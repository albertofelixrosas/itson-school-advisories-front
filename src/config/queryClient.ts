/**
 * React Query Client Instance
 * School Advisories System
 * 
 * Singleton QueryClient instance for the app
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create QueryClient with default options
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Time before data becomes stale (5 minutes)
      staleTime: 5 * 60 * 1000,
      
      // Time to keep unused data in cache (10 minutes)
      gcTime: 10 * 60 * 1000,
      
      // Retry failed queries
      retry: 1,
      
      // Retry delay (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus
      refetchOnWindowFocus: false,
      
      // Refetch on reconnect
      refetchOnReconnect: true,
      
      // Refetch on mount
      refetchOnMount: true,
    },
    mutations: {
      // Retry failed mutations
      retry: 1,
      
      // Retry delay
      retryDelay: 1000,
    },
  },
});

export default queryClient;
