import { GetCurrentDateUseCase } from '../../application/use-cases/GetCurrentDateUseCase';
import { ConvertDateUseCase } from '../../application/use-cases/ConvertDateUseCase';
import { GetHolidaysUseCase } from '../../application/use-cases/GetHolidaysUseCase';
import { CheckHolidayUseCase } from '../../application/use-cases/CheckHolidayUseCase';
import { KhmerCalendarService } from '../../domain/services/KhmerCalendarService';

export interface GraphQLContext {
  getCurrentDateUseCase: GetCurrentDateUseCase;
  convertDateUseCase: ConvertDateUseCase;
  getHolidaysUseCase: GetHolidaysUseCase;
  checkHolidayUseCase: CheckHolidayUseCase;
}

export const createResolvers = (context: GraphQLContext) => {
  return {
    currentDate: async () => {
      return await context.getCurrentDateUseCase.execute();
    },

    convertDate: async ({ date }: { date: string }) => {
      return await context.convertDateUseCase.execute({ date });
    },

    khmerMonths: () => {
      return KhmerCalendarService.getKhmerMonths();
    },

    khmerDays: () => {
      return KhmerCalendarService.getKhmerDays();
    },

    buddhistEra: ({ year }: { year: number }) => {
      const buddhistEra = KhmerCalendarService.toBuddhistEra(year);
      return {
        gregorian: year,
        buddhistEra,
        difference: 543,
      };
    },

    gregorianYear: ({ beYear }: { beYear: number }) => {
      const gregorian = KhmerCalendarService.fromBuddhistEra(beYear);
      return {
        gregorian,
        buddhistEra: beYear,
        difference: 543,
      };
    },

    holidays: async ({
      year,
      type,
    }: {
      year?: number;
      type?: 'all' | 'public' | 'religious';
    }) => {
      return await context.getHolidaysUseCase.getByYear({ year, type: type || 'all' });
    },

    holidaysByMonth: async ({ year, month }: { year?: number; month?: number }) => {
      return await context.getHolidaysUseCase.getByMonth({ year, month });
    },

    holidaysByDate: async ({ date }: { date: string }) => {
      return await context.getHolidaysUseCase.getByDate(date);
    },

    upcomingHolidays: async ({ limit }: { limit?: number }) => {
      const result = await context.getHolidaysUseCase.getUpcoming(limit || 10);
      return result.holidays;
    },

    checkHoliday: async ({ date }: { date: string }) => {
      return await context.checkHolidayUseCase.execute({ date });
    },

    publicHolidays: async ({ year }: { year?: number }) => {
      return await context.getHolidaysUseCase.getByYear({ year, type: 'public' });
    },

    religiousHolidays: async ({ year }: { year?: number }) => {
      return await context.getHolidaysUseCase.getByYear({ year, type: 'religious' });
    },

    bulkHolidays: async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
      return await context.getHolidaysUseCase.getByDateRange(startDate, endDate);
    },
  };
};

