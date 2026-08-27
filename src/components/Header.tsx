import { AutoLayout, Input } from '../figma';
import { SignoffRow, WidgetMode } from '../types';
import { COLORS } from '../constants/theme';
import { GearIcon } from './Icons';

interface HeaderProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  rows: SignoffRow[];
  mode: WidgetMode;
  onOpenSettings: () => void;
}

export const Header = ({
  title,
  onTitleChange,
  rows,
  mode,
  onOpenSettings,
}: HeaderProps) => {
  // Compute overall status dot color
  let dotColor = '#BDBDBD'; // neutral default

  if (rows.length > 0) {
    if (mode === 'binary') {
      const allChecked = rows.every((r) => r.checked);
      const someChecked = rows.some((r) => r.checked);
      if (allChecked) {
        dotColor = '#10B981'; // green
      } else if (someChecked) {
        dotColor = '#0D99FF'; // figma blue in-progress
      }
    } else {
      const hasBlocked = rows.some((r) => r.status === 'blocked');
      const allDone = rows.every((r) => r.status === 'signed_off' || r.status === 'na');
      const hasInReview = rows.some((r) => r.status === 'in_review');
      const hasSignedOff = rows.some((r) => r.status === 'signed_off');

      if (hasBlocked) {
        dotColor = '#EF4444'; // red
      } else if (allDone) {
        dotColor = '#10B981'; // green
      } else if (hasInReview || hasSignedOff) {
        dotColor = '#F59E0B'; // yellow
      }
    }
  }

  return (
    <AutoLayout
      direction="vertical"
      width="fill-parent"
      fill={COLORS.white}
    >
      <AutoLayout
        direction="horizontal"
        spacing="auto"
        verticalAlignItems="center"
        width="fill-parent"
        padding={{ top: 12, bottom: 12, left: 14, right: 14 }}
        fill={COLORS.white}
      >
        {/* Left: Status Dot + Title Input */}
        <AutoLayout
          direction="horizontal"
          verticalAlignItems="center"
          spacing={8}
          width="fill-parent"
        >
          <AutoLayout
            width={8}
            height={8}
            cornerRadius={4}
            fill={dotColor}
          />
          <Input
            value={title}
            placeholder="Sign-off Tracker"
            onTextEditEnd={(e) => onTitleChange(e.characters.trim() || 'Sign-off Tracker')}
            fontSize={13}
            fontWeight={600}
            fill={COLORS.textPrimary}
            width="fill-parent"
          />
        </AutoLayout>

        {/* Right: Settings Icon Button */}
        <AutoLayout
          padding={4}
          cornerRadius={4}
          fill={COLORS.white}
          hoverStyle={{
            fill: COLORS.hoverBg,
          }}
          onClick={onOpenSettings}
        >
          <GearIcon
            size={16}
            color={COLORS.textSecondary}
          />
        </AutoLayout>
      </AutoLayout>

      {/* Header divider */}
      <AutoLayout
        width="fill-parent"
        height={1}
        fill={COLORS.hairline}
      />
    </AutoLayout>
  );
};
