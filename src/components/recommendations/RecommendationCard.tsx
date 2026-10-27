import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import type { Recommendation } from '../../api/types';
import { activityMeta } from '../../utils/activity';
import { formatDateTime } from '../../utils/date';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { RecommendationSections } from './RecommendationSections';

interface Props {
  rec: Recommendation;
  /** Show only the summary text (used on the dashboard). */
  compact?: boolean;
  showActivityLink?: boolean;
}

export function RecommendationCard({ rec, compact, showActivityLink = true }: Props) {
  return (
    <Card className="rec-card">
      <div className="rec-card__head">
        <Badge tone="ai"><Sparkles size={14} aria-hidden="true" /> AI recommendation</Badge>
        <span className="muted">{activityMeta(rec.activityType).label}{rec.createdAt ? ` · ${formatDateTime(rec.createdAt)}` : ''}</span>
      </div>
      <p className={compact ? 'rec-card__text rec-card__text--clamp' : 'rec-card__text'}>{rec.recommendation}</p>
      {!compact && <RecommendationSections rec={rec} />}
      {showActivityLink && (
        <Link className="text-link" to={compact ? `/activities/${encodeURIComponent(rec.activityId)}/insight` : `/activities/${encodeURIComponent(rec.activityId)}`}>
          {compact ? 'Read full recommendation' : 'View activity'}
        </Link>
      )}
    </Card>
  );
}
