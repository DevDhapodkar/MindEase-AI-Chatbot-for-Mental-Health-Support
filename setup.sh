#!/bin/bash

# MindEase Setup Script
echo "🧠 Setting up MindEase - AI Mental Health Support Chatbot"
echo "================================================"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ and try again."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm and try again."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server && npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client && npm install
cd ..

# Create environment file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "⚙️ Creating environment configuration..."
    cp server/env.example server/.env
    echo "✅ Environment file created at server/.env"
    echo "💡 You can edit server/.env to customize configuration"
fi

echo ""
echo "🎉 MindEase setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev     # Start both frontend and backend"
echo "   npm run server  # Start backend only"
echo "   npm run client  # Start frontend only"
echo ""
echo "🌐 Once started, visit:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5001"
echo ""
echo "📚 For more information, see README.md"
echo ""
echo "⚠️  Important: MindEase is not a replacement for professional mental health care."
echo "   Crisis resources are available 24/7:"
echo "   US: 988 (Suicide & Crisis Lifeline)"
echo "   UK: 116 123 (Samaritans)"