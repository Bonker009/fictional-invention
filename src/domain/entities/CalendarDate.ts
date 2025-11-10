export class CalendarDate {
  private readonly year: number;
  private readonly month: number;
  private readonly day: number;
  private readonly date: Date;

  constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.date = new Date(year, month - 1, day);
  }

  static fromDate(date: Date): CalendarDate {
    return new CalendarDate(date.getFullYear(), date.getMonth() + 1, date.getDate());
  }

  static fromString(dateString: string): CalendarDate {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string');
    }
    return CalendarDate.fromDate(date);
  }

  getYear(): number {
    return this.year;
  }

  getMonth(): number {
    return this.month;
  }

  getDay(): number {
    return this.day;
  }

  getDayOfWeek(): number {
    return this.date.getDay();
  }

  toDate(): Date {
    return new Date(this.date);
  }

  toString(): string {
    const year = this.year.toString().padStart(4, '0');
    const month = this.month.toString().padStart(2, '0');
    const day = this.day.toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  equals(other: CalendarDate): boolean {
    return (
      this.year === other.year && this.month === other.month && this.day === other.day
    );
  }

  isBefore(other: CalendarDate): boolean {
    return this.date < other.toDate();
  }

  isAfter(other: CalendarDate): boolean {
    return this.date > other.toDate();
  }

  addDays(days: number): CalendarDate {
    const newDate = new Date(this.date);
    newDate.setDate(newDate.getDate() + days);
    return CalendarDate.fromDate(newDate);
  }

  addMonths(months: number): CalendarDate {
    const newDate = new Date(this.date);
    newDate.setMonth(newDate.getMonth() + months);
    return CalendarDate.fromDate(newDate);
  }

  addYears(years: number): CalendarDate {
    const newDate = new Date(this.date);
    newDate.setFullYear(newDate.getFullYear() + years);
    return CalendarDate.fromDate(newDate);
  }
}

