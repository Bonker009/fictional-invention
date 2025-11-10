import { IHolidayRepository } from '../../domain/interfaces/IHolidayRepository';
import { Holiday } from '../../domain/entities/Holiday';
import { pool } from '../database/pool';
import { RedisCache } from '../cache/RedisCache';
import { logger } from '../logging/logger';

export class PostgresHolidayRepository implements IHolidayRepository {
  private cache: RedisCache | null = null;
  private cacheEnabled: boolean;

  constructor(cache?: RedisCache) {
    this.cache = cache || null;
    this.cacheEnabled = process.env.ENABLE_CACHE === 'true' && this.cache !== null;
  }

  private getCacheKey(prefix: string, ...args: (string | number)[]): string {
    return `holiday:${prefix}:${args.join(':')}`;
  }

  private async getCached<T>(key: string): Promise<T | null> {
    if (!this.cacheEnabled || !this.cache) return null;
    return await this.cache.get<T>(key);
  }

  private async setCached<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.cacheEnabled || !this.cache) return;
    await this.cache.set(key, value, ttl);
  }

  private mapRowToHoliday(row: any, year?: number): Holiday {
    return new Holiday({
      month: row.month,
      day: row.day,
      nameKh: row.name_kh,
      nameEn: row.name_en,
      type: row.type,
      isPublicHoliday: row.is_public_holiday,
      description: row.description || undefined,
      year: year || row.year,
    });
  }

  async findAll(year: number): Promise<Holiday[]> {
    const cacheKey = this.getCacheKey('all', year);
    const cached = await this.getCached<Holiday[]>(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for holidays year ${year}`);
      return cached.map((h) => new Holiday(h));
    }

    try {
      const result = await pool.query(
        `SELECT * FROM holidays 
         WHERE year IS NULL OR year = $1
         ORDER BY month ASC, day ASC`,
        [year]
      );

      const holidays = result.rows.map((row) => this.mapRowToHoliday(row, year));
      await this.setCached(cacheKey, holidays);
      return holidays;
    } catch (error) {
      logger.error('Error finding all holidays:', error);
      throw new Error('Failed to fetch holidays');
    }
  }

  async findByDate(month: number, day: number, year: number): Promise<Holiday[]> {
    const cacheKey = this.getCacheKey('date', year, month, day);
    const cached = await this.getCached<Holiday[]>(cacheKey);
    if (cached) {
      return cached.map((h) => new Holiday(h));
    }

    try {
      const result = await pool.query(
        `SELECT * FROM holidays 
         WHERE month = $1 AND day = $2 
         AND (year IS NULL OR year = $3)`,
        [month, day, year]
      );

      const holidays = result.rows.map((row) => this.mapRowToHoliday(row, year));
      await this.setCached(cacheKey, holidays);
      return holidays;
    } catch (error) {
      logger.error('Error finding holidays by date:', error);
      throw new Error('Failed to fetch holidays by date');
    }
  }

  async findByMonth(month: number, year: number): Promise<Holiday[]> {
    const cacheKey = this.getCacheKey('month', year, month);
    const cached = await this.getCached<Holiday[]>(cacheKey);
    if (cached) {
      return cached.map((h) => new Holiday(h));
    }

    try {
      const result = await pool.query(
        `SELECT * FROM holidays 
         WHERE month = $1 
         AND (year IS NULL OR year = $2)
         ORDER BY day ASC`,
        [month, year]
      );

      const holidays = result.rows.map((row) => this.mapRowToHoliday(row, year));
      await this.setCached(cacheKey, holidays);
      return holidays;
    } catch (error) {
      logger.error('Error finding holidays by month:', error);
      throw new Error('Failed to fetch holidays by month');
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Holiday[]> {
    const cacheKey = this.getCacheKey(
      'range',
      startDate.toISOString(),
      endDate.toISOString()
    );
    const cached = await this.getCached<Holiday[]>(cacheKey);
    if (cached) {
      return cached.map((h) => new Holiday(h));
    }

    try {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      const years = [];
      
      for (let y = startYear; y <= endYear; y++) {
        years.push(y);
      }

      const allHolidays: Holiday[] = [];

      for (const year of years) {
        const yearHolidays = await this.findAll(year);
        allHolidays.push(...yearHolidays);
      }

      // Filter by date range
      const filtered = allHolidays.filter((h) => {
        const holidayDate = new Date(h.year!, h.month - 1, h.day);
        return holidayDate >= startDate && holidayDate <= endDate;
      });

      await this.setCached(cacheKey, filtered, 1800); // 30 minutes cache
      return filtered;
    } catch (error) {
      logger.error('Error finding holidays by date range:', error);
      throw new Error('Failed to fetch holidays by date range');
    }
  }

  async findUpcoming(limit: number, fromDate?: Date): Promise<Holiday[]> {
    const today = fromDate || new Date();
    const endDate = new Date(today);
    endDate.setFullYear(endDate.getFullYear() + 2); // Look ahead 2 years

    try {
      const holidays = await this.findByDateRange(today, endDate);
      
      // Filter upcoming only
      const upcoming = holidays.filter((h) => {
        const holidayDate = new Date(h.year!, h.month - 1, h.day);
        return holidayDate >= today;
      });

      return upcoming.slice(0, limit);
    } catch (error) {
      logger.error('Error finding upcoming holidays:', error);
      throw new Error('Failed to fetch upcoming holidays');
    }
  }

  async findPublicHolidays(year: number): Promise<Holiday[]> {
    const cacheKey = this.getCacheKey('public', year);
    const cached = await this.getCached<Holiday[]>(cacheKey);
    if (cached) {
      return cached.map((h) => new Holiday(h));
    }

    try {
      const result = await pool.query(
        `SELECT * FROM holidays 
         WHERE is_public_holiday = true
         AND (year IS NULL OR year = $1)
         ORDER BY month ASC, day ASC`,
        [year]
      );

      const holidays = result.rows.map((row) => this.mapRowToHoliday(row, year));
      await this.setCached(cacheKey, holidays);
      return holidays;
    } catch (error) {
      logger.error('Error finding public holidays:', error);
      throw new Error('Failed to fetch public holidays');
    }
  }

  async findReligiousHolidays(year: number): Promise<Holiday[]> {
    const cacheKey = this.getCacheKey('religious', year);
    const cached = await this.getCached<Holiday[]>(cacheKey);
    if (cached) {
      return cached.map((h) => new Holiday(h));
    }

    try {
      const result = await pool.query(
        `SELECT * FROM holidays 
         WHERE type IN ('religious', 'holy')
         AND (year IS NULL OR year = $1)
         ORDER BY month ASC, day ASC`,
        [year]
      );

      const holidays = result.rows.map((row) => this.mapRowToHoliday(row, year));
      await this.setCached(cacheKey, holidays);
      return holidays;
    } catch (error) {
      logger.error('Error finding religious holidays:', error);
      throw new Error('Failed to fetch religious holidays');
    }
  }
}

