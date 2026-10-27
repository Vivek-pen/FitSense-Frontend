import { Link, useParams } from 'react-router-dom';
import { Hourglass } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { RecommendationCard } from '../../components/recommendations/RecommendationCard';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Skeleton } from '../../components/ui/Skeleton';
import { useActivityRecommendation } from '../../hooks/useRecommendations';

export function ActivityInsightPage() {
  const { activityId } = useParams();
  const { data, isLoading, isError, error, refetch, isFetching } = useActivityRecommendation(activityId);
  const back = { to: `/activities/${encodeURIComponent(activityId ?? '')}`, label: 'Back to activity' };

  return (
    <>
      <PageHeader title="AI recommendation" subtitle="Practical notes based on this workout." back={back} />
      {isLoading && <Skeleton height={260} style={{ borderRadius: 20 }} />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} title="Couldn’t load the recommendation" />}
      {data === null && (
        <EmptyState
          icon={Hourglass}
          title="Recommendation not ready yet"
          description="It may still be generating, or it isn’t available for this activity. New activities usually take a short while. We check a few times automatically."
          action={<Button variant="secondary" onClick={() => refetch()} loading={isFetching}>Check again</Button>}
        />
      )}
      {data && <RecommendationCard rec={data} showActivityLink={false} />}
      {data && (
        <p className="muted small"><Link to={back.to} className="text-link">Back to the activity</Link></p>
      )}
    </>
  );
}
