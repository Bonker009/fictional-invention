import { Request, Response, NextFunction } from 'express';
import { GetHolidaysUseCase } from '../../application/use-cases/GetHolidaysUseCase';
import { CheckHolidayUseCase } from '../../application/use-cases/CheckHolidayUseCase';
import { logger } from '../../infrastructure/logging/logger';

export class HolidayController {
  constructor(
    private getHolidaysUseCase: GetHolidaysUseCase,
    private checkHolidayUseCase: CheckHolidayUseCase
  ) {}

  getAllHolidays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const type = (req.query.type as 'all' | 'public' | 'religious') || 'all';

      logger.info(`Getting all holidays for year ${year || 'current'}, type: ${type}`);
      const result = await this.getHolidaysUseCase.getByYear({ year, type });

      res.json({
        success: true,
        ...result,
        data: result.holidays,
      });
    } catch (error) {
      logger.error('Error getting all holidays:', error);
      next(error);
    }
  };

  getHolidaysByMonth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;
      const month = req.query.month ? parseInt(req.query.month as string) : undefined;

      logger.info(`Getting holidays for year ${year || 'current'}, month ${month || 'current'}`);
      const result = await this.getHolidaysUseCase.getByMonth({ year, month });

      res.json({
        success: true,
        ...result,
        data: result.holidays,
      });
    } catch (error) {
      logger.error('Error getting holidays by month:', error);
      next(error);
    }
  };

  getHolidaysByDate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const date = req.query.date as string;

      if (!date) {
        res.status(400).json({
          success: false,
          error: 'Date parameter is required (format: YYYY-MM-DD)',
        });
        return;
      }

      logger.info(`Getting holidays for date ${date}`);
      const holidays = await this.getHolidaysUseCase.getByDate(date);

      res.json({
        success: true,
        date,
        isHoliday: holidays.length > 0,
        count: holidays.length,
        data: holidays,
      });
    } catch (error) {
      logger.error('Error getting holidays by date:', error);
      next(error);
    }
  };

  getUpcomingHolidays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      logger.info(`Getting upcoming holidays with limit ${limit}`);
      const result = await this.getHolidaysUseCase.getUpcoming(limit);

      res.json({
        success: true,
        ...result,
        data: result.holidays,
      });
    } catch (error) {
      logger.error('Error getting upcoming holidays:', error);
      next(error);
    }
  };

  checkHoliday = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const date = req.query.date as string;

      if (!date) {
        res.status(400).json({
          success: false,
          error: 'Date parameter is required (format: YYYY-MM-DD)',
        });
        return;
      }

      logger.info(`Checking if ${date} is a holiday`);
      const result = await this.checkHolidayUseCase.execute({ date });

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      logger.error('Error checking holiday:', error);
      next(error);
    }
  };

  getPublicHolidays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;

      logger.info(`Getting public holidays for year ${year || 'current'}`);
      const result = await this.getHolidaysUseCase.getByYear({ year, type: 'public' });

      res.json({
        success: true,
        ...result,
        data: result.holidays,
      });
    } catch (error) {
      logger.error('Error getting public holidays:', error);
      next(error);
    }
  };

  getReligiousHolidays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const year = req.query.year ? parseInt(req.query.year as string) : undefined;

      logger.info(`Getting religious holidays for year ${year || 'current'}`);
      const result = await this.getHolidaysUseCase.getByYear({ year, type: 'religious' });

      res.json({
        success: true,
        ...result,
        data: result.holidays,
      });
    } catch (error) {
      logger.error('Error getting religious holidays:', error);
      next(error);
    }
  };

  getBulkHolidays = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'startDate and endDate parameters are required (format: YYYY-MM-DD)',
        });
        return;
      }

      logger.info(`Getting bulk holidays from ${startDate} to ${endDate}`);
      const holidays = await this.getHolidaysUseCase.getByDateRange(
        startDate as string,
        endDate as string
      );

      res.json({
        success: true,
        startDate,
        endDate,
        total: holidays.length,
        data: holidays,
      });
    } catch (error) {
      logger.error('Error getting bulk holidays:', error);
      next(error);
    }
  };
}

