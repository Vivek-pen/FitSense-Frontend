import { metricLabel, metricValue } from '../../utils/formatting';

export function ActivityMetrics({ metrics }: { metrics?: Record<string, unknown> | null }) {
  const entries = Object.entries(metrics ?? {});
  if (entries.length === 0) {
    return <p className="muted">No extra metrics were recorded for this activity.</p>;
  }
  return (
    <dl className="metrics">
      {entries.map(([key, value]) => (
        <div key={key} className="metrics__item">
          <dt>{metricLabel(key)}</dt>
          <dd>{metricValue(value)}</dd>
        </div>
      ))}
    </dl>
  );
}
