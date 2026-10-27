export const ACTIVITY_TYPES = [
  'RUNNING',
  'WALKING',
  'CYCLING',
  'SWIMMING',
  'WEIGHT_TRAINING',
  'YOGA',
  'HIIT',
  'STRETCHING',
  'OTHER',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];

/** Request DTO. The backend calls this field `activityType`; responses call it `type`. */
export interface ActivityRequest {
  userId?: string; // Set only by the identity adapter (usersApi), never from user input.
  activityType: ActivityType;
  duration: number;
  caloriesBurned?: number | null;
  startTime: string; // Java LocalDateTime: YYYY-MM-DDTHH:mm:ss, no timezone
  additionalMetrics?: Record<string, unknown>;
}

export interface ActivityResponse {
  id: string;
  userId: string;
  type: ActivityType;
  duration: number;
  caloriesBurned?: number | null;
  startTime: string;
  additionalMetrics?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Recommendation {
  id: string;
  activityId: string;
  userId: string;
  activityType: string;
  recommendation: string;
  improvements: string[];
  suggestions: string[];
  safety: string[];
  createdAt?: string;
}
