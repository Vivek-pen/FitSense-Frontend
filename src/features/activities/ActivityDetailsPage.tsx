import { Link, useParams } from 'react-router-dom';
import { Clock, Flame, Sparkles } from 'lucide-react';
import { ActivityMetrics } from '../../components/activities/ActivityMetrics';
import { ActivityTypeIcon } from '../../components/activities/ActivityTypeIcon';
import { PageHeader } from '../../components/layout/PageHeader';
import { buttonClass } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useActivity } from '../../hooks/useActivity';
import { activityMeta } from '../../utils/activity';
import { formatDateTime } from '../../utils/date';
import { formatCalories, formatDuration } from '../../utils/formatting';

export function ActivityDetailsPage() {
  const { activityId } = useParams();
  const { data: a, isLoading, isError, error, refetch } = useActivity(activityId);
  const back = { to: '/activities', label: 'Activities' };

  if (isLoading) {
    return (
      <>
        <PageHeader title="Activity" back={back} />
        <Skeleton height={220} style={{ borderRadius: 20 }} />
      </>
    );
  }
  if (isError || !a) {
    return (
      <>
        <PageHeader title="Activity" back={back} />
        <ErrorState error={error} onRetry={() => refetch()} title={undefined} />
      </>
    );
  }

  const { label } = activityMeta(a.type);
  return (
    <>
      <PageHeader
        title={label}
        subtitle={formatDateTime(a.startTime)}
        back={back}
        actions={
          <Link to={`/activities/${encodeURIComponent(a.id)}/insight`} className={buttonClass('primary')}>
            <Sparkles size={18} aria-hidden="true" /> View AI recommendation
          </Link>
        }
      />
      <div className="stack stack--lg">
        <Card className="detail-hero">
          <ActivityTypeIcon type={a.type} size={28} />
          <dl className="detail-stats">
            <div>
              <dt><Clock size={16} aria-hidden="true" /> Duration</dt>
              <dd>{formatDuration(a.duration)}</dd>
            </div>
            <div>
              <dt><Flame size={16} aria-hidden="true" /> Calories</dt>
              <dd>{formatCalories(a.caloriesBurned)}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2>Additional metrics</h2>
          <ActivityMetrics metrics={a.additionalMetrics} />
        </Card>

        {(a.createdAt || a.updatedAt) && (
          <p className="muted small">
            {a.createdAt && <>Saved {formatDateTime(a.createdAt)}. </>}
            {a.updatedAt && a.updatedAt !== a.createdAt && <>Updated {formatDateTime(a.updatedAt)}.</>}
          </p>
        )}
      </div>
    </>
  );
}
