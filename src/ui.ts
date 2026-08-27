// ─────────────────────────────────────────────────────────────────────────────
// ui.ts — Widget Settings popup
// Runs in a Figma showUI iframe (plain browser DOM, no React).
// Communicates with code.tsx via parent.postMessage / window.onmessage.
// ─────────────────────────────────────────────────────────────────────────────

// ── Types (mirrored from types.ts — cannot import across sandbox boundary) ───

type WidgetMode = 'binary' | 'multistate';

interface SignoffRow {
  id: string;
  role: string;
  assignee: string;
  checked: boolean;
  status: string;
  date: string;
  note: string;
}

interface InitMessage {
  type: 'init';
  mode: WidgetMode;
  rows: SignoffRow[];
}

interface UpdateRowsMessage {
  type: 'update-rows';
  rows: SignoffRow[];
}

type IncomingMessage = InitMessage | UpdateRowsMessage;

// ── Preset data (mirrored from constants/presets.ts) ─────────────────────────

const ROLE_PRESETS = [
  { id: 'design-signoff', name: 'Design Sign-off', roles: ['Design', 'Eng', 'PM', 'QA'] },
  { id: 'legal-compliance', name: 'Legal / Compliance Review', roles: ['Legal', 'Compliance', 'Security'] },
  { id: 'launch-checklist', name: 'Launch Checklist', roles: ['Design', 'Eng', 'PM', 'Marketing', 'Support'] },
];

// ── App state ─────────────────────────────────────────────────────────────────

let currentMode: WidgetMode = 'binary';
let currentRows: SignoffRow[] = [];
let draggedId: string | null = null;

// ── Messaging helpers ─────────────────────────────────────────────────────────

function sendToWidget(msg: object) {
  parent.postMessage({ pluginMessage: msg }, '*');
}

// ── Styles (injected once into <head>) ────────────────────────────────────────

function injectStyles() {
  const style = document.createElement('style');
  style.textContent = `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 12px;
      color: #1E1E1E;
      background: #fff;
      overflow-x: hidden;
    }

    /* ── Layout ── */
    #app {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }

    /* ── Popup Header ── */
    .popup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 14px 11px;
      border-bottom: 1px solid #F0F0F0;
      flex-shrink: 0;
    }
    .popup-header h1 {
      font-size: 12px;
      font-weight: 700;
      color: #1E1E1E;
    }
    .btn-done {
      font-size: 11px;
      font-weight: 600;
      color: #0077CC;
      background: #E8F4FE;
      border: none;
      border-radius: 4px;
      padding: 3px 8px;
      cursor: pointer;
    }
    .btn-done:hover { background: #F2F2F2; }

    /* ── Scrollable body ── */
    .popup-body {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    /* ── Section ── */
    .section { display: flex; flex-direction: column; gap: 7px; }
    .section-label {
      font-size: 11px;
      font-weight: 600;
      color: #666666;
      text-transform: none;
      letter-spacing: 0;
    }

    /* ── Segmented control (Status Mode) ── */
    .seg-control {
      display: flex;
      background: #F7F7F7;
      border: 1px solid #F0F0F0;
      border-radius: 6px;
      padding: 2px;
      gap: 2px;
    }
    .seg-btn {
      flex: 1;
      text-align: center;
      padding: 5px 8px;
      border-radius: 4px;
      border: 1px solid transparent;
      font-size: 11px;
      font-weight: 400;
      color: #666666;
      background: transparent;
      cursor: pointer;
      transition: background 0.1s, color 0.1s;
    }
    .seg-btn.active {
      background: #fff;
      border-color: #F0F0F0;
      color: #1E1E1E;
      font-weight: 600;
    }
    .seg-btn:not(.active):hover { background: #F2F2F2; }

    /* ── Preset cards ── */
    .preset-list { display: flex; flex-direction: column; gap: 4px; }
    .preset-card {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 6px 8px;
      border-radius: 5px;
      border: 1px solid #F0F0F0;
      background: #F7F7F7;
      cursor: pointer;
      transition: background 0.1s;
    }
    .preset-card:hover { background: #F2F2F2; }
    .preset-name { font-size: 12px; font-weight: 600; color: #1E1E1E; }
    .preset-roles { font-size: 11px; color: #6B6B6B; }

    /* ── Warning banner ── */
    .warning-banner {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      border-radius: 4px;
      background: #FFFBEB;
      border: 1px solid #FDE68A;
      font-size: 11px;
      color: #92400E;
    }
    .warning-icon { flex-shrink: 0; }

    /* ── Role list (drag-and-drop) ── */
    .role-list { display: flex; flex-direction: column; gap: 3px; }

    .role-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 6px;
      border-radius: 4px;
      background: #F7F7F7;
      cursor: default;
      user-select: none;
      transition: opacity 0.15s, box-shadow 0.15s;
    }
    .role-row.dragging { opacity: 0.4; }
    .role-row.drag-over { box-shadow: 0 0 0 2px #0D99FF; background: #E8F4FE; }

    .role-row-left {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
      overflow: hidden;
    }
    .drag-handle {
      cursor: grab;
      color: #D0D0D0;
      font-size: 13px;
      line-height: 1;
      flex-shrink: 0;
    }
    .drag-handle:active { cursor: grabbing; }
    .role-name {
      font-size: 11px;
      font-weight: 500;
      color: #1E1E1E;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .btn-remove {
      font-size: 10px;
      font-weight: 500;
      color: #E02424;
      background: transparent;
      border: none;
      border-radius: 3px;
      padding: 2px 5px;
      cursor: pointer;
      flex-shrink: 0;
    }
    .btn-remove:hover { background: #FDF2F2; }

    /* ── Empty roles state ── */
    .roles-empty {
      font-size: 11px;
      color: #6B6B6B;
      text-align: center;
      padding: 8px 0;
    }
  `;
  document.head.appendChild(style);
}

