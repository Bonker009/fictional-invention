export type HolidayType = 'public' | 'religious' | 'holy';

export interface HolidayData {
  month: number;
  day: number;
  nameKh: string;
  nameEn: string;
  type: HolidayType;
  isPublicHoliday: boolean;
  description?: string;
  year?: number;
}

export class Holiday {
  readonly month: number;
  readonly day: number;
  readonly nameKh: string;
  readonly nameEn: string;
  readonly type: HolidayType;
  readonly isPublicHoliday: boolean;
  readonly description?: string;
  readonly year?: number;

  constructor(data: HolidayData) {
    this.month = data.month;
    this.day = data.day;
    this.nameKh = data.nameKh;
    this.nameEn = data.nameEn;
    this.type = data.type;
    this.isPublicHoliday = data.isPublicHoliday;
    this.description = data.description;
    this.year = data.year;
  }

  matchesDate(month: number, day: number): boolean {
    return this.month === month && this.day === day;
  }

  toJSON() {
    return {
      month: this.month,
      day: this.day,
      nameKh: this.nameKh,
      nameEn: this.nameEn,
      type: this.type,
      isPublicHoliday: this.isPublicHoliday,
      description: this.description,
      date: this.year ? `${this.year}-${String(this.month).padStart(2, '0')}-${String(this.day).padStart(2, '0')}` : undefined,
      year: this.year,
      buddhistEra: this.year ? this.year + 543 : undefined,
    };
  }
}

