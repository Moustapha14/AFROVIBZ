'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { TrackingProvider } from '@/lib/context/TrackingContext';
import { ContentProvider } from '@/lib/context/ContentContext';

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
          <ContentProvider>
            {children}
          </ContentProvider>
        </TrackingProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
} 