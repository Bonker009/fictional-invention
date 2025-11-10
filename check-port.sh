#!/bin/bash

echo "Checking for port conflicts..."

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "❌ Port 3000 is already in use"
    echo "Running processes on port 3000:"
    lsof -i :3000
    echo ""
    echo "Solution: Use docker-compose.alt.yml which uses port 3002"
    echo "  docker-compose -f docker-compose.alt.yml up -d"
else
    echo "✅ Port 3000 is available"
fi

if lsof -Pi :3002 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "❌ Port 3002 is already in use"
else
    echo "✅ Port 3002 is available"
fi

echo ""
echo "Checking Docker containers using ports..."
docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "3000|3002|NAME"

