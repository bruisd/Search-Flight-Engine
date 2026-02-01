import { useQuery } from '@tanstack/react-query';
import { searchAirports } from '../services';
import { searchPopularAirports } from '../utils/popularAirports';
import type { Airport } from '../types';

/**
 * React Query hook for searching airports
 *
 * @param keyword - Search term (minimum 2 characters to trigger search)
 * @returns Object containing airports array, loading state, and error
 *
 * Features:
 * - Only fetches when keyword >= 2 characters
 * - 10 minute stale time (airport data rarely changes)
 * - Falls back to popular airports on error
 * - Component should debounce keyword before passing to this hook
 *
 * @example
 * const keyword = useDebounce(searchTerm, 300);
 * const { airports, isLoading, error } = useAirportSearch(keyword);
 */
export function useAirportSearch(keyword: string) {
  const trimmedKeyword = keyword.trim();

  const query = useQuery({
    queryKey: ['airports', trimmedKeyword],
    queryFn: () => searchAirports(trimmedKeyword),
    enabled: trimmedKeyword.length >= 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    // Provide initial data to avoid flash of empty state
    placeholderData: (previousData) => previousData,
  });

  // On error, use fallback popular airports filtered by keyword
  const airports: Airport[] =
    query.data || (query.isError ? searchPopularAirports(trimmedKeyword) : []);

  // Extract error message if available
  const error: string | null = query.error
    ? query.error instanceof Error
      ? query.error.message
      : 'Failed to search airports'
    : null;

  return {
    airports,
    isLoading: query.isLoading,
    error,
  };
}
