import { PrismaClient } from '@prisma/client';
import { logger } from '../logging/logger';

let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'stdout' },
        { level: 'warn', emit: 'stdout' },
      ],
    });

    // Log queries in development
    if (process.env.NODE_ENV === 'development') {
      prisma.$on('query' as never, (e: any) => {
        logger.debug('Query: ' + e.query);
        logger.debug('Duration: ' + e.duration + 'ms');
      });
    }

    // Handle shutdown gracefully
    process.on('beforeExit', async () => {
      await prisma.$disconnect();
    });
  }

  return prisma;
};

export const disconnectPrisma = async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
};

