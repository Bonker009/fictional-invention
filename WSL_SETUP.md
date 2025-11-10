# WSL Setup Guide

## Quick Start (Recommended)

Open **Ubuntu WSL terminal** and navigate to your project:

```bash
cd /mnt/f/khmer-calendar
```

### Option 1: Test Server (No Database) - FASTEST

```bash
./test-wsl.sh
```

This starts a test server with:
- ✅ Khmer Calendar conversions
- ✅ Buddhist Era calculations
- ✅ **Accurate Lunar Calendar** (ported from .NET)
- ✅ Full Khmer text formatting

Visit: `http://localhost:3002`

### Option 2: Full Server (With PostgreSQL + Redis)

**First time setup:**

```bash
./setup-wsl.sh
```

This will:
- Install Node.js 18 if needed
- Install Docker if needed
- Install all npm dependencies
- Generate Prisma Client
- Build TypeScript code

**Run the full server:**

```bash
./run-wsl.sh
```

This starts:
- PostgreSQL database
- Redis cache
- Full API with all features

Visit:
- REST API: `http://localhost:3002/api/v1`
- GraphQL: `http://localhost:3002/graphql`
- Swagger Docs: `http://localhost:3002/api-docs`

## Manual Commands

If you prefer manual setup:

```bash
# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install dependencies
npm install --legacy-peer-deps

# Generate Prisma Client
npx prisma generate

# Build TypeScript
npm run build

# Start Docker services (optional)
docker-compose up -d

# Run migrations (if using Docker)
npx prisma migrate deploy
npm run prisma:seed

# Start server
npm start

# OR start test server (no database)
node test-server.js
```

## Testing the API

### Using curl:

```bash
# Get current date
curl http://localhost:3002/current

# Convert specific date
curl http://localhost:3002/convert?date=2024-04-15

# Get lunar calendar for date
curl http://localhost:3002/lunar?date=2017-12-10

# Get Khmer months
curl http://localhost:3002/months

# Get Khmer days
curl http://localhost:3002/days
```

### Using your browser:

- Home: http://localhost:3002/
- Current date: http://localhost:3002/current
- Convert date: http://localhost:3002/convert?date=2024-11-09
- Lunar calendar: http://localhost:3002/lunar?date=2017-12-10

## Troubleshooting

### Port 3002 already in use

```bash
# Check what's using the port
sudo lsof -i :3002

# Kill the process
sudo kill -9 <PID>
```

### Docker not starting

```bash
# Start Docker service
sudo service docker start

# Check Docker status
sudo service docker status
```

### Node.js not found

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Windows (Git Bash) Alternative

If you're using Git Bash instead of WSL:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build
npm run build

# Start test server
node test-server.js
```

Then open http://localhost:3002 in your browser.

