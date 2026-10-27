import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { activitiesApi } from '../../api/activitiesApi';
import { toApiError } from '../../api/errors';
import { ACTIVITY_TYPES } from '../../api/types';
import { ACTIVITY_META } from '../../utils/activity';
import { nowForInput } from '../../utils/date';
import { Button, buttonClass } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input, Select, Textarea } from '../ui/Fields';
import { useToast } from '../ui/ToastProvider';
import { activitySchema, toActivityRequest, type ActivityFormValues } from './activitySchema';

export function ActivityForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [serverError, setServerError] = useState<{ message: string; kind: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      activityType: 'RUNNING',
      duration: '',
      caloriesBurned: '',
      startTime: nowForInput(),
      distanceKm: '',
      averageHeartRate: '',
      elevationMeters: '',
      notes: '',
      advancedJson: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: ActivityFormValues) => activitiesApi.create(toActivityRequest(values)),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity saved. Your recommendation will appear once it’s ready.');
      navigate(created?.id ? `/activities/${encodeURIComponent(created.id)}` : '/activities');
    },
    onError: (e) => {
      const err = toApiError(e);
      setServerError({ message: err.message, kind: err.kind });
      toast.error(err.message);
    },
  });

  const onSubmit = (values: ActivityFormValues) => {
    if (mutation.isPending) return; // guards against double submit
    setServerError(null);
    mutation.mutate(values);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="stack stack--lg">
      <Card className="form-card">
        <h2>Workout</h2>
        <div className="form-grid">
          <Select label="Activity type" error={errors.activityType?.message} {...register('activityType')}>
            {ACTIVITY_TYPES.map((t) => (
              <option key={t} value={t}>{ACTIVITY_META[t].label}</option>
            ))}
          </Select>
          <Input label="Start time" type="datetime-local" error={errors.startTime?.message} {...register('startTime')} />
          <Input label="Duration (minutes)" inputMode="numeric" placeholder="30" error={errors.duration?.message} {...register('duration')} />
          <Input
            label="Calories burned (optional)"
            inputMode="numeric"
            placeholder="250"
            error={errors.caloriesBurned?.message}
            {...register('caloriesBurned')}
          />
        </div>
      </Card>

      <Card className="form-card">
        <h2>Extra details <span className="muted">(optional)</span></h2>
        <div className="form-grid">
          <Input label="Distance (km)" inputMode="decimal" placeholder="5.0" error={errors.distanceKm?.message} {...register('distanceKm')} />
          <Input label="Average heart rate (bpm)" inputMode="numeric" placeholder="140" error={errors.averageHeartRate?.message} {...register('averageHeartRate')} />
          <Input label="Elevation gain (m)" inputMode="decimal" placeholder="120" error={errors.elevationMeters?.message} {...register('elevationMeters')} />
        </div>
        <Textarea label="Notes" rows={3} placeholder="Easy pace, felt strong" error={errors.notes?.message} {...register('notes')} />
        <details className="advanced">
          <summary>Add other metrics as JSON</summary>
          <Textarea
            label="Other metrics (JSON object)"
            rows={4}
            spellCheck={false}
            placeholder={'{"pace": "5:30 /km"}'}
            hint="Saved as-is with the activity. The server does not check these keys."
            error={errors.advancedJson?.message}
            {...register('advancedJson')}
          />
        </details>
      </Card>

      {serverError && (
        <div className="callout callout--error" role="alert">
          <strong>We couldn’t save this activity.</strong>
          <p>{serverError.message}</p>
          {(serverError.kind === 'server' || serverError.kind === 'validation') && (
            <p className="muted">Your entries are still here. If this keeps happening, the backend may not be linking your sign-in to your account yet (a known backend gap).</p>
          )}
        </div>
      )}

      <div className="form-actions">
        <Link to="/activities" className={buttonClass('ghost')}>Cancel</Link>
        <Button type="submit" loading={mutation.isPending}>
          {mutation.isPending ? 'Saving…' : 'Save activity'}
        </Button>
      </div>
    </form>
  );
}
