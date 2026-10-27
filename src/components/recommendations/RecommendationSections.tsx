import { Lightbulb, ShieldCheck, TrendingUp } from 'lucide-react';
import type { Recommendation } from '../../api/types';

function Section({ title, items, icon, tone }: { title: string; items?: string[]; icon: React.ReactNode; tone?: 'safety' }) {
  if (!items || items.length === 0) return null;
  return (
    <section className={`rec-section ${tone ? `rec-section--${tone}` : ''}`}>
      <h3>{icon} {title}</h3>
      <ul>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </section>
  );
}

export function RecommendationSections({ rec }: { rec: Recommendation }) {
  return (
    <div className="rec-sections">
      <Section title="Safety notes" tone="safety" items={rec.safety} icon={<ShieldCheck size={18} aria-hidden="true" />} />
      <Section title="Areas to improve" items={rec.improvements} icon={<TrendingUp size={18} aria-hidden="true" />} />
      <Section title="Suggestions" items={rec.suggestions} icon={<Lightbulb size={18} aria-hidden="true" />} />
    </div>
  );
}
