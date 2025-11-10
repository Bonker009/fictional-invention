#!/bin/bash
# Setup script for Ubuntu WSL

echo "============================================================"
echo "🇰🇭 Khmer Calendar API v2.0 - WSL Setup"
echo "============================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "📦 Node.js not found. Installing..."
    
    # Install Node.js 18.x
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    echo "✅ Node.js installed: $(node --version)"
else
    echo "✅ Node.js already installed: $(node --version)"
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "📦 Docker not found. Installing..."
    
    # Install Docker
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    
    # Add current user to docker group
    sudo usermod -aG docker $USER
    
    echo "✅ Docker installed"
else
    echo "✅ Docker already installed"
fi

# Install dependencies
echo ""
echo "📦 Installing npm dependencies..."
npm install --legacy-peer-deps

# Generate Prisma Client
echo ""
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Build TypeScript
echo ""
echo "🔨 Building TypeScript..."
npm run build

echo ""
echo "============================================================"
echo "✅ Setup Complete!"
echo "============================================================"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "1️⃣  Start Docker containers:"
echo "   docker-compose up -d"
echo ""
echo "2️⃣  Run database migrations:"
echo "   npx prisma migrate deploy"
echo ""
echo "3️⃣  Seed the database:"
echo "   npx prisma db seed"
echo ""
echo "4️⃣  Start the server:"
echo "   npm start"
echo ""
echo "📝 Or run test server without database:"
echo "   node test-server.js"
echo ""
echo "============================================================"

