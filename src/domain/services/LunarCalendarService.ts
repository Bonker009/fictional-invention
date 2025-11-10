/**
 * Lunar Calendar Service for calculating Buddhist holidays
 * 
 * This service calculates lunar calendar dates for Buddhist holidays which follow
 * the lunar calendar rather than the Gregorian calendar.
 * 
 * Key Buddhist Holidays in Cambodia:
 * - Meak Bochea (Magha Puja) - Full moon of 3rd lunar month
 * - Visak Bochea (Vesak) - Full moon of 4th/6th lunar month
 * - Pchum Ben - 15th day of 10th lunar month
 * - Bon Om Touk (Water Festival) - Full moon of 12th lunar month
 */

export interface LunarDate {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  gregorianDate: Date;
}

export class LunarCalendarService {
  /**
   * Calculate approximate lunar date to Gregorian date
   * This is a simplified calculation. For production, consider using a proper lunar calendar library
   */
  static lunarToGregorian(year: number, lunarMonth: number, lunarDay: number): Date {
    // Lunar year typically starts around late January or early February
    // Average lunar month is ~29.53 days
    const LUNAR_MONTH_DAYS = 29.53;
    
    // Approximate start of lunar year (Chinese/Khmer New Year is usually late Jan-Feb)
    const lunarYearStart = this.getLunarYearStart(year);
    
    // Calculate days from start of lunar year
    const daysFromLunarYearStart = (lunarMonth - 1) * LUNAR_MONTH_DAYS + lunarDay;
    
    // Add to lunar year start
    const gregorianDate = new Date(lunarYearStart);
    gregorianDate.setDate(gregorianDate.getDate() + Math.floor(daysFromLunarYearStart));
    
    return gregorianDate;
  }

  /**
   * Get approximate start of lunar year for a given Gregorian year
   * Khmer/Chinese New Year typically falls between Jan 21 and Feb 20
   */
  private static getLunarYearStart(year: number): Date {
    // This is a simplified approximation
    // For accurate dates, use an astronomical calculation library
    const springEquinox = new Date(year, 2, 20); // March 20
    const daysToNewMoon = this.getDaysToNewMoon(springEquinox);
    
    const lunarNewYear = new Date(springEquinox);
    lunarNewYear.setDate(springEquinox.getDate() - daysToNewMoon);
    
    // Adjust to typical range (Jan 21 - Feb 20)
    if (lunarNewYear.getMonth() > 2) {
      lunarNewYear.setMonth(1); // February
      lunarNewYear.setDate(1);
    }
    
    return lunarNewYear;
  }

  /**
   * Simplified moon phase calculation
   * Returns approximate days to next new moon
   */
  private static getDaysToNewMoon(date: Date): number {
    const LUNAR_CYCLE = 29.53; // days
    const KNOWN_NEW_MOON = new Date(2000, 0, 6); // Jan 6, 2000 was a new moon
    
    const daysSinceKnownNewMoon =
      (date.getTime() - KNOWN_NEW_MOON.getTime()) / (1000 * 60 * 60 * 24);
    const cyclePosition = daysSinceKnownNewMoon % LUNAR_CYCLE;
    
    return LUNAR_CYCLE - cyclePosition;
  }

  /**
   * Calculate Meak Bochea (Magha Puja) - Full moon day of 3rd lunar month
   */
  static calculateMeakBochea(year: number): Date {
    return this.lunarToGregorian(year, 3, 15); // 15th day is full moon
  }

  /**
   * Calculate Visak Bochea (Vesak/Buddha's Birthday) - Full moon of 6th lunar month
   * (Sometimes 4th month depending on tradition)
   */
  static calculateVisakBochea(year: number): Date {
    return this.lunarToGregorian(year, 6, 15);
  }

  /**
   * Calculate Pchum Ben (Ancestors' Day) - 15th day of 10th lunar month
   */
  static calculatePchumBen(year: number): Date {
    return this.lunarToGregorian(year, 10, 15);
  }

  /**
   * Calculate Bon Om Touk (Water Festival) - Full moon of 12th lunar month
   */
  static calculateBonOmTouk(year: number): Date {
    return this.lunarToGregorian(year, 12, 15);
  }

  /**
   * Calculate Buddhist Lent Begin (Chol Vassa) - Full moon of 8th lunar month
   */
  static calculateBuddhistLentBegin(year: number): Date {
    return this.lunarToGregorian(year, 8, 15);
  }

  /**
   * Calculate Buddhist Lent End (Choeung Vassa) - Full moon of 11th lunar month
   */
  static calculateBuddhistLentEnd(year: number): Date {
    return this.lunarToGregorian(year, 11, 15);
  }

  /**
   * Calculate all lunar holidays for a given year
   */
  static calculateAllLunarHolidays(year: number): Map<string, Date> {
    return new Map([
      ['meakBochea', this.calculateMeakBochea(year)],
      ['visakBochea', this.calculateVisakBochea(year)],
      ['pchumBen', this.calculatePchumBen(year)],
      ['bonOmTouk', this.calculateBonOmTouk(year)],
      ['buddhistLentBegin', this.calculateBuddhistLentBegin(year)],
      ['buddhistLentEnd', this.calculateBuddhistLentEnd(year)],
    ]);
  }

  /**
   * Check if a date is a full moon day (15th of lunar month)
   */
  static isFullMoonDay(date: Date): boolean {
    // Simplified check - in production, use astronomical calculations
    const LUNAR_CYCLE = 29.53;
    const KNOWN_FULL_MOON = new Date(2000, 0, 21); // Jan 21, 2000 was a full moon
    
    const daysSinceKnownFullMoon =
      (date.getTime() - KNOWN_FULL_MOON.getTime()) / (1000 * 60 * 60 * 24);
    const cyclePosition = daysSinceKnownFullMoon % LUNAR_CYCLE;
    
    // Within 1 day of full moon
    return cyclePosition < 1 || cyclePosition > (LUNAR_CYCLE - 1);
  }
}

