#!/bin/bash

# IELTS Practice App - GitHub Export Script
# This script helps you push your code to GitHub

echo "🚀 IELTS Practice App - GitHub Export Helper"
echo "============================================"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first:"
    echo "   - Windows: https://git-scm.com/download/win"
    echo "   - Mac: brew install git"
    echo "   - Linux: sudo apt-get install git"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Check if already a git repository
if [ -d ".git" ]; then
    echo "📁 Git repository already exists"
    echo ""
else
    echo "📁 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
    echo ""
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Logs
logs
*.log

# PM2
ecosystem.config.js

# IDE
.vscode
.idea
EOF
    echo "✅ .gitignore created"
    echo ""
fi

# Add all files
echo "📦 Adding files to Git..."
git add .
echo "✅ Files added"
echo ""

# Commit
echo "💾 Creating commit..."
read -p "Enter commit message (or press Enter for default): " commit_message
if [ -z "$commit_message" ]; then
    commit_message="Initial commit - IELTS Practice App"
fi
git commit -m "$commit_message"
echo "✅ Commit created"
echo ""

# Check if remote exists
if git remote get-url origin &> /dev/null; then
    echo "🔗 Remote repository already configured"
    echo "   Current remote: $(git remote get-url origin)"
    echo ""
    read -p "Do you want to push to this remote? (y/n): " push_existing
    if [ "$push_existing" = "y" ]; then
        echo "📤 Pushing to GitHub..."
        git push -u origin main || git push -u origin master
        echo "✅ Code pushed to GitHub!"
        echo ""
        echo "🎉 Success! Your code is now on GitHub!"
        echo "   Repository: $(git remote get-url origin)"
        exit 0
    fi
fi

# Instructions for creating GitHub repository
echo "📋 NEXT STEPS:"
echo "=============="
echo ""
echo "1. Go to GitHub.com and log in"
echo "2. Click the '+' icon in top right → 'New repository'"
echo "3. Repository name: ielts-practice-app"
echo "4. Description: 'Professional IELTS Practice Platform with AI-powered test generation'"
echo "5. Choose 'Public' or 'Private'"
echo "6. DO NOT initialize with README, .gitignore, or license"
echo "7. Click 'Create repository'"
echo ""
echo "8. Copy the repository URL (it looks like: https://github.com/USERNAME/ielts-practice-app.git)"
echo ""

read -p "Enter your GitHub repository URL: " repo_url

if [ -z "$repo_url" ]; then
    echo "❌ No URL provided. Exiting..."
    echo ""
    echo "To push later, run these commands:"
    echo "  git remote add origin YOUR_REPO_URL"
    echo "  git push -u origin main"
    exit 1
fi

# Add remote
echo "🔗 Adding remote repository..."
git remote add origin "$repo_url"
echo "✅ Remote added"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your code is now on GitHub!"
    echo "============================================"
    echo ""
    echo "📍 Repository URL: $repo_url"
    echo ""
    echo "🔄 To push future changes:"
    echo "   git add ."
    echo "   git commit -m 'Your message'"
    echo "   git push"
    echo ""
    echo "🚀 Next: Deploy to Vercel"
    echo "   1. Go to https://vercel.com"
    echo "   2. Click 'Add New...' → 'Project'"
    echo "   3. Import your GitHub repository"
    echo "   4. Add environment variables"
    echo "   5. Deploy!"
else
    echo ""
    echo "❌ Push failed. Common issues:"
    echo "   1. Check your GitHub credentials"
    echo "   2. Make sure the repository exists"
    echo "   3. Verify the URL is correct"
    echo ""
    echo "💡 Try pushing manually:"
    echo "   git push -u origin main"
fi