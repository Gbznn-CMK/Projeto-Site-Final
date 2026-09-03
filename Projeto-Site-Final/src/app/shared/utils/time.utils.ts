/**
 * Time utilities for slot generation and overlap detection
 */

/**
 * Generates 30-minute time slots between two times
 * @param startTime - Start time in "HH:MM" format
 * @param endTime - End time in "HH:MM" format
 * @returns Array of time strings in "HH:MM" format
 */
export function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots: string[] = [];
  const [startH, startM] = startTime.split(':').map(Number);
  const [endH, endM] = endTime.split(':').map(Number);

  let currentH = startH;
  let currentM = startM;

  while (currentH < endH || (currentH === endH && currentM < endM)) {
    slots.push(`${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`);
    currentM += 30;
    if (currentM >= 60) {
      currentM = 0;
      currentH += 1;
    }
  }

  return slots;
}

/**
 * Converts time string to minutes since midnight
 * @param timeStr - Time in "HH:MM" format
 * @returns Number of minutes since midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Converts minutes since midnight to time string
 * @param minutes - Number of minutes since midnight
 * @returns Time in "HH:MM" format
 */
export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Adds minutes to a time string
 * @param timeStr - Time in "HH:MM" format
 * @param minutes - Minutes to add
 * @returns New time in "HH:MM" format
 */
export function addMinutesToTime(timeStr: string, minutes: number): string {
  const totalMinutes = timeToMinutes(timeStr) + minutes;
  return minutesToTime(totalMinutes);
}

/**
 * Checks if two time ranges overlap
 * @param start1 - Start time of first range (minutes)
 * @param end1 - End time of first range (minutes)
 * @param start2 - Start time of second range (minutes)
 * @param end2 - End time of second range (minutes)
 * @returns True if ranges overlap
 */
export function timeRangesOverlap(
  start1: number,
  end1: number,
  start2: number,
  end2: number
): boolean {
  return !(end1 <= start2 || start1 >= end2);
}

/**
 * Formats duration in minutes to readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration (e.g., "1h 30m", "45m")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Gets day name from day index
 * @param dayIndex - 0 = Monday, 6 = Sunday
 * @returns Day name in Portuguese
 */
export function getDayName(dayIndex: number): string {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
  return days[dayIndex] || '';
}

/**
 * Gets JavaScript day index (0-6, Sun-Sat) converted to app format (0-6, Mon-Sun)
 * @param jsDay - JavaScript day (0 = Sunday, 6 = Saturday)
 * @returns App day format (0 = Monday, 6 = Sunday)
 */
export function jsToAppDay(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

/**
 * Gets app day format (0-6, Mon-Sun) converted to JavaScript format (0-6, Sun-Sat)
 * @param appDay - App day format (0 = Monday, 6 = Sunday)
 * @returns JavaScript day (0 = Sunday, 6 = Saturday)
 */
export function appToJsDay(appDay: number): number {
  return appDay === 6 ? 0 : appDay + 1;
}

/**
 * Checks if a date is today
 * @param date - Date to check
 * @returns True if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Checks if a date is in the future
 * @param date - Date to check
 * @returns True if date is in the future
 */
export function isFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Formats a date to Brazilian format (DD/MM/YYYY)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDateBR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Parses a date string in ISO format to a Date object
 * @param dateStr - Date string in YYYY-MM-DD or ISO format
 * @returns Date object
 */
export function parseISODate(dateStr: string): Date {
  return new Date(dateStr);
}

/**
 * Formats a Date into a local "YYYY-MM-DD" key, using the browser's local
 * timezone instead of UTC. This prevents off-by-one-day errors when the
 * local date differs from the UTC date (e.g. late evening in UTC-3).
 * @param date - Date to format
 * @returns Local date key in "YYYY-MM-DD" format
 */
export function toLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
