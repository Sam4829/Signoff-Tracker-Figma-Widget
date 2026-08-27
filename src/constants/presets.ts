import { PresetConfig } from '../types';

export const ROLE_PRESETS: PresetConfig[] = [
  {
    id: 'design-signoff',
    name: 'Design Sign-off',
    roles: ['Design', 'Eng', 'PM', 'QA'],
  },
  {
    id: 'legal-compliance',
    name: 'Legal / Compliance Review',
    roles: ['Legal', 'Compliance', 'Security'],
  },
  {
    id: 'launch-checklist',
    name: 'Launch Checklist',
    roles: ['Design', 'Eng', 'PM', 'Marketing', 'Support'],
  },
];
