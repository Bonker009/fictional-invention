#!/bin/bash
# Quick run script for WSL

echo "============================================================"
echo "🇰🇭 Khmer Calendar API v2.0"
echo "============================================================"
echo ""

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if build exists
if [ ! -d "dist" ]; then
    echo "⚠️  Build not found. Building..."
    npm run build
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "⚠️  Docker is not running. Starting Docker..."
    sudo service docker start
    sleep 3
fi

# Start containers
echo "🐳 Starting Docker containers..."
docker-compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if database is initialized
if ! docker-compose exec -T postgres psql -U khmer_user -d khmer_calendar -c "SELECT 1 FROM holidays LIMIT 1" > /dev/null 2>&1; then
    echo "📊 Initializing database..."
    npx prisma migrate deploy
    npm run prisma:seed
fi

# Start the server
echo ""
echo "============================================================"
echo "🚀 Starting Khmer Calendar API..."
echo "============================================================"
echo ""
echo "📍 REST API: http://localhost:3002/api/v1"
echo "📊 GraphQL: http://localhost:3002/graphql"
echo "📖 Swagger Docs: http://localhost:3002/api-docs"
echo ""
echo "Press Ctrl+C to stop"
echo ""
npm start

