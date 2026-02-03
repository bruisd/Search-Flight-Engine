/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import type { ReactNode } from 'react';
import { useFlightSearch, type FlightSearchParams } from '../hooks';
import type { Flight, AirlineInfo, FlightLeg } from '../types';

// ============================================================================
// Types
// ============================================================================

export interface FlightFilters {
  stops: number[]; // [0] for direct, [0, 1] for direct + 1 stop, [2] for 2+ stops
  priceRange: [number, number]; // [min, max]
  airlines: string[]; // airline codes ["DL", "BA"]
  departureTime: string[]; // ["morning", "afternoon", "evening"]
}

export interface SearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass?: string;
  tripType: 'round-trip' | 'one-way' | 'multi-city';
  legs?: FlightLeg[]; // For multi-city searches
}

interface SearchState {
  // Search params
  searchParams: SearchParams | null;

  // Results
  allFlights: Flight[];
  airlines: AirlineInfo[];
  priceRange: { min: number; max: number };
  totalResults: number;

  // Filters
  filters: FlightFilters;

  // UI State
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  sortBy: 'cheapest' | 'fastest' | 'best';
}

export interface SearchContextValue extends SearchState {
  // Derived
  filteredFlights: Flight[];

  // Actions
  setSearchParams: (params: SearchParams) => void;
  updateFilter: <K extends keyof FlightFilters>(
    filterType: K,
    value: FlightFilters[K]
  ) => void;
  resetFilters: () => void;
  setSortBy: (sort: 'cheapest' | 'fastest' | 'best') => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get time of day from hour
 * @param hour - Hour in 24-hour format (0-23)
 * @returns "morning" | "afternoon" | "evening"
 */
function getTimeOfDay(hour: number): string {
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 18) return 'afternoon';
  return 'evening';
}

/**
 * Create default filters based on available data
 */
function createDefaultFilters(priceRange: { min: number; max: number }): FlightFilters {
  return {
    stops: [], // Show all
    priceRange: [priceRange.min, priceRange.max], // Full range
    airlines: [], // Show all
    departureTime: [], // Show all
  };
}

/**
 * Apply filters and sorting to flights
 */
function applyFilters(
  flights: Flight[],
  filters: FlightFilters,
  sortBy: 'cheapest' | 'fastest' | 'best'
): Flight[] {
  // Filter flights
  const filtered = [...flights].filter((flight) => {
    // Stops filter
    if (filters.stops.length > 0) {
      // Normalize stops: 0, 1, or 2+ (represented as 2)
      const stopCategory = flight.stops >= 2 ? 2 : flight.stops;
      if (!filters.stops.includes(stopCategory)) return false;
    }

    // Price filter
    if (
      flight.price < filters.priceRange[0] ||
      flight.price > filters.priceRange[1]
    ) {
      return false;
    }

    // Airline filter
    if (
      filters.airlines.length > 0 &&
      !filters.airlines.includes(flight.airline.code)
    ) {
      return false;
    }

    // Departure time filter
    if (filters.departureTime.length > 0) {
      const hour = new Date(flight.departureTime).getHours();
      const timeOfDay = getTimeOfDay(hour);
      if (!filters.departureTime.includes(timeOfDay)) return false;
    }

    return true;
  });

  // Sort flights
  switch (sortBy) {
    case 'cheapest':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'fastest':
      filtered.sort((a, b) => a.duration - b.duration);
      break;
    case 'best':
      // Best value: weighted combination of price and duration
      // Normalize both to 0-1 scale, then combine with weights
      filtered.sort((a, b) => {
        const scoreA = a.price * 0.6 + a.duration * 0.4;
        const scoreB = b.price * 0.6 + b.duration * 0.4;
        return scoreA - scoreB;
      });
      break;
  }

  return filtered;
}

/**
 * Convert SearchParams to FlightSearchParams
 */
function toFlightSearchParams(params: SearchParams): FlightSearchParams {
  return {
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    returnDate: params.returnDate,
    adults: params.adults,
    travelClass: params.travelClass,
    legs: params.legs,
  };
}

// ============================================================================
// Reducer
// ============================================================================

type SearchAction =
  | { type: 'SET_SEARCH_PARAMS'; payload: SearchParams }
  | {
      type: 'SET_SEARCH_RESULTS';
      payload: {
        flights: Flight[];
        airlines: AirlineInfo[];
        priceRange: { min: number; max: number };
        totalResults: number;
      };
    }
  | {
      type: 'UPDATE_FILTER';
      payload: {
        filterType: keyof FlightFilters;
        value: FlightFilters[keyof FlightFilters];
      };
    }
  | { type: 'RESET_FILTERS' }
  | { type: 'SET_SORT_BY'; payload: 'cheapest' | 'fastest' | 'best' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { isError: boolean; error: string | null } };

