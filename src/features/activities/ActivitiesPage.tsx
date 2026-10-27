import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, Plus, SearchX } from 'lucide-react';
import { ACTIVITY_TYPES } from '../../api/types';
import { ActivityCard } from '../../components/activities/ActivityCard';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button, buttonClass } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Input, Select } from '../../components/ui/Fields';
import { ListSkeleton } from '../../components/ui/Skeleton';
import { useActivities } from '../../hooks/useActivities';
import { ACTIVITY_META } from '../../utils/activity';
import { dateKey, timestamp } from '../../utils/date';

export function ActivitiesPage() {
  const { data, isLoading, isError, error, refetch, isFetching } = useActivities();
  const [type, setType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [order, setOrder] = useState<'newest' | 'oldest'>('newest');

  // Filters run in the browser on the loaded results only; the API has no server-side search.
  const visible = useMemo(() => {
    const filtered = (data ?? []).filter((a) => {
      const day = dateKey(a.startTime);
      return (!type || a.type === type) && (!from || day >= from) && (!to || day <= to);
    });
    filtered.sort((a, b) => (order === 'newest' ? timestamp(b.startTime) - timestamp(a.startTime) : timestamp(a.startTime) - timestamp(b.startTime)));
    return filtered;
  }, [data, type, from, to, order]);

  const filtersActive = Boolean(type || from || to);
  const reset = () => {
    setType('');
    setFrom('');
    setTo('');
  };

  return (
    <>
      <PageHeader
        title="Activities"
        subtitle="Everything you’ve logged, newest first."
        actions={<Link to="/activities/new" className={buttonClass('primary')}><Plus size={18} aria-hidden="true" /> Log activity</Link>}
      />

      {isLoading && <ListSkeleton rows={5} />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} title="Couldn’t load your activities" />}

      {data && data.length === 0 && (
        <EmptyState
          icon={Dumbbell}
          title="No activities yet"
          description="When you log a workout it will show up here."
          action={<Link to="/activities/new" className={buttonClass('primary')}>Log activity</Link>}
        />
      )}

      {data && data.length > 0 && (
        <div className="stack stack--lg">
          <form className="filters" onSubmit={(e) => e.preventDefault()} aria-label="Filter activities">
            <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">All types</option>
              {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{ACTIVITY_META[t].label}</option>)}
            </Select>
            <Input label="From" type="date" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} />
            <Input label="To" type="date" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} />
            <Select label="Sort" value={order} onChange={(e) => setOrder(e.target.value as 'newest' | 'oldest')}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </Select>
          </form>

          <div className="section-head">
            <p className="muted" aria-live="polite">Showing {visible.length} of {data.length} activities{isFetching ? ' · refreshing…' : ''}</p>
            {filtersActive && <Button variant="ghost" size="sm" onClick={reset}>Clear filters</Button>}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No activities match these filters"
              description="Try a different type or widen the date range."
              action={<Button variant="secondary" onClick={reset}>Clear filters</Button>}
            />
          ) : (
            <div className="stack">{visible.map((a) => <ActivityCard key={a.id} activity={a} />)}</div>
          )}
        </div>
      )}
    </>
  );
}
