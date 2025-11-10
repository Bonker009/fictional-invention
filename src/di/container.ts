import { PostgresHolidayRepository } from '../infrastructure/repositories/PostgresHolidayRepository';
import { GetCurrentDateUseCase } from '../application/use-cases/GetCurrentDateUseCase';
import { ConvertDateUseCase } from '../application/use-cases/ConvertDateUseCase';
import { GetHolidaysUseCase } from '../application/use-cases/GetHolidaysUseCase';
import { CheckHolidayUseCase } from '../application/use-cases/CheckHolidayUseCase';
import { CalendarController } from '../presentation/controllers/CalendarController';
import { HolidayController } from '../presentation/controllers/HolidayController';
import { getRedisCache, RedisCache } from '../infrastructure/cache/RedisCache';
import { testConnection, closePool } from '../infrastructure/database/pool';
import { logger } from '../infrastructure/logging/logger';

export class DIContainer {
  private cache: RedisCache | null = null;
  private holidayRepository: PostgresHolidayRepository;
  private getCurrentDateUseCase: GetCurrentDateUseCase;
  private convertDateUseCase: ConvertDateUseCase;
  private getHolidaysUseCase: GetHolidaysUseCase;
  private checkHolidayUseCase: CheckHolidayUseCase;
  public calendarController: CalendarController;
  public holidayController: HolidayController;

  constructor() {
    // Initialize cache if enabled
    if (process.env.ENABLE_CACHE === 'true') {
      this.cache = getRedisCache();
      logger.info('Cache enabled');
    } else {
      logger.info('Cache disabled');
    }

    // Initialize repository with cache
    this.holidayRepository = new PostgresHolidayRepository(this.cache || undefined);

    // Initialize use cases
    this.getCurrentDateUseCase = new GetCurrentDateUseCase(this.holidayRepository);
    this.convertDateUseCase = new ConvertDateUseCase(this.holidayRepository);
    this.getHolidaysUseCase = new GetHolidaysUseCase(this.holidayRepository);
    this.checkHolidayUseCase = new CheckHolidayUseCase(this.holidayRepository);

    // Initialize controllers
    this.calendarController = new CalendarController(
      this.getCurrentDateUseCase,
      this.convertDateUseCase
    );
    this.holidayController = new HolidayController(
      this.getHolidaysUseCase,
      this.checkHolidayUseCase
    );
  }

  async initialize(): Promise<void> {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Failed to connect to database');
    }
    
    // Initialize cache if enabled
    if (this.cache) {
      await this.cache.connect();
    }
  }

  async cleanup(): Promise<void> {
    // Close database pool
    await closePool();
    
    // Disconnect cache
    if (this.cache) {
      await this.cache.disconnect();
    }
  }

  getDependencies() {
    return {
      calendarController: this.calendarController,
      holidayController: this.holidayController,
      getCurrentDateUseCase: this.getCurrentDateUseCase,
      convertDateUseCase: this.convertDateUseCase,
      getHolidaysUseCase: this.getHolidaysUseCase,
      checkHolidayUseCase: this.checkHolidayUseCase,
    };
  }
}

