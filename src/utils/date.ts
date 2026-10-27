// The backend stores Java LocalDateTime (no timezone). We show the value as-is, without implying a zone.
const dateTime = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
const dateOnly = new Intl.DateTimeFormat(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

function parse(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDateTime(value?: string | null): string {
  const d = parse(value);
  return d ? dateTime.format(d) : '—';
}

export function formatDate(value?: string | null): string {
  const d = parse(value);
  return d ? dateOnly.format(d) : '—';
}

/** YYYY-MM-DD part of a LocalDateTime string, used for date-range filtering. */
export function dateKey(value: string): string {
  return value.slice(0, 10);
}

export function timestamp(value: string): number {
  return parse(value)?.getTime() ?? 0;
}

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** Value for <input type="datetime-local"> in the browser's local time. */
export function nowForInput(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Converts datetime-local output to a backend-compatible LocalDateTime string. */
export function toLocalDateTime(inputValue: string): string {
  return inputValue.length === 16 ? `${inputValue}:00` : inputValue.slice(0, 19);
}
