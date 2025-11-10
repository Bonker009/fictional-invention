import { CalendarDate } from '../entities/CalendarDate';

export interface KhmerMonth {
  index: number;
  khmer: string;
  english: string;
}

export interface KhmerDay {
  index: number;
  khmer: string;
  english: string;
}

export interface FormattedDate {
  gregorian: {
    year: number;
    month: number;
    day: number;
    dayName: string;
  };
  formatted: {
    khmer: string;
    english: string;
  };
}

export class KhmerCalendarService {
  private static readonly BUDDHIST_ERA_OFFSET = 543;

  private static readonly KHMER_MONTHS: string[] = [
    'មករា', // January
    'កុម្ភៈ', // February
    'មីនា', // March
    'មេសា', // April
    'ឧសភា', // May
    'មិថុនា', // June
    'កក្កដា', // July
    'សីហា', // August
    'កញ្ញា', // September
    'តុលា', // October
    'វិច្ឆិកា', // November
    'ធ្នូ', // December
  ];

  private static readonly ENGLISH_MONTHS: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  private static readonly KHMER_DAYS: string[] = [
    'ថ្ងៃអាទិត្យ', // Sunday
    'ថ្ងៃច័ន្ទ', // Monday
    'ថ្ងៃអង្គារ', // Tuesday
    'ថ្ងៃពុធ', // Wednesday
    'ថ្ងៃព្រហស្បតិ៍', // Thursday
    'ថ្ងៃសុក្រ', // Friday
    'ថ្ងៃសៅរ៍', // Saturday
  ];

  private static readonly ENGLISH_DAYS: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  static toBuddhistEra(gregorianYear: number): number {
    return gregorianYear + this.BUDDHIST_ERA_OFFSET;
  }

  static fromBuddhistEra(buddhistEraYear: number): number {
    return buddhistEraYear - this.BUDDHIST_ERA_OFFSET;
  }

  static getKhmerMonths(): KhmerMonth[] {
    return this.KHMER_MONTHS.map((khmer, index) => ({
      index: index + 1,
      khmer,
      english: this.ENGLISH_MONTHS[index],
    }));
  }

  static getKhmerDays(): KhmerDay[] {
    return this.KHMER_DAYS.map((khmer, index) => ({
      index,
      khmer,
      english: this.ENGLISH_DAYS[index],
    }));
  }

  static getMonthName(monthIndex: number): string {
    if (monthIndex < 1 || monthIndex > 12) {
      throw new Error(`Invalid month index: ${monthIndex}. Must be between 1 and 12.`);
    }
    return this.KHMER_MONTHS[monthIndex - 1];
  }

  static getDayName(dayIndex: number): string {
    if (dayIndex < 0 || dayIndex > 6) {
      throw new Error(`Invalid day index: ${dayIndex}. Must be between 0 and 6.`);
    }
    return this.KHMER_DAYS[dayIndex];
  }

  static formatKhmerDate(calendarDate: CalendarDate): FormattedDate {
    const year = calendarDate.getYear();
    const month = calendarDate.getMonth();
    const day = calendarDate.getDay();
    const dayOfWeek = calendarDate.getDayOfWeek();

    const dayName = this.getDayName(dayOfWeek);
    const monthName = this.getMonthName(month);
    const buddhistEra = this.toBuddhistEra(year);

    const date = calendarDate.toDate();
    const englishDayName = date.toLocaleDateString('en-US', { weekday: 'long' });

    return {
      gregorian: {
        year,
        month,
        day,
        dayName,
      },
      formatted: {
        khmer: `${dayName} ថ្ងៃទី ${day} ${monthName} ឆ្នាំ ${buddhistEra}`,
        english: `${englishDayName} ${day} ${monthName} ${buddhistEra} BE`,
      },
    };
  }
}

