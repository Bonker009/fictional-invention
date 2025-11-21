import { IHolidayRepository } from '../../domain/interfaces/IHolidayRepository';
import { Holiday, HolidayData, HolidayType } from '../../domain/entities/Holiday';

export interface CreateHolidayInput {
  month: number;
  day: number;
  nameKh: string;
  nameEn: string;
  type: HolidayType;
  isPublicHoliday: boolean;
  description?: string;
  year?: number;
}

export class CreateHolidayUseCase {
  constructor(private holidayRepository: IHolidayRepository) {}

  async execute(input: CreateHolidayInput): Promise<Holiday> {
    // Validate required fields
    if (!input.month || input.month < 1 || input.month > 12) {
      throw new Error('Month must be between 1 and 12');
    }

    if (!input.day || input.day < 1 || input.day > 31) {
      throw new Error('Day must be between 1 and 31');
    }

    if (!input.nameKh || input.nameKh.trim().length === 0) {
      throw new Error('Khmer name (nameKh) is required');
    }

    if (!input.nameEn || input.nameEn.trim().length === 0) {
      throw new Error('English name (nameEn) is required');
    }

    if (!input.type || !['public', 'religious', 'holy'].includes(input.type)) {
      throw new Error('Type must be one of: public, religious, holy');
    }

    // Validate date if year is provided
    if (input.year) {
      const date = new Date(input.year, input.month - 1, input.day);
      if (
        date.getFullYear() !== input.year ||
        date.getMonth() !== input.month - 1 ||
        date.getDate() !== input.day
      ) {
        throw new Error('Invalid date: the specified day does not exist in the given month and year');
      }
    }

    const holidayData: HolidayData = {
      month: input.month,
      day: input.day,
      nameKh: input.nameKh.trim(),
      nameEn: input.nameEn.trim(),
      type: input.type,
      isPublicHoliday: input.isPublicHoliday,
      description: input.description?.trim(),
      year: input.year,
    };

    return await this.holidayRepository.create(holidayData);
  }
}

