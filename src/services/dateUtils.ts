/**
 * Date utilities for safe date handling without timezone issues
 */

/**
 * Convert ISO date string (YYYY-MM-DD) or ISO datetime (with T and Z)
 * to local YYYY-MM-DD format safely
 * 
 * Examples:
 * - "2025-12-08" → "2025-12-08" (already formatted)
 * - "2025-12-08T10:30:00Z" → "2025-12-08" (local date, UTC+3 example might shift)
 * 
 * @param dateStr - ISO format string from backend
 * @returns Local date in YYYY-MM-DD format
 */
export const getLocalDateString = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;

  // If already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  // If ISO datetime format, parse and extract local date
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateStr}`);
      return null;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (err) {
    console.error(`Failed to parse date: ${dateStr}`, err);
    return null;
  }
};

/**
 * Get current local date in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Compare two date strings safely
 */
export const isSameDay = (dateStr1: string | null, dateStr2: string | null): boolean => {
  if (!dateStr1 || !dateStr2) return false;
  const normalized1 = getLocalDateString(dateStr1);
  const normalized2 = getLocalDateString(dateStr2);
  return normalized1 === normalized2;
};
