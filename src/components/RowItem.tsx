import { AutoLayout, Text, Input } from '../figma';
import { SignoffRow, WidgetMode, MultiStateStatus } from '../types';
import { COLORS, STATUS_CONFIG } from '../constants/theme';
import { getFormattedCurrentDate } from '../utils/date';
import {
  DragHandleIcon,
  CheckboxIcon,
  NoteIcon,
  ChevronDownIcon,
} from './Icons';
import { InlineNote } from './InlineNote';
import { StatusDropdown } from './StatusDropdown';

interface RowItemProps {
  row: SignoffRow;
  mode: WidgetMode;
  isNoteOpen: boolean;
  isDropdownOpen: boolean;
  onToggleNote: () => void;
  onToggleDropdown: () => void;
  onUpdateRow: (updated: Partial<SignoffRow>) => void;
}

export const RowItem = ({
  row,
  mode,
  isNoteOpen,
  isDropdownOpen,
  onToggleNote,
  onToggleDropdown,
  onUpdateRow,
}: RowItemProps) => {
  // Checkbox toggle in Binary mode
  const handleCheckboxToggle = () => {
    const nextChecked = !row.checked;
    const updates: Partial<SignoffRow> = { checked: nextChecked };
    if (nextChecked) {
      updates.date = getFormattedCurrentDate();
    }
    onUpdateRow(updates);
  };

  // Status selection in Multi-state mode
  const handleSelectStatus = (status: MultiStateStatus) => {
    const updates: Partial<SignoffRow> = { status };
    if (status === 'signed_off') {
      updates.date = getFormattedCurrentDate();
    }
    onUpdateRow(updates);
  };

  const hasNote = Boolean(row.note && row.note.trim().length > 0);

  return (
    <AutoLayout
      direction="vertical"
      width="fill-parent"
      fill={COLORS.white}
    >
      {/* Main Row Content */}
      <AutoLayout
        direction="horizontal"
        verticalAlignItems="center"
        spacing="auto"
        width="fill-parent"
        padding={{ top: 8, bottom: 8, left: 10, right: 12 }}
        fill={COLORS.white}
        hoverStyle={{
          fill: COLORS.rowHover,
        }}
      >
        {/* Left Section: Drag handle + (Checkbox in Binary mode) + Role/Assignee Stack */}
        <AutoLayout
          direction="horizontal"
          verticalAlignItems="center"
          spacing={8}
          width="fill-parent"
        >
          {/* Drag handle — hover-only per spec §8.1. True drag-reorder is not available
              in Figma Declarative Widget API v1. Up/Down buttons in Settings provide
              functional reordering. Handle blends with background, visible on row hover. */}
          <AutoLayout padding={2}>
            <DragHandleIcon size={12} color={COLORS.hairline} />
          </AutoLayout>

          {/* Binary Checkbox */}
          {mode === 'binary' && (
            <AutoLayout padding={2}>
              <CheckboxIcon
                checked={row.checked}
                onClick={handleCheckboxToggle}
              />
            </AutoLayout>
          )}

          {/* Role & Assignee Inputs */}
          <AutoLayout
            direction="vertical"
            spacing={1}
            width="fill-parent"
          >
            {/* Role Title */}
            <Input
              value={row.role}
              placeholder="Role / Team"
              onTextEditEnd={(e) =>
                onUpdateRow({ role: e.characters.trim() || 'Role' })
              }
              fontSize={13}
              fontWeight={600}
              fill={COLORS.textPrimary}
              width="fill-parent"
            />

            {/* Assignee Name */}
            <Input
              value={row.assignee}
              placeholder="Unassigned"
              onTextEditEnd={(e) =>
                onUpdateRow({ assignee: e.characters.trim() })
              }
              fontSize={11}
              fontWeight={400}
              italic={!row.assignee}
              fill={row.assignee ? COLORS.textSecondary : COLORS.textMuted}
              width="fill-parent"
            />
          </AutoLayout>
        </AutoLayout>

        {/* Right Section: Note Icon + Date Input + (Status Pill in Multi-state mode) */}
        <AutoLayout
          direction="horizontal"
          verticalAlignItems="center"
          spacing={8}
        >
          {/* Note Toggle Icon */}
          <AutoLayout
            padding={3}
            cornerRadius={4}
            hoverStyle={{
              fill: COLORS.hoverBg,
            }}
            onClick={onToggleNote}
          >
            <NoteIcon hasNote={hasNote} isOpen={isNoteOpen} />
          </AutoLayout>

          {/* Date Input */}
          <AutoLayout
            verticalAlignItems="center"
            padding={{ top: 2, bottom: 2, left: 4, right: 4 }}
            cornerRadius={4}
            fill={COLORS.white}
            hoverStyle={{
              fill: COLORS.subtleBg,
            }}
          >
            <Input
              value={row.date}
              placeholder="—"
              onTextEditEnd={(e) => onUpdateRow({ date: e.characters.trim() })}
              fontSize={11}
              fontWeight={400}
              fill={row.date ? COLORS.textSecondary : COLORS.textMuted}
              width={76}
            />
          </AutoLayout>

          {/* Multi-state Status Pill */}
          {mode === 'multistate' && (
            <AutoLayout
              direction="horizontal"
              verticalAlignItems="center"
              spacing={5}
              padding={{ top: 4, bottom: 4, left: 8, right: 8 }}
              cornerRadius={20}
              fill={STATUS_CONFIG[row.status].bg}
              stroke={STATUS_CONFIG[row.status].borderColor}
              strokeWidth={1}
              hoverStyle={{
                fill: STATUS_CONFIG[row.status].bg,
              }}
              onClick={onToggleDropdown}
            >
              <AutoLayout
                width={6}
                height={6}
                cornerRadius={3}
                fill={STATUS_CONFIG[row.status].dotColor}
              />
              <Text
                fontSize={11}
                fontWeight={500}
                fill={STATUS_CONFIG[row.status].text}
              >
                {STATUS_CONFIG[row.status].label}
              </Text>
              <ChevronDownIcon size={10} color={STATUS_CONFIG[row.status].text} />
            </AutoLayout>
          )}
        </AutoLayout>
      </AutoLayout>

      {/* Expandable Inline Note Panel */}
      {isNoteOpen && (
        <InlineNote
          note={row.note}
          onNoteChange={(newNote) => onUpdateRow({ note: newNote })}
          onClose={onToggleNote}
        />
      )}

      {/* Status Dropdown Popover */}
      {mode === 'multistate' && isDropdownOpen && (
        <AutoLayout
          width="fill-parent"
          padding={{ top: 2, bottom: 6, left: 32, right: 12 }}
        >
          <StatusDropdown
            currentStatus={row.status}
            onSelectStatus={handleSelectStatus}
            onClose={onToggleDropdown}
          />
        </AutoLayout>
      )}

      {/* Row Divider */}
      <AutoLayout
        width="fill-parent"
        height={1}
        fill={COLORS.hairline}
      />
    </AutoLayout>
  );
};
