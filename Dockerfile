# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies for building)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY src ./src

# Generate Prisma Client
RUN npm run prisma:generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install only production dependencies
RUN npm ci --only=production --legacy-peer-deps && \
    npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Copy generated Prisma Client from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3002

ENV NODE_ENV=production
ENV PORT=3002

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/api/v1/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start app (run migrations from host first)
CMD ["node", "dist/server.js"]
