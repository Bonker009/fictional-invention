import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response, NextFunction } from 'express';
import { logger } from '../logging/logger';

interface SwaggerSpec {
  servers?: Array<{ url: string; description: string }>;
  [key: string]: any;
}

// Get server URL from environment or construct dynamically
const getServerUrl = (): string => {
  // Check for explicit API_BASE_URL environment variable
  if (process.env.API_BASE_URL) {
    return process.env.API_BASE_URL;
  }

  // Check for SERVER_URL environment variable
  if (process.env.SERVER_URL) {
    return process.env.SERVER_URL;
  }

  // For production, try to extract from CORS_ORIGIN if available
  if (process.env.NODE_ENV === 'production' && process.env.CORS_ORIGIN) {
    const corsOrigins = process.env.CORS_ORIGIN.split(',').map(o => o.trim());
    // Find the first HTTPS URL (preferred) or any HTTP URL
    const httpsUrl = corsOrigins.find(url => url.startsWith('https://'));
    const httpUrl = corsOrigins.find(url => url.startsWith('http://'));
    const productionUrl = httpsUrl || httpUrl;
    
    if (productionUrl) {
      // Remove trailing slash if present
      return productionUrl.replace(/\/$/, '');
    }
  }

  // For production, try to construct from common environment variables
  if (process.env.NODE_ENV === 'production') {
    const protocol = process.env.PROTOCOL || 'https';
    const host = process.env.HOST || process.env.DOMAIN;
    const port = process.env.PORT || '3002';
    
    if (host) {
      // If port is 80 (HTTP) or 443 (HTTPS), don't include it in URL
      const shouldIncludePort = port !== '80' && port !== '443';
      return shouldIncludePort ? `${protocol}://${host}:${port}` : `${protocol}://${host}`;
    }
  }

  // Default to localhost for development
  const port = process.env.PORT || '3002';
  return `http://localhost:${port}`;
};

// Build servers array dynamically
const buildServers = (): Array<{ url: string; description: string }> => {
  const servers: Array<{ url: string; description: string }> = [];
  const baseUrl = getServerUrl();
  const port = process.env.PORT || '3002';

  // Add primary server (from environment or default)
  if (process.env.NODE_ENV === 'production') {
    servers.push({
      url: baseUrl,
      description: 'Production server',
    });
  } else {
    servers.push({
      url: baseUrl,
      description: 'Development server',
    });
    
    // Add Docker development server if different port
    if (port !== '3003') {
      servers.push({
        url: `http://localhost:3003`,
        description: 'Development server (Docker)',
      });
    }
  }

  // Add localhost as fallback for development
  if (process.env.NODE_ENV !== 'production') {
    servers.push({
      url: `http://localhost:${port}`,
      description: 'Local development',
    });
  }

  logger.info(`Swagger servers configured: ${servers.map(s => s.url).join(', ')}`);
  return servers;
};

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
    servers: buildServers(),
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
  apis: [
    './src/infrastructure/routes/v1/*.ts',
    './dist/infrastructure/routes/v1/*.js',
  ],
};

// Generate swagger spec with dynamic server URLs
const getSwaggerSpec = (): SwaggerSpec => {
  // Rebuild options with current server configuration
  const dynamicOptions: swaggerJsdoc.Options = {
    ...options,
    definition: {
      ...options.definition!,
      servers: buildServers(),
    },
  };
  return swaggerJsdoc(dynamicOptions) as SwaggerSpec;
};

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, (req: Request, res: Response, next: NextFunction) => {
    // Generate spec dynamically to include correct server URL based on request
    const swaggerSpec = getSwaggerSpec();
    
    // If we can detect the host from the request, add it as a server option
    if (req.headers.host) {
      const protocol = req.protocol || (req.secure ? 'https' : 'http');
      const host = req.headers.host;
      const detectedUrl = `${protocol}://${host}`;
      
      // Add detected server if it's not already in the list
      const existingServers = swaggerSpec.servers || [];
      const hasDetectedServer = existingServers.some((s: { url: string }) => s.url === detectedUrl);
      
      if (!hasDetectedServer && process.env.NODE_ENV === 'production') {
        swaggerSpec.servers = [
          { url: detectedUrl, description: 'Current server' },
          ...existingServers,
        ];
      }
    }
    
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Khmer Calendar API Documentation',
    })(req, res, next);
  });

  app.get('/api-docs.json', (req: Request, res: Response) => {
    const swaggerSpec = getSwaggerSpec();
    
    // Add detected server URL if available
    if (req.headers.host) {
      const protocol = req.protocol || (req.secure ? 'https' : 'http');
      const host = req.headers.host;
      const detectedUrl = `${protocol}://${host}`;
      
      const existingServers = swaggerSpec.servers || [];
      const hasDetectedServer = existingServers.some((s: { url: string }) => s.url === detectedUrl);
      
      if (!hasDetectedServer) {
        swaggerSpec.servers = [
          { url: detectedUrl, description: 'Current server' },
          ...existingServers,
        ];
      }
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