// ── Warning icon SVG ──────────────────────────────────────────────────────────

const WARNING_SVG = `<svg class="warning-icon" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6 1L11 10H1L6 1Z" stroke="#92400E" stroke-width="1.2" stroke-linejoin="round"/>
  <path d="M6 4.5V6.5" stroke="#92400E" stroke-width="1.2" stroke-linecap="round"/>
  <circle cx="6" cy="8.25" r="0.5" fill="#92400E"/>
</svg>`;

// ── Render helpers ────────────────────────────────────────────────────────────

function renderStatusMode(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'section';
  section.id = 'section-status-mode';

  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = 'Status Mode';

  const seg = document.createElement('div');
  seg.className = 'seg-control';

  const binaryBtn = document.createElement('button');
  binaryBtn.className = 'seg-btn' + (currentMode === 'binary' ? ' active' : '');
  binaryBtn.textContent = 'Binary (Checkbox)';
  binaryBtn.addEventListener('click', () => {
    if (currentMode === 'binary') return;
    currentMode = 'binary';
    sendToWidget({ type: 'set-mode', mode: 'binary' });
    updateSegControl();
  });

  const multiBtn = document.createElement('button');
  multiBtn.className = 'seg-btn' + (currentMode === 'multistate' ? ' active' : '');
  multiBtn.textContent = 'Multi-state (5 States)';
  multiBtn.addEventListener('click', () => {
    if (currentMode === 'multistate') return;
    currentMode = 'multistate';
    sendToWidget({ type: 'set-mode', mode: 'multistate' });
    updateSegControl();
  });

  seg.appendChild(binaryBtn);
  seg.appendChild(multiBtn);
  section.appendChild(label);
  section.appendChild(seg);
  container.appendChild(section);
}

function updateSegControl() {
  const seg = document.querySelector('.seg-control');
  if (!seg) return;
  const [bBtn, mBtn] = seg.querySelectorAll<HTMLButtonElement>('.seg-btn');
  bBtn.className = 'seg-btn' + (currentMode === 'binary' ? ' active' : '');
  mBtn.className = 'seg-btn' + (currentMode === 'multistate' ? ' active' : '');
}

function renderPresets(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'section';
  section.id = 'section-presets';

  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = 'Apply a Preset';

  const list = document.createElement('div');
  list.className = 'preset-list';

  ROLE_PRESETS.forEach((preset) => {
    const card = document.createElement('div');
    card.className = 'preset-card';
    card.innerHTML = `
      <div class="preset-name">${preset.name}</div>
      <div class="preset-roles">${preset.roles.join(' · ')}</div>
    `;
    card.addEventListener('click', () => {
      sendToWidget({ type: 'apply-preset', presetId: preset.id });
      // Widget will send back update-rows; close popup
      sendToWidget({ type: 'close' });
    });
    list.appendChild(card);
  });

  const warning = document.createElement('div');
  warning.className = 'warning-banner';
  warning.innerHTML = `${WARNING_SVG}<span>Applying a preset replaces the current list.</span>`;

  section.appendChild(label);
  section.appendChild(list);
  section.appendChild(warning);
  container.appendChild(section);
}

