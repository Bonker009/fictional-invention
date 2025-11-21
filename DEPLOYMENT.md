# Deployment Guide

This guide explains how to configure environment variables for deployment.

## ⚠️ Important: Environment Variables

When deploying, you **must** set the correct hostnames for database and Redis connections. The application defaults to `localhost`, which will only work in local development.

## Docker Compose Deployment

If using Docker Compose, the `docker-compose.yml` file already configures the correct service names:

```yaml
environment:
  - DB_HOST=postgres      # Service name in Docker network
  - REDIS_HOST=redis      # Service name in Docker network
```

**No additional configuration needed** - Docker Compose automatically resolves service names.

## External/Cloud Deployment

When deploying to cloud platforms (AWS, Azure, GCP, Heroku, etc.) or using external database/Redis services, you need to set these environment variables:

### Required Environment Variables

```bash
# Database Configuration
DB_HOST=your-database-host.com        # NOT localhost!
DB_PORT=5432
DB_NAME=khmer_calendar
DB_USER=your_db_user
DB_PASSWORD=your_db_password

# Redis Configuration
REDIS_HOST=your-redis-host.com        # NOT localhost!
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password    # If required
REDIS_DB=0

# Application Settings
NODE_ENV=production
PORT=3002
CACHE_TTL=3600
ENABLE_CACHE=true
API_VERSION=v1
```

### Platform-Specific Instructions

#### Heroku
```bash
heroku config:set DB_HOST=your-db-host.herokuapp.com
heroku config:set REDIS_HOST=your-redis-host.herokuapp.com
heroku config:set DB_PASSWORD=your_password
heroku config:set REDIS_PASSWORD=your_redis_password
```

#### AWS (EC2/ECS)
Set environment variables in:
- EC2: `/etc/environment` or use AWS Systems Manager Parameter Store
- ECS: Task Definition → Environment Variables

#### Azure
Set in App Service → Configuration → Application Settings

#### Google Cloud Platform
Set in Cloud Run → Environment Variables or use Secret Manager

#### DigitalOcean
Set in App Platform → Settings → Environment Variables

### Verification

After deployment, check the logs to verify the correct hosts are being used:

```bash
# You should see logs like:
# Database configuration: user@your-db-host.com:5432/khmer_calendar
# Redis configuration: your-redis-host.com:6379
```

If you see `localhost` in production logs, your environment variables are not set correctly!

## Troubleshooting

### Problem: "Connection refused" or "ECONNREFUSED"

**Cause:** Application is trying to connect to `localhost` instead of the actual database/Redis host.

**Solution:**
1. Verify environment variables are set: `echo $DB_HOST` and `echo $REDIS_HOST`
2. Ensure variables are set before the application starts
3. Check that your deployment platform is passing environment variables correctly
4. Restart the application after setting environment variables

### Problem: "Service name not found" (Docker)

**Cause:** Service name doesn't match in `docker-compose.yml`.

**Solution:**
- Ensure service names match exactly: `postgres` and `redis`
- Verify all services are on the same Docker network
- Check `docker-compose.yml` network configuration

### Problem: Database connection works but Redis doesn't (or vice versa)

**Cause:** One environment variable is set correctly, the other isn't.

**Solution:**
- Check both `DB_HOST` and `REDIS_HOST` are set
- Verify both services are accessible from your deployment environment
- Check firewall/security group rules allow connections

## Example .env File (for reference)

```env
# ⚠️ DO NOT use localhost in production!
# Replace with actual hostnames/IPs

NODE_ENV=production
PORT=3002

# Database - Replace with your actual database host
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=khmer_calendar
DB_USER=khmer_user
DB_PASSWORD=your_secure_password

# Redis - Replace with your actual Redis host
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0

# Cache Settings
CACHE_TTL=3600
ENABLE_CACHE=true

# API Settings
API_VERSION=v1

# CORS - Update with your actual frontend URLs
CORS_ORIGIN=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

## Security Best Practices

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use secret management services** - AWS Secrets Manager, Azure Key Vault, etc.
3. **Rotate credentials regularly**
4. **Use strong passwords** for database and Redis
5. **Enable SSL/TLS** for database connections when possible
6. **Restrict network access** - Only allow connections from your application servers

