import 'dotenv/config';
import { createApp } from './infrastructure/app';
import { logger } from './infrastructure/logging/logger';
import { testConnection, closePool } from './infrastructure/database/pool';

const PORT = process.env.PORT || 3002;

async function startServer() {
  try {
    // Test database connection
    logger.info('Testing database connection...');
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Failed to connect to database');
    }
    logger.info('Database connected successfully');

    // Create and start Express app
    const app = await createApp();

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Khmer Calendar API v2.0 server is running on port ${PORT}`);
      logger.info(`📍 REST API: http://localhost:${PORT}/api/v1`);
      logger.info(`📊 GraphQL: http://localhost:${PORT}/graphql`);
      logger.info(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`🏗️  Architecture: Clean Architecture with TypeScript`);
      logger.info(`💾 Database: PostgreSQL with node-postgres`);
      logger.info(`⚡ Cache: Redis ${process.env.ENABLE_CACHE === 'true' ? 'enabled' : 'disabled'}`);
      logger.info(`🔒 Security: Helmet + Rate Limiting enabled`);
      logger.info(`📦 Compression: Enabled`);
      logger.info(`🏷️  ETag Caching: Enabled`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        try {
          await closePool();
          logger.info('Database connection closed');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

