// Single place for the brand and runtime settings.
// Only public values belong here: VITE_* variables are visible in the browser.
const env = import.meta.env;

export const config = {
  brandName: 'FitPulse',
  tagline: 'Track every workout. Get practical coaching.',
  apiBaseUrl: (env.VITE_API_BASE_URL ?? 'http://localhost:9090').replace(/\/$/, ''),
  keycloakUrl: env.VITE_KEYCLOAK_URL ?? 'http://localhost:8181',
  keycloakRealm: env.VITE_KEYCLOAK_REALM ?? 'fitness-oauth2',
  keycloakClientId: env.VITE_KEYCLOAK_CLIENT_ID ?? '',
  requestTimeoutMs: 15_000,
};
