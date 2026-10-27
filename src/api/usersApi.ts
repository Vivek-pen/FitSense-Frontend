/**
 * Identity adapter — the ONE place that knows about the backend's user-ID gap.
 *
 * The backend has no confirmed "current user" endpoint that maps the signed-in
 * Keycloak subject to the User Service database ID, and the frontend must not
 * guess that they are equal or ask people to type an ID.
 *
 * When the backend adds such an endpoint, implement it here and the activity
 * form (userId in the POST body) and the AI Insights page (per-user
 * recommendations) will start using it automatically.
 */
export async function getCurrentAppUserId(): Promise<string | null> {
  return null;
}
