import { IHolidayRepository } from '../../domain/interfaces/IHolidayRepository';

export interface CheckHolidayInput {
  date: string;
}

export interface CheckHolidayResult {
  date: string;
  isHoliday: boolean;
  holidays: Array<{
    nameKh: string;
    nameEn: string;
    type: string;
    isPublicHoliday: boolean;
    description?: string;
  }>;
}

export class CheckHolidayUseCase {
  constructor(private holidayRepository: IHolidayRepository) {}

  async execute(input: CheckHolidayInput): Promise<CheckHolidayResult> {
    if (!input.date) {
      throw new Error('Date is required');
    }

    const date = new Date(input.date);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format. Use YYYY-MM-DD');
    }

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const holidays = await this.holidayRepository.findByDate(month, day, year);

    return {
      date: input.date,
      isHoliday: holidays.length > 0,
      holidays: holidays.map((h) => ({
        nameKh: h.nameKh,
        nameEn: h.nameEn,
        type: h.type,
        isPublicHoliday: h.isPublicHoliday,
        description: h.description,
      })),
    };
  }
}

