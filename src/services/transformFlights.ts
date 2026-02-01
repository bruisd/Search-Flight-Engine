import type { Flight, FlightSegment } from '../types';
import type {
  AmadeusFlightOffer,
  AmadeusFlightSearchResponse,
  FlightSearchResult,
  AirlineInfo,
} from './flightService';

/**
 * Parse ISO 8601 duration to minutes
 * Examples:
 *   "PT7H30M" → 450
 *   "PT45M" → 45
 *   "PT12H" → 720
 *   "PT1H5M" → 65
 */
export function parseDuration(isoDuration: string): number {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
  const matches = isoDuration.match(regex);

  if (!matches) {
    return 0;
  }

  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;

  return hours * 60 + minutes;
}

/**
 * Convert ALL CAPS to Title Case
 * Examples:
 *   "DELTA AIR LINES" → "Delta Air Lines"
 *   "BRITISH AIRWAYS" → "British Airways"
 *   "AMERICAN AIRLINES" → "American Airlines"
 */
export function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get airline logo URL or placeholder
 * For now, returns a placeholder path
 * TODO: Replace with actual logo URLs or CDN links
 */
export function getAirlineLogo(code: string): string {
  // Map of known airline codes to logo URLs
  const logoMap: Record<string, string> = {
    DL: '/airlines/delta.svg',
    AA: '/airlines/american.svg',
    UA: '/airlines/united.svg',
    BA: '/airlines/british-airways.svg',
    LH: '/airlines/lufthansa.svg',
    AF: '/airlines/air-france.svg',
    KL: '/airlines/klm.svg',
    EK: '/airlines/emirates.svg',
    QR: '/airlines/qatar.svg',
    SQ: '/airlines/singapore.svg',
  };

  return logoMap[code] || `/airlines/${code.toLowerCase()}.svg`;
}

/**
 * Check if arrival is next day compared to departure
 */
function isNextDay(departureTime: string, arrivalTime: string): boolean {
  const departure = new Date(departureTime);
  const arrival = new Date(arrivalTime);

  const departureDay = departure.toISOString().split('T')[0];
  const arrivalDay = arrival.toISOString().split('T')[0];

  return arrivalDay !== departureDay;
}

/**
 * Format aircraft name from dictionary
 * Examples:
 *   "BOEING 777-200" → "Boeing 777-200"
 *   "AIRBUS A350" → "Airbus A350"
 */
function formatAircraftName(name: string): string {
  if (!name) return 'Aircraft';
  return toTitleCase(name);
}

/**
 * Transform a single Amadeus flight offer to our Flight type
 */
function transformFlightOffer(
  offer: AmadeusFlightOffer,
  dictionaries?: AmadeusFlightSearchResponse['dictionaries']
): Flight {
  // Get the first itinerary (outbound flight)
  const itinerary = offer.itineraries[0];
  const segments = itinerary.segments;
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1];

  // 1. ID
  const id = offer.id;

  // 2. Airline info
  const airlineCode = offer.validatingAirlineCodes[0];
  const airlineName = dictionaries?.carriers?.[airlineCode]
    ? toTitleCase(dictionaries.carriers[airlineCode])
    : airlineCode;
  const airlineLogo = getAirlineLogo(airlineCode);

  const airline = {
    code: airlineCode,
    name: airlineName,
    logo: airlineLogo,
  };

  // 3. Flight number (from first segment)
  const flightNumber = `${firstSegment.carrierCode} ${firstSegment.number}`;

  // 4. Departure time
  const departureTime = firstSegment.departure.at;

  // 5. Arrival time
  const arrivalTime = lastSegment.arrival.at;

  // 6. Origin
  const origin = firstSegment.departure.iataCode;

  // 7. Destination
  const destination = lastSegment.arrival.iataCode;

  // 8. Duration (parse ISO 8601 to minutes)
  const duration = parseDuration(itinerary.duration);

  // 9. Stops (number of segments - 1)
  const stops = segments.length - 1;

  // 10. Stop locations (intermediate airports)
  const stopLocations: string[] = [];
  if (stops > 0) {
    // For each segment except the last, add the arrival airport
    for (let i = 0; i < segments.length - 1; i++) {
      stopLocations.push(segments[i].arrival.iataCode);
    }
  }

  // 11. Price
  const price = parseFloat(offer.price.grandTotal);

  // 12. Currency
  const currency = offer.price.currency;

  // 13. Cabin class
  const cabinRaw = offer.travelerPricings[0]?.fareDetailsBySegment[0]?.cabin || 'ECONOMY';
  const cabinClass = toTitleCase(cabinRaw);

  // 14. Aircraft
  const aircraftCode = firstSegment.aircraft.code;
  const aircraftName = dictionaries?.aircraft?.[aircraftCode];
  const aircraft = aircraftName ? formatAircraftName(aircraftName) : aircraftCode;

  // 15. Is next day
  const isNextDayFlight = isNextDay(departureTime, arrivalTime);

  // 16. Best value (will be calculated later)
  const isBestValue = false;

  // 17. Segments
  const flightSegments: FlightSegment[] = segments.map((seg) => {
    const segAirlineCode = seg.carrierCode;
    const segAirlineName = dictionaries?.carriers?.[segAirlineCode]
      ? toTitleCase(dictionaries.carriers[segAirlineCode])
      : segAirlineCode;

    const segAircraftCode = seg.aircraft.code;
    const segAircraftName = dictionaries?.aircraft?.[segAircraftCode];
    const segAircraft = segAircraftName ? formatAircraftName(segAircraftName) : segAircraftCode;

    return {
      airline: segAirlineName,
      flightNumber: `${seg.carrierCode} ${seg.number}`,
      origin: seg.departure.iataCode,
      destination: seg.arrival.iataCode,
      departureTime: seg.departure.at,
      arrivalTime: seg.arrival.at,
      duration: parseDuration(seg.duration),
      aircraft: segAircraft,
    };
  });

  return {
    id,
    airline,
    flightNumber,
    departureTime,
    arrivalTime,
    origin,
    destination,
    duration,
    stops,
    stopLocations,
    price,
    currency,
    cabinClass,
    aircraft,
    isNextDay: isNextDayFlight,
    isBestValue,
    segments: flightSegments,
  };
}

