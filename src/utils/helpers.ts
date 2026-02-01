import { differenceInMinutes } from 'date-fns';
import type { DepartureTimeSlot } from '../types';

/**
 * Determines the time of day based on hour (24-hour format)
 * @param hour - Hour in 24-hour format (0-23)
 * @returns Time of day category
 * @example
 * getTimeOfDay(8) // "morning"
 * getTimeOfDay(14) // "afternoon"
 * getTimeOfDay(20) // "evening"
 */
export function getTimeOfDay(hour: number): DepartureTimeSlot {
  if (hour >= 6 && hour < 12) {
    return 'morning';
  }
  if (hour >= 12 && hour < 18) {
    return 'afternoon';
  }
  return 'evening';
}

/**
 * Converts number of stops to human-readable label
 * @param stops - Number of stops
 * @returns Formatted stops label
 * @example
 * getStopsLabel(0) // "Non-stop"
 * getStopsLabel(1) // "1 Stop"
 * getStopsLabel(2) // "2+ Stops"
 */
export function getStopsLabel(stops: number): string {
  if (stops === 0) {
    return 'Non-stop';
  }
  if (stops === 1) {
    return '1 Stop';
  }
  return `${stops}+ Stops`;
}

/**
 * Returns CSS color class based on number of stops
 * @param stops - Number of stops
 * @returns CSS color class
 * @example
 * getStopsColor(0) // "text-green-600"
 * getStopsColor(1) // "text-gray-500"
 */
export function getStopsColor(stops: number): string {
  return stops === 0 ? 'text-green-600' : 'text-gray-500';
}

/**
 * Calculates duration in minutes between two dates
 * @param departure - Departure time ISO string
 * @param arrival - Arrival time ISO string
 * @returns Duration in minutes
 * @example
 * calculateDuration("2024-10-24T10:00:00Z", "2024-10-24T17:30:00Z") // 450
 */
export function calculateDuration(departure: string, arrival: string): number {
  const departureDate = new Date(departure);
  const arrivalDate = new Date(arrival);
  return differenceInMinutes(arrivalDate, departureDate);
}

/**
 * Merges multiple class names, filtering out falsy values
 * Useful for conditional class application
 * @param classes - Variable number of class names (strings, booleans, or undefined)
 * @returns Merged class name string
 * @example
 * classNames('btn', true && 'active', false && 'disabled') // "btn active"
 * classNames('card', isHovered && 'hovered', undefined) // "card hovered" or "card"
 */
export function classNames(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Generates a unique ID for use as React keys or element IDs
 * @returns Unique identifier string
 * @example
 * generateId() // "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
