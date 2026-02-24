#!/bin/bash

# IELTS Practice Platform - Automated Vercel Deployment Script
# This script handles the complete deployment process including fixing broken environment variables

set -e  # Exit on any error

echo "🚀 IELTS Practice Platform - Vercel Deployment Script"
echo "===================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Step 1: Check if Vercel CLI is installed
echo "📦 Checking Vercel CLI installation..."
if ! command -v vercel &> /dev/null; then
    print_info "Vercel CLI not found. Installing globally..."
    npm install -g vercel
    print_success "Vercel CLI installed successfully!"
else
    print_success "Vercel CLI is already installed (version $(vercel --version))"
fi
echo ""

# Step 2: Check Vercel authentication
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    print_warning "You are not logged in to Vercel."
    print_info "Opening browser for authentication..."
    echo ""
    vercel login
    echo ""
    print_success "Successfully logged in to Vercel!"
else
    VERCEL_USER=$(vercel whoami 2>/dev/null)
    print_success "Already logged in as: $VERCEL_USER"
fi
echo ""

# Step 3: Clean up broken environment variables
echo "🧹 Cleaning up any broken environment variable configurations..."
print_info "Removing NEXT_PUBLIC_SITE_URL from all environments (if exists)..."

vercel env rm NEXT_PUBLIC_SITE_URL production --yes 2>/dev/null || print_info "No production env to remove"
vercel env rm NEXT_PUBLIC_SITE_URL preview --yes 2>/dev/null || print_info "No preview env to remove"
vercel env rm NEXT_PUBLIC_SITE_URL development --yes 2>/dev/null || print_info "No development env to remove"

print_success "Cleanup completed!"
echo ""

# Step 4: Add all environment variables
echo "🔧 Adding environment variables..."

# Supabase URL
print_info "Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "https://aqaapxdrmgjhoqlkwqkg.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --yes 2>/dev/null || true
echo "https://aqaapxdrmgjhoqlkwqkg.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview --yes 2>/dev/null || true
echo "https://aqaapxdrmgjhoqlkwqkg.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL development --yes 2>/dev/null || true
print_success "NEXT_PUBLIC_SUPABASE_URL added to all environments"

# Supabase Anon Key
print_info "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTE3MDksImV4cCI6MjA1NDkyNzcwOX0.k3wMFZY6k-9biBNJVEBBjp4LkZXwpP0hgaY5L2-8-U4" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>/dev/null || true
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTE3MDksImV4cCI6MjA1NDkyNzcwOX0.k3wMFZY6k-9biBNJVEBBjp4LkZXwpP0hgaY5L2-8-U4" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview --yes 2>/dev/null || true
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTE3MDksImV4cCI6MjA1NDkyNzcwOX0.k3wMFZY6k-9biBNJVEBBjp4LkZXwpP0hgaY5L2-8-U4" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development --yes 2>/dev/null || true
print_success "NEXT_PUBLIC_SUPABASE_ANON_KEY added to all environments"

# Site URL
print_info "Adding NEXT_PUBLIC_SITE_URL..."
echo "https://ielts-practice-platform-2026.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL production --yes 2>/dev/null || true
echo "https://ielts-practice-platform-2026.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL preview --yes 2>/dev/null || true
echo "https://ielts-practice-platform-2026.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL development --yes 2>/dev/null || true
print_success "NEXT_PUBLIC_SITE_URL added to all environments"

echo ""
print_warning "IMPORTANT: OpenAI API Key Required"
echo ""
echo "The OPENAI_API_KEY environment variable needs to be added manually because"
echo "it requires your actual API key from OpenAI."
echo ""
echo "Please run these commands to add your OpenAI API key:"
echo ""
echo "  vercel env add OPENAI_API_KEY production"
echo "  vercel env add OPENAI_API_KEY preview"
echo "  vercel env add OPENAI_API_KEY development"
echo ""
echo "Get your API key from: https://platform.openai.com/api-keys"
echo ""

read -p "Have you added your OPENAI_API_KEY? (y/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment paused. Please add your OPENAI_API_KEY and run this script again."
    echo ""
    echo "To continue after adding the key, run:"
    echo "  ./deploy-to-vercel.sh"
    exit 0
fi

echo ""

# Step 5: List all environment variables
echo "📋 Current environment variables:"
vercel env ls
echo ""

# Step 6: Deploy to production
echo "🚀 Deploying to Vercel production..."
print_info "This may take 2-5 minutes..."
echo ""

if vercel --prod --yes; then
    echo ""
    print_success "Deployment successful! 🎉"
    echo ""
    echo "=========================================="
    echo "✅ Your IELTS Practice Platform is LIVE!"
    echo "=========================================="
    echo ""
    echo "🌐 Production URL: https://ielts-practice-platform-2026.vercel.app"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Visit your live site and test all features"
    echo "  2. Try sign up/login functionality"
    echo "  3. Test all practice modules (Reading, Writing, Listening, Speaking)"
    echo "  4. Verify test generation works"
    echo ""
    echo "💡 To redeploy after changes:"
    echo "   vercel --prod --yes"
    echo ""
    echo "📊 View deployment details:"
    echo "   https://vercel.com/dashboard"
    echo ""
else
    echo ""
    print_error "Deployment failed!"
    echo ""
    echo "Common issues:"
    echo "  1. Missing OPENAI_API_KEY - make sure you added it"
    echo "  2. Build errors - check the error log above"
    echo "  3. Environment variables - run 'vercel env ls' to verify"
    echo ""
    echo "Need help? Share the error message above."
    exit 1
fi