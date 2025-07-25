#!/bin/bash

# GuardianLayer Deployment Script
# This script handles the complete deployment of the GuardianLayer application

set -e  # Exit on any error

echo "🛡️  GuardianLayer Deployment Script"
echo "=================================="

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    if ! command -v supabase &> /dev/null; then
        print_warning "Supabase CLI is not installed. Installing..."
        npm install -g supabase
    fi
    
    print_success "All dependencies are available"
}

# Install project dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm run test
    print_success "All tests passed"
}

# Build the application
build_application() {
    print_status "Building application..."
    npm run build
    print_success "Application built successfully"
}

# Deploy Supabase functions
deploy_supabase() {
    print_status "Deploying Supabase functions..."
    
    # Check if Supabase is linked
    if [ ! -f ".supabase/config.toml" ]; then
        print_warning "Supabase project not linked. Please run 'supabase link' first."
        return 1
    fi
    
    # Deploy database migrations
    print_status "Running database migrations..."
    supabase db push
    
    # Deploy edge functions
    print_status "Deploying edge functions..."
    supabase functions deploy send-otp-email
    
    print_success "Supabase deployment completed"
}

# Deploy to Vercel (if configured)
deploy_vercel() {
    if command -v vercel &> /dev/null; then
        print_status "Deploying to Vercel..."
        vercel --prod
        print_success "Vercel deployment completed"
    else
        print_warning "Vercel CLI not found. Skipping Vercel deployment."
    fi
}

# Deploy to Netlify (if configured)
deploy_netlify() {
    if command -v netlify &> /dev/null; then
        print_status "Deploying to Netlify..."
        netlify deploy --prod --dir=dist
        print_success "Netlify deployment completed"
    else
        print_warning "Netlify CLI not found. Skipping Netlify deployment."
    fi
}

# Main deployment function
main() {
    echo "Starting deployment process..."
    echo ""
    
    # Parse command line arguments
    SKIP_TESTS=false
    SKIP_BUILD=false
    ENVIRONMENT="production"
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -h|--help)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --skip-tests    Skip running tests"
                echo "  --skip-build    Skip building the application"
                echo "  --env ENV       Set environment (development|staging|production)"
                echo "  -h, --help      Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    print_status "Deploying to environment: $ENVIRONMENT"
    echo ""
    
    # Step 1: Check dependencies
    check_dependencies
    echo ""
    
    # Step 2: Install dependencies
    install_dependencies
    echo ""
    
    # Step 3: Run tests (unless skipped)
    if [ "$SKIP_TESTS" = false ]; then
        run_tests
        echo ""
    else
        print_warning "Skipping tests"
        echo ""
    fi
    
    # Step 4: Build application (unless skipped)
    if [ "$SKIP_BUILD" = false ]; then
        build_application
        echo ""
    else
        print_warning "Skipping build"
        echo ""
    fi
    
    # Step 5: Deploy Supabase
    deploy_supabase
    echo ""
    
    # Step 6: Deploy to hosting platform
    case $ENVIRONMENT in
        production)
            deploy_vercel
            ;;
        staging)
            deploy_netlify
            ;;
        development)
            print_status "Development environment - skipping hosting deployment"
            ;;
    esac
    
    echo ""
    print_success "🎉 Deployment completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Verify the application is working correctly"
    echo "2. Run smoke tests on the deployed environment"
    echo "3. Monitor logs for any issues"
    echo "4. Update documentation if needed"
    echo ""
    echo "GuardianLayer is now protecting your users! 🛡️"
}

# Run the main function
main "$@"
