import widget, { useSyncedState, AutoLayout, waitForTask } from './figma';
import { SignoffRow, WidgetMode } from './types';
import { COLORS } from './constants/theme';
import { ROLE_PRESETS } from './constants/presets';
import { Header } from './components/Header';
import { RowItem } from './components/RowItem';
import { EmptyState } from './components/EmptyState';
import { Footer } from './components/Footer';

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

  // ── Open the Settings popup via figma.showUI ──────────────────────────────
  const openSettings = () => {
    return new Promise<void>((resolve) => {
      figma.showUI(__html__, { width: 340, height: 420, title: 'Widget Settings' });

      // Handle messages sent from the popup
      // NOTE: Do NOT postMessage init here — the iframe isn't ready yet.
      // Instead, wait for the popup to send 'ready', then respond with init.
      figma.ui.onmessage = (msg: { type: string; [key: string]: unknown }) => {
        switch (msg.type) {
          case 'ready': {
            // Popup is loaded and its window.onmessage listener is registered
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
              setRows(seededRows);
            }
            figma.closePlugin();
            resolve();
            break;
          }

          case 'reorder-row': {
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
            setRows(newRows);
            // Send updated list back to popup so it re-syncs
            figma.ui.postMessage({ type: 'update-rows', rows: newRows });
            break;
          }

          case 'remove-row': {
            const id = msg.id as string;
            const newRows = rows.filter((r) => r.id !== id);
            setRows(newRows);
            setOpenNoteRowIds(openNoteRowIds.filter((rowId) => rowId !== id));
            if (activeDropdownRowId === id) setActiveDropdownRowId('');
            // Send updated list back to popup
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

  // Add a new blank role
  const handleAddRole = () => {
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

  // Update a specific row
  const handleUpdateRow = (id: string, updated: Partial<SignoffRow>) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, ...updated } : row))
    );
  };

  // Toggle status dropdown
  const handleToggleDropdown = (rowId: string) => {
    setActiveDropdownRowId(activeDropdownRowId === rowId ? '' : rowId);
  };

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
              isNoteOpen={openNoteRowIds.includes(row.id)}
              isDropdownOpen={activeDropdownRowId === row.id}
              onToggleNote={() => handleToggleNote(row.id)}
              onToggleDropdown={() => handleToggleDropdown(row.id)}
              onUpdateRow={(updated) => handleUpdateRow(row.id, updated)}
            />
          ))}
        </AutoLayout>
      )}

      {/* Widget Footer */}
      <Footer mode={mode} onAddRole={handleAddRole} />
    </AutoLayout>
  );
}

widget.register(SignoffTrackerWidget);
