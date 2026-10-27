import { activityMeta } from '../../utils/activity';

export function ActivityTypeIcon({ type, size = 22 }: { type?: string; size?: number }) {
  const { icon: Icon } = activityMeta(type);
  return (
    <span className="type-icon" aria-hidden="true">
      <Icon size={size} />
    </span>
  );
}
