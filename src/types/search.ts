import type { CabinClass } from './flight';

export interface Airport {
  readonly code: string;
  readonly name: string;
  readonly city: string;
  readonly country: string;
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

export type TripType = 'one-way' | 'round-trip';
