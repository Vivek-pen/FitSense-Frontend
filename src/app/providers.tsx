import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { isApiError } from '../api/errors';
import { AuthProvider } from '../auth/AuthProvider';
import { ToastProvider } from '../components/ui/ToastProvider';

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            // Retry reads once for transient problems only. Mutations are never retried.
            retry: (count, error) => count < 1 && isApiError(error) && ['network', 'timeout', 'server'].includes(error.kind),
          },
          mutations: { retry: false },
        },
      }),
  );
  return (
    <AuthProvider>
      <QueryClientProvider client={client}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
}
