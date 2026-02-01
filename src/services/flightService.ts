import { amadeusGet } from './amadeusClient';
import type { Flight } from '../types';
import { transformFlightOffers } from './transformFlights';

// Result type with metadata
export interface FlightSearchResult {
  flights: Flight[];
  airlines: AirlineInfo[];
  priceRange: { min: number; max: number };
  totalResults: number;
}

export interface AirlineInfo {
  code: string;
  name: string;
}

// Amadeus API response types
interface AmadeusLocation {
  iataCode: string;
  terminal?: string;
  at: string;
}

interface AmadeusSegment {
  departure: AmadeusLocation;
  arrival: AmadeusLocation;
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  id: string;
  numberOfStops: number;
  blacklistedInEU: boolean;
}

interface AmadeusItinerary {
  duration: string;
  segments: AmadeusSegment[];
}

interface AmadeusTravelerPricing {
  travelerId: string;
  fareOption: string;
  travelerType: string;
  fareDetailsBySegment: Array<{
    segmentId: string;
    cabin: string;
    fareBasis: string;
    class: string;
  }>;
}

export interface AmadeusFlightOffer {
  type: string;
  id: string;
  source: string;
  instantTicketingRequired: boolean;
  nonHomogeneous: boolean;
  oneWay: boolean;
  lastTicketingDate: string;
  numberOfBookableSeats: number;
  itineraries: AmadeusItinerary[];
  price: {
    currency: string;
    total: string;
    base: string;
    fees: Array<{
      amount: string;
      type: string;
    }>;
    grandTotal: string;
  };
  pricingOptions: {
    fareType: string[];
    includedCheckedBagsOnly: boolean;
  };
  validatingAirlineCodes: string[];
  travelerPricings: AmadeusTravelerPricing[];
}

export interface AmadeusFlightSearchResponse {
  meta: {
    count: number;
    links?: {
      self: string;
    };
  };
  data: AmadeusFlightOffer[];
  dictionaries?: {
    locations?: Record<string, unknown>;
    aircraft?: Record<string, string>;
    currencies?: Record<string, string>;
    carriers?: Record<string, string>;
  };
}

/**
 * Search for flights using Amadeus Flight Offers Search API
 *
 * @param params - Search parameters
 * @returns FlightSearchResult with flights, airlines, price range, and total count
 *
 * Features:
 * - Searches up to 100 results for better filtering
 * - Extracts unique airlines from results
 * - Calculates price range (min/max)
 * - Returns empty result on error (doesn't throw)
 * - Maps cabin classes: "Economy" → "ECONOMY", "Premium Economy" → "PREMIUM_ECONOMY"
 * - Formats dates as YYYY-MM-DD for API
 *
 * @example
 * const result = await searchFlights({
 *   origin: 'JFK',
 *   destination: 'LHR',
 *   departureDate: '2024-10-24',
 *   returnDate: '2024-10-31',
 *   adults: 2,
 *   travelClass: 'Economy'
 * });
 */
export async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass?: string;
  nonStop?: boolean;
  max?: number;
}): Promise<FlightSearchResult> {
  try {
    const apiParams: Record<string, unknown> = {
      originLocationCode: params.origin,
      destinationLocationCode: params.destination,
      departureDate: params.departureDate,
      adults: params.adults,
      max: params.max || 100, // Request 100 results for good filter data
      currencyCode: 'USD',
    };

    // Add return date if provided (for round-trip)
    if (params.returnDate) {
      apiParams.returnDate = params.returnDate;
    }

    // Add travel class if provided
    // Convert from our format (e.g., "Premium Economy") to Amadeus format (e.g., "PREMIUM_ECONOMY")
    if (params.travelClass) {
      const travelClassMap: Record<string, string> = {
        Economy: 'ECONOMY',
        'Premium Economy': 'PREMIUM_ECONOMY',
        Business: 'BUSINESS',
        First: 'FIRST',
      };
      apiParams.travelClass = travelClassMap[params.travelClass] || 'ECONOMY';
    }

    // Add non-stop filter if provided
    if (params.nonStop !== undefined) {
      apiParams.nonStop = params.nonStop;
    }

    const response = await amadeusGet<AmadeusFlightSearchResponse>(
      '/v2/shopping/flight-offers',
      apiParams
    );

    // Transform Amadeus response to our Flight type
    return transformFlightOffers(response);
  } catch (error) {
    // Handle errors gracefully - return empty result instead of throwing
    if (import.meta.env.DEV) {
      console.error('[Flight Service] Error searching flights:', error);
    }

    return {
      flights: [],
      airlines: [],
      priceRange: { min: 0, max: 0 },
      totalResults: 0,
    };
  }
}

/**
 * Get flight details by offer ID
 * This endpoint provides more detailed information about a specific flight offer
 */
export async function getFlightDetails(offerId: string): Promise<Flight | null> {
  try {
    const response = await amadeusGet<{ data: AmadeusFlightOffer }>(
      `/v2/shopping/flight-offers/${offerId}`
    );

    // Transform single offer to flight
    const result = transformFlightOffers({
      data: [response.data],
      meta: { count: 1 },
    });

    return result.flights[0] || null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Flight Service] Error fetching flight details:', error);
    }
    return null;
  }
}
