import { IHolidayRepository } from '../../domain/interfaces/IHolidayRepository';
import { Holiday } from '../../domain/entities/Holiday';
import { KhmerCalendarService } from '../../domain/services/KhmerCalendarService';

export interface GetHolidaysInput {
  year?: number;
  month?: number;
  date?: string;
  limit?: number;
  type?: 'all' | 'public' | 'religious';
}

export interface GetHolidaysResult {
  holidays: Holiday[];
  year: number;
  buddhistEra: number;
  month?: number;
  monthName?: string;
  total: number;
  publicHolidays?: number;
}

export interface GetUpcomingHolidaysResult {
  holidays: Holiday[];
  limit: number;
  count: number;
}

export class GetHolidaysUseCase {
  constructor(private holidayRepository: IHolidayRepository) {}

  async getByYear(input: GetHolidaysInput): Promise<GetHolidaysResult> {
    const year = input.year || new Date().getFullYear();
    const buddhistEra = KhmerCalendarService.toBuddhistEra(year);

    let holidays: Holiday[];

    if (input.type === 'public') {
      holidays = await this.holidayRepository.findPublicHolidays(year);
    } else if (input.type === 'religious') {
      holidays = await this.holidayRepository.findReligiousHolidays(year);
    } else {
      holidays = await this.holidayRepository.findAll(year);
    }

    const publicHolidaysCount = holidays.filter((h) => h.isPublicHoliday).length;

    return {
      holidays,
      year,
      buddhistEra,
      total: holidays.length,
      publicHolidays: publicHolidaysCount,
    };
  }

  async getByMonth(input: GetHolidaysInput): Promise<GetHolidaysResult> {
    const year = input.year || new Date().getFullYear();
    const month = input.month || new Date().getMonth() + 1;

    if (month < 1 || month > 12) {
      throw new Error('Month must be between 1 and 12');
    }

    const holidays = await this.holidayRepository.findByMonth(month, year);
    const buddhistEra = KhmerCalendarService.toBuddhistEra(year);
    const monthName = KhmerCalendarService.getMonthName(month);

    return {
      holidays,
      year,
      buddhistEra,
      month,
      monthName,
      total: holidays.length,
    };
  }

  async getByDate(dateString: string): Promise<Holiday[]> {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return await this.holidayRepository.findByDate(month, day, year);
  }

  async getUpcoming(limit: number = 10): Promise<GetUpcomingHolidaysResult> {
    if (limit < 1) {
      throw new Error('Limit must be greater than 0');
    }
    if (limit > 100) {
      throw new Error('Limit cannot exceed 100');
    }

    const holidays = await this.holidayRepository.findUpcoming(limit);

    return {
      holidays,
      limit,
      count: holidays.length,
    };
  }

  async getByDateRange(startDate: string, endDate: string): Promise<Holiday[]> {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    if (start > end) {
      throw new Error('Start date must be before end date');
    }

    return await this.holidayRepository.findByDateRange(start, end);
  }
}

