# Setup Instructions

Complete setup guide for the Cambodia Khmer Calendar API v2.0

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm ([Download](https://nodejs.org/))
- **Docker** and **Docker Compose** ([Download](https://www.docker.com/get-started))
- **Git** ([Download](https://git-scm.com/))

**Optional** (for local development without Docker):
- **PostgreSQL** 16+ ([Download](https://www.postgresql.org/download/))
- **Redis** 7+ ([Download](https://redis.io/download))

## Installation Methods

Choose one of the following methods:

### Method 1: Docker Compose (Recommended for Production)

This method sets up everything (API, PostgreSQL, Redis) with one command.

```bash
# 1. Clone the repository
git clone <repository-url>
cd khmer-calendar

# 2. Start all services
docker-compose up -d

# 3. Check service status
docker-compose ps

# 4. View logs
docker-compose logs -f khmer-calendar-api

# 5. API is ready!
# REST API: http://localhost:3002/api/v1
# GraphQL: http://localhost:3002/graphql
# Swagger: http://localhost:3002/api-docs
```

**That's it!** The API is now running with all dependencies.

To stop the services:

```bash
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

---

### Method 2: Docker Compose Development Mode

This method is for active development with hot-reload.

```bash
# 1. Clone the repository
git clone <repository-url>
cd khmer-calendar

# 2. Install dependencies locally (for IDE support)
npm install

# 3. Start development environment
docker-compose -f docker-compose.dev.yml up -d

# 4. View logs with hot-reload
docker-compose -f docker-compose.dev.yml logs -f khmer-calendar-api

# 5. API runs on port 3003
# REST API: http://localhost:3003/api/v1
# GraphQL: http://localhost:3003/graphql
```

Any changes to `src/` files will automatically restart the server.

---

### Method 3: Local Development (No Docker)

This method runs everything locally.

#### Step 1: Install PostgreSQL

##### On macOS (using Homebrew):
```bash
brew install postgresql@16
brew services start postgresql@16
createdb khmer_calendar
```

##### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb khmer_calendar
```

##### On Windows:
Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

#### Step 2: Install Redis

##### On macOS:
```bash
brew install redis
brew services start redis
```

##### On Ubuntu/Debian:
```bash
sudo apt install redis-server
sudo systemctl start redis
```

##### On Windows:
Use Windows Subsystem for Linux (WSL) or download from [Redis Downloads](https://redis.io/download)

#### Step 3: Set Up the Application

```bash
# 1. Clone the repository
git clone <repository-url>
cd khmer-calendar

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your configuration
# Update DATABASE_URL with your PostgreSQL credentials
# Example: DATABASE_URL="postgresql://your_user:your_password@localhost:5432/khmer_calendar"
nano .env  # or use your preferred editor

# 5. Generate Prisma Client
npm run prisma:generate

# 6. Run database migrations
npm run prisma:migrate

# 7. Seed the database
npm run prisma:seed

# 8. Build TypeScript
npm run build

# 9. Start the server
npm start

# Or for development with hot-reload:
npm run dev
```

The API will be available at:
- REST API: `http://localhost:3002/api/v1`
- GraphQL: `http://localhost:3002/graphql`
- Swagger: `http://localhost:3002/api-docs`

---

## Verification

After installation, verify everything is working:

### 1. Health Check

```bash
curl http://localhost:3002/api/v1/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-11-09T...",
  "service": "Khmer Calendar API",
  "version": "2.0.0",
  "database": "healthy",
  "cache": "healthy",
  "uptime": 123.45
}
```

### 2. Test Calendar Endpoint

```bash
curl http://localhost:3002/api/v1/current
```

### 3. Test Holidays Endpoint

```bash
curl http://localhost:3002/api/v1/holidays?year=2024
```

### 4. Test GraphQL

```bash
curl -X POST http://localhost:3002/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ currentDate { formatted { khmer english } } }"}'
```

### 5. Open Swagger UI

Navigate to `http://localhost:3002/api-docs` in your browser.

---

## Configuration

### Environment Variables

The `.env` file controls the application configuration:

```env
# Application Settings
NODE_ENV=production        # or 'development'
PORT=3002                  # API port

# Database Connection
DATABASE_URL="postgresql://khmer_user:khmer_password@localhost:5432/khmer_calendar"

# Redis Configuration
REDIS_HOST=localhost       # Redis hostname
REDIS_PORT=6379           # Redis port
REDIS_PASSWORD=           # Leave empty if no password
REDIS_DB=0                # Redis database number

# Cache Settings
CACHE_TTL=3600            # Cache duration in seconds (1 hour)
ENABLE_CACHE=true         # Enable/disable caching

# API Configuration
API_VERSION=v1            # API version prefix

# Security
RATE_LIMIT_WINDOW_MS=900000    # Rate limit window (15 minutes)
RATE_LIMIT_MAX_REQUESTS=100    # Max requests per window
CORS_ORIGIN=*                  # CORS allowed origins (* = all)

# Logging
LOG_LEVEL=info            # Logging level (error, warn, info, debug)
```

### Docker Compose Configuration

Edit `docker-compose.yml` to customize:

- Port mappings
- Environment variables
- Volume mounts
- Resource limits

```yaml
services:
  khmer-calendar-api:
    ports:
      - "3002:3002"  # Change host port here
    environment:
      - PORT=3002
      # Add more environment variables
```

---

## Database Management

### View Database with Prisma Studio

```bash
# Using npm
npm run prisma:studio

# Using Docker
docker-compose exec khmer-calendar-api npm run prisma:studio
```

Opens a GUI at `http://localhost:5555` to view and edit data.

### Reset Database

```bash
# WARNING: This deletes all data!

# Using npm
npm run prisma:migrate -- reset
npm run prisma:seed

# Using Docker
docker-compose exec khmer-calendar-api npm run prisma:migrate -- reset
docker-compose exec khmer-calendar-api npm run prisma:seed
```

### Backup Database

```bash
# PostgreSQL dump
docker-compose exec postgres pg_dump -U khmer_user khmer_calendar > backup.sql

# Restore from backup
docker-compose exec -T postgres psql -U khmer_user khmer_calendar < backup.sql
```

---

## Troubleshooting

### Port Already in Use

```bash
# Change port in .env
PORT=3004

# Or change in docker-compose.yml
ports:
  - "3004:3002"
```

### Database Connection Refused

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Redis Connection Failed

```bash
# Check Redis is running
docker-compose ps redis

# Test connection
docker-compose exec redis redis-cli ping
# Should return: PONG
```

### Build Errors

```bash
# Clean build
npm run prebuild  # Removes dist/
npm run build

# Or with Docker
docker-compose build --no-cache khmer-calendar-api
```

### Missing Dependencies

```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install

# Or rebuild Docker image
docker-compose build --no-cache
```

### Permission Errors (Linux/macOS)

```bash
# Fix ownership
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended)
sudo docker-compose up -d
```

---

## Next Steps

After successful installation:

1. **Read the Documentation**: Check `README.md` for API usage examples
2. **Explore Swagger**: Visit `/api-docs` for interactive API documentation
3. **Try GraphQL**: Use `/graphql` playground to test queries
4. **Check Logs**: Monitor application logs for any issues
5. **Configure Monitoring**: Set up logging and monitoring for production
6. **Set Up CI/CD**: Configure automated deployments

---

## Production Deployment

For production deployment:

### Security Checklist

- [ ] Change default database passwords
- [ ] Set strong Redis password
- [ ] Configure specific CORS origins (not `*`)
- [ ] Use environment-specific `.env` files
- [ ] Enable HTTPS/TLS
- [ ] Configure rate limiting appropriately
- [ ] Set up monitoring and alerting
- [ ] Regular database backups
- [ ] Keep dependencies updated

### Docker Production Setup

```bash
# Use production docker-compose
docker-compose -f docker-compose.yml up -d

# Or build with specific tag
docker-compose build --no-cache
docker tag khmer-calendar-api:latest your-registry/khmer-calendar-api:2.0.0
docker push your-registry/khmer-calendar-api:2.0.0
```

### Environment Variables for Production

```env
NODE_ENV=production
LOG_LEVEL=warn
ENABLE_CACHE=true
CACHE_TTL=7200
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_MAX_REQUESTS=1000
```

---

## Support

For issues or questions:

1. Check `MIGRATION_GUIDE.md` if upgrading from v1.0
2. Review `README.md` for general documentation
3. Check existing GitHub issues
4. Create a new issue with details

---

**Happy Coding!** 🚀

