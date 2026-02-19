#!/bin/bash
# SuperMart Setup Script

echo "🚀 Starting SuperMart Setup..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MongoDB is running
echo "🔍 Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found. Please install MongoDB or use MongoDB Atlas."
    echo "   Visit: https://www.mongodb.com/cloud/atlas"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "📝 Setting up environment variables..."
echo "   - Edit .env.local file and update MONGODB_URI if needed"
echo ""

echo "🌐 Starting development server..."
echo "   - The app will be available at http://localhost:3000"
echo ""

echo "📄 To initialize demo data:"
echo "   1. Wait for the dev server to start (message will say 'ready')"
echo "   2. In a new terminal, run:"
echo "      curl http://localhost:3000/api/init"
echo "   3. Then login with demo credentials:"
echo "      📧 Seller: seller@demo.com / demo123"
echo "      📧 Buyer: buyer@demo.com / demo123"
echo ""

npm run dev
