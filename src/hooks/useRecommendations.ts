import { useQueries, useQuery } from '@tanstack/react-query';
import { getCurrentAppUserId } from '../api/usersApi';
import { recommendationsApi } from '../api/recommendationsApi';
import type { ActivityResponse, Recommendation } from '../api/types';

const POLL_MS = 10_000;
const MAX_POLLS = 6; // stop after about a minute

/** Recommendation for one activity. While it's not ready yet, checks gently a limited number of times. */
export function useActivityRecommendation(activityId: string | undefined) {
  return useQuery({
    queryKey: ['recommendation', activityId],
    queryFn: ({ signal }) => recommendationsApi.getForActivity(activityId!, signal),
    enabled: Boolean(activityId),
    refetchInterval: (query) =>
      query.state.data === null && query.state.dataUpdateCount < MAX_POLLS ? POLL_MS : false,
  });
}

/** Resolves the application user ID through the identity adapter (null until the backend supports it). */
export function useCurrentAppUserId() {
  return useQuery({
    queryKey: ['current-app-user-id'],
    queryFn: () => getCurrentAppUserId(),
    staleTime: Infinity,
  });
}

export function useUserRecommendations(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['recommendations', 'user', userId],
    queryFn: ({ signal }) => recommendationsApi.listForUser(userId!, signal),
    enabled: Boolean(userId),
  });
}

export interface ActivityRecommendation {
  activity: ActivityResponse;
  recommendation: Recommendation;
}

/**
 * Looks up recommendations for the most recent activities using the per-activity endpoint.
 * Used where no application user ID is available. Missing recommendations are simply skipped.
 */
export function useRecentRecommendations(activities: ActivityResponse[] | undefined, limit: number) {
  const recent = (activities ?? []).slice(0, limit);
  const results = useQueries({
    queries: recent.map((a) => ({
      queryKey: ['recommendation', a.id],
      queryFn: ({ signal }: { signal: AbortSignal }) => recommendationsApi.getForActivity(a.id, signal),
      staleTime: 60_000,
    })),
  });

  const items: ActivityRecommendation[] = [];
  results.forEach((r, i) => {
    if (r.data) items.push({ activity: recent[i], recommendation: r.data });
  });

  return {
    items,
    checked: recent.length,
    isLoading: results.some((r) => r.isLoading),
    isError: results.length > 0 && results.every((r) => r.isError),
    refetch: () => Promise.all(results.map((r) => r.refetch())),
  };
}
