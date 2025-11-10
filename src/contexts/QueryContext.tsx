/**
 * React Query Context Configuration
 * School Advisories System
 * 
 * Provides QueryClient configuration for the entire app:
 * - Default query options
 * - Cache configuration
 * - Retry logic
 * - DevTools in development
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/config/queryClient';

/**
 * Query Provider Props
 */
interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * Query Provider Component
 * 
 * Wraps the app with QueryClientProvider and DevTools
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const isDevelopment = import.meta.env.DEV;

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {isDevelopment && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

export default QueryProvider;
