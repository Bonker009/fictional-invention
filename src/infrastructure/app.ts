import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { graphqlHTTP } from 'express-graphql';
import { createCalendarRoutes } from './routes/v1/calendarRoutes';
import { createHolidayRoutes } from './routes/v1/holidayRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter } from './middleware/rateLimiter';
import { setupSwagger } from './swagger/swagger';
import { schema } from './graphql/schema';
import { createResolvers } from './graphql/resolvers';
import { logger } from './logging/logger';
import { DIContainer } from '../di/container';
import { getPrismaClient } from './database/prisma';

export async function createApp(): Promise<Express> {
  const app = express();
  
  // Initialize DI Container
  const container = new DIContainer();
  await container.initialize();
  logger.info('DI Container initialized');

  const dependencies = container.getDependencies();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disable for Swagger UI
    crossOriginEmbedderPolicy: false,
  }));

  // CORS configuration
  const corsOptions = {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
  };
  app.use(cors(corsOptions));

  // Compression middleware
  app.use(compression({
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    },
    threshold: 1024, // Only compress responses larger than 1KB
  }));

  // Request logging
  app.use(requestLogger);

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ETag support (built into Express)
  app.set('etag', 'strong');

  // Rate limiting
  app.use('/api', apiLimiter);

  // Root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Welcome to Cambodia Khmer Calendar API v2.0',
      version: '2.0.0',
      description: 'National API for Cambodia holidays, holy days, and Khmer calendar',
      architecture: 'Clean Architecture with TypeScript',
      database: 'PostgreSQL with Prisma ORM',
      cache: 'Redis',
      baseUrl: `${req.protocol}://${req.get('host')}`,
      documentation: {
        swagger: `${req.protocol}://${req.get('host')}/api-docs`,
        graphql: `${req.protocol}://${req.get('host')}/graphql`,
      },
      endpoints: {
        rest: {
          v1: `${req.protocol}://${req.get('host')}/api/v1`,
          health: `${req.protocol}://${req.get('host')}/api/v1/health`,
        },
        graphql: `${req.protocol}://${req.get('host')}/graphql`,
      },
      features: [
        'TypeScript with strict type checking',
        'PostgreSQL database with Prisma ORM',
        'Redis caching for performance',
        'RESTful API with versioning (v1)',
        'GraphQL alternative endpoint',
        'Swagger/OpenAPI documentation',
        'Comprehensive Khmer calendar conversions',
        'Buddhist Era date calculations',
        'Complete Cambodia public holidays',
        'Religious and holy day observances',
        'Lunar calendar calculations',
        'Bulk operations support',
        'Rate limiting and security',
        'Request compression',
        'ETag caching support',
        'Structured logging',
      ],
    });
  });

  // Health check endpoint
  app.get('/api/v1/health', async (_req: Request, res: Response) => {
    try {
      // Check database connection
      await getPrismaClient().$queryRaw`SELECT 1`;
      const dbStatus = 'healthy';

      // Check Redis if enabled
      let cacheStatus = 'disabled';
      if (process.env.ENABLE_CACHE === 'true') {
        cacheStatus = 'healthy';
      }

      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'Khmer Calendar API',
        version: '2.0.0',
        architecture: 'Clean Architecture',
        database: dbStatus,
        cache: cacheStatus,
        uptime: process.uptime(),
      });
    } catch (error) {
      logger.error('Health check failed:', error);
      res.status(503).json({
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: 'Service unavailable',
      });
    }
  });

  // API v1 Routes
  const apiVersion = process.env.API_VERSION || 'v1';
  app.use(`/api/${apiVersion}`, createCalendarRoutes(dependencies.calendarController));
  app.use(`/api/${apiVersion}/holidays`, createHolidayRoutes(dependencies.holidayController));

  // GraphQL endpoint
  app.use(
    '/graphql',
    graphqlHTTP({
      schema,
      rootValue: createResolvers({
        getCurrentDateUseCase: dependencies.getCurrentDateUseCase,
        convertDateUseCase: dependencies.convertDateUseCase,
        getHolidaysUseCase: dependencies.getHolidaysUseCase,
        checkHolidayUseCase: dependencies.checkHolidayUseCase,
      }),
      graphiql: process.env.NODE_ENV === 'development',
    })
  );

  // Swagger documentation
  setupSwagger(app);

  // 404 handler
  app.use(notFoundHandler);

  // Error handler (must be last)
  app.use(errorHandler);

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    await container.cleanup();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received: closing HTTP server');
    await container.cleanup();
    process.exit(0);
  });

  return app;
}

