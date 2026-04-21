/**
 * Availability time utilities
 *
 * The backend may return `time` columns as `HH:mm` or `HH:mm:ss` strings.
 * These helpers normalize them for forms and table rendering.
 */

/**
 * Normalize backend time strings to HH:mm.
 */
export function normalizeAvailabilityTime(value?: string | null): string {
  if (!value) {
    return '';
  }

  const [hours = '00', minutes = '00'] = value.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}

/**
 * Convert an ISO date to an input[type=date] value.
 */
export function toDateInputValue(value?: string | null): string {
  if (!value) {
    return '';
  }

  return value.slice(0, 10);
}

/**
 * Build a normalized display range from backend start/end times.
 */
export function formatAvailabilityTimeRange(startTime?: string | null, endTime?: string | null): string {
  const normalizedStart = normalizeAvailabilityTime(startTime);
  const normalizedEnd = normalizeAvailabilityTime(endTime);

  if (!normalizedStart && !normalizedEnd) {
    return '';
  }

  return `${normalizedStart} - ${normalizedEnd}`;
}