import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { ActivityResponse } from '../../api/types';
import { activityMeta } from '../../utils/activity';

/** Minutes per activity type, computed only from the fetched activities. */
export function ActivityTypeChart({ activities }: { activities: ActivityResponse[] }) {
  const totals = new Map<string, { minutes: number; count: number }>();
  for (const a of activities) {
    const t = totals.get(a.type) ?? { minutes: 0, count: 0 };
    t.minutes += a.duration || 0;
    t.count += 1;
    totals.set(a.type, t);
  }
  const data = [...totals.entries()]
    .map(([type, v]) => ({ name: activityMeta(type).label, minutes: v.minutes, count: v.count }))
    .sort((a, b) => b.minutes - a.minutes);

  const summary = `Minutes by activity type: ${data.map((d) => `${d.name} ${d.minutes}`).join(', ')}.`;

  return (
    <div>
      <div role="img" aria-label={summary} style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#e6e3da" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#5b6475', fontSize: 12 }} interval={0} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: '#5b6475', fontSize: 12 }} allowDecimals={false} />
            <Tooltip cursor={{ fill: 'rgba(15,157,107,0.08)' }} formatter={(v: number) => [`${v} min`, 'Time']} />
            <Bar dataKey="minutes" fill="#0f9d6b" radius={[6, 6, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details className="advanced">
        <summary>View as a table</summary>
        <table className="data-table">
          <thead>
            <tr><th scope="col">Activity type</th><th scope="col">Sessions</th><th scope="col">Total minutes</th></tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.name}><th scope="row">{d.name}</th><td>{d.count}</td><td>{d.minutes}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
