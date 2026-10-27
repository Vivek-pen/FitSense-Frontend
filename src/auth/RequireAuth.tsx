import type { ReactNode } from 'react';
import { Loader2, LogIn, ServerCrash, Settings } from 'lucide-react';
import { config } from '../config';
import { Button } from '../components/ui/Button';
import { useAuth } from './AuthProvider';

function FullScreen({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <main className="fullscreen" role="status" aria-live="polite">
      <div className="fullscreen__card">
        <div className="fullscreen__icon" aria-hidden="true">{icon}</div>
        <h1>{title}</h1>
        {children}
      </div>
    </main>
  );
}

/** Shows the right screen for every authentication state; renders children only when signed in. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { status, login, retry } = useAuth();

  if (status === 'authenticated') return <>{children}</>;

  if (status === 'misconfigured') {
    return (
      <FullScreen icon={<Settings />} title="Sign-in isn’t configured">
        <p>Set <code>VITE_KEYCLOAK_CLIENT_ID</code> in your <code>.env</code> file to the public Keycloak client for this app, then restart the dev server.</p>
      </FullScreen>
    );
  }
  if (status === 'expired') {
    return (
      <FullScreen icon={<LogIn />} title="Your session has ended">
        <p>Sign in again to keep using {config.brandName}.</p>
        <Button onClick={login}>Sign in</Button>
      </FullScreen>
    );
  }
  if (status === 'error') {
    return (
      <FullScreen icon={<ServerCrash />} title="Can’t reach sign-in">
        <p>Keycloak didn’t respond at <code>{config.keycloakUrl}</code>. Make sure it is running and the realm and client ID are correct.</p>
        <Button onClick={retry}>Try again</Button>
      </FullScreen>
    );
  }
  return (
    <FullScreen icon={<Loader2 className="spin" />} title="Checking your session…" />
  );
}
