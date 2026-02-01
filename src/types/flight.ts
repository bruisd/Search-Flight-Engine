export interface FlightSegment {
  readonly airline: string;
  readonly flightNumber: string;
  readonly origin: string;
  readonly destination: string;
  readonly departureTime: string;
  readonly arrivalTime: string;
  readonly duration: number; // minutes
  readonly aircraft: string;
}

export interface Flight {
  readonly id: string;
  readonly airline: {
    readonly code: string;
    readonly name: string;
    readonly logo: string;
  };
  readonly flightNumber: string;
  readonly departureTime: string; // ISO datetime
  readonly arrivalTime: string; // ISO datetime
  readonly origin: string; // "JFK"
  readonly destination: string; // "LHR"
  readonly duration: number; // total minutes
  readonly stops: number; // 0 = direct, 1 = 1 stop
  readonly stopLocations: readonly string[]; // ["BOS"]
  readonly price: number; // 450
  readonly currency: string; // "USD"
  readonly cabinClass: string; // "Economy"
  readonly aircraft: string; // "Boeing 777"
  readonly isNextDay: boolean; // arrives next day
  readonly isBestValue: boolean; // calculated flag
  readonly segments: readonly FlightSegment[];
}

export type CabinClass = 'economy' | 'premium_economy' | 'business' | 'first';
