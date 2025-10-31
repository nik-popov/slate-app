#!/bin/bash

# Slate App Development Setup Script
echo "🚀 Setting up Slate App for development..."

# Check if .env exists
if [ -f ".env" ]; then
    echo "✅ .env file found"
    echo "📋 Current Firebase configuration:"
    grep "VITE_" .env | head -6
else
    echo "⚠️  No .env file found"
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
    echo "✅ .env file created from template"
    echo ""
    echo "🔧 You need to configure your Firebase settings:"
    echo "   1. Edit .env file with your Firebase project config"
    echo "   2. Or use the in-app database setup modal"
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if Firebase project is configured
echo ""
echo "🔥 Firebase Setup Instructions:"
echo "   1. Go to https://console.firebase.google.com"
echo "   2. Create a new project or select existing one"
echo "   3. Add a web app (</> icon)"
echo "   4. Copy the config values to your .env file"
echo "   5. Enable Firestore Database"
echo "   6. Set Firestore rules for testing:"
echo ""
echo "      rules_version = '2';"
echo "      service cloud.firestore {"
echo "        match /databases/{database}/documents {"
echo "          match /{document=**} {"
echo "            allow read, write: if true;"
echo "          }"
echo "        }"
echo "      }"
echo ""

# Check for common development tools
echo "🛠️  Development Environment Check:"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
else
    echo "❌ Node.js not found - please install Node.js"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
else
    echo "❌ npm not found"
fi

if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo "✅ Git: $GIT_VERSION"
else
    echo "⚠️  Git not found - recommended for version control"
fi

echo ""
echo "🎯 Next Steps:"
echo "   1. Configure Firebase (edit .env or use in-app setup)"
echo "   2. Run 'npm run dev' to start development server"
echo "   3. Open http://localhost:5173 in your browser"
echo "   4. Use the database setup modal if needed"
echo ""
echo "📚 Available Commands:"
echo "   npm run dev      - Start development server"
echo "   npm run build    - Build for production"
echo "   npm run preview  - Preview production build"
echo "   npm run lint     - Run ESLint"
echo ""

# Check if already running
if lsof -i :5173 > /dev/null 2>&1; then
    echo "🟢 Development server is already running on port 5173"
else
    echo "🔴 Development server is not running"
    echo "   Run 'npm run dev' to start it"
fi

echo ""
echo "✨ Setup complete! Happy coding!"