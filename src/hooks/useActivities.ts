import { useQuery } from '@tanstack/react-query';
import { activitiesApi } from '../api/activitiesApi';
import { sortNewestFirst } from '../utils/activity';

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async ({ signal }) => sortNewestFirst(await activitiesApi.list(signal)),
  });
}
