@echo off
REM AI Debate Partner - Windows Installation Script
REM This script sets up the complete AI Debate Partner application on Windows

echo.
echo ╔════════════════════════════════════════╗
echo ║        AI Debate Partner Setup         ║
echo ║                                        ║
echo ║  Full-stack AI debate application      ║
echo ║  with RAG and multi-perspective AI     ║
echo ╚════════════════════════════════════════╝
echo.

echo 🚀 Setting up AI Debate Partner...
echo.

REM Check if Node.js is installed
echo 📝 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18 or higher.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js found: %NODE_VERSION%
)

REM Check if Docker is installed (optional)
echo 📝 Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker not found. Docker is optional but recommended for easy setup.
    set HAS_DOCKER=0
) else (
    for /f "tokens=*" %%i in ('docker --version') do set DOCKER_VERSION=%%i
    echo ✅ Docker found: %DOCKER_VERSION%
    set HAS_DOCKER=1
)

REM Install dependencies
echo.
echo 📝 Installing project dependencies...

if not exist package.json (
    echo ❌ package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)
echo ✅ Root dependencies installed

REM Install shared dependencies
if exist shared (
    echo 📝 Installing shared dependencies...
    cd shared
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install shared dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Shared dependencies installed
)

REM Install backend dependencies
if exist backend (
    echo 📝 Installing backend dependencies...
    cd backend
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install backend dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Backend dependencies installed
)

REM Install frontend dependencies
if exist frontend (
    echo 📝 Installing frontend dependencies...
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ Failed to install frontend dependencies
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Frontend dependencies installed
)

REM Setup environment variables
echo.
echo 📝 Setting up environment variables...

if not exist .env (
    if exist .env.example (
        copy .env.example .env >nul
        echo ✅ Created .env from .env.example
        echo ⚠️  Please edit .env file with your actual values:
        echo   - GEMINI_API_KEY: Get from Google AI Studio
        echo   - EMAIL_SERVER_*: Configure for magic link authentication
        echo   - JWT_SECRET: Generate a secure random string (32+ characters)
        echo   - NEXTAUTH_SECRET: Generate a secure random string (32+ characters)
    ) else (
        echo ❌ .env.example not found. Please create environment configuration manually.
    )
) else (
    echo ✅ .env file already exists
)

REM Setup database
echo.
echo 📝 Setting up database...

if exist backend (
    cd backend
    
    REM Create db directory if it doesn't exist
    if not exist db mkdir db
    
    REM Run database migrations (may fail on first run, that's normal)
    call npm run db:generate >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Database schema generated
    ) else (
        echo ⚠️  Failed to generate database schema (this is normal for first run)
    )
    
    cd ..
)

REM Ask user for setup preference
echo.
if %HAS_DOCKER%==1 (
    set /p USE_DOCKER="Would you like to use Docker for easy setup? (y/n): "
    if /i "%USE_DOCKER%"=="y" goto :docker_setup
    if /i "%USE_DOCKER%"=="yes" goto :docker_setup
)

goto :local_setup

:docker_setup
echo 📝 Setting up with Docker...

if exist docker-compose.yml (
    docker-compose pull
    docker-compose build
    if %errorlevel% neq 0 (
        echo ❌ Failed to build Docker images
        pause
        exit /b 1
    )
    echo ✅ Docker images built successfully
    
    echo 📝 Starting services with Docker...
    docker-compose up -d
    if %errorlevel% neq 0 (
        echo ❌ Failed to start services
        pause
        exit /b 1
    )
    echo ✅ Services started with Docker
    
    echo.
    echo 🎉 Setup complete! Services are running:
    echo    Frontend: http://localhost:3000
    echo    Backend:  http://localhost:5000
    echo    ChromaDB: http://localhost:8000
    echo.
    echo To view logs: docker-compose logs -f
    echo To stop:     docker-compose down
) else (
    echo ❌ docker-compose.yml not found
)
goto :end

:local_setup
echo 📝 Setting up for local development...

REM Build shared types
if exist shared (
    echo 📝 Building shared types...
    cd shared
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ Failed to build shared types
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Shared types built
)

REM Build backend
if exist backend (
    echo 📝 Building backend...
    cd backend
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ Failed to build backend
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Backend built
)

REM Build frontend
if exist frontend (
    echo 📝 Building frontend...
    cd frontend
    call npm run build
    if %errorlevel% neq 0 (
        echo ❌ Failed to build frontend
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Frontend built
)

echo.
echo 🎉 Setup complete! To start the development servers:
echo.
echo Terminal 1 - Start backend:
echo   cd backend ^&^& npm run dev
echo.
echo Terminal 2 - Start frontend:
echo   cd frontend ^&^& npm run dev
echo.
echo Terminal 3 - Start ChromaDB (optional):
echo   docker run -p 8000:8000 chromadb/chroma:latest
echo   # OR install and run ChromaDB locally
echo.
echo Then visit: http://localhost:3000

:end
echo.
echo ✅ Installation completed successfully!
echo.
echo 📖 Next steps:
echo    1. Edit .env file with your API keys
echo    2. Start the development servers
echo    3. Visit http://localhost:3000
echo.
echo 📚 Documentation:
echo    - README.md: General information
echo    - DEPLOYMENT.md: Deployment guide
echo.
echo 🆘 Need help? Check the documentation or create an issue on GitHub

pause