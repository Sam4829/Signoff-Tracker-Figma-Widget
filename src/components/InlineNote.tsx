import { AutoLayout, Input, Text } from '../figma';

import { COLORS } from '../constants/theme';
import { CloseIcon } from './Icons';

interface InlineNoteProps {
  note: string;
  onNoteChange: (newNote: string) => void;
  onClose: () => void;
}

export const InlineNote = ({
  note,
  onNoteChange,
  onClose,
}: InlineNoteProps) => {
  return (
    <AutoLayout
      direction="horizontal"
      verticalAlignItems="center"
      spacing="auto"
      width="fill-parent"
      padding={{ top: 6, bottom: 6, left: 28, right: 12 }}
      fill={COLORS.subtleBg}
    >
      <AutoLayout
        direction="horizontal"
        verticalAlignItems="center"
        spacing={6}
        width="fill-parent"
      >
        <Text
          fontSize={11}
          fill={COLORS.figmaBlueText}
          fontWeight={500}
        >
          Note:
        </Text>
        <AutoLayout
          width="fill-parent"
          padding={{ top: 2, bottom: 2, left: 4, right: 4 }}
          fill={COLORS.white}
          stroke={COLORS.hairline}
          strokeWidth={1}
          cornerRadius={4}
        >
          <Input
            value={note}
            placeholder="Add a one-line note (e.g. Approved with caveats)..."
            onTextEditEnd={(e) => onNoteChange(e.characters)}
            fontSize={11}
            fill={COLORS.textPrimary}
            width="fill-parent"
          />
        </AutoLayout>
      </AutoLayout>

      <AutoLayout
        padding={3}
        cornerRadius={4}
        hoverStyle={{
          fill: COLORS.hoverBg,
        }}
        onClick={onClose}
      >
        <CloseIcon size={12} color={COLORS.textTertiary} />
      </AutoLayout>
    </AutoLayout>
  );
};
