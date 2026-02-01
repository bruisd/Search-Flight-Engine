import { amadeusGet } from './amadeusClient';
import type { Airport } from '../types';
import { searchPopularAirports } from '../utils/popularAirports';

// Amadeus API response types
interface AmadeusLocationResponse {
  data: Array<{
    type: string;
    subType: 'AIRPORT' | 'CITY';
    name: string;
    iataCode: string;
    address: {
      cityName: string;
      countryName: string;
      countryCode: string;
    };
  }>;
  meta?: {
    count: number;
  };
}

/**
 * Convert ALL CAPS string to Title Case
 * Examples:
 *   "JOHN F KENNEDY INTL" → "John F Kennedy Intl"
 *   "NEW YORK" → "New York"
 *   "UNITED STATES OF AMERICA" → "United States Of America"
 */
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => {
      // Handle special cases for common abbreviations
      const upperWords = ['intl', 'jfk', 'lax', 'nyc', 'usa', 'uk', 'uae'];
      if (upperWords.includes(word)) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      // Handle apostrophes (e.g., "o'hare" → "O'Hare")
      if (word.includes("'")) {
        return word
          .split("'")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join("'");
      }
      // Standard title case
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Transform Amadeus location data to our Airport type
 */
function transformAmadeusLocation(location: AmadeusLocationResponse['data'][0]): Airport {
  return {
    code: location.iataCode,
    name: toTitleCase(location.name),
    city: toTitleCase(location.address.cityName),
    country: location.address.countryCode,
  };
}

/**
 * Remove duplicate airports by code, keeping the first occurrence
 */
function deduplicateAirports(airports: Airport[]): Airport[] {
  const seen = new Set<string>();
  return airports.filter((airport) => {
    if (seen.has(airport.code)) {
      return false;
    }
    seen.add(airport.code);
    return true;
  });
}

/**
 * Sort airports by relevance to search keyword
 * Priority:
 * 1. Exact code match (e.g., "JFK" matches "JFK")
 * 2. Code starts with keyword (e.g., "LA" matches "LAX")
 * 3. City matches (e.g., "London" matches city)
 * 4. Airport name matches
 */
function sortAirportsByRelevance(airports: Airport[], keyword: string): Airport[] {
  const searchTerm = keyword.toLowerCase();

  return airports.sort((a, b) => {
    const aCode = a.code.toLowerCase();
    const bCode = b.code.toLowerCase();
    const aCity = a.city.toLowerCase();
    const bCity = b.city.toLowerCase();
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // Exact code match gets highest priority
    const aExactCode = aCode === searchTerm;
    const bExactCode = bCode === searchTerm;
    if (aExactCode && !bExactCode) return -1;
    if (!aExactCode && bExactCode) return 1;

    // Code starts with search term
    const aStartsWithCode = aCode.startsWith(searchTerm);
    const bStartsWithCode = bCode.startsWith(searchTerm);
    if (aStartsWithCode && !bStartsWithCode) return -1;
    if (!aStartsWithCode && bStartsWithCode) return 1;

    // City exact match
    const aCityExact = aCity === searchTerm;
    const bCityExact = bCity === searchTerm;
    if (aCityExact && !bCityExact) return -1;
    if (!aCityExact && bCityExact) return 1;

    // City starts with search term
    const aCityStarts = aCity.startsWith(searchTerm);
    const bCityStarts = bCity.startsWith(searchTerm);
    if (aCityStarts && !bCityStarts) return -1;
    if (!aCityStarts && bCityStarts) return 1;

    // Airport name starts with search term
    const aNameStarts = aName.startsWith(searchTerm);
    const bNameStarts = bName.startsWith(searchTerm);
    if (aNameStarts && !bNameStarts) return -1;
    if (!aNameStarts && bNameStarts) return 1;

    // Default alphabetical by city
    return aCity.localeCompare(bCity);
  });
}

/**
 * Search for airports using Amadeus API
 * Returns airport suggestions based on keyword search
 *
 * @param keyword - Search term (minimum 2 characters)
 * @returns Promise<Airport[]> - Array of matching airports, empty array on error
 *
 * Features:
 * - Searches both airports and cities
 * - Converts API's ALL CAPS responses to Title Case
 * - Removes duplicate airport codes
 * - Sorts by relevance (exact matches first)
 * - Falls back to popular airports list if API fails
 * - Returns empty array for invalid input
 *
 * @example
 * const results = await searchAirports('new york');
 * // Returns: [{ code: 'JFK', name: 'John F Kennedy Intl', city: 'New York', country: 'US' }, ...]
 */
export async function searchAirports(keyword: string): Promise<Airport[]> {
  // Validate input - minimum 2 characters required
  if (!keyword || keyword.trim().length < 2) {
    return [];
  }

  const searchTerm = keyword.trim();

  try {
    // Call Amadeus Location API
    const response = await amadeusGet<AmadeusLocationResponse>(
      '/v1/reference-data/locations',
      {
        keyword: searchTerm,
        subType: 'AIRPORT,CITY',
        'page[limit]': 10,
      }
    );

    // Check if we got results
    if (!response.data || response.data.length === 0) {
      // No results from API, use fallback
      if (import.meta.env.DEV) {
        console.log('[Airport Service] No results from API, using fallback');
      }
      return searchPopularAirports(searchTerm);
    }

    // Transform API response to our Airport type
    let airports = response.data.map(transformAmadeusLocation);

    // Remove duplicates by code
    airports = deduplicateAirports(airports);

    // Sort by relevance
    airports = sortAirportsByRelevance(airports, searchTerm);

    return airports;
  } catch (error) {
    // On any error, fall back to popular airports
    if (import.meta.env.DEV) {
      console.error('[Airport Service] API error, using fallback:', error);
    }
    return searchPopularAirports(searchTerm);
  }
}

/**
 * Get airport by code
 * Useful for validating airport codes or getting airport details
 *
 * @param code - IATA airport code (e.g., "JFK")
 * @returns Promise<Airport | null> - Airport details or null if not found
 */
export async function getAirportByCode(code: string): Promise<Airport | null> {
  if (!code || code.length !== 3) {
    return null;
  }

  try {
    const response = await amadeusGet<AmadeusLocationResponse>(
      '/v1/reference-data/locations',
      {
        keyword: code,
        subType: 'AIRPORT',
        'page[limit]': 1,
      }
    );

    if (!response.data || response.data.length === 0) {
      return null;
    }

    // Find exact code match
    const exactMatch = response.data.find(
      (location) => location.iataCode.toUpperCase() === code.toUpperCase()
    );

    if (!exactMatch) {
      return null;
    }

    return transformAmadeusLocation(exactMatch);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('[Airport Service] Error fetching airport by code:', error);
    }
    return null;
  }
}
