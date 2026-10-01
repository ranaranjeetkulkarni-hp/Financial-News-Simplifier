@echo off
title FinNews AI - Backend Server
echo ========================================================
echo         FINNEWS AI - FINANCIAL NEWS SIMPLIFIER
echo ========================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in your PATH.
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if virtual environment exists and activate it
if exist venv\Scripts\activate.bat (
    echo [INFO] Activating virtual environment (venv)...
    call venv\Scripts\activate.bat
) else if exist .venv\Scripts\activate.bat (
    echo [INFO] Activating virtual environment (.venv)...
    call .venv\Scripts\activate.bat
) else (
    echo [NOTE] No virtual environment found. Running with global Python.
    echo [TIP] To create one: python -m venv venv
)

REM Check if .env file exists
if not exist .env (
    if exist .env.example (
        echo [WARNING] No .env file detected!
        echo Copying .env.example to .env...
        copy .env.example .env >nul
        echo [ACTION REQUIRED] Please edit .env with your NEWS_API_KEY and GROQ_API_KEY!
        echo.
    )
)

echo [INFO] Starting FastAPI server on http://127.0.0.1:8000 ...
echo [INFO] OpenAPI Docs available at http://127.0.0.1:8000/docs
echo [INFO] Press Ctrl+C to stop the server.
echo.

python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server stopped with an error.
    echo Check that dependencies are installed: pip install -r requirements.txt
    pause
)