/**
 * Find the best value flight (lowest price with fewest stops)
 */
function findBestValueFlight(flights: Flight[]): number {
  if (flights.length === 0) return -1;

  let bestIndex = 0;
  let bestScore = Infinity;

  flights.forEach((flight, index) => {
    // Score = price + (stops * 50)
    // This weights both price and convenience
    const score = flight.price + flight.stops * 50;

    if (score < bestScore) {
      bestScore = score;
      bestIndex = index;
    }
  });

  return bestIndex;
}

/**
 * Extract unique airlines from flights
 */
function extractAirlines(flights: Flight[]): AirlineInfo[] {
  const airlinesMap = new Map<string, string>();

  flights.forEach((flight) => {
    if (!airlinesMap.has(flight.airline.code)) {
      airlinesMap.set(flight.airline.code, flight.airline.name);
    }
  });

  return Array.from(airlinesMap.entries()).map(([code, name]) => ({ code, name }));
}

/**
 * Calculate price range from flights
 */
function calculatePriceRange(flights: Flight[]): { min: number; max: number } {
  if (flights.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = flights.map((f) => f.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

/**
 * Transform Amadeus API response to FlightSearchResult
 *
 * This is the main transformer function that:
 * 1. Transforms each flight offer to our Flight type
 * 2. Sorts flights by price (ascending)
 * 3. Marks the best value flight
 * 4. Extracts unique airlines
 * 5. Calculates price range
 *
 * @param apiResponse - Raw Amadeus API response
 * @returns FlightSearchResult with transformed flights and metadata
 */
export function transformFlightOffers(
  apiResponse: AmadeusFlightSearchResponse
): FlightSearchResult {
  // Handle empty response
  if (!apiResponse.data || apiResponse.data.length === 0) {
    return {
      flights: [],
      airlines: [],
      priceRange: { min: 0, max: 0 },
      totalResults: 0,
    };
  }

  // Transform all flight offers
  let flights = apiResponse.data.map((offer) =>
    transformFlightOffer(offer, apiResponse.dictionaries)
  );

  // Sort by price (ascending)
  flights.sort((a, b) => a.price - b.price);

  // Mark the best value flight
  const bestValueIndex = findBestValueFlight(flights);
  if (bestValueIndex >= 0) {
    flights = flights.map((flight, index) => ({
      ...flight,
      isBestValue: index === bestValueIndex,
    }));
  }

  // Extract unique airlines
  const airlines = extractAirlines(flights);

  // Calculate price range
  const priceRange = calculatePriceRange(flights);

  // Get total results count
  const totalResults = apiResponse.meta.count || flights.length;

  return {
    flights,
    airlines,
    priceRange,
    totalResults,
  };
}
