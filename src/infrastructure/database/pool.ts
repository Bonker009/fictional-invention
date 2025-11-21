import { Pool, PoolConfig } from 'pg';
import { logger } from '../logging/logger';

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = parseInt(process.env.DB_PORT || '5432');
const dbName = process.env.DB_NAME || 'khmer_calendar';
const dbUser = process.env.DB_USER || 'khmer_user';
const dbPassword = process.env.DB_PASSWORD || 'khmer_password';

// Warn if using localhost in production
if (process.env.NODE_ENV === 'production' && dbHost === 'localhost') {
  logger.warn('⚠️  WARNING: Using localhost for database in production! Set DB_HOST environment variable.');
}

logger.info(`Database configuration: ${dbUser}@${dbHost}:${dbPort}/${dbName}`);

const poolConfig: PoolConfig = {
  host: dbHost,
  port: dbPort,
  database: dbName,
  user: dbUser,
  password: dbPassword,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
};

export const pool = new Pool(poolConfig);

// Log pool errors
pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', { error: err });
  process.exit(-1);
});

// Test connection
export const testConnection = async (): Promise<boolean> => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    logger.info('Database connection successful', { time: result.rows[0].now });
    return true;
  } catch (error) {
    logger.error('Database connection failed', { error });
    return false;
  }
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  await pool.end();
  logger.info('Database pool closed');
};

