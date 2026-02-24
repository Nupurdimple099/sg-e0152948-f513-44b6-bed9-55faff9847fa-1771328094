#!/bin/bash

# Quick Fix Script for Vercel Environment Variable Issues
# This script specifically fixes the "Secret reference" error

set -e

echo "🔧 Vercel Environment Variable Fix Script"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

# Check if logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel."
    print_info "Please run: vercel login"
    exit 1
fi

VERCEL_USER=$(vercel whoami 2>/dev/null)
print_success "Logged in as: $VERCEL_USER"
echo ""

# Remove broken NEXT_PUBLIC_SITE_URL
echo "🧹 Removing broken NEXT_PUBLIC_SITE_URL environment variable..."
vercel env rm NEXT_PUBLIC_SITE_URL production --yes 2>/dev/null && print_success "Removed from production" || print_info "Not found in production"
vercel env rm NEXT_PUBLIC_SITE_URL preview --yes 2>/dev/null && print_success "Removed from preview" || print_info "Not found in preview"
vercel env rm NEXT_PUBLIC_SITE_URL development --yes 2>/dev/null && print_success "Removed from development" || print_info "Not found in development"
echo ""

# Add it back correctly
echo "✨ Adding NEXT_PUBLIC_SITE_URL with correct plain text value..."
echo "https://ielts-practice-platform-2026.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL production --yes
echo "https://ielts-practice-platform-2026.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL preview --yes
echo "https://ielts-practice-platform-2026.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL development --yes
print_success "NEXT_PUBLIC_SITE_URL added successfully to all environments!"
echo ""

# Verify
echo "📋 Current environment variables:"
vercel env ls
echo ""

print_success "Fix completed! The broken secret reference has been removed."
echo ""
echo "🚀 Now you can deploy with:"
echo "   vercel --prod --yes"
echo ""