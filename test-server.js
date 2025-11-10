/**
 * Simple Test Server - No Database Required
 * Tests the Khmer Calendar and Lunar Calendar features
 */

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const { KhmerCalendarService } = require('./dist/domain/services/KhmerCalendarService');
const { KhmerLunarCalendarService } = require('./dist/domain/services/KhmerLunarCalendarService');
const { CalendarDate } = require('./dist/domain/entities/CalendarDate');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Swagger Documentation
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Khmer Calendar API',
    version: '2.0.0',
    description: 'API for Khmer Calendar conversions, Buddhist Era dates, and accurate Lunar Calendar calculations',
    contact: {
      name: 'Khmer Calendar API',
    }
  },
  servers: [
    {
      url: 'http://localhost:3002',
      description: 'Test Server'
    }
  ],
  tags: [
    { name: 'Calendar', description: 'Calendar conversion endpoints' },
    { name: 'Lunar', description: 'Lunar calendar endpoints' },
    { name: 'Reference', description: 'Reference data endpoints' }
  ],
  paths: {
    '/current': {
      get: {
        tags: ['Calendar'],
        summary: 'Get current date',
        description: 'Returns current date in Gregorian, Buddhist Era, and Lunar Calendar formats',
        responses: {
          200: {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        gregorian: { type: 'object' },
                        buddhistEra: { type: 'object' },
                        lunarDate: { type: 'object' },
                        formatted: { type: 'object' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/convert': {
      get: {
        tags: ['Calendar'],
        summary: 'Convert date',
        description: 'Convert a Gregorian date to Buddhist Era and Lunar Calendar',
        parameters: [
          {
            name: 'date',
            in: 'query',
            required: true,
            description: 'Date in YYYY-MM-DD format',
            schema: { type: 'string', format: 'date', example: '2024-04-15' }
          }
        ],
        responses: {
          200: {
            description: 'Successful response'
          }
        }
      }
    },
    '/lunar': {
      get: {
        tags: ['Lunar'],
        summary: 'Get lunar calendar info',
        description: 'Get detailed lunar calendar information for a specific date',
        parameters: [
          {
            name: 'date',
            in: 'query',
            required: true,
            description: 'Date in YYYY-MM-DD format',
            schema: { type: 'string', format: 'date', example: '2017-12-10' }
          }
        ],
        responses: {
          200: {
            description: 'Returns lunar calendar code and full Khmer description',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        code: { type: 'string', example: '0910256101R07' },
                        fullDescription: { type: 'string', example: 'ថ្ងៃ ៧រោច ខែមិគសិរ ព.ស ២៥៦១ ឆ្នាំ រកា នព្វ​ស័ក' },
                        sak: { type: 'string' },
                        animalYear: { type: 'string' },
                        lunarMonth: { type: 'string' },
                        moonPhase: { type: 'string' },
                        lunarDay: { type: 'number' },
                        isHolyDay: { type: 'boolean' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/months': {
      get: {
        tags: ['Reference'],
        summary: 'Get Khmer month names',
        description: 'Returns all Khmer month names in Khmer and English',
        responses: {
          200: {
            description: 'List of months'
          }
        }
      }
    },
    '/days': {
      get: {
        tags: ['Reference'],
        summary: 'Get Khmer day names',
        description: 'Returns all Khmer day names',
        responses: {
          200: {
            description: 'List of days'
          }
        }
      }
    }
  }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Khmer Calendar API Documentation'
}));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🇰🇭 Welcome to Cambodia Khmer Calendar API v2.0 (Test Mode)',
    status: 'running',
    features: [
      'Khmer Calendar Conversions',
      'Buddhist Era Calculations', 
      'Accurate Lunar Calendar (ported from .NET)',
      'Full Khmer Formatting'
    ],
    endpoints: {
      'GET /current': 'Get current date in Khmer format with lunar calendar',
      'GET /convert?date=YYYY-MM-DD': 'Convert any date to Khmer format',
      'GET /lunar?date=YYYY-MM-DD': 'Get lunar calendar information',
      'GET /months': 'Get all Khmer month names',
      'GET /days': 'Get all Khmer day names',
      'GET /buddhist-era/:year': 'Convert year to Buddhist Era'
    },
    testUrls: [
      `http://localhost:${PORT}/current`,
      `http://localhost:${PORT}/convert?date=2024-04-15`,
      `http://localhost:${PORT}/lunar?date=2017-12-10`,
      `http://localhost:${PORT}/months`,
      `http://localhost:${PORT}/days`
    ]
  });
});

// Get current date with lunar calendar
app.get('/current', (req, res) => {
  try {
    const now = new Date();
    const calendarDate = CalendarDate.fromDate(now);
    const formattedDate = KhmerCalendarService.formatKhmerDate(calendarDate);
    const lunarDate = KhmerLunarCalendarService.getKhmerLunarDate(now);

    res.json({
      success: true,
      data: {
        ...formattedDate,
        formatted: {
          khmer: lunarDate.fullDescription,
          english: `${formattedDate.formatted.english.split(' ')[0]} ${formattedDate.gregorian.day}/${formattedDate.gregorian.month}/${formattedDate.gregorian.year}`
        },
        lunarDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Convert specific date
app.get('/convert', (req, res) => {
  try {
    const dateStr = req.query.date;
    if (!dateStr) {
      return res.status(400).json({
        success: false,
        error: 'Date parameter required (format: YYYY-MM-DD)'
      });
    }

    const calendarDate = CalendarDate.fromString(dateStr);
    const formattedDate = KhmerCalendarService.formatKhmerDate(calendarDate);
    const lunarDate = KhmerLunarCalendarService.getKhmerLunarDate(calendarDate.toDate());

    res.json({
      success: true,
      data: {
        ...formattedDate,
        formatted: {
          khmer: lunarDate.fullDescription,
          english: `${formattedDate.formatted.english.split(' ')[0]} ${formattedDate.gregorian.day}/${formattedDate.gregorian.month}/${formattedDate.gregorian.year}`
        },
        lunarDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get lunar calendar only
app.get('/lunar', (req, res) => {
  try {
    const dateStr = req.query.date || new Date().toISOString().split('T')[0];
    const date = new Date(dateStr);
    const lunarDate = KhmerLunarCalendarService.getKhmerLunarDate(date);

    res.json({
      success: true,
      data: lunarDate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Khmer months
app.get('/months', (req, res) => {
  try {
    const months = KhmerCalendarService.getKhmerMonths();
    res.json({
      success: true,
      data: months
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get Khmer days
app.get('/days', (req, res) => {
  try {
    const days = KhmerCalendarService.getKhmerDays();
    res.json({
      success: true,
      data: days
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Convert to Buddhist Era
app.get('/buddhist-era/:year', (req, res) => {
  try {
    const year = parseInt(req.params.year);
    if (isNaN(year)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid year parameter'
      });
    }

    const buddhistEra = KhmerCalendarService.toBuddhistEra(year);
    res.json({
      success: true,
      data: {
        gregorian: year,
        buddhistEra,
        difference: 543
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log('🚀 Khmer Calendar API v2.0 - TEST SERVER');
  console.log('='.repeat(70));
  console.log(`\n📍 Server running at: http://localhost:${PORT}`);
  console.log(`\n🔥 Features:`);
  console.log('   ✅ Khmer Calendar Conversions');
  console.log('   ✅ Buddhist Era Calculations');
  console.log('   ✅ Accurate Lunar Calendar (ported from .NET)');
  console.log('   ✅ Full Khmer Text Formatting');
  console.log(`\n🧪 Try these URLs:`);
  console.log(`   • http://localhost:${PORT}/`);
  console.log(`   • http://localhost:${PORT}/current`);
  console.log(`   • http://localhost:${PORT}/convert?date=2024-04-15`);
  console.log(`   • http://localhost:${PORT}/lunar?date=2017-12-10`);
  console.log(`   • http://localhost:${PORT}/months`);
  console.log(`   • http://localhost:${PORT}/days`);
  console.log('\n' + '='.repeat(70));
  console.log('💡 Note: This is a TEST server (database features disabled)');
  console.log('   Start Docker Desktop and run: docker-compose up -d');
  console.log('   Then run: npm start (for full features with PostgreSQL + Redis)');
  console.log('='.repeat(70) + '\n');
});

