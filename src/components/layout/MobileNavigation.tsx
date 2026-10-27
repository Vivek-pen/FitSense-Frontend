import { Link, useLocation } from 'react-router-dom';
import { NAV_ITEMS, NEW_ACTIVITY_ITEM } from './navItems';

export function MobileNavigation() {
  const { pathname } = useLocation();
  const items = [NAV_ITEMS[0], NAV_ITEMS[1], NEW_ACTIVITY_ITEM, NAV_ITEMS[2]];
  return (
    <nav className="mobile-nav" aria-label="Main">
      <ul>
        {items.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;
          return (
            <li key={item.to}>
              <Link to={item.to} className="mobile-nav__link" aria-current={active ? 'page' : undefined}>
                <Icon size={22} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
