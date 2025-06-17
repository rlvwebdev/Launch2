# Vercel Deployment Script for Launch Transportation Platform (PowerShell)
# This script deploys the application to Vercel with proper configuration

Write-Host "🚀 Launch - Deploying to Vercel..." -ForegroundColor Green

# Check if Vercel CLI is installed
if (!(Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel@latest
}

# Deploy to Vercel
Write-Host "🚀 Deploying to production..." -ForegroundColor Blue
vercel --prod

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🌐 Your application should now be live at the provided URL" -ForegroundColor Cyan
Write-Host "📊 View deployment logs at: https://vercel.com/dashboard" -ForegroundColor Cyan
