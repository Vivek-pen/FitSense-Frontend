export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'server'
  | 'unknown';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status?: number;

  constructor(kind: ApiErrorKind, message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
  }
}

export function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

export function toApiError(e: unknown): ApiError {
  if (isApiError(e)) return e;
  return new ApiError('unknown', 'Something unexpected went wrong.');
}

/** Maps an HTTP status to an error kind. */
export function kindFromStatus(status: number): ApiErrorKind {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 400 || status === 409 || status === 422) return 'validation';
  if (status >= 500) return 'server';
  return 'unknown';
}

/** Friendly, non-technical messages. Raw server bodies and stack traces are never shown. */
export const DEFAULT_MESSAGES: Record<ApiErrorKind, string> = {
  network: 'We couldn’t reach the FitPulse API gateway. Check that it is running and that it allows this app’s origin (CORS).',
  timeout: 'The request took too long. Try again in a moment.',
  unauthorized: 'Your session has expired. Sign in again to continue.',
  forbidden: 'You don’t have permission to view this.',
  not_found: 'We couldn’t find what you asked for.',
  validation: 'The server rejected this request. Check the details and try again.',
  server: 'The service had a problem handling this request. Try again in a moment.',
  unknown: 'Something unexpected went wrong.',
};
