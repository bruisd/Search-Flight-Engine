import { useQuery } from '@tanstack/react-query';
import { searchFlights, searchMultiCityFlights } from '../services';
import type { FlightLeg } from '../types';
import { format } from 'date-fns';

/**
 * Search parameters for flight search
 */
export interface FlightSearchParams {
  origin: string; // Airport code (e.g., "JFK")
  destination: string; // Airport code (e.g., "LHR")
  departureDate: string; // ISO date string or Date
  returnDate?: string; // ISO date string or Date (optional for one-way)
  adults: number;
  travelClass?: string; // "Economy", "Premium Economy", "Business", "First"
  nonStop?: boolean;
  legs?: FlightLeg[]; // For multi-city searches
}

/**
 * Format date to YYYY-MM-DD for API
 */
function formatDateForAPI(date: string | Date): string {
  if (typeof date === 'string') {
    // If it's already a string, try to parse it
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return date; // Return as-is if can't parse
    }
    return format(parsed, 'yyyy-MM-dd');
  }
  return format(date, 'yyyy-MM-dd');
}

/**
 * Validate that search params have all required fields
 */
function isValidSearchParams(params: FlightSearchParams | null): params is FlightSearchParams {
  if (!params) return false;

  // For multi-city searches, validate legs instead
  if (params.legs && params.legs.length >= 2) {
    return params.legs.every(leg =>
      leg.origin && leg.destination && leg.departureDate
    ) && params.adults > 0;
  }

  // For regular searches, validate origin/destination/departureDate
  return !!(
    params.origin &&
    params.destination &&
    params.departureDate &&
    params.adults > 0
  );
}

/**
 * React Query hook for searching flights
 *
 * @param params - Search parameters (null to disable query)
 * @returns Object containing flight search results, loading state, error, and refetch function
 *
 * Features:
 * - Only fetches when params is valid (has required fields)
 * - 5 minute stale time
 * - Retries once on error
 * - Provides meaningful error messages
 * - Transforms API response to FlightSearchResult
 *
 * @example
 * const { data, isLoading, error, refetch } = useFlightSearch({
 *   origin: 'JFK',
 *   destination: 'LHR',
 *   departureDate: '2024-10-24',
 *   returnDate: '2024-10-31',
 *   adults: 2,
 *   travelClass: 'Economy'
 * });
 */
export function useFlightSearch(params: FlightSearchParams | null) {
  const query = useQuery({
    queryKey: ['flights', params],
    queryFn: async () => {
      if (!params) {
        throw new Error('Search parameters are required');
      }

      // Handle multi-city searches
      if (params.legs && params.legs.length >= 2) {
        const result = await searchMultiCityFlights(
          params.legs,
          params.adults,
          params.travelClass || 'Economy'
        );
        return result;
      }

      // Handle regular round-trip/one-way searches
      // Format dates for API
      const apiParams = {
        origin: params.origin,
        destination: params.destination,
        departureDate: formatDateForAPI(params.departureDate),
        returnDate: params.returnDate ? formatDateForAPI(params.returnDate) : undefined,
        adults: params.adults,
        travelClass: params.travelClass,
        nonStop: params.nonStop,
      };

      // Call search API
      const result = await searchFlights(apiParams);
      return result;
    },
    enabled: isValidSearchParams(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    // Don't keep previous data - show loading state instead
    placeholderData: undefined,
  });

  // Extract meaningful error message
  const getErrorMessage = (): string | null => {
    if (!query.error) return null;

    if (query.error instanceof Error) {
      // Check for specific error types
      if (query.error.message.includes('network')) {
        return 'Network error. Please check your internet connection.';
      }
      if (query.error.message.includes('401')) {
        return 'Authentication error. Please try again later.';
      }
      if (query.error.message.includes('429')) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      if (query.error.message.includes('500')) {
        return 'Server error. Please try again later.';
      }
      return query.error.message;
    }

    return 'Failed to search flights. Please try again.';
  };

  return {
    data: query.data || null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: getErrorMessage(),
    refetch: query.refetch,
  };
}
