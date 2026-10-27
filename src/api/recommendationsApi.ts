import { apiRequest } from './apiClient';
import { isApiError } from './errors';
import type { Recommendation } from './types';

export const recommendationsApi = {
  /** Needs the application user ID — see usersApi.getCurrentAppUserId. */
  async listForUser(userId: string, signal?: AbortSignal): Promise<Recommendation[]> {
    const data = await apiRequest<Recommendation[]>(`/api/recommendations/user/${encodeURIComponent(userId)}`, { signal });
    return Array.isArray(data) ? data : [];
  },

  /** Returns null when no recommendation exists yet (generation is asynchronous). */
  async getForActivity(activityId: string, signal?: AbortSignal): Promise<Recommendation | null> {
    try {
      const data = await apiRequest<Recommendation | undefined>(
        `/api/recommendations/activity/${encodeURIComponent(activityId)}`,
        { signal },
      );
      return data && data.id ? data : null;
    } catch (e) {
      if (isApiError(e) && e.kind === 'not_found') return null;
      throw e;
    }
  },
};