function renderRoleList(container: HTMLElement) {
  const section = document.createElement('div');
  section.className = 'section';
  section.id = 'section-roles';

  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = 'Reorder & Remove Roles';

  const list = document.createElement('div');
  list.className = 'role-list';
  list.id = 'role-list';

  section.appendChild(label);
  section.appendChild(list);
  container.appendChild(section);

  refreshRoleList();
}

function refreshRoleList() {
  const list = document.getElementById('role-list');
  if (!list) return;
  list.innerHTML = '';

  if (currentRows.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'roles-empty';
    empty.textContent = 'No roles yet. Apply a preset or add roles via the widget.';
    list.appendChild(empty);
    return;
  }

  currentRows.forEach((row) => {
    const rowEl = document.createElement('div');
    rowEl.className = 'role-row';
    rowEl.draggable = true;
    rowEl.dataset.id = row.id;

    const left = document.createElement('div');
    left.className = 'role-row-left';

    const handle = document.createElement('span');
    handle.className = 'drag-handle';
    handle.textContent = '⠿';

    const name = document.createElement('span');
    name.className = 'role-name';
    name.textContent = row.role || 'Untitled Role';

    left.appendChild(handle);
    left.appendChild(name);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      sendToWidget({ type: 'remove-row', id: row.id });
      // Optimistic: remove from local state immediately
      currentRows = currentRows.filter((r) => r.id !== row.id);
      refreshRoleList();
    });

    rowEl.appendChild(left);
    rowEl.appendChild(removeBtn);

    // ── HTML5 drag-and-drop ──
    rowEl.addEventListener('dragstart', (e) => {
      draggedId = row.id;
      rowEl.classList.add('dragging');
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', row.id);
      }
    });

    rowEl.addEventListener('dragend', () => {
      draggedId = null;
      rowEl.classList.remove('dragging');
      // Clear all drag-over highlights
      document.querySelectorAll('.role-row.drag-over').forEach((el) =>
        el.classList.remove('drag-over')
      );
    });

    rowEl.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
      if (row.id !== draggedId) {
        rowEl.classList.add('drag-over');
      }
    });

    rowEl.addEventListener('dragleave', () => {
      rowEl.classList.remove('drag-over');
    });

    rowEl.addEventListener('drop', (e) => {
      e.preventDefault();
      rowEl.classList.remove('drag-over');
      if (!draggedId || draggedId === row.id) return;

      const targetIndex = currentRows.findIndex((r) => r.id === row.id);
      if (targetIndex === -1) return;

      // Reorder local state optimistically
      const draggedIndex = currentRows.findIndex((r) => r.id === draggedId);
      if (draggedIndex === -1) return;
      const newRows = [...currentRows];
      const [moved] = newRows.splice(draggedIndex, 1);
      newRows.splice(targetIndex, 0, moved);
      currentRows = newRows;
      refreshRoleList();

      // Notify widget
      sendToWidget({ type: 'reorder-row', draggedId, targetIndex });
    });

    list.appendChild(rowEl);
  });
}

// ── Full render ───────────────────────────────────────────────────────────────

function render() {
  const app = document.getElementById('app');
  if (!app) return;
  app.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.className = 'popup-header';

  const title = document.createElement('h1');
  title.textContent = 'Widget Settings';

  const doneBtn = document.createElement('button');
  doneBtn.className = 'btn-done';
  doneBtn.textContent = 'Done';
  doneBtn.addEventListener('click', () => {
    sendToWidget({ type: 'close' });
  });

  header.appendChild(title);
  header.appendChild(doneBtn);
  app.appendChild(header);

  // Scrollable body
  const body = document.createElement('div');
  body.className = 'popup-body';

  renderStatusMode(body);
  renderPresets(body);

  // Only show Reorder section if there are rows
  if (currentRows.length > 0) {
    renderRoleList(body);
  }

  app.appendChild(body);
}

// ── Handle messages from widget ───────────────────────────────────────────────

window.onmessage = (event: MessageEvent) => {
  const msg = event.data?.pluginMessage as IncomingMessage | undefined;
  if (!msg) return;

  if (msg.type === 'init') {
    currentMode = msg.mode;
    currentRows = msg.rows;
    render();
  } else if (msg.type === 'update-rows') {
    currentRows = msg.rows;
    // Refresh just the role list section if it exists, otherwise re-render
    const section = document.getElementById('section-roles');
    if (section && currentRows.length > 0) {
      refreshRoleList();
    } else {
      render();
    }
  }
};

// ── Boot ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  injectStyles();
  render(); // Initial skeleton — will be populated on 'init' message from widget
  sendToWidget({ type: 'ready' }); // Signal to widget that we're loaded and listening
});
