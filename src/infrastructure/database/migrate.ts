import { promises as fs } from 'fs';
import { join } from 'path';
import { pool } from './pool';
import { logger } from '../logging/logger';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  try {
    logger.info('Starting database migrations...');
    
    // Read the schema file
    const schemaPath = join(__dirname, 'schema.sql');
    const schema = await fs.readFile(schemaPath, 'utf-8');
    
    // Execute the schema
    await pool.query(schema);
    
    logger.info('Database migrations completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed', { error });
    process.exit(1);
  }
}

runMigrations();

