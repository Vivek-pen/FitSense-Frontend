import { useQuery } from '@tanstack/react-query';
import { activitiesApi } from '../api/activitiesApi';

export function useActivity(id: string | undefined) {
  return useQuery({
    queryKey: ['activity', id],
    queryFn: ({ signal }) => activitiesApi.get(id!, signal),
    enabled: Boolean(id),
  });
}
