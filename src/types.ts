export type WidgetMode = 'binary' | 'multistate';

export type MultiStateStatus =
  | 'not_started'
  | 'in_review'
  | 'signed_off'
  | 'blocked'
  | 'na';

export interface SignoffRow {
  id: string;
  role: string;
  assignee: string;
  checked: boolean;
  status: MultiStateStatus;
  date: string;
  note: string;
}

export interface PresetConfig {
  id: string;
  name: string;
  roles: string[];
}

export interface StatusStyle {
  label: string;
  bg: string;
  text: string;
  dotColor: string;
  borderColor: string;
}
