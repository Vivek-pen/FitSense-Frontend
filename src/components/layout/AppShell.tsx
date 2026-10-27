import { Outlet } from 'react-router-dom';
import { MobileNavigation } from './MobileNavigation';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  return (
    <div className="shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <Sidebar />
      <div className="shell__body">
        <Topbar />
        <main id="main" className="shell__main" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
      <MobileNavigation />
    </div>
  );
}
