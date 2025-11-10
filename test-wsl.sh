#!/bin/bash
# Test the API without database

echo "============================================================"
echo "🧪 Testing Khmer Calendar API v2.0 (No Database)"
echo "============================================================"
echo ""

# Check if build exists
if [ ! -d "dist" ]; then
    echo "⚠️  Build not found. Building..."
    npm run build
fi

echo "🚀 Starting test server..."
echo ""
node test-server.js

