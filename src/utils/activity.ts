import {
  Activity, Bike, Dumbbell, Flame, Flower2, Footprints, Sparkles, StretchHorizontal, Waves,
  type LucideIcon,
} from 'lucide-react';
import type { ActivityResponse } from '../api/types';
import { timestamp } from './date';

export interface ActivityMeta {
  label: string;
  icon: LucideIcon;
}

export const ACTIVITY_META: Record<string, ActivityMeta> = {
  RUNNING: { label: 'Running', icon: Activity },
  WALKING: { label: 'Walking', icon: Footprints },
  CYCLING: { label: 'Cycling', icon: Bike },
  SWIMMING: { label: 'Swimming', icon: Waves },
  WEIGHT_TRAINING: { label: 'Weight training', icon: Dumbbell },
  YOGA: { label: 'Yoga', icon: Flower2 },
  HIIT: { label: 'HIIT', icon: Flame },
  STRETCHING: { label: 'Stretching', icon: StretchHorizontal },
  OTHER: { label: 'Other', icon: Sparkles },
};

/** Falls back gracefully if the backend ever returns a type this UI doesn't know. */
export function activityMeta(type?: string): ActivityMeta {
  if (type && ACTIVITY_META[type]) return ACTIVITY_META[type];
  const label = type ? type.charAt(0) + type.slice(1).toLowerCase().replace(/_/g, ' ') : 'Activity';
  return { label, icon: Sparkles };
}

export function sortNewestFirst(list: ActivityResponse[]): ActivityResponse[] {
  return [...list].sort((a, b) => timestamp(b.startTime) - timestamp(a.startTime));
}

export interface ActivitySummary {
  count: number;
  totalMinutes: number;
  totalCalories: number;
  caloriesCount: number;
  latest: ActivityResponse | null;
}

/** Summaries come only from the activities actually returned by the API. */
export function summarize(list: ActivityResponse[]): ActivitySummary {
  let totalMinutes = 0;
  let totalCalories = 0;
  let caloriesCount = 0;
  for (const a of list) {
    totalMinutes += a.duration || 0;
    if (typeof a.caloriesBurned === 'number') {
      totalCalories += a.caloriesBurned;
      caloriesCount += 1;
    }
  }
  return { count: list.length, totalMinutes, totalCalories, caloriesCount, latest: sortNewestFirst(list)[0] ?? null };
}
