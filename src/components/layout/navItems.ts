import { LayoutDashboard, ListChecks, Plus, Sparkles, type LucideIcon } from 'lucide-react';

export interface NavItemDef {
  to: string;
  label: string;
  icon: LucideIcon;
  isActive: (path: string) => boolean;
}

export const NAV_ITEMS: NavItemDef[] = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, isActive: (p) => p.startsWith('/dashboard') },
  {
    to: '/activities',
    label: 'Activities',
    icon: ListChecks,
    isActive: (p) => p.startsWith('/activities') && p !== '/activities/new',
  },
  { to: '/insights', label: 'AI Insights', icon: Sparkles, isActive: (p) => p.startsWith('/insights') },
];

export const NEW_ACTIVITY_ITEM: NavItemDef = {
  to: '/activities/new',
  label: 'Log activity',
  icon: Plus,
  isActive: (p) => p === '/activities/new',
};
