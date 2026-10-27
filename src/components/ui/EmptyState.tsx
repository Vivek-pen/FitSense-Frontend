import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description, action }: { icon: LucideIcon; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="state">
      <div className="state__icon" aria-hidden="true"><Icon size={24} /></div>
      <h2 className="state__title">{title}</h2>
      <p className="state__text">{description}</p>
      {action}
    </div>
  );
}
