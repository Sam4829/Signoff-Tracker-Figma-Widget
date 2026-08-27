import { MultiStateStatus, StatusStyle } from '../types';

export const COLORS = {
  // Brand / Accent
  figmaBlue: '#0D99FF',
  figmaBlueHover: '#007BE5',
  figmaBlueLight: '#E8F4FE',

  // Neutrals
  white: '#FFFFFF',
  cardBg: '#FFFFFF',
  canvasBorder: '#E6E6E6',
  hairline: '#F0F0F0',
  subtleBg: '#F7F7F7',
  hoverBg: '#F2F2F2',

  // Text
  textPrimary: '#1E1E1E',
  textSecondary: '#666666',
  textTertiary: '#8C8C8C',
  textMuted: '#B3B3B3',

  // Row selection / highlight
  rowHover: '#FBFBFB',
  dangerBg: '#FDF2F2',
  dangerText: '#E02424',
  dangerBorder: '#F8B4B4',
  warningBg: '#FFFBEB',
  warningText: '#92400E',
  warningBorder: '#FDE68A',
};

export const STATUS_CONFIG: Record<MultiStateStatus, StatusStyle> = {
  not_started: {
    label: 'Not started',
    bg: '#F2F2F2',
    text: '#555555',
    dotColor: '#999999',
    borderColor: '#E0E0E0',
  },
  in_review: {
    label: 'In review',
    bg: '#FFF8E1',
    text: '#B78103',
    dotColor: '#F59E0B',
    borderColor: '#FFE082',
  },
  signed_off: {
    label: 'Signed off',
    bg: '#E8F5E9',
    text: '#1B5E20',
    dotColor: '#10B981',
    borderColor: '#A5D6A7',
  },
  blocked: {
    label: 'Blocked',
    bg: '#FFEBEE',
    text: '#C62828',
    dotColor: '#EF4444',
    borderColor: '#EF9A9A',
  },
  na: {
    label: 'N/A',
    bg: '#EEEEEE',
    text: '#757575',
    dotColor: '#9E9E9E',
    borderColor: '#E0E0E0',
  },
};
