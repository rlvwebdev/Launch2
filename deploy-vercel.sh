#!/bin/bash

# Vercel Deployment Script for Launch Transportation Platform
# This script deploys the application to Vercel with proper configuration

echo "🚀 Launch - Deploying to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel@latest
fi

# Login to Vercel (if not already logged in)
echo "🔐 Vercel authentication..."
vercel login

# Deploy to Vercel
echo "🚀 Deploying to production..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your application should now be live at the provided URL"
echo "📊 View deployment logs at: https://vercel.com/dashboard"
