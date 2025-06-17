#!/bin/bash

# 🚀 Launch Transportation Platform - Deployment Script
# This script helps deploy your application to various platforms

echo "🚀 Launch Transportation Platform - Deployment Helper"
echo "=================================================="

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

# Check if git is clean
check_git_status() {
    if [[ -n $(git status --porcelain) ]]; then
        print_warning "You have uncommitted changes. Please commit them first."
        git status --short
        read -p "Do you want to continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Build and test locally
build_locally() {
    print_status "Building application locally..."
    npm run build
    if [ $? -eq 0 ]; then
        print_success "Local build successful!"
    else
        print_error "Local build failed. Please fix errors before deploying."
        exit 1
    fi
}

# Deploy to Vercel
deploy_vercel() {
    print_status "Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm i -g vercel
    fi
    
    # Deploy to production
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Successfully deployed to Vercel!"
        print_status "Your app should be available at: https://launch-transportation-platform.vercel.app"
    else
        print_error "Vercel deployment failed."
        exit 1
    fi
}

# Deploy to Netlify
deploy_netlify() {
    print_status "Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm i -g netlify-cli
    fi
    
    # Build and deploy
    npm run build
    netlify deploy --prod --dir=.next
    
    if [ $? -eq 0 ]; then
        print_success "Successfully deployed to Netlify!"
    else
        print_error "Netlify deployment failed."
        exit 1
    fi
}

# Export for GitHub Pages
export_static() {
    print_status "Creating static export for GitHub Pages..."
    
    # Temporarily modify next.config.ts for static export
    cp next.config.ts next.config.ts.backup
    
    cat > next.config.ts << EOF
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
EOF
    
    # Build for static export
    npm run build
    
    # Restore original config
    mv next.config.ts.backup next.config.ts
    
    if [ $? -eq 0 ]; then
        print_success "Static export created in 'out' directory!"
        print_status "Upload the 'out' directory to your static hosting provider."
    else
        print_error "Static export failed."
        mv next.config.ts.backup next.config.ts
        exit 1
    fi
}

# Main menu
show_menu() {
    echo ""
    echo "Choose deployment option:"
    echo "1) 🚀 Deploy to Vercel (Recommended)"
    echo "2) 🌐 Deploy to Netlify"
    echo "3) 📄 Create static export (GitHub Pages, etc.)"
    echo "4) 🧪 Build and test locally only"
    echo "5) ❌ Exit"
    echo ""
}

# Main deployment flow
main() {
    print_status "Checking prerequisites..."
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository!"
        exit 1
    fi
    
    # Check if package.json exists
    if [[ ! -f "package.json" ]]; then
        print_error "package.json not found! Make sure you're in the project root."
        exit 1
    fi
    
    # Check git status
    check_git_status
    
    # Show menu and get user choice
    while true; do
        show_menu
        read -p "Enter your choice (1-5): " choice
        
        case $choice in
            1)
                build_locally && deploy_vercel
                break
                ;;
            2)
                build_locally && deploy_netlify
                break
                ;;
            3)
                export_static
                break
                ;;
            4)
                build_locally
                break
                ;;
            5)
                print_status "Goodbye! 👋"
                exit 0
                ;;
            *)
                print_error "Invalid option. Please choose 1-5."
                ;;
        esac
    done
    
    echo ""
    print_success "🎉 Deployment process completed!"
    print_status "Your Launch Transportation Platform is ready to manage fleets worldwide!"
}

# Run main function
main "$@"
