#!/bin/bash

# Slate App Development Setup Script
# This script sets up the development environment for the Slate app

set -e

echo "🚀 Setting up Slate App development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js (version 18 or higher)"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version $(node -v) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

# Install dependencies
print_status "Installing npm dependencies..."
if npm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp .env.example .env
    print_warning "Please edit .env file with your Firebase configuration before running the app"
    print_warning "Get your Firebase config from: https://console.firebase.google.com/"
else
    print_success ".env file already exists"
fi

# Check TypeScript compilation
print_status "Checking TypeScript compilation..."
if npm run type-check; then
    print_success "TypeScript compilation successful"
else
    print_error "TypeScript compilation failed"
    exit 1
fi

# Try to build the project
print_status "Testing production build..."
if npm run build; then
    print_success "Production build successful"
else
    print_error "Production build failed"
    exit 1
fi

print_success "Development environment setup complete!"
echo ""
print_status "Next steps:"
echo "1. Edit .env file with your Firebase configuration"
echo "2. Run 'npm run dev' to start the development server"
echo "3. Open http://localhost:3000 in your browser"
echo ""
print_status "Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run preview      - Preview production build"
echo "  npm run type-check   - Check TypeScript types"
echo ""
print_status "Deployment commands:"
echo "  npm run deploy:firebase - Deploy to Firebase Hosting"
echo "  npm run deploy:vercel   - Deploy to Vercel"
echo "  npm run deploy:netlify  - Deploy to Netlify"
echo ""
print_warning "Don't forget to configure your Firebase project and update .env file!"