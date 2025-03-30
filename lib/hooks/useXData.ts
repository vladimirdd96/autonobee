import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface XDataOptions {
  forceRefresh?: boolean;
  staleTime?: number; // Time in milliseconds before data is considered stale
  enabled?: boolean; // Whether the query should be enabled
  retry?: boolean; // Whether to retry on error
}

export function useXData<T extends Record<string, any>>(
  queryKey: string[],
  fetchFn: () => Promise<T>,
  options: XDataOptions = {}
) {
  const { forceRefresh = false, staleTime = 30 * 60 * 1000, enabled = true, retry = true } = options;

  // Use React Query for client-side caching
  const query = useQuery<T, Error>({
    queryKey,
    queryFn: fetchFn,
    staleTime,
    gcTime: staleTime * 2, // Keep in cache for twice the stale time (new property name for cacheTime)
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    refetchOnReconnect: false, // Don't refetch when network reconnects
    enabled,
    retry
  });

  // Handle force refresh
  useEffect(() => {
    if (forceRefresh) {
      query.refetch();
    }
  }, [forceRefresh, query]);

  return {
    data: query.data as T | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    isStale: query.isStale,
  };
} 