# Cambodia Khmer Calendar API v2.0 🇰🇭

A comprehensive, production-ready RESTful and GraphQL API for Cambodia featuring the Khmer calendar system, Buddhist Era date conversions, and complete holiday information for public and religious observances.

## 🌟 What's New in v2.0

- ✅ **TypeScript** - Full TypeScript migration with strict type checking
- ✅ **PostgreSQL + Prisma** - Robust database layer with ORM
- ✅ **Redis Caching** - High-performance caching layer
- ✅ **GraphQL Endpoint** - Alternative GraphQL API alongside REST
- ✅ **Swagger/OpenAPI** - Interactive API documentation
- ✅ **API Versioning** - Clean v1 API structure
- ✅ **Lunar Calendar** - Accurate Buddhist holiday calculations
- ✅ **Bulk Operations** - Date range queries for holidays
- ✅ **Enhanced Security** - Helmet, rate limiting, CORS
- ✅ **Compression** - Response compression for better performance
- ✅ **ETag Caching** - HTTP caching support
- ✅ **Structured Logging** - Winston logger with multiple transports
- ✅ **Docker Compose** - Full stack with PostgreSQL and Redis

## 🏗️ Architecture

This project follows **Clean Architecture** principles with TypeScript:

```
src/
├── domain/              # Domain Layer (Core Business Logic)
│   ├── entities/        # Business entities (Holiday, CalendarDate)
│   ├── interfaces/      # Repository interfaces
│   └── services/        # Domain services (KhmerCalendarService, LunarCalendarService)
│
├── application/         # Application Layer (Use Cases)
│   └── use-cases/       # Business use cases
│
├── infrastructure/      # Infrastructure Layer
│   ├── database/        # Prisma client
│   ├── cache/           # Redis cache
│   ├── repositories/    # Repository implementations
│   ├── routes/          # Express routes (v1)
│   ├── middleware/      # Express middleware
│   ├── graphql/         # GraphQL schema and resolvers
│   ├── swagger/         # Swagger/OpenAPI configuration
│   └── logging/         # Winston logger
│
├── presentation/        # Presentation Layer
│   └── controllers/     # HTTP controllers
│
└── di/                  # Dependency Injection
    └── container.ts     # DI container

prisma/
├── schema.prisma        # Database schema
└── seed.ts             # Database seed data
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (recommended)
- PostgreSQL 16+ (if running without Docker)
- Redis 7+ (if running without Docker)

### Installation

#### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/Bonker009/fictional-invention.git
cd khmer-calendar

# Start all services (API, PostgreSQL, Redis)
docker-compose up -d

# View logs
docker-compose logs -f khmer-calendar-api
```

The API will be available at:
- REST API: `http://localhost:3002/api/v1`
- GraphQL: `http://localhost:3002/graphql`
- Swagger Docs: `http://localhost:3002/api-docs`

#### Option 2: Development Mode with Docker

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# The API runs with hot-reload on port 3003
```

#### Option 3: Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and Redis configuration

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database
npm run prisma:seed

# Start development server
npm run dev
```

## 📚 API Endpoints

### Base URLs
- REST API v1: `/api/v1`
- GraphQL: `/graphql`
- API Documentation: `/api-docs`

### REST API Endpoints

#### Calendar Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/current` | Get current date in Khmer format |
| GET | `/api/v1/convert?date=YYYY-MM-DD` | Convert date to Khmer format |
| POST | `/api/v1/convert` | Convert date to Khmer format (POST) |
| GET | `/api/v1/months` | Get Khmer month names |
| GET | `/api/v1/days` | Get Khmer day names |
| GET | `/api/v1/buddhist-era/:year` | Convert to Buddhist Era |
| GET | `/api/v1/gregorian/:beYear` | Convert from Buddhist Era |

