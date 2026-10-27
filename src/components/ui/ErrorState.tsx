import { CloudOff, Lock, SearchX, ServerCrash, TriangleAlert } from 'lucide-react';
import { toApiError, type ApiErrorKind } from '../../api/errors';
import { Button } from './Button';

const TITLES: Record<ApiErrorKind, string> = {
  network: 'Can’t reach the API gateway',
  timeout: 'The request timed out',
  unauthorized: 'Please sign in again',
  forbidden: 'Access denied',
  not_found: 'Not found',
  validation: 'The request was rejected',
  server: 'The service hit a problem',
  unknown: 'Something went wrong',
};

const ICONS = { network: CloudOff, forbidden: Lock, not_found: SearchX, server: ServerCrash } as const;

/** Turns any thrown value into a clear message, distinct for 403, 404, network and server errors. */
export function ErrorState({ error, onRetry, title }: { error: unknown; onRetry?: () => void; title?: string }) {
  const e = toApiError(error);
  const Icon = ICONS[e.kind as keyof typeof ICONS] ?? TriangleAlert;
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon" aria-hidden="true"><Icon size={24} /></div>
      <h2 className="state__title">{title ?? TITLES[e.kind]}</h2>
      <p className="state__text">{e.message}</p>
      {onRetry && e.kind !== 'forbidden' && <Button variant="secondary" onClick={onRetry}>Try again</Button>}
    </div>
  );
}
