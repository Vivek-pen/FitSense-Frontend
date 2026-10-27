import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { buttonClass } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export function AccessDeniedPage() {
  return (
    <EmptyState
      icon={Lock}
      title="Access denied"
      description="Your account isn’t allowed to view this page."
      action={<Link to="/dashboard" className={buttonClass('primary')}>Back to overview</Link>}
    />
  );
}
