export function formatDuration(minutes: number): string {
  if (!Number.isFinite(minutes)) return '—';
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function formatCalories(value?: number | null): string {
  return typeof value === 'number' ? `${value.toLocaleString()} kcal` : '—';
}

const KNOWN_METRIC_LABELS: Record<string, string> = {
  distanceKm: 'Distance (km)',
  averageHeartRate: 'Average heart rate (bpm)',
  elevationMeters: 'Elevation (m)',
  pace: 'Pace',
  notes: 'Notes',
};

export function metricLabel(key: string): string {
  if (KNOWN_METRIC_LABELS[key]) return KNOWN_METRIC_LABELS[key];
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function metricValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function firstName(fullName?: string): string | null {
  const name = fullName?.trim().split(/\s+/)[0];
  return name || null;
}
