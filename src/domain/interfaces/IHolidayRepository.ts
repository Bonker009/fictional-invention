import { Holiday } from '../entities/Holiday';

export interface IHolidayRepository {
  findAll(year: number): Promise<Holiday[]>;
  findByDate(month: number, day: number, year: number): Promise<Holiday[]>;
  findByMonth(month: number, year: number): Promise<Holiday[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Holiday[]>;
  findUpcoming(limit: number, fromDate?: Date): Promise<Holiday[]>;
  findPublicHolidays(year: number): Promise<Holiday[]>;
  findReligiousHolidays(year: number): Promise<Holiday[]>;
}

