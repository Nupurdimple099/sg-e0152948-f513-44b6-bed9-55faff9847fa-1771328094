#!/bin/bash

# IELTS Practice Platform - Vercel Deployment Script
# This script deploys your Next.js app to Vercel with proper configuration

echo "🚀 Starting Vercel Deployment..."
echo ""

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Set project name
PROJECT_NAME="ielts-practice-platform-2026"

echo "📋 Project Name: $PROJECT_NAME"
echo ""

# Deploy to Vercel
echo "🔨 Deploying to Vercel..."
vercel --yes \
  --name "$PROJECT_NAME" \
  --build-env NEXT_PUBLIC_SUPABASE_URL="https://aqaapxdrmgjhoqlkwqkg.supabase.co" \
  --build-env NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxYWFweGRybWdqaG9xbGt3cWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkzNTE3MDksImV4cCI6MjA1NDkyNzcwOX0.k3wMFZY6k-9biBNJVEBBjp4LkZXwpP0hgaY5L2-8-U4" \
  --env OPENAI_API_KEY="sk-proj-your-real-openai-key-here" \
  --env NEXT_PUBLIC_SITE_URL="https://$PROJECT_NAME.vercel.app" \
  --prod

echo ""
echo "✅ Deployment Complete!"
echo ""
echo "🌐 Your app is live at:"
echo "   https://$PROJECT_NAME.vercel.app"
echo ""
echo "📊 View deployment details:"
echo "   https://vercel.com/dashboard"