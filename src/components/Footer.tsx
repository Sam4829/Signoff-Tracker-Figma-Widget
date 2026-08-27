import { AutoLayout, Text } from '../figma';

import { WidgetMode } from '../types';
import { COLORS } from '../constants/theme';
import { PlusIcon } from './Icons';

interface FooterProps {
  mode: WidgetMode;
  onAddRole: () => void;
}

export const Footer = ({ mode, onAddRole }: FooterProps) => {
  const modeLabel = mode === 'binary' ? 'Binary' : 'Multi-state';

  return (
    <AutoLayout direction="vertical" width="fill-parent" fill={COLORS.white}>
      <AutoLayout width="fill-parent" height={1} fill={COLORS.hairline} />
      <AutoLayout
        direction="horizontal"
        spacing="auto"
        verticalAlignItems="center"
        width="fill-parent"
        padding={{ top: 10, bottom: 10, left: 14, right: 14 }}
        fill={COLORS.white}
      >
        {/* Left: + Add role button */}
        <AutoLayout
          direction="horizontal"
          verticalAlignItems="center"
          spacing={4}
          padding={{ top: 4, bottom: 4, left: 6, right: 6 }}
          cornerRadius={4}
          hoverStyle={{
            fill: COLORS.figmaBlueLight,
          }}
          onClick={onAddRole}
        >
          <PlusIcon size={12} color={COLORS.figmaBlue} />
          <Text
            fontSize={12}
            fontWeight={600}
            fill={COLORS.figmaBlue}
          >
            Add role
          </Text>
        </AutoLayout>

        {/* Right: Passive mode badge */}
        <AutoLayout
          padding={{ top: 2, bottom: 2, left: 6, right: 6 }}
          cornerRadius={4}
          fill={COLORS.subtleBg}
          stroke={COLORS.hairline}
          strokeWidth={1}
        >
          <Text
            fontSize={10}
            fontWeight={500}
            fill={COLORS.textTertiary}
          >
            {modeLabel}
          </Text>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};
