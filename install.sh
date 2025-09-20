#!/bin/bash

# AI Debate Partner - Installation Script
# This script sets up the complete AI Debate Partner application

set -e

echo "🚀 Setting up AI Debate Partner..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}📝 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
check_node() {
    print_step "Checking Node.js installation..."
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js found: $NODE_VERSION"
        
        # Check if version is >= 18
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$MAJOR_VERSION" -lt 18 ]; then
            print_error "Node.js version 18 or higher is required. Please upgrade Node.js."
            exit 1
        fi
    else
        print_error "Node.js not found. Please install Node.js 18 or higher."
        echo "Visit: https://nodejs.org/"
        exit 1
    fi
}

# Check if Docker is installed (optional)
check_docker() {
    print_step "Checking Docker installation..."
    if command -v docker &> /dev/null; then
        DOCKER_VERSION=$(docker --version)
        print_success "Docker found: $DOCKER_VERSION"
        return 0
    else
        print_warning "Docker not found. Docker is optional but recommended for easy setup."
        return 1
    fi
}

# Install dependencies
install_dependencies() {
    print_step "Installing project dependencies..."
    
    if [ ! -f package.json ]; then
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
    
    npm install
    print_success "Root dependencies installed"
    
    # Install shared dependencies
    if [ -d "shared" ]; then
        print_step "Installing shared dependencies..."
        cd shared && npm install && cd ..
        print_success "Shared dependencies installed"
    fi
    
    # Install backend dependencies
    if [ -d "backend" ]; then
        print_step "Installing backend dependencies..."
        cd backend && npm install && cd ..
        print_success "Backend dependencies installed"
    fi
    
    # Install frontend dependencies
    if [ -d "frontend" ]; then
        print_step "Installing frontend dependencies..."
        cd frontend && npm install && cd ..
        print_success "Frontend dependencies installed"
    fi
}

# Setup environment variables
setup_env() {
    print_step "Setting up environment variables..."
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Created .env from .env.example"
            print_warning "Please edit .env file with your actual values:"
            echo "  - GEMINI_API_KEY: Get from Google AI Studio"
            echo "  - EMAIL_SERVER_*: Configure for magic link authentication"
            echo "  - JWT_SECRET: Generate a secure random string (32+ characters)"
            echo "  - NEXTAUTH_SECRET: Generate a secure random string (32+ characters)"
        else
            print_error ".env.example not found. Please create environment configuration manually."
            return 1
        fi
    else
        print_success ".env file already exists"
    fi
}

# Setup database
setup_database() {
    print_step "Setting up database..."
    
    if [ -d "backend" ]; then
        cd backend
        
        # Create db directory if it doesn't exist
        mkdir -p db
        
        # Run database migrations
        if npm run db:generate > /dev/null 2>&1; then
            print_success "Database schema generated"
        else
            print_warning "Failed to generate database schema (this is normal for first run)"
        fi
        
        cd ..
    fi
}

# Build projects
build_projects() {
    print_step "Building projects..."
    
    # Build shared types
    if [ -d "shared" ]; then
        print_step "Building shared types..."
        cd shared && npm run build && cd ..
        print_success "Shared types built"
    fi
    
    # Build backend
    if [ -d "backend" ]; then
        print_step "Building backend..."
        cd backend && npm run build && cd ..
        print_success "Backend built"
    fi
    
    # Build frontend
    if [ -d "frontend" ]; then
        print_step "Building frontend..."
        cd frontend && npm run build && cd ..
        print_success "Frontend built"
    fi
}

# Setup with Docker
setup_docker() {
    print_step "Setting up with Docker..."
    
    if [ -f docker-compose.yml ]; then
        docker-compose pull
        docker-compose build
        print_success "Docker images built successfully"
        
        print_step "Starting services with Docker..."
        docker-compose up -d
        print_success "Services started with Docker"
        
        echo ""
        echo "🎉 Setup complete! Services are running:"
        echo "   Frontend: http://localhost:3000"
        echo "   Backend:  http://localhost:5000"
        echo "   ChromaDB: http://localhost:8000"
        echo ""
        echo "To view logs: docker-compose logs -f"
        echo "To stop:     docker-compose down"
    else
        print_error "docker-compose.yml not found"
        return 1
    fi
}

# Setup without Docker
setup_local() {
    print_step "Setting up for local development..."
    
    echo ""
    echo "🎉 Setup complete! To start the development servers:"
    echo ""
    echo "Terminal 1 - Start backend:"
    echo "  cd backend && npm run dev"
    echo ""
    echo "Terminal 2 - Start frontend:"
    echo "  cd frontend && npm run dev"
    echo ""
    echo "Terminal 3 - Start ChromaDB (optional):"
    echo "  docker run -p 8000:8000 chromadb/chroma:latest"
    echo "  # OR install and run ChromaDB locally"
    echo ""
    echo "Then visit: http://localhost:3000"
}

# Main installation flow
main() {
    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║        AI Debate Partner Setup         ║"
    echo "║                                        ║"
    echo "║  Full-stack AI debate application      ║"
    echo "║  with RAG and multi-perspective AI     ║"
    echo "╚════════════════════════════════════════╝"
    echo ""
    
    # Prerequisites check
    check_node
    HAS_DOCKER=$(check_docker && echo "1" || echo "0")
    
    # Installation
    install_dependencies
    setup_env
    setup_database
    
    # Ask user for setup preference
    echo ""
    if [ "$HAS_DOCKER" = "1" ]; then
        read -p "Would you like to use Docker for easy setup? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            setup_docker
            return
        fi
    fi
    
    # Local setup
    build_projects
    setup_local
    
    echo ""
    print_success "Installation completed successfully!"
    echo ""
    echo "📖 Next steps:"
    echo "   1. Edit .env file with your API keys"
    echo "   2. Start the development servers"
    echo "   3. Visit http://localhost:3000"
    echo ""
    echo "📚 Documentation:"
    echo "   - README.md: General information"
    echo "   - DEPLOYMENT.md: Deployment guide"
    echo ""
    echo "🆘 Need help? Check the documentation or create an issue on GitHub"
}

# Run main function
main "$@"