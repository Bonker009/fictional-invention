import { CalendarDate } from '../../domain/entities/CalendarDate';
import { KhmerCalendarService } from '../../domain/services/KhmerCalendarService';
import { KhmerLunarCalendarService, KhmerLunarDate } from '../../domain/services/KhmerLunarCalendarService';
import { IHolidayRepository } from '../../domain/interfaces/IHolidayRepository';
import { Holiday } from '../../domain/entities/Holiday';

export interface ConvertDateInput {
  date: string;
  includeLunar?: boolean;
}

export interface ConvertDateResult {
  gregorian: {
    year: number;
    month: number;
    day: number;
    dayName: string;
  };
  holidays: Holiday[] | null;
  isHoliday: boolean;
  lunarDate?: KhmerLunarDate;
}

export class ConvertDateUseCase {
  constructor(private holidayRepository: IHolidayRepository) {}

  async execute(input: ConvertDateInput): Promise<ConvertDateResult> {
    if (!input.date) {
      throw new Error('Date is required');
    }

    const calendarDate = CalendarDate.fromString(input.date);
    const formattedDate = KhmerCalendarService.formatKhmerDate(calendarDate);

    // Check if the date is a holiday
    const holidays = await this.holidayRepository.findByDate(
      calendarDate.getMonth(),
      calendarDate.getDay(),
      calendarDate.getYear()
    );

    // Get lunar calendar information if requested
    let lunarDate: KhmerLunarDate | undefined;
    if (input.includeLunar !== false) {
      lunarDate = KhmerLunarCalendarService.getKhmerLunarDate(calendarDate.toDate());
    }

    return {
      gregorian: formattedDate.gregorian,
      holidays: holidays.length > 0 ? holidays : null,
      isHoliday: holidays.length > 0,
      ...(lunarDate && { lunarDate }),
    };
  }
}