#### Holiday Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/holidays?year=2024` | Get all holidays for a year |
| GET | `/api/v1/holidays/date?date=YYYY-MM-DD` | Get holidays for a specific date |
| GET | `/api/v1/holidays/month?year=2024&month=4` | Get holidays for a month |
| GET | `/api/v1/holidays/upcoming?limit=10` | Get upcoming holidays |
| GET | `/api/v1/holidays/check?date=YYYY-MM-DD` | Check if date is a holiday |
| GET | `/api/v1/holidays/public?year=2024` | Get only public holidays |
| GET | `/api/v1/holidays/religious?year=2024` | Get only religious holidays |
| GET | `/api/v1/holidays/bulk?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD` | Get holidays in date range |

### GraphQL API

Access the GraphQL Playground at `/graphql` in development mode.

**Example Query:**

```graphql
query {
  currentDate {
    gregorian {
      year
      month
      day
      dayName
    }
    buddhistEra {
      year
      monthName
      dayName
    }
    formatted {
      khmer
      english
    }
    isHoliday
    holidays {
      nameKh
      nameEn
      type
      isPublicHoliday
    }
  }
}
```

**Example Query for Holidays:**

```graphql
query {
  holidays(year: 2024, type: public) {
    holidays {
      nameKh
      nameEn
      date
      isPublicHoliday
      description
    }
    total
    publicHolidays
  }
}
```

## 📝 Features

### Calendar Features
- ✅ Buddhist Era (BE) date conversion
- ✅ Khmer month and day names (Khmer and English)
- ✅ Formatted date strings in Khmer and English
- ✅ Date conversion with automatic holiday detection
- ✅ Year conversions between Gregorian and Buddhist Era

### Holiday Features
- ✅ Complete list of Cambodia public holidays
- ✅ Buddhist holy days with lunar calendar calculations
- ✅ Religious observances
- ✅ Holiday lookup by date, month, year, or date range
- ✅ Upcoming holidays query with customizable limit
- ✅ Public vs religious holiday filtering
- ✅ Bulk operations for date ranges
- ✅ Holiday information in Khmer and English
- ✅ Multi-year holiday data (2024-2030 pre-calculated)

### Technical Features
- ✅ RESTful API with versioning (v1)
- ✅ GraphQL alternative endpoint
- ✅ PostgreSQL database with Prisma ORM
- ✅ Redis caching for optimal performance
- ✅ Swagger/OpenAPI 3.0 documentation
- ✅ TypeScript with strict type checking
- ✅ Clean Architecture pattern
- ✅ Comprehensive error handling
- ✅ Request/Response compression (gzip)
- ✅ ETag support for HTTP caching
- ✅ Rate limiting protection
- ✅ Helmet security headers
- ✅ CORS enabled with configuration
- ✅ Structured logging with Winston
- ✅ Docker containerization
- ✅ Database migrations
- ✅ Health check endpoint with dependency status

## 🛠️ Technology Stack

### Core
- **TypeScript** 5.3+ - Static typing and modern JavaScript
- **Node.js** 18+ - Runtime environment
- **Express.js** 4.18 - Web framework

### Database & Caching
- **PostgreSQL** 16 - Primary database
- **Prisma** 5.7 - Modern ORM with type safety
- **Redis** 7 - Caching layer

### API & Documentation
- **GraphQL** 16.8 - Alternative query language
- **Swagger/OpenAPI** 3.0 - API documentation
- **express-graphql** 0.12 - GraphQL middleware

### Security & Performance
- **Helmet** 7.1 - Security headers
- **express-rate-limit** 7.1 - Rate limiting
- **compression** 1.7 - Response compression
- **CORS** 2.8 - Cross-origin resource sharing

### Logging & Monitoring
- **Winston** 3.11 - Structured logging
- **Morgan** 1.10 - HTTP request logging

### Development
- **ts-node-dev** - TypeScript development server
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Application
NODE_ENV=development
PORT=3002

# Database
DATABASE_URL="postgresql://khmer_user:khmer_password@localhost:5432/khmer_calendar?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Cache Settings
CACHE_TTL=3600
ENABLE_CACHE=true

# API Settings
API_VERSION=v1
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Settings
CORS_ORIGIN=*

