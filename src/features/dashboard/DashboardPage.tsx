import { Link } from 'react-router-dom';
import { Dumbbell, Flame, ListChecks, Plus, Timer, CalendarClock } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { ActivityCard } from '../../components/activities/ActivityCard';
import { ActivityTypeChart } from '../../components/activities/ActivityTypeChart';
import { RecommendationCard } from '../../components/recommendations/RecommendationCard';
import { buttonClass } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { ListSkeleton, Skeleton } from '../../components/ui/Skeleton';
import { useActivities } from '../../hooks/useActivities';
import { useRecentRecommendations } from '../../hooks/useRecommendations';
import { activityMeta, summarize } from '../../utils/activity';
import { formatDateTime } from '../../utils/date';
import { firstName, formatDuration } from '../../utils/formatting';

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

const MIN_ACTIVITIES_FOR_CHART = 3;

export function DashboardPage() {
  const { user } = useAuth();
  const activities = useActivities();
  const recs = useRecentRecommendations(activities.data, 5);
  const name = firstName(user?.name);
  const list = activities.data ?? [];
  const summary = summarize(list);

  return (
    <>
      <section className="hero">
        <div>
          <h1>{name ? `${greeting()}, ${name}` : greeting()}</h1>
          <p>Log a workout and your coaching notes will follow.</p>
        </div>
        <Link to="/activities/new" className={buttonClass('accent')}>
          <Plus size={18} aria-hidden="true" /> Log activity
        </Link>
      </section>

      {activities.isLoading && (
        <div className="stack stack--lg">
          <div className="grid-stats">{[0, 1, 2, 3].map((i) => <Skeleton key={i} height={104} style={{ borderRadius: 16 }} />)}</div>
          <ListSkeleton rows={3} />
        </div>
      )}

      {activities.isError && <ErrorState error={activities.error} onRetry={() => activities.refetch()} title="Couldn’t load your activities" />}

      {activities.isSuccess && list.length === 0 && (
        <EmptyState
          icon={Dumbbell}
          title="No activities yet"
          description="Log your first workout to see totals, history and AI recommendations here."
          action={<Link to="/activities/new" className={buttonClass('primary')}>Log your first activity</Link>}
        />
      )}

      {activities.isSuccess && list.length > 0 && (
        <div className="stack stack--lg">
          <section aria-label="Summary" className="grid-stats">
            <Card className="stat">
              <ListChecks size={20} aria-hidden="true" />
              <p className="stat__value">{summary.count}</p>
              <p className="stat__label">Activities logged</p>
            </Card>
            <Card className="stat">
              <Timer size={20} aria-hidden="true" />
              <p className="stat__value">{formatDuration(summary.totalMinutes)}</p>
              <p className="stat__label">Total time</p>
            </Card>
            <Card className="stat">
              <Flame size={20} aria-hidden="true" />
              <p className="stat__value">{summary.caloriesCount > 0 ? summary.totalCalories.toLocaleString() : '—'}</p>
              <p className="stat__label">
                {summary.caloriesCount > 0
                  ? `Calories burned${summary.caloriesCount < summary.count ? ` (${summary.caloriesCount} of ${summary.count} activities)` : ''}`
                  : 'Calories burned (none recorded)'}
              </p>
            </Card>
            <Card className="stat">
              <CalendarClock size={20} aria-hidden="true" />
              <p className="stat__value stat__value--sm">{summary.latest ? activityMeta(summary.latest.type).label : '—'}</p>
              <p className="stat__label">Latest · {formatDateTime(summary.latest?.startTime)}</p>
            </Card>
          </section>

          <div className="two-col">
            <section aria-labelledby="recent-heading" className="stack">
              <div className="section-head">
                <h2 id="recent-heading">Recent activities</h2>
                <Link to="/activities" className="text-link">See all</Link>
              </div>
              {list.slice(0, 5).map((a) => <ActivityCard key={a.id} activity={a} />)}
            </section>

            <section aria-labelledby="ai-heading" className="stack">
              <div className="section-head">
                <h2 id="ai-heading">AI insights</h2>
                <Link to="/insights" className="text-link">Open insights</Link>
              </div>
              {recs.isLoading && <Skeleton height={140} style={{ borderRadius: 16 }} />}
              {!recs.isLoading && recs.items.length === 0 && (
                <Card className="note">
                  <p>No recommendations are ready yet. They’re generated after you save an activity and can take a short while to appear.</p>
                </Card>
              )}
              {recs.items.slice(0, 2).map(({ recommendation }) => (
                <RecommendationCard key={recommendation.id} rec={recommendation} compact />
              ))}
            </section>
          </div>

          <section aria-labelledby="chart-heading">
            <Card>
              <h2 id="chart-heading">Time by activity type</h2>
              {list.length >= MIN_ACTIVITIES_FOR_CHART ? (
                <ActivityTypeChart activities={list} />
              ) : (
                <p className="muted">Log at least {MIN_ACTIVITIES_FOR_CHART} activities to see how your time is split across activity types.</p>
              )}
            </Card>
          </section>
        </div>
      )}
    </>
  );
}
