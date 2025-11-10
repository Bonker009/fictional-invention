#!/bin/sh
set -e

echo "Waiting for database to be ready..."
until PGPASSWORD=$DB_PASSWORD psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
  echo "Postgres is unavailable - sleeping"
  sleep 1
done

echo "Database is ready!"

# Run migrations
echo "Running database migrations..."
node dist/infrastructure/database/migrate.js

# Run seed
echo "Seeding database..."
node dist/infrastructure/database/seed.js

# Start application
echo "Starting application..."
exec node dist/server.js

