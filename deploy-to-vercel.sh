#!/bin/bash

# IELTS Practice Platform - Direct Vercel Deployment Script
# This script deploys your Next.js app directly to Vercel without GitHub

set -e  # Exit on any error

echo "🚀 IELTS Practice Platform - Vercel Deployment"
echo "================================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed successfully!"
    echo ""
fi

# Project configuration
PROJECT_NAME="ielts-practice-platform-2026"

echo "📋 Project Name: $PROJECT_NAME"
echo ""

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please login first:"
    vercel login
    echo ""
fi

echo "✅ Vercel authentication confirmed"
echo ""

# Deploy to Vercel
echo "🔨 Deploying to Vercel..."
echo "   This may take a few minutes..."
echo ""

# Initial deployment
vercel --yes --name "$PROJECT_NAME"

echo ""
echo "📊 Deployment successful! Now adding environment variables..."
echo ""

# Add environment variables
echo "🔑 Adding NEXT_PUBLIC_SUPABASE_URL..."
echo "https://aqaapxdrmgjhoqlkwqkg.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --yes 2>/dev/null || true
echo "https://aqaapxdrmgjhoqlkwqkg.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL preview --yes 2>/dev/null || true
echo "https://aqaapxdrmgjhoqlkwqkg.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL development --yes 2>/dev/null || true

echo "🔑 Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTE3MDksImV4cCI6MjA1NDkyNzcwOX0.k3wMFZY6k-9biBNJVEBBjp4LkZXwpP0hgaY5L2-8-U4" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --yes 2>/dev/null || true
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTE3MDksImV4cCI6MjA1NDkyNzcwOX0.k3wMFZY6k-9biBNJVEBBjp4LkZXwpP0hgaY5L2-8-U4" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY preview --yes 2>/dev/null || true
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTE3MDksImV4cCI6MjA1NDkyNzcwOX0.k3wMFZY6k-9biBNJVEBBjp4LkZXwpP0hgaY5L2-8-U4" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY development --yes 2>/dev/null || true

echo "🔑 Adding NEXT_PUBLIC_SITE_URL..."
echo "https://$PROJECT_NAME.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL production --yes 2>/dev/null || true
echo "https://$PROJECT_NAME.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL preview --yes 2>/dev/null || true
echo "https://$PROJECT_NAME.vercel.app" | vercel env add NEXT_PUBLIC_SITE_URL development --yes 2>/dev/null || true

echo ""
echo "⚠️  IMPORTANT: OpenAI API Key needs to be added manually"
echo "   Run this command and enter your real OpenAI API key when prompted:"
echo ""
echo "   vercel env add OPENAI_API_KEY production"
echo "   vercel env add OPENAI_API_KEY preview"
echo "   vercel env add OPENAI_API_KEY development"
echo ""

read -p "📝 Have you added your OpenAI API key? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "⏸️  Pausing deployment. Please add your OpenAI API key first:"
    echo "   1. Run: vercel env add OPENAI_API_KEY production"
    echo "   2. When prompted, paste your OpenAI API key (starts with sk-proj-)"
    echo "   3. Repeat for preview and development environments"
    echo "   4. Then run this script again"
    echo ""
    exit 1
fi

# Final production deployment with all environment variables
echo ""
echo "🚀 Deploying to production with environment variables..."
vercel --prod --yes

echo ""
echo "════════════════════════════════════════════════"
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "════════════════════════════════════════════════"
echo ""
echo "🌐 Your IELTS Practice Platform is now live at:"
echo "   https://$PROJECT_NAME.vercel.app"
echo ""
echo "📊 View your deployment:"
echo "   https://vercel.com/dashboard"
echo ""
echo "🎯 Next Steps:"
echo "   1. Visit your live site and test the features"
echo "   2. Check authentication (sign up/login)"
echo "   3. Test practice modules (Reading, Writing, etc.)"
echo "   4. Verify Supabase connection"
echo ""
echo "💡 To redeploy after changes:"
echo "   vercel --prod"
echo ""
echo "🎉 Happy testing!"
echo ""