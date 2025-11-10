import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cambodia Khmer Calendar API',
      version: '2.0.0',
      description: `
        A comprehensive RESTful API for Cambodia featuring Khmer calendar system, 
        Buddhist Era date conversions, and complete holiday/holy day information for 
        public and religious observances.
        
        **Features:**
        - Buddhist Era (BE) date conversion
        - Khmer month and day names
        - Complete list of Cambodia public holidays
        - Buddhist holy days and religious observances
        - Holiday lookup by date, month, or year
        - Upcoming holidays query
        - Bulk operations for date ranges
        - PostgreSQL database with Redis caching
        - Rate limiting and security features
      `,
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3002',
        description: 'Development server',
      },
      {
        url: 'http://localhost:3003',
        description: 'Development server (Docker)',
      },
    ],
    tags: [
      {
        name: 'Calendar',
        description: 'Calendar date conversion and information endpoints',
      },
      {
        name: 'Holidays',
        description: 'Holiday information and lookup endpoints',
      },
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
        Holiday: {
          type: 'object',
          properties: {
            month: {
              type: 'integer',
              example: 4,
            },
            day: {
              type: 'integer',
              example: 15,
            },
            nameKh: {
              type: 'string',
              example: 'ពិធីបុណ្យចូលឆ្នាំខ្មែរ',
            },
            nameEn: {
              type: 'string',
              example: 'Khmer New Year',
            },
            type: {
              type: 'string',
              enum: ['public', 'religious', 'holy'],
              example: 'public',
            },
            isPublicHoliday: {
              type: 'boolean',
              example: true,
            },
            description: {
              type: 'string',
              example: 'Traditional Cambodian New Year celebration',
            },
            date: {
              type: 'string',
              format: 'date',
              example: '2024-04-15',
            },
            year: {
              type: 'integer',
              example: 2024,
            },
            buddhistEra: {
              type: 'integer',
              example: 2567,
            },
          },
        },
      },
    },
  },
  apis: ['./src/infrastructure/routes/v1/*.ts'],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Khmer Calendar API Documentation',
  }));

  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

