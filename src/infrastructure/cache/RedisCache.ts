import { createClient, RedisClientType } from 'redis';
import { logger } from '../logging/logger';

export class RedisCache {
  private client: RedisClientType;
  private isConnected: boolean = false;
  private readonly defaultTTL: number;

  constructor(ttl: number = 3600) {
    this.defaultTTL = ttl;
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379');
    
    // Warn if using localhost in production
    if (process.env.NODE_ENV === 'production' && redisHost === 'localhost') {
      logger.warn('⚠️  WARNING: Using localhost for Redis in production! Set REDIS_HOST environment variable.');
    }
    
    logger.info(`Redis configuration: ${redisHost}:${redisPort}`);
    
    this.client = createClient({
      socket: {
        host: redisHost,
        port: redisPort,
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB || '0'),
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('error', (err) => {
      logger.error('Redis Client Error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      logger.info('Redis Client Connected');
      this.isConnected = true;
    });

    this.client.on('disconnect', () => {
      logger.warn('Redis Client Disconnected');
      this.isConnected = false;
    });
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect();
        this.isConnected = true;
        logger.info('Redis connection established');
      } catch (error) {
        logger.error('Failed to connect to Redis:', error);
        throw error;
      }
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis connection closed');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache get');
      return null;
    }

    try {
      const data = await this.client.get(key);
      if (data) {
        logger.debug(`Cache hit: ${key}`);
        return JSON.parse(data) as T;
      }
      logger.debug(`Cache miss: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Redis get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache set');
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      const expiryTime = ttl || this.defaultTTL;
      await this.client.setEx(key, expiryTime, serialized);
      logger.debug(`Cache set: ${key} (TTL: ${expiryTime}s)`);
    } catch (error) {
      logger.error(`Redis set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache delete');
      return;
    }

    try {
      await this.client.del(key);
      logger.debug(`Cache deleted: ${key}`);
    } catch (error) {
      logger.error(`Redis delete error for key ${key}:`, error);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache pattern delete');
      return;
    }

    try {
      const keys = await this.client.keys(pattern);
      if (keys.length > 0) {
        await this.client.del(keys);
        logger.debug(`Cache pattern deleted: ${pattern} (${keys.length} keys)`);
      }
    } catch (error) {
      logger.error(`Redis pattern delete error for pattern ${pattern}:`, error);
    }
  }

  async flush(): Promise<void> {
    if (!this.isConnected) {
      logger.warn('Redis not connected, skipping cache flush');
      return;
    }

    try {
      await this.client.flushDb();
      logger.info('Cache flushed');
    } catch (error) {
      logger.error('Redis flush error:', error);
    }
  }

  isHealthy(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
let cacheInstance: RedisCache | null = null;

export const getRedisCache = (): RedisCache => {
  if (!cacheInstance) {
    const ttl = parseInt(process.env.CACHE_TTL || '3600');
    cacheInstance = new RedisCache(ttl);
  }
  return cacheInstance;
};

