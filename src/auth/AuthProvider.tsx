import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { config } from '../config';
import { initAuth, keycloak, onSessionExpired } from './keycloak';

type AuthStatus = 'loading' | 'authenticated' | 'expired' | 'error' | 'misconfigured';

interface AuthUser {
  name?: string;
  email?: string;
}

interface AuthContextValue {
  status: AuthStatus;
  user: AuthUser | null;
  login: () => void;
  logout: () => void;
  retry: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(config.keycloakClientId ? 'loading' : 'misconfigured');
  const [user, setUser] = useState<AuthUser | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!config.keycloakClientId) return;
    let cancelled = false;
    setStatus('loading');
    initAuth()
      .then((authenticated) => {
        if (cancelled) return;
        if (!authenticated) {
          keycloak.login();
          return;
        }
        // Display-only claims from the OIDC library. The backend remains the authority on identity.
        const claims = keycloak.tokenParsed as { name?: string; email?: string; preferred_username?: string } | undefined;
        setUser({ name: claims?.name ?? claims?.preferred_username, email: claims?.email });
        setStatus('authenticated');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  useEffect(() => onSessionExpired(() => setStatus((s) => (s === 'authenticated' ? 'expired' : s))), []);

  const login = useCallback(() => void keycloak.login(), []);
  const logout = useCallback(() => void keycloak.logout({ redirectUri: window.location.origin }), []);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  const value = useMemo(() => ({ status, user, login, logout, retry }), [status, user, login, logout, retry]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
