export type DepartureTimeSlot = 'morning' | 'afternoon' | 'evening';

export interface PriceRange {
  readonly min: number;
  readonly max: number;
}

export interface FlightFilters {
  readonly stops: readonly number[];
  readonly priceRange: PriceRange;
  readonly airlines: readonly string[];
  readonly departureTime: readonly DepartureTimeSlot[];
}
