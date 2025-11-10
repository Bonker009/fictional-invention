import { IHolidayRepository } from '../../domain/interfaces/IHolidayRepository';
import { Holiday } from '../../domain/entities/Holiday';
import { getPrismaClient } from '../database/prisma';
import { RedisCache } from '../cache/RedisCache';
import { logger } from '../logging/logger';

export class PrismaHolidayRepository implements IHolidayRepository {
  private prisma = getPrismaClient();
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

  async findAll(year: number): Promise<Holiday[]> {
    const cacheKey = this.getCacheKey('all', year);
    const cached = await this.getCached<Holiday[]>(cacheKey);
    if (cached) {
      logger.debug(`Cache hit for holidays year ${year}`);
      return cached.map((h) => new Holiday(h));
    }

    try {
      // Get fixed holidays
      const fixedHolidays = await this.prisma.holiday.findMany({
        where: {
          OR: [
            { isRecurring: true },
            {
              AND: [
                { startYear: { lte: year } },
                {
                  OR: [
                    { endYear: null },
                    { endYear: { gte: year } }
                  ]
                }
              ]
            }
          ]
        },
        orderBy: [{ month: 'asc' }, { day: 'asc' }],
      });

      // Get calculated lunar holidays for the year
      const lunarDates = await this.prisma.calculatedLunarDate.findMany({
        where: { year },
        include: { lunarHoliday: true },
      });

      const holidays: Holiday[] = [
        ...fixedHolidays.map((h) => new Holiday({
          month: h.month,
          day: h.day,
          nameKh: h.nameKh,
          nameEn: h.nameEn,
          type: h.type,
          isPublicHoliday: h.isPublicHoliday,
          description: h.description || undefined,
          year,
        })),
        ...lunarDates.map((ld) => new Holiday({
          month: ld.month,
          day: ld.day,
          nameKh: ld.lunarHoliday.nameKh,
          nameEn: ld.lunarHoliday.nameEn,
          type: ld.lunarHoliday.type,
          isPublicHoliday: ld.lunarHoliday.isPublicHoliday,
          description: ld.lunarHoliday.description || undefined,
          year,
        })),
      ];

      // Sort by date
      holidays.sort((a, b) => {
        if (a.month !== b.month) return a.month - b.month;
        return a.day - b.day;
      });

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
      // Find fixed holidays
      const fixedHolidays = await this.prisma.holiday.findMany({
        where: {
          month,
          day,
          OR: [
            { isRecurring: true },
            {
              AND: [
                { startYear: { lte: year } },
                {
                  OR: [
                    { endYear: null },
                    { endYear: { gte: year } }
                  ]
                }
              ]
            }
          ],
        },
      });

      // Find lunar holidays for this date
      const lunarDates = await this.prisma.calculatedLunarDate.findMany({
        where: { year, month, day },
        include: { lunarHoliday: true },
      });

      const holidays: Holiday[] = [
        ...fixedHolidays.map((h) => new Holiday({
          month: h.month,
          day: h.day,
          nameKh: h.nameKh,
          nameEn: h.nameEn,
          type: h.type,
          isPublicHoliday: h.isPublicHoliday,
          description: h.description || undefined,
          year,
        })),
        ...lunarDates.map((ld) => new Holiday({
          month: ld.month,
          day: ld.day,
          nameKh: ld.lunarHoliday.nameKh,
          nameEn: ld.lunarHoliday.nameEn,
          type: ld.lunarHoliday.type,
          isPublicHoliday: ld.lunarHoliday.isPublicHoliday,
          description: ld.lunarHoliday.description || undefined,
          year,
        })),
      ];

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
      const fixedHolidays = await this.prisma.holiday.findMany({
        where: {
          month,
          OR: [
            { isRecurring: true },
            {
              AND: [
                { startYear: { lte: year } },
                {
                  OR: [
                    { endYear: null },
                    { endYear: { gte: year } }
                  ]
                }
              ]
            }
          ],
        },
        orderBy: { day: 'asc' },
      });

      const lunarDates = await this.prisma.calculatedLunarDate.findMany({
        where: { year, month },
        include: { lunarHoliday: true },
        orderBy: { day: 'asc' },
      });

      const holidays: Holiday[] = [
        ...fixedHolidays.map((h) => new Holiday({
          month: h.month,
          day: h.day,
          nameKh: h.nameKh,
          nameEn: h.nameEn,
          type: h.type,
          isPublicHoliday: h.isPublicHoliday,
          description: h.description || undefined,
          year,
        })),
        ...lunarDates.map((ld) => new Holiday({
          month: ld.month,
          day: ld.day,
          nameKh: ld.lunarHoliday.nameKh,
          nameEn: ld.lunarHoliday.nameEn,
          type: ld.lunarHoliday.type,
          isPublicHoliday: ld.lunarHoliday.isPublicHoliday,
          description: ld.lunarHoliday.description || undefined,
          year,
        })),
      ];

      holidays.sort((a, b) => a.day - b.day);

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
      const allHolidays = await this.findAll(year);
      const publicHolidays = allHolidays.filter((h) => h.isPublicHoliday);
      
      await this.setCached(cacheKey, publicHolidays);
      return publicHolidays;
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
      const allHolidays = await this.findAll(year);
      const religiousHolidays = allHolidays.filter(
        (h) => h.type === 'religious' || h.type === 'holy'
      );
      
      await this.setCached(cacheKey, religiousHolidays);
      return religiousHolidays;
    } catch (error) {
      logger.error('Error finding religious holidays:', error);
      throw new Error('Failed to fetch religious holidays');
    }
  }
}

