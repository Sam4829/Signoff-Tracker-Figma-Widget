import { AutoLayout, Text } from '../figma';
import { MultiStateStatus } from '../types';
import { COLORS, STATUS_CONFIG } from '../constants/theme';

interface StatusDropdownProps {
  currentStatus: MultiStateStatus;
  onSelectStatus: (status: MultiStateStatus) => void;
  onClose: () => void;
}

const ALL_STATUSES: MultiStateStatus[] = [
  'not_started',
  'in_review',
  'signed_off',
  'blocked',
  'na',
];

export const StatusDropdown = ({
  currentStatus,
  onSelectStatus,
  onClose,
}: StatusDropdownProps) => {
  return (
    <AutoLayout
      direction="vertical"
      width="fill-parent"
      padding={{ top: 4, bottom: 4, left: 4, right: 4 }}
      fill={COLORS.white}
      stroke={COLORS.hairline}
      strokeWidth={1}
      cornerRadius={6}
      spacing={2}
    >
      {ALL_STATUSES.map((st) => {
        const config = STATUS_CONFIG[st];
        const isSelected = st === currentStatus;

        return (
          <AutoLayout
            key={st}
            direction="horizontal"
            verticalAlignItems="center"
            spacing="auto"
            width="fill-parent"
            padding={{ top: 6, bottom: 6, left: 8, right: 8 }}
            cornerRadius={4}
            fill={isSelected ? COLORS.figmaBlueLight : COLORS.white}
            hoverStyle={{
              fill: isSelected ? COLORS.figmaBlueLight : COLORS.hoverBg,
            }}
            onClick={() => {
              onSelectStatus(st);
              onClose();
            }}
          >
            <AutoLayout
              direction="horizontal"
              verticalAlignItems="center"
              spacing={8}
            >
              <AutoLayout
                width={8}
                height={8}
                cornerRadius={4}
                fill={config.dotColor}
              />
              <Text
                fontSize={12}
                fontWeight={isSelected ? 600 : 400}
                fill={isSelected ? COLORS.figmaBlueText : COLORS.textPrimary}
              >
                {config.label}
              </Text>
            </AutoLayout>

            {isSelected && (
              <Text
                fontSize={11}
                fill={COLORS.figmaBlueText}
                fontWeight={600}
              >
                ✓
              </Text>
            )}
          </AutoLayout>
        );
      })}
    </AutoLayout>
  );
};
