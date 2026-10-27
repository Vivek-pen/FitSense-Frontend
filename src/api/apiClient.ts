import { config } from '../config';
import { forceRefresh, getAccessToken, notifySessionExpired } from '../auth/keycloak';
import { ApiError, DEFAULT_MESSAGES, kindFromStatus } from './errors';

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
  signal?: AbortSignal;
  timeoutMs?: number;
}

/** Pulls a short human-readable message from a JSON error body, if there is one. */
function readValidationMessage(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as Record<string, unknown>;
  const candidate = typeof b.message === 'string' ? b.message : typeof b.error === 'string' ? b.error : null;
  if (candidate && candidate.length <= 160 && !/exception|\bat\s+\w+\./i.test(candidate)) return candidate;
  return null;
}

async function parseBody(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return undefined;
  }
}

/**
 * Calls the API Gateway with the current access token.
 * - Never sends X_USER_ID; the gateway owns identity headers.
 * - On a 401, tries one silent token refresh and repeats the request once.
 * - POSTs are never retried except for that single post-refresh repeat (the first attempt was rejected).
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  return attempt(true);

  async function attempt(canRefresh: boolean): Promise<T> {
    let token: string;
    try {
      token = await getAccessToken();
    } catch {
      notifySessionExpired();
      throw new ApiError('unauthorized', DEFAULT_MESSAGES.unauthorized, 401);
    }

    const controller = new AbortController();
    let timedOut = false;
    const timer = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, options.timeoutMs ?? config.requestTimeoutMs);
    const onExternalAbort = () => controller.abort();
    options.signal?.addEventListener('abort', onExternalAbort);

    let res: Response;
    try {
      res = await fetch(`${config.apiBaseUrl}${path}`, {
        method: options.method ?? 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        },
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });
    } catch (e) {
      if (options.signal?.aborted) throw e; // navigation/unmount: let React Query drop it quietly
      if (timedOut) throw new ApiError('timeout', DEFAULT_MESSAGES.timeout);
      throw new ApiError('network', DEFAULT_MESSAGES.network);
    } finally {
      window.clearTimeout(timer);
      options.signal?.removeEventListener('abort', onExternalAbort);
    }

    if (res.status === 401 && canRefresh) {
      if (await forceRefresh()) return attempt(false);
      notifySessionExpired();
      throw new ApiError('unauthorized', DEFAULT_MESSAGES.unauthorized, 401);
    }

    const body = await parseBody(res);

    if (!res.ok) {
      const kind = kindFromStatus(res.status);
      if (kind === 'unauthorized') notifySessionExpired();
      const message = (kind === 'validation' && readValidationMessage(body)) || DEFAULT_MESSAGES[kind];
      throw new ApiError(kind, message, res.status);
    }
    return body as T;
  }
}
