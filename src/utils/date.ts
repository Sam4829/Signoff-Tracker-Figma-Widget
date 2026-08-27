const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

/**
 * Returns today's date formatted as "24 Aug 2026"
 */
export function getFormattedCurrentDate(): string {
  const now = new Date();
  const day = now.getDate();
  const month = MONTH_NAMES[now.getMonth()];
  const year = now.getFullYear();
  return `${day} ${month} ${year}`;
}
