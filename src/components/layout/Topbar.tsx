import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HeartPulse, LogOut } from 'lucide-react';
import { config } from '../../config';
import { useAuth } from '../../auth/AuthProvider';

export function Topbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const display = user?.name || user?.email || 'Account';
  const initial = display.trim().charAt(0).toUpperCase();

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="topbar">
      <Link to="/dashboard" className="brand brand--compact">
        <span className="brand__mark" aria-hidden="true"><HeartPulse size={18} /></span>
        {config.brandName}
      </Link>
      <div className="menu" ref={ref}>
        <button type="button" className="menu__trigger" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)}>
          <span className="avatar" aria-hidden="true">{initial}</span>
          <span className="menu__name">{display}</span>
          <ChevronDown size={16} aria-hidden="true" />
        </button>
        {open && (
          <div className="menu__panel">
            <div className="menu__identity">
              {user?.name && <strong>{user.name}</strong>}
              {user?.email && <span className="muted">{user.email}</span>}
            </div>
            <button type="button" className="menu__item" onClick={logout}>
              <LogOut size={16} aria-hidden="true" /> Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
