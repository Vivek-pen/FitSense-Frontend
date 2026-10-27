import { z } from 'zod';
import { ACTIVITY_TYPES, type ActivityRequest } from '../../api/types';
import { toLocalDateTime } from '../../utils/date';

const wholeNumber = /^\d*$/;
const decimal = /^(\d+(\.\d+)?)?$/;

function parseJsonObject(text: string): Record<string, unknown> | null {
  if (!text.trim()) return {};
  try {
    const parsed: unknown = JSON.parse(text);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

// Inputs stay strings so empty optional fields are simple; they're converted in toActivityRequest.
export const activitySchema = z.object({
  activityType: z.enum(ACTIVITY_TYPES, { errorMap: () => ({ message: 'Choose an activity type' }) }),
  duration: z
    .string()
    .trim()
    .min(1, 'Enter how long it lasted')
    .regex(/^\d+$/, 'Use whole minutes, for example 30')
    .refine((v) => Number(v) > 0, 'Duration must be more than 0 minutes'),
  caloriesBurned: z.string().trim().regex(wholeNumber, 'Use a whole number, for example 250'),
  startTime: z
    .string()
    .min(1, 'Choose a start time')
    .refine((v) => !Number.isNaN(new Date(v).getTime()), 'Enter a valid date and time'),
  distanceKm: z.string().trim().regex(decimal, 'Use a number, for example 5.2'),
  averageHeartRate: z.string().trim().regex(wholeNumber, 'Use a whole number, for example 140'),
  elevationMeters: z.string().trim().regex(decimal, 'Use a number, for example 120'),
  notes: z.string().max(500, 'Keep notes under 500 characters'),
  advancedJson: z.string().refine((v) => parseJsonObject(v) !== null, 'Enter a valid JSON object, for example {"cadence": 82}'),
});

export type ActivityFormValues = z.infer<typeof activitySchema>;

export function toActivityRequest(v: ActivityFormValues): ActivityRequest {
  const metrics: Record<string, unknown> = { ...(parseJsonObject(v.advancedJson) ?? {}) };
  if (v.distanceKm) metrics.distanceKm = Number(v.distanceKm);
  if (v.averageHeartRate) metrics.averageHeartRate = Number(v.averageHeartRate);
  if (v.elevationMeters) metrics.elevationMeters = Number(v.elevationMeters);
  if (v.notes.trim()) metrics.notes = v.notes.trim();

  return {
    activityType: v.activityType,
    duration: Number(v.duration),
    caloriesBurned: v.caloriesBurned ? Number(v.caloriesBurned) : null,
    startTime: toLocalDateTime(v.startTime),
    additionalMetrics: Object.keys(metrics).length > 0 ? metrics : undefined,
  };
}
