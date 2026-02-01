import { format } from 'date-fns';

/**
 * Formats a price value to USD currency string
 * @param price - The price value to format
 * @returns Formatted price string (e.g., "$450", "$1,200")
 * @example
 * formatPrice(450) // "$450"
 * formatPrice(1200) // "$1,200"
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Formats duration in minutes to human-readable string
 * @param minutes - The duration in minutes
 * @returns Formatted duration string (e.g., "7h 30m", "1h 30m", "45m")
 * @example
 * formatDuration(450) // "7h 30m"
 * formatDuration(90) // "1h 30m"
 * formatDuration(45) // "45m"
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) {
    return `${mins}m`;
  }

  if (mins === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${mins}m`;
}

/**
 * Formats an ISO date string to 12-hour time format
 * @param dateString - ISO date string
 * @returns Formatted time string (e.g., "10:00 AM", "5:30 PM")
 * @example
 * formatTime("2024-10-24T10:00:00Z") // "10:00 AM"
 * formatTime("2024-10-24T17:30:00Z") // "5:30 PM"
 */
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'h:mm a');
}

/**
 * Formats an ISO date string to 24-hour time format
 * @param dateString - ISO date string
 * @returns Formatted time string (e.g., "10:00", "17:30")
 * @example
 * formatTime24("2024-10-24T10:00:00Z") // "10:00"
 * formatTime24("2024-10-24T17:30:00Z") // "17:30"
 */
export function formatTime24(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'HH:mm');
}

/**
 * Formats an ISO date string to readable date format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Oct 24, 2023")
 * @example
 * formatDate("2024-10-24T10:00:00Z") // "Oct 24, 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy');
}

/**
 * Formats an ISO date string to short date format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Oct 24")
 * @example
 * formatDateShort("2024-10-24T10:00:00Z") // "Oct 24"
 */
export function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d');
}

/**
 * Formats an ISO date string to date with day of week
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Oct 24, Thu")
 * @example
 * formatDateWithDay("2024-10-24T10:00:00Z") // "Oct 24, Thu"
 */
export function formatDateWithDay(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, EEE');
}

/**
 * Formats a date range from two ISO date strings
 * @param start - Start date ISO string
 * @param end - End date ISO string
 * @returns Formatted date range string (e.g., "Oct 12 - Oct 19")
 * @example
 * formatDateRange("2024-10-12T10:00:00Z", "2024-10-19T10:00:00Z") // "Oct 12 - Oct 19"
 */
export function formatDateRange(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`;
}
