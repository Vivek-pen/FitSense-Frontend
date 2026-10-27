import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function PageHeader({ title, subtitle, actions, back }: { title: string; subtitle?: string; actions?: ReactNode; back?: { to: string; label: string } }) {
  return (
    <header className="page-header">
      {back && (
        <Link to={back.to} className="back-link">
          <ArrowLeft size={16} aria-hidden="true" /> {back.label}
        </Link>
      )}
      <div className="page-header__row">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
    </header>
  );
}