# Logging
LOG_LEVEL=info
```

## 📦 NPM Scripts

```bash
# Development
npm run dev              # Start development server with hot-reload
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma Client
npm run prisma:migrate   # Run database migrations
npm run prisma:seed      # Seed database with holidays
npm run prisma:studio    # Open Prisma Studio GUI
npm run db:setup         # Run migrations and seed

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking

# Testing
npm test                 # Run tests with coverage
npm run test:watch       # Run tests in watch mode
```

## 🐳 Docker Commands

```bash
# Production
docker-compose up -d                 # Start all services
docker-compose down                  # Stop all services
docker-compose logs -f               # View logs
docker-compose restart               # Restart services

# Development
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml logs -f khmer-calendar-api

# Database
docker-compose exec khmer-calendar-api npm run prisma:studio
docker-compose exec postgres psql -U khmer_user -d khmer_calendar

# Redis
docker-compose exec redis redis-cli
```

## 📅 Included Holidays

### Public Holidays (21)
- International New Year Day (January 1)
- Victory Day over Genocide (January 7)
- Constitution Day (February 7)
- International Women's Day (March 8)
- Khmer New Year (April 14-16)
- International Labour Day (May 1)
- Royal Ploughing Ceremony (May 14)
- Day of Remembrance (May 20)
- International Children's Day (June 1)
- Queen Mother's Birthday (June 18)
- Constitutional Day (September 24)
- King Father Commemoration Day (October 15)
- Coronation Day (October 29)
- Independence Day (November 9)
- International Human Rights Day (December 10)

### Buddhist Holy Days (Lunar Calendar)
- Meak Bochea (Magha Puja) - 3rd lunar month
- Visak Bochea (Vesak) - 6th lunar month
- Buddhist Lent Begin (Chol Vassa) - 8th lunar month
- Pchum Ben (Ancestors' Day) - 10th lunar month
- Buddhist Lent End (Choeung Vassa) - 11th lunar month
- Water Festival (Bon Om Touk) - 12th lunar month

## 🧪 Example Usage

### cURL Examples

```bash
# Get current date
curl http://localhost:3002/api/v1/current

# Convert specific date
curl http://localhost:3002/api/v1/convert?date=2024-04-15

# Get all holidays for 2024
curl http://localhost:3002/api/v1/holidays?year=2024

# Check if date is a holiday
curl http://localhost:3002/api/v1/holidays/check?date=2024-04-15

# Get upcoming holidays
curl http://localhost:3002/api/v1/holidays/upcoming?limit=5

# Bulk query for date range
curl "http://localhost:3002/api/v1/holidays/bulk?startDate=2024-01-01&endDate=2024-12-31"
```

### JavaScript/TypeScript

```typescript
// Get current date
const response = await fetch('http://localhost:3002/api/v1/current');
const data = await response.json();
console.log(data);

// Get holidays with filtering
const holidays = await fetch('http://localhost:3002/api/v1/holidays?year=2024&type=public');
const holidayData = await holidays.json();
console.log(holidayData);

// GraphQL query
const graphqlQuery = {
  query: `
    query {
      currentDate {
        formatted {
          khmer
          english
        }
        isHoliday
        holidays {
          nameEn
          nameKh
        }
      }
    }
  `
};

const graphqlResponse = await fetch('http://localhost:3002/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(graphqlQuery),
});
const graphqlData = await graphqlResponse.json();
console.log(graphqlData);
```

## 🔒 Security Features

- **Helmet.js** - Sets various HTTP headers for security
- **Rate Limiting** - Prevents abuse with configurable limits
- **CORS** - Configurable cross-origin resource sharing
- **Input Validation** - Request validation and sanitization
- **SQL Injection Protection** - Prisma parameterized queries
- **NoSQL Injection Protection** - Type-safe Redis operations

## 📊 Performance

- **Response Compression** - Automatic gzip compression
- **Redis Caching** - Configurable TTL for holiday data
- **ETag Support** - HTTP caching for unchanged resources
- **Database Indexing** - Optimized queries with Prisma
- **Connection Pooling** - Efficient database connections

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Made with ❤️ for Cambodia** 🇰🇭
