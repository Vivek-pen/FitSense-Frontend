import { Link, useLocation } from 'react-router-dom';
import { HeartPulse, Plus } from 'lucide-react';
import { config } from '../../config';
import { buttonClass } from '../ui/Button';
import { NAV_ITEMS } from './navItems';

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="sidebar">
      <Link to="/dashboard" className="brand">
        <span className="brand__mark" aria-hidden="true"><HeartPulse size={20} /></span>
        {config.brandName}
      </Link>
      <Link to="/activities/new" className={`${buttonClass('accent')} sidebar__cta`}>
        <Plus size={18} aria-hidden="true" /> Log activity
      </Link>
      <nav aria-label="Main">
        <ul className="nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, isActive }) => (
            <li key={to}>
              <Link to={to} className="nav__link" aria-current={isActive(pathname) ? 'page' : undefined}>
                <Icon size={20} aria-hidden="true" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
