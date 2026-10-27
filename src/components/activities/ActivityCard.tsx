import { Link } from 'react-router-dom';
import { ChevronRight, Clock, Flame } from 'lucide-react';
import type { ActivityResponse } from '../../api/types';
import { activityMeta } from '../../utils/activity';
import { formatDateTime } from '../../utils/date';
import { formatDuration } from '../../utils/formatting';
import { ActivityTypeIcon } from './ActivityTypeIcon';

export function ActivityCard({ activity }: { activity: ActivityResponse }) {
  const { label } = activityMeta(activity.type);
  return (
    <Link to={`/activities/${encodeURIComponent(activity.id)}`} className="activity-row">
      <ActivityTypeIcon type={activity.type} />
      <div className="activity-row__main">
        <span className="activity-row__title">{label}</span>
        <span className="muted">{formatDateTime(activity.startTime)}</span>
      </div>
      <dl className="activity-row__stats">
        <div>
          <dt className="sr-only">Duration</dt>
          <dd><Clock size={14} aria-hidden="true" /> {formatDuration(activity.duration)}</dd>
        </div>
        {typeof activity.caloriesBurned === 'number' && (
          <div>
            <dt className="sr-only">Calories burned</dt>
            <dd><Flame size={14} aria-hidden="true" /> {activity.caloriesBurned.toLocaleString()} kcal</dd>
          </div>
        )}
      </dl>
      <span className="activity-row__cta">View details <ChevronRight size={16} aria-hidden="true" /></span>
    </Link>
  );
}
