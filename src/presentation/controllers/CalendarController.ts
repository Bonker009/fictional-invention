import { Request, Response, NextFunction } from 'express';
import { GetCurrentDateUseCase } from '../../application/use-cases/GetCurrentDateUseCase';
import { ConvertDateUseCase } from '../../application/use-cases/ConvertDateUseCase';
import { KhmerCalendarService } from '../../domain/services/KhmerCalendarService';
import { logger } from '../../infrastructure/logging/logger';

export class CalendarController {
  constructor(
    private getCurrentDateUseCase: GetCurrentDateUseCase,
    private convertDateUseCase: ConvertDateUseCase
  ) {}

  getCurrentDate = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.info('Getting current date');
      const result = await this.getCurrentDateUseCase.execute();

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error getting current date:', error);
      next(error);
    }
  };

  convertDate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const date = (req.query.date || req.body.date) as string;

      if (!date) {
        res.status(400).json({
          success: false,
          error: 'Date parameter is required (format: YYYY-MM-DD)',
        });
        return;
      }

      logger.info(`Converting date: ${date}`);
      const result = await this.convertDateUseCase.execute({ date });

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      logger.error('Error converting date:', error);
      next(error);
    }
  };

  getMonths = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.debug('Getting Khmer months');
      const months = KhmerCalendarService.getKhmerMonths();

      res.json({
        success: true,
        data: months,
      });
    } catch (error) {
      logger.error('Error getting months:', error);
      next(error);
    }
  };

  getDays = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      logger.debug('Getting Khmer days');
      const days = KhmerCalendarService.getKhmerDays();

      res.json({
        success: true,
        data: days,
      });
    } catch (error) {
      logger.error('Error getting days:', error);
      next(error);
    }
  };

  convertToBuddhistEra = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = parseInt(req.params.year);

      if (isNaN(year)) {
        res.status(400).json({
          success: false,
          error: 'Invalid year parameter',
        });
        return;
      }

      logger.debug(`Converting year ${year} to Buddhist Era`);
      const buddhistEra = KhmerCalendarService.toBuddhistEra(year);

      res.json({
        success: true,
        data: {
          gregorian: year,
          buddhistEra,
          difference: 543,
        },
      });
    } catch (error) {
      logger.error('Error converting to Buddhist Era:', error);
      next(error);
    }
  };

  convertFromBuddhistEra = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const beYear = parseInt(req.params.beYear);

      if (isNaN(beYear)) {
        res.status(400).json({
          success: false,
          error: 'Invalid Buddhist Era year parameter',
        });
        return;
      }

      logger.debug(`Converting Buddhist Era ${beYear} to Gregorian`);
      const gregorian = KhmerCalendarService.fromBuddhistEra(beYear);

      res.json({
        success: true,
        data: {
          buddhistEra: beYear,
          gregorian,
          difference: 543,
        },
      });
    } catch (error) {
      logger.error('Error converting from Buddhist Era:', error);
      next(error);
    }
  };
}

