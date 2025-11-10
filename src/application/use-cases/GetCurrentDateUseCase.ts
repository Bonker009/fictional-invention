import { CalendarDate } from '../../domain/entities/CalendarDate';
import { KhmerCalendarService } from '../../domain/services/KhmerCalendarService';
import { KhmerLunarCalendarService, KhmerLunarDate } from '../../domain/services/KhmerLunarCalendarService';
import { IHolidayRepository } from '../../domain/interfaces/IHolidayRepository';
import { Holiday } from '../../domain/entities/Holiday';

export interface CurrentDateResult {
  gregorian: {
    year: number;
    month: number;
    day: number;
    dayName: string;
  };
  holidays: Holiday[] | null;
  isHoliday: boolean;
  lunarDate: KhmerLunarDate;
}

export class GetCurrentDateUseCase {
  constructor(private holidayRepository: IHolidayRepository) {}

  async execute(): Promise<CurrentDateResult> {
    const now = new Date();
    const calendarDate = CalendarDate.fromDate(now);
    const formattedDate = KhmerCalendarService.formatKhmerDate(calendarDate);

    // Check if today is a holiday
    const holidays = await this.holidayRepository.findByDate(
      now.getMonth() + 1,
      now.getDate(),
      now.getFullYear()
    );

    // Get lunar calendar information
    const lunarDate = KhmerLunarCalendarService.getKhmerLunarDate(now);

    return {
      gregorian: formattedDate.gregorian,
      holidays: holidays.length > 0 ? holidays : null,
      isHoliday: holidays.length > 0,
      lunarDate,
    };
  }
}

