import type { Airport } from '../types';

/**
 * Popular airports for fallback when API is unavailable
 * This list covers major international hubs across all continents
 */
export const POPULAR_AIRPORTS: readonly Airport[] = [
  // United States
  { code: 'JFK', name: 'John F Kennedy Intl', city: 'New York', country: 'US' },
  { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'US' },
  { code: 'ORD', name: "O'Hare Intl", city: 'Chicago', country: 'US' },
  { code: 'ATL', name: 'Hartsfield-Jackson Atlanta Intl', city: 'Atlanta', country: 'US' },
  { code: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'US' },
  { code: 'MIA', name: 'Miami Intl', city: 'Miami', country: 'US' },
  { code: 'DFW', name: 'Dallas/Fort Worth Intl', city: 'Dallas', country: 'US' },
  { code: 'SEA', name: 'Seattle-Tacoma Intl', city: 'Seattle', country: 'US' },
  { code: 'LAS', name: 'Harry Reid Intl', city: 'Las Vegas', country: 'US' },
  { code: 'BOS', name: 'Logan Intl', city: 'Boston', country: 'US' },
  { code: 'EWR', name: 'Newark Liberty Intl', city: 'Newark', country: 'US' },
  { code: 'MCO', name: 'Orlando Intl', city: 'Orlando', country: 'US' },
  { code: 'DEN', name: 'Denver Intl', city: 'Denver', country: 'US' },
  { code: 'IAH', name: 'George Bush Intercontinental', city: 'Houston', country: 'US' },
  { code: 'PHX', name: 'Phoenix Sky Harbor Intl', city: 'Phoenix', country: 'US' },

  // Europe
  { code: 'LHR', name: 'Heathrow', city: 'London', country: 'GB' },
  { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'FR' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'DE' },
  { code: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'NL' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas', city: 'Madrid', country: 'ES' },
  { code: 'BCN', name: 'Barcelona-El Prat', city: 'Barcelona', country: 'ES' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'DE' },
  { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino', city: 'Rome', country: 'IT' },
  { code: 'LGW', name: 'Gatwick', city: 'London', country: 'GB' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'CH' },
  { code: 'VIE', name: 'Vienna Intl', city: 'Vienna', country: 'AT' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'DK' },

  // Asia Pacific
  { code: 'DXB', name: 'Dubai Intl', city: 'Dubai', country: 'AE' },
  { code: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'SG' },
  { code: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'JP' },
  { code: 'NRT', name: 'Narita Intl', city: 'Tokyo', country: 'JP' },
  { code: 'ICN', name: 'Incheon Intl', city: 'Seoul', country: 'KR' },
  { code: 'HKG', name: 'Hong Kong Intl', city: 'Hong Kong', country: 'HK' },
  { code: 'BKK', name: 'Suvarnabhumi', city: 'Bangkok', country: 'TH' },
  { code: 'KUL', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur', country: 'MY' },
  { code: 'DEL', name: 'Indira Gandhi Intl', city: 'New Delhi', country: 'IN' },
  { code: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'AU' },
  { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'AU' },

  // Middle East & Africa
  { code: 'DOH', name: 'Hamad Intl', city: 'Doha', country: 'QA' },
  { code: 'AUH', name: 'Abu Dhabi Intl', city: 'Abu Dhabi', country: 'AE' },
  { code: 'CAI', name: 'Cairo Intl', city: 'Cairo', country: 'EG' },
  { code: 'JNB', name: 'O.R. Tambo Intl', city: 'Johannesburg', country: 'ZA' },

  // Canada & Latin America
  { code: 'YYZ', name: 'Toronto Pearson Intl', city: 'Toronto', country: 'CA' },
  { code: 'YVR', name: 'Vancouver Intl', city: 'Vancouver', country: 'CA' },
  { code: 'MEX', name: 'Mexico City Intl', city: 'Mexico City', country: 'MX' },
  { code: 'GRU', name: 'São Paulo-Guarulhos Intl', city: 'São Paulo', country: 'BR' },
  { code: 'EZE', name: 'Ministro Pistarini Intl', city: 'Buenos Aires', country: 'AR' },
] as const;

/**
 * Search popular airports locally by keyword
 * Used as fallback when API is unavailable
 */
export function searchPopularAirports(keyword: string): Airport[] {
  if (!keyword || keyword.length < 2) {
    return [];
  }

  const searchTerm = keyword.toLowerCase();

  return POPULAR_AIRPORTS.filter((airport) => {
    return (
      airport.code.toLowerCase().includes(searchTerm) ||
      airport.name.toLowerCase().includes(searchTerm) ||
      airport.city.toLowerCase().includes(searchTerm) ||
      airport.country.toLowerCase().includes(searchTerm)
    );
  }).slice(0, 10); // Limit to 10 results
}
