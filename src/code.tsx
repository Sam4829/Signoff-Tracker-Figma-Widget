import widget, { useSyncedState, AutoLayout, waitForTask } from './figma';
import { SignoffRow, WidgetMode } from './types';
import { COLORS } from './constants/theme';
import { ROLE_PRESETS } from './constants/presets';
import { Header } from './components/Header';
import { RowItem } from './components/RowItem';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';

// Fix 4: Soft cap — enforced in handleAddRole, surfaced in Footer warning.
// Rationale: Figma widget renderer has no virtualisation; render cost is linear
// (~11 AutoLayout nodes per row). Beyond ~20 rows the full re-render on every
// Input edit becomes noticeable. A sign-off tracker with 20+ roles is also a
// process smell worth flagging to the user.
const MAX_ROWS = 20;

function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function SignoffTrackerWidget() {
  const [title, setTitle] = useSyncedState<string>('title', 'Design Sign-off');
  const [mode, setMode] = useSyncedState<WidgetMode>('mode', 'binary');
  const [rows, setRows] = useSyncedState<SignoffRow[]>('rows', []);

  // NOTE: Figma Widget API has no per-user local state — useSyncedState is the
  // only reactive hook and syncs across all collaborators. activeDropdownRowId
  // and openNoteRowIds are therefore shared state.
  // This is a known Figma Widget API v1 constraint.
  const [activeDropdownRowId, setActiveDropdownRowId] = useSyncedState<string>(
    'activeDropdownRowId',
    ''
  );
  const [openNoteRowIds, setOpenNoteRowIds] = useSyncedState<string[]>(
    'openNoteRowIds',
    []
  );

  // Fix 2: Consolidated row setter that always prunes openNoteRowIds to only
  // IDs that still exist in the new rows array, preventing silent accumulation
  // of ghost IDs in useSyncedState (which persists to Figma document storage).
  const setRowsSafe = (newRows: SignoffRow[]) => {
    setRows(newRows);
    const existingIds = new Set(newRows.map((r) => r.id));
    setOpenNoteRowIds(openNoteRowIds.filter((id) => existingIds.has(id)));
  };

  // ── Open the Settings popup via figma.showUI ──────────────────────────────
  const openSettings = () => {
    return new Promise<void>((resolve) => {
      // Fix 1: figma.ui is a process-wide singleton — there is only ONE showUI
      // surface per Figma file. Assigning figma.ui.onmessage here overwrites
      // any previous handler from another widget instance. This is safe because
      // waitForTask() prevents two widgets from holding the popup lock at the
      // same time, but it means a second widget clicking settings will
      // implicitly close the first widget's open popup. This is a Figma Widget
      // API v1 constraint with no workaround available.
      figma.showUI(__html__, { width: 340, height: 420, title: 'Widget Settings' });

      // Handle messages sent from the popup.
      // NOTE: Do NOT postMessage init here — the iframe isn't ready yet.
      // Instead, wait for the popup to send 'ready', then respond with init.
      figma.ui.onmessage = (msg: { type: string; [key: string]: unknown }) => {
        switch (msg.type) {
          case 'ready': {
            // Popup is loaded and its window.onmessage listener is registered.
            figma.ui.postMessage({ type: 'init', mode, rows });
            break;
          }

          case 'set-mode': {
            const newMode = msg.mode as WidgetMode;
            setMode(newMode);
            break;
          }

          case 'apply-preset': {
            const preset = ROLE_PRESETS.find((p) => p.id === (msg.presetId as string));
            if (preset) {
              const seededRows: SignoffRow[] = preset.roles.map((roleName) => ({
                id: generateUniqueId(),
                role: roleName,
                assignee: '',
                checked: false,
                status: 'not_started',
                date: '',
                note: '',
              }));
              // Use setRowsSafe: preset replaces all rows, so openNoteRowIds
              // for old rows should be pruned (all old IDs become ghosts).
              setRowsSafe(seededRows);
            }
            figma.closePlugin();
            resolve();
            break;
          }

          case 'reorder-row': {
            // Fix 3: `rows` here is captured from the render cycle that created
            // this onmessage closure. If a collaborator adds/removes a row while
            // the popup is open, this local `rows` snapshot is stale — the splice
            // will operate on the old list and setRowsSafe will overwrite the
            // collaborator's concurrent change. This is a fundamental Figma Widget
            // API v1 constraint (no way to read current state inside an async
            // closure). Accept it; the worst case is a re-orderable list reverting
            // one concurrent add/remove. Mitigated by the popup being a short-lived
            // modal interaction.
            const { draggedId, targetIndex } = msg as {
              type: string;
              draggedId: string;
              targetIndex: number;
            };
            const draggedIndex = rows.findIndex((r) => r.id === draggedId);
            if (draggedIndex === -1) break;
            const newRows = [...rows];
            const [moved] = newRows.splice(draggedIndex, 1);
            newRows.splice(targetIndex, 0, moved);
            setRowsSafe(newRows);
            // Send updated list back to popup so it re-syncs.
            figma.ui.postMessage({ type: 'update-rows', rows: newRows });
            break;
          }

          case 'remove-row': {
            const id = msg.id as string;
            const newRows = rows.filter((r) => r.id !== id);
            // setRowsSafe prunes openNoteRowIds automatically — no need for a
            // separate setOpenNoteRowIds call here unlike before.
            setRowsSafe(newRows);
            if (activeDropdownRowId === id) setActiveDropdownRowId('');
            // Send updated list back to popup.
            figma.ui.postMessage({ type: 'update-rows', rows: newRows });
            break;
          }

          case 'close': {
            figma.closePlugin();
            resolve();
            break;
          }
        }
      };
    });
  };

  // ── Row handlers ──────────────────────────────────────────────────────────

  // Add a new blank role — Fix 4: silently no-ops when at MAX_ROWS cap.
  // Footer displays a warning when rowCount >= MAX_ROWS so the user knows why.
  const handleAddRole = () => {
    if (rows.length >= MAX_ROWS) return;
    const newRow: SignoffRow = {
      id: generateUniqueId(),
      role: 'Role',
      assignee: '',
      checked: false,
      status: 'not_started',
      date: '',
      note: '',
    };
    setRows([...rows, newRow]);
  };

  // Toggle inline note visibility
  const handleToggleNote = (rowId: string) => {
    setOpenNoteRowIds(
      openNoteRowIds.includes(rowId)
        ? openNoteRowIds.filter((id) => id !== rowId)
        : [...openNoteRowIds, rowId]
    );
  };

  // Update a specific row — row content edits don't change the row list,
  // so plain setRows is fine here (no pruning needed).
  const handleUpdateRow = (id: string, updated: Partial<SignoffRow>) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, ...updated } : row))
    );
  };

  // Toggle status dropdown
  const handleToggleDropdown = (rowId: string) => {
    setActiveDropdownRowId(activeDropdownRowId === rowId ? '' : rowId);
  };

  // Fix 5: Derive a Set from openNoteRowIds once per render for O(1) lookups
  // in the rows.map() below. Previously used Array.includes() — O(n) per row,
  // so O(n²) total. With N=20 rows this saves ~380 comparisons per render.
  const openNoteSet = new Set(openNoteRowIds);

  return (
    <AutoLayout
      direction="vertical"
      width={340}
      cornerRadius={8}
      fill={COLORS.cardBg}
      stroke={COLORS.canvasBorder}
      strokeWidth={1}
    >
      {/* Widget Header — gear icon opens showUI popup */}
      <Header
        title={title}
        onTitleChange={setTitle}
        rows={rows}
        mode={mode}
        onOpenSettings={() => waitForTask(openSettings())}
      />

      {/* Empty State vs Rows List */}
      {rows.length === 0 ? (
        <EmptyState
          onChoosePreset={() => waitForTask(openSettings())}
        />
      ) : (
        <AutoLayout
          direction="vertical"
          width="fill-parent"
          fill={COLORS.white}
        >
          {rows.map((row) => (
            <RowItem
              key={row.id}
              row={row}
              mode={mode}
              isNoteOpen={openNoteSet.has(row.id)}
              isDropdownOpen={activeDropdownRowId === row.id}
              onToggleNote={() => handleToggleNote(row.id)}
              onToggleDropdown={() => handleToggleDropdown(row.id)}
              onUpdateRow={(updated) => handleUpdateRow(row.id, updated)}
            />
          ))}
        </AutoLayout>
      )}

      {/* Widget Footer — passes rowCount/maxRows so it can surface the cap warning */}
      <Footer
        mode={mode}
        onAddRole={handleAddRole}
        rowCount={rows.length}
        maxRows={MAX_ROWS}
      />
    </AutoLayout>
  );
}

widget.register(SignoffTrackerWidget);
