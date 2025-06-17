# 🚀 Launch Transportation Platform - Deployment Script (PowerShell)
# This script helps deploy your application to various platforms

Write-Host "🚀 Launch Transportation Platform - Deployment Helper" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if git is clean
function Test-GitStatus {
    $status = git status --porcelain
    if ($status) {
        Write-Warning "You have uncommitted changes. Please commit them first."
        git status --short
        $continue = Read-Host "Do you want to continue anyway? (y/n)"
        if ($continue -notmatch '^[Yy]$') {
            exit 1
        }
    }
}

# Build and test locally
function Build-Locally {
    Write-Status "Building application locally..."
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Local build successful!"
        return $true
    } else {
        Write-Error "Local build failed. Please fix errors before deploying."
        return $false
    }
}

# Deploy to Vercel
function Deploy-Vercel {
    Write-Status "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    try {
        vercel --version | Out-Null
    } catch {
        Write-Warning "Vercel CLI not found. Installing..."
        npm i -g vercel
    }
    
    # Deploy to production
    vercel --prod
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Successfully deployed to Vercel!"
        Write-Status "Your app should be available at: https://launch-transportation-platform.vercel.app"
    } else {
        Write-Error "Vercel deployment failed."
        exit 1
    }
}

# Deploy to Netlify
function Deploy-Netlify {
    Write-Status "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    try {
        netlify --version | Out-Null
    } catch {
        Write-Warning "Netlify CLI not found. Installing..."
        npm i -g netlify-cli
    }
    
    # Build and deploy
    npm run build
    netlify deploy --prod --dir=.next
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Successfully deployed to Netlify!"
    } else {
        Write-Error "Netlify deployment failed."
        exit 1
    }
}

# Export for GitHub Pages
function Export-Static {
    Write-Status "Creating static export for GitHub Pages..."
    
    # Backup original config
    Copy-Item "next.config.ts" "next.config.ts.backup"
    
    # Create static export config
    @"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: '/Launch2'
};

export default nextConfig;
"@ | Out-File -FilePath "next.config.ts" -Encoding utf8
    
    # Build for static export
    npm run build
    
    # Restore original config
    Move-Item "next.config.ts.backup" "next.config.ts" -Force
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Static export created in 'out' directory!"
        Write-Status "Upload the 'out' directory to your static hosting provider."
    } else {
        Write-Error "Static export failed."
        if (Test-Path "next.config.ts.backup") {
            Move-Item "next.config.ts.backup" "next.config.ts" -Force
        }
        exit 1
    }
}

# Main menu
function Show-Menu {
    Write-Host ""
    Write-Host "Choose deployment option:"
    Write-Host "1) 🚀 Deploy to Vercel (Recommended)"
    Write-Host "2) 🌐 Deploy to Netlify"
    Write-Host "3) 📄 Create static export (GitHub Pages, etc.)"
    Write-Host "4) 🧪 Build and test locally only"
    Write-Host "5) ❌ Exit"
    Write-Host ""
}

# Main deployment flow
function Main {
    Write-Status "Checking prerequisites..."
    
    # Check if we're in a git repository
    try {
        git rev-parse --git-dir | Out-Null
    } catch {
        Write-Error "Not in a git repository!"
        exit 1
    }
    
    # Check if package.json exists
    if (-not (Test-Path "package.json")) {
        Write-Error "package.json not found! Make sure you're in the project root."
        exit 1
    }
    
    # Check git status
    Test-GitStatus
    
    # Show menu and get user choice
    do {
        Show-Menu
        $choice = Read-Host "Enter your choice (1-5)"
        
        switch ($choice) {
            "1" {
                if (Build-Locally) {
                    Deploy-Vercel
                }
                $continue = $false
            }
            "2" {
                if (Build-Locally) {
                    Deploy-Netlify
                }
                $continue = $false
            }
            "3" {
                Export-Static
                $continue = $false
            }
            "4" {
                Build-Locally
                $continue = $false
            }
            "5" {
                Write-Status "Goodbye! 👋"
                exit 0
            }
            default {
                Write-Error "Invalid option. Please choose 1-5."
                $continue = $true
            }
        }
    } while ($continue)
    
    Write-Host ""
    Write-Success "🎉 Deployment process completed!"
    Write-Status "Your Launch Transportation Platform is ready to manage fleets worldwide!"
}

# Run main function
Main
