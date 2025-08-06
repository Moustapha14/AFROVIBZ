'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ContentProvider } from '@/lib/context/ContentContext';
import { TrackingProvider } from '@/lib/context/TrackingContext';
import { AuthProvider } from '@/lib/hooks/useAuth';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TrackingProvider>
          <ContentProvider>{children}</ContentProvider>
        </TrackingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
