import { AutoLayout, Text } from '../figma';

import { COLORS } from '../constants/theme';

interface EmptyStateProps {
  onChoosePreset: () => void;
}

export const EmptyState = ({ onChoosePreset }: EmptyStateProps) => {
  return (
    <AutoLayout
      direction="vertical"
      horizontalAlignItems="center"
      verticalAlignItems="center"
      width="fill-parent"
      padding={{ top: 24, bottom: 24, left: 16, right: 16 }}
      spacing={12}
      fill={COLORS.white}
    >
      <Text
        fontSize={12}
        fill={COLORS.textSecondary}
        horizontalAlignText="center"
        width="fill-parent"
      >
        Start from a preset or build your own list of roles that need to sign off.
      </Text>

      {/* Primary Action: Choose a preset */}
      <AutoLayout
        direction="horizontal"
        verticalAlignItems="center"
        padding={{ top: 7, bottom: 7, left: 12, right: 12 }}
        cornerRadius={6}
        fill={COLORS.figmaBlue}
        hoverStyle={{
          fill: COLORS.figmaBlueHover,
        }}
        onClick={onChoosePreset}
      >
        <Text
          fontSize={12}
          fontWeight={600}
          fill={COLORS.white}
        >
          Choose a preset
        </Text>
      </AutoLayout>
    </AutoLayout>
  );
};
