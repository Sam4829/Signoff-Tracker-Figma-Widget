import { SVG } from '../figma';

interface IconProps {
  size?: number;
  color?: string;
  onClick?: () => void;
}

export const DragHandleIcon = ({ size = 14, color = '#B3B3B3' }: IconProps) => {
  return (
    <SVG
      src={`<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="4" r="1.25" fill="${color}" />
        <circle cx="10" cy="4" r="1.25" fill="${color}" />
        <circle cx="6" cy="8" r="1.25" fill="${color}" />
        <circle cx="10" cy="8" r="1.25" fill="${color}" />
        <circle cx="6" cy="12" r="1.25" fill="${color}" />
        <circle cx="10" cy="12" r="1.25" fill="${color}" />
      </svg>`}
    />
  );
};

export const CheckboxIcon = ({ checked = false, onClick }: { checked?: boolean; onClick?: () => void }) => {
  if (checked) {
    return (
      <SVG
        onClick={onClick}
        src={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="16" height="16" rx="4" fill="#0D99FF" />
          <path d="M4.5 8.2L6.8 10.5L11.5 5.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`}
      />
    );
  }
  return (
    <SVG
      onClick={onClick}
      src={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="3.25" fill="white" stroke="#CCCCCC" stroke-width="1.5" />
      </svg>`}
    />
  );
};

export const NoteIcon = ({ hasNote = false, isOpen = false, onClick }: { hasNote?: boolean; isOpen?: boolean; onClick?: () => void }) => {
  if (hasNote || isOpen) {
    return (
      <SVG
        onClick={onClick}
        src={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="2.5" width="14" height="15" rx="3" fill="#0D99FF" />
          <path d="M6.5 6.5H13.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          <path d="M6.5 10H13.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          <path d="M6.5 13.5H10.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
        </svg>`}
      />
    );
  }
  return (
    <SVG
      onClick={onClick}
      src={`<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.75" y="3.25" width="12.5" height="13.5" rx="2.25" fill="none" stroke="#A0A0A0" stroke-width="1.5" />
        <path d="M6.5 7H13.5" stroke="#A0A0A0" stroke-width="1.3" stroke-linecap="round" />
        <path d="M6.5 10H13.5" stroke="#A0A0A0" stroke-width="1.3" stroke-linecap="round" />
        <path d="M6.5 13H10" stroke="#A0A0A0" stroke-width="1.3" stroke-linecap="round" />
      </svg>`}
    />
  );
};

export const GearIcon = ({ size = 16, color = '#666666', onClick }: IconProps) => {
  return (
    <SVG
      onClick={onClick}
      src={`<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.5 1.5H9.5V3.1A4.5 4.5 0 0 1 10.8 3.8L12.3 2.3L14.4 4.4L12.9 5.9A4.5 4.5 0 0 1 13.6 7.2H15.2V10.2H13.6A4.5 4.5 0 0 1 12.9 11.5L14.4 13L12.3 15.1L10.8 13.6A4.5 4.5 0 0 1 9.5 14.3V15.9H6.5V14.3A4.5 4.5 0 0 1 5.2 13.6L3.7 15.1L1.6 13L3.1 11.5A4.5 4.5 0 0 1 2.4 10.2H0.8V7.2H2.4A4.5 4.5 0 0 1 3.1 5.9L1.6 4.4L3.7 2.3L5.2 3.8A4.5 4.5 0 0 1 6.5 3.1V1.5ZM8 5.5A2.5 2.5 0 1 0 8 10.5A2.5 2.5 0 0 0 8 5.5Z" fill="${color}"/>
      </svg>`}
    />
  );
};

export const ChevronDownIcon = ({ size = 12, color = '#666666' }: IconProps) => {
  return (
    <SVG
      src={`<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L8 10L12 6" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`}
    />
  );
};

export const PlusIcon = ({ size = 14, color = '#0D99FF', onClick }: IconProps) => {
  return (
    <SVG
      onClick={onClick}
      src={`<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3V13M3 8H13" stroke="${color}" stroke-width="1.8" stroke-linecap="round" />
      </svg>`}
    />
  );
};

export const CloseIcon = ({ size = 14, color = '#8C8C8C', onClick }: IconProps) => {
  return (
    <SVG
      onClick={onClick}
      src={`<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4L12 12M12 4L4 12" stroke="${color}" stroke-width="1.6" stroke-linecap="round" />
      </svg>`}
    />
  );
};

export const ArrowUpIcon = ({ size = 14, color = '#666666', onClick }: IconProps) => {
  return (
    <SVG
      onClick={onClick}
      src={`<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 12V4M4 8L8 4L12 8" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`}
    />
  );
};

export const ArrowDownIcon = ({ size = 14, color = '#666666', onClick }: IconProps) => {
  return (
    <SVG
      onClick={onClick}
      src={`<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 4V12M4 8L8 12L12 8" stroke="${color}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`}
    />
  );
};

export const WarningIcon = ({ size = 14, color = '#D97706' }: IconProps) => {
  return (
    <SVG
      src={`<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 2.5L14 13.5H2L8 2.5Z" fill="${color}" />
        <path d="M8 6.5V9.5M8 11.5H8.01" stroke="white" stroke-width="1.5" stroke-linecap="round" />
      </svg>`}
    />
  );
};
