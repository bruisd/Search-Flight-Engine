import type { CabinClass } from './flight';

export interface Airport {
  readonly code: string;
  readonly name: string;
  readonly city: string;
  readonly country: string;
}

export interface FlightLeg {
  id: string; // unique id like "leg-1", "leg-2"
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
}

export interface SearchParams {
  readonly origin: string;
  readonly destination: string;
  readonly departureDate: string;
  readonly returnDate?: string;
  readonly passengers: number;
  readonly cabinClass: CabinClass;
  readonly tripType: TripType;
}

export interface MultiCitySearchParams {
  readonly tripType: 'multi-city';
  readonly legs: FlightLeg[];
  readonly passengers: number;
  readonly cabinClass: CabinClass;
}

export type TripType = 'one-way' | 'round-trip' | 'multi-city';
