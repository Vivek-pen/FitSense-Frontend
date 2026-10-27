import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/layout/PageHeader';
import { RecommendationCard } from '../../components/recommendations/RecommendationCard';
import { Button, buttonClass } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useActivities } from '../../hooks/useActivities';
import { useCurrentAppUserId, useRecentRecommendations, useUserRecommendations } from '../../hooks/useRecommendations';

const FALLBACK_LIMIT = 10;

export function InsightsPage() {
  const userId = useCurrentAppUserId();
  const hasUserId = Boolean(userId.data);
  const byUser = useUserRecommendations(userId.data);
  const activities = useActivities();
  // Without an app user ID, fall back to the per-activity endpoint for the latest activities.
  const fallback = useRecentRecommendations(hasUserId ? undefined : activities.data, FALLBACK_LIMIT);

  const refresh = () => (hasUserId ? byUser.refetch() : Promise.all([activities.refetch(), fallback.refetch()]));
  const loading = userId.isLoading || (hasUserId ? byUser.isLoading : activities.isLoading || fallback.isLoading);
  const error = hasUserId ? byUser.error : activities.error;
  const items = hasUserId
    ? (byUser.data ?? []).map((r) => ({ key: r.id, rec: r }))
    : fallback.items.map((i) => ({ key: i.recommendation.id, rec: i.recommendation }));

  return (
    <>
      <PageHeader
        title="AI insights"
        subtitle="Recommendations generated from your logged workouts."
        actions={<Button variant="secondary" onClick={() => void refresh()}>Refresh</Button>}
      />

      {!userId.isLoading && !hasUserId && (
        <Card className="note" role="note">
          <p>
            <strong>Showing your {FALLBACK_LIMIT} most recent activities only.</strong> The backend can’t yet tell this app which
            account is yours for the full recommendation history, so older recommendations aren’t listed here.
          </p>
        </Card>
      )}

      <div className="stack stack--lg" style={{ marginTop: 24 }}>
        {loading && (
          <>
            <Skeleton height={220} style={{ borderRadius: 20 }} />
            <Skeleton height={220} style={{ borderRadius: 20 }} />
          </>
        )}
        {!loading && error && <ErrorState error={error} onRetry={() => void refresh()} title="Couldn’t load insights" />}
        {!loading && !error && items.length === 0 && (
          <EmptyState
            icon={Sparkles}
            title="No recommendations yet"
            description="Recommendations are generated after you log an activity and can take a short while to appear. Check back soon."
            action={<Link to="/activities/new" className={buttonClass('primary')}>Log activity</Link>}
          />
        )}
        {!loading && items.map(({ key, rec }) => <RecommendationCard key={key} rec={rec} />)}
      </div>
    </>
  );
}
