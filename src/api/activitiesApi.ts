import { apiRequest } from './apiClient';
import { getCurrentAppUserId } from './usersApi';
import type { ActivityRequest, ActivityResponse } from './types';

export const activitiesApi = {
  async list(signal?: AbortSignal): Promise<ActivityResponse[]> {
    const data = await apiRequest<ActivityResponse[]>('/api/activities', { signal });
    return Array.isArray(data) ? data : [];
  },

  get(id: string, signal?: AbortSignal): Promise<ActivityResponse> {
    return apiRequest<ActivityResponse>(`/api/activities/${encodeURIComponent(id)}`, { signal });
  },

  async create(input: ActivityRequest): Promise<ActivityResponse> {
    // Current backend contract mismatch: the service may read userId from the body.
    // Include it only when the adapter can resolve it safely.
    const userId = await getCurrentAppUserId();
    const payload: ActivityRequest = userId ? { ...input, userId } : input;
    return apiRequest<ActivityResponse>('/api/activities', { method: 'POST', body: payload });
  },
};
