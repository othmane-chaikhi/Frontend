@echo off
echo ==================================
echo   Portfolio Frontend Server
echo ==================================
echo.

:: Check if node_modules exists
if not exist "node_modules" (
    echo First time setup - installing dependencies...
    npm install
    echo.
)

:: Check if .env.local exists
if not exist ".env.local" (
    echo Creating .env.local file...
    echo NEXT_PUBLIC_API_URL=http://localhost:8000/api > .env.local
    echo.
)

:: Start server
echo Starting Next.js development server...
echo Frontend will be available at: http://localhost:3000
echo.
echo Press CTRL+C to stop the server
echo.
npm run dev

