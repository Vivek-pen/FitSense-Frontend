import Keycloak from 'keycloak-js';
import { config } from '../config';

// Public SPA client: Authorization Code flow with PKCE (S256). No client secret.
export const keycloak = new Keycloak({
  url: config.keycloakUrl,
  realm: config.keycloakRealm,
  clientId: config.keycloakClientId,
});

let initPromise: Promise<boolean> | null = null;

/** Safe to call more than once (React StrictMode runs effects twice in dev). */
export function initAuth(): Promise<boolean> {
  if (!initPromise) {
    initPromise = keycloak
      .init({ onLoad: 'login-required', pkceMethod: 'S256', checkLoginIframe: false })
      .catch((e) => {
        initPromise = null;
        throw e;
      });
  }
  return initPromise;
}

const SESSION_EXPIRED_EVENT = 'fitpulse:session-expired';

export function notifySessionExpired() {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export function onSessionExpired(handler: () => void) {
  window.addEventListener(SESSION_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
}

/** Returns a token that is valid for at least 30 more seconds, refreshing silently if needed. */
export async function getAccessToken(): Promise<string> {
  try {
    await keycloak.updateToken(30);
  } catch {
    throw new Error('refresh-failed');
  }
  if (!keycloak.token) throw new Error('no-token');
  return keycloak.token;
}

/** Forces a single silent refresh. Returns false if the session can't be renewed. */
export async function forceRefresh(): Promise<boolean> {
  try {
    await keycloak.updateToken(-1);
    return true;
  } catch {
    return false;
  }
}
