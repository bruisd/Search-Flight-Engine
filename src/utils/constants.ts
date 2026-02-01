/**
 * Airline codes with their display names and logo paths
 */
export const AIRLINES: Record<string, { name: string; logo: string }> = {
  DL: { name: 'Delta Airlines', logo: '/airlines/delta.png' },
  BA: { name: 'British Airways', logo: '/airlines/british-airways.png' },
  UA: { name: 'United Airlines', logo: '/airlines/united.png' },
  AA: { name: 'American Airlines', logo: '/airlines/american.png' },
  VS: { name: 'Virgin Atlantic', logo: '/airlines/virgin.png' },
  LH: { name: 'Lufthansa', logo: '/airlines/lufthansa.png' },
  AF: { name: 'Air France', logo: '/airlines/air-france.png' },
  KL: { name: 'KLM', logo: '/airlines/klm.png' },
  EK: { name: 'Emirates', logo: '/airlines/emirates.png' },
  QR: { name: 'Qatar Airways', logo: '/airlines/qatar.png' },
};

/**
 * Time slot definitions for filtering flights by departure time
 */
export const TIME_SLOTS = {
  morning: {
    label: 'Morning',
    range: '06-12',
    icon: 'wb_twilight',
  },
  afternoon: {
    label: 'Afternoon',
    range: '12-18',
    icon: 'light_mode',
  },
  evening: {
    label: 'Evening',
    range: '18-00',
    icon: 'dark_mode',
  },
} as const;

/**
 * Available cabin class options
 */
export const CABIN_CLASSES = [
  'Economy',
  'Premium Economy',
  'Business',
  'First',
] as const;

/**
 * Maximum number of passengers allowed per booking
 */
export const MAX_PASSENGERS = 9;

/**
 * Minimum number of passengers required per booking
 */
export const MIN_PASSENGERS = 1;

/**
 * Default search parameters
 */
export const DEFAULT_SEARCH_PARAMS = {
  passengers: 1,
  cabinClass: 'economy' as const,
  tripType: 'round-trip' as const,
};


/**
 * Stop filter options
 */
export const STOP_OPTIONS = [
  { value: 0, label: 'Non-stop' },
  { value: 1, label: '1 Stop' },
  { value: 2, label: '2+ Stops' },
] as const;
