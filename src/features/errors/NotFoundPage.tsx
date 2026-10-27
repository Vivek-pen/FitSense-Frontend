import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { buttonClass } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';

export function NotFoundPage() {
  return (
    <EmptyState
      icon={Compass}
      title="Page not found"
      description="That page doesn’t exist or has moved."
      action={<Link to="/dashboard" className={buttonClass('primary')}>Back to overview</Link>}
    />
  );
}