const initialState: SearchState = {
  searchParams: null,
  allFlights: [],
  airlines: [],
  priceRange: { min: 0, max: 0 },
  totalResults: 0,
  filters: {
    stops: [],
    priceRange: [0, 0],
    airlines: [],
    departureTime: [],
  },
  isLoading: false,
  isError: false,
  error: null,
  sortBy: 'cheapest',
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case 'SET_SEARCH_PARAMS':
      // When new search params are set, immediately clear old data and show loading
      return {
        ...state,
        searchParams: action.payload,
        isLoading: true,
        allFlights: [],
        airlines: [],
        priceRange: { min: 0, max: 0 },
        totalResults: 0,
        filters: {
          stops: [],
          priceRange: [0, 0],
          airlines: [],
          departureTime: [],
        },
        isError: false,
        error: null,
      };

    case 'SET_SEARCH_RESULTS': {
      // Reset filters when new results arrive
      const defaultFilters = createDefaultFilters(action.payload.priceRange);
      return {
        ...state,
        allFlights: action.payload.flights,
        airlines: action.payload.airlines,
        priceRange: action.payload.priceRange,
        totalResults: action.payload.totalResults,
        filters: defaultFilters,
        isLoading: false,
        isError: false,
        error: null,
      };
    }

    case 'UPDATE_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.filterType]: action.payload.value,
        },
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: createDefaultFilters(state.priceRange),
      };

    case 'SET_SORT_BY':
      return {
        ...state,
        sortBy: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        isError: action.payload.isError,
        error: action.payload.error,
        isLoading: false,
      };

    default:
      return state;
  }
}

// ============================================================================
// Context
// ============================================================================

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

interface SearchProviderProps {
  children: ReactNode;
}

export function SearchProvider({ children }: SearchProviderProps) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  // Track last search params to prevent redundant API calls
  const lastSearchParamsKeyRef = useRef<string>('');
  const lastFlightSearchParamsRef = useRef<FlightSearchParams | null>(null);

  // Convert SearchParams to FlightSearchParams for the hook
  // Use JSON.stringify for deep comparison to prevent unnecessary recalculations
  const flightSearchParams = useMemo(() => {
    if (!state.searchParams) return null;

    const paramsKey = JSON.stringify(state.searchParams);

    // If params haven't changed, return the same object reference
    // This prevents useFlightSearch from re-running
    if (paramsKey === lastSearchParamsKeyRef.current) {
      return lastFlightSearchParamsRef.current;
    }

    // Params changed, create new object and cache it
    lastSearchParamsKeyRef.current = paramsKey;
    const newParams = toFlightSearchParams(state.searchParams);
    lastFlightSearchParamsRef.current = newParams;
    return newParams;
  }, [state.searchParams]);

  // Use flight search hook
  const { data, isLoading, isError, error } = useFlightSearch(flightSearchParams);

  // Consolidate all state updates into single effect to prevent waterfall delays
  useEffect(() => {
    console.log('[SearchContext] State update:', { hasData: !!data, isLoading, isError });

    // If we have new data, update results and clear loading/error states
    if (data) {
      dispatch({
        type: 'SET_SEARCH_RESULTS',
        payload: {
          flights: data.flights,
          airlines: data.airlines,
          priceRange: data.priceRange,
          totalResults: data.totalResults,
        },
      });
      console.log('[SearchContext] Results dispatched, isLoading will be set to false');
      return; // SET_SEARCH_RESULTS already sets isLoading: false
    }

    // If error occurred, update error state
    if (isError) {
      dispatch({ type: 'SET_ERROR', payload: { isError, error } });
      console.log('[SearchContext] Error state dispatched');
      return;
    }

    // Otherwise just update loading state
    dispatch({ type: 'SET_LOADING', payload: isLoading });
    console.log('[SearchContext] Loading state dispatched:', isLoading);
  }, [data, isLoading, isError, error]);

  // Calculate filtered flights (memoized)
  const filteredFlights = useMemo(() => {
    return applyFilters(state.allFlights, state.filters, state.sortBy);
  }, [state.allFlights, state.filters, state.sortBy]);

  // Actions - memoized with useCallback to prevent context value from changing
  const setSearchParams = useCallback((params: SearchParams) => {
    dispatch({ type: 'SET_SEARCH_PARAMS', payload: params });
  }, []);

  const updateFilter = useCallback(<K extends keyof FlightFilters>(
    filterType: K,
    value: FlightFilters[K]
  ) => {
    dispatch({ type: 'UPDATE_FILTER', payload: { filterType, value } });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const setSortBy = useCallback((sort: 'cheapest' | 'fastest' | 'best') => {
    dispatch({ type: 'SET_SORT_BY', payload: sort });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const value: SearchContextValue = useMemo(() => ({
    ...state,
    filteredFlights,
    setSearchParams,
    updateFilter,
    resetFilters,
    setSortBy,
  }), [state, filteredFlights, setSearchParams, updateFilter, resetFilters, setSortBy]);

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to access search context
 * Must be used within SearchProvider
 */
export function useSearch(): SearchContextValue {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within SearchProvider');
  }
  return context;
}
