@echo off
title Scrapify - Dev Server
color 0A

echo.
echo  ============================================
echo   Scrapify - AI Web Scraper
echo   Starting development environment...
echo  ============================================
echo.

:: ── Check Node.js ────────────────────────────
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  [ERROR] Node.js is not installed or not in PATH.
    echo  Download it from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v') do set NODE_VERSION=%%v
echo  [OK] Node.js %NODE_VERSION% detected

:: ── Check npm ────────────────────────────────
where npm >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo  [ERROR] npm is not available.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('npm -v') do set NPM_VERSION=%%v
echo  [OK] npm v%NPM_VERSION% detected
echo.

:: ── Check .env file ──────────────────────────
if not exist ".env" (
    color 0E
    echo  [WARN] No .env file found.
    echo  Copying .env.example to .env ...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo  [OK] .env created from .env.example
        echo.
        echo  !! ACTION REQUIRED: Open .env and fill in your API keys:
        echo       GOOGLE_GENAI_API_KEY
        echo       UPSTASH_REDIS_REST_URL
        echo       UPSTASH_REDIS_REST_TOKEN
        echo.
    ) else (
        echo  [WARN] .env.example not found either. Skipping.
        echo.
    )
    color 0A
)

:: ── Install dependencies ─────────────────────
if not exist "node_modules" (
    echo  [INFO] node_modules not found. Installing dependencies...
    echo.
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo.
        echo  [ERROR] npm install failed. Check the output above.
        pause
        exit /b 1
    )
    echo.
    echo  [OK] Dependencies installed.
    echo.
) else (
    echo  [OK] node_modules found. Skipping install.
    echo.
)

:: ── Start dev server ─────────────────────────
echo  ============================================
echo   Starting Next.js on http://localhost:9002
echo   Press Ctrl+C to stop the server
echo  ============================================
echo.

call npm run dev

:: ── If server exits ──────────────────────────
echo.
echo  [INFO] Dev server stopped.
pause
