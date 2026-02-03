export { amadeusClient, amadeusGet } from './amadeusClient';
export type { AmadeusError } from './amadeusClient';
export { searchFlights, getFlightDetails, searchMultiCityFlights } from './flightService';
export type {
  FlightSearchResult,
  AirlineInfo,
  AmadeusFlightOffer,
  AmadeusFlightSearchResponse,
} from './flightService';
export { searchAirports, getAirportByCode } from './airportService';
export { transformFlightOffers, parseDuration, toTitleCase, getAirlineLogo } from './transformFlights';
