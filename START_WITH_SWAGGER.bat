@echo off
cls
echo ============================================================
echo      Khmer Calendar API v2.0 - With Swagger UI
echo ============================================================
echo.
echo Stopping any running servers...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :3002 ^| findstr LISTENING') DO TaskKill /F /PID %%P 2>nul
timeout /t 2 /nobreak >nul
cls
echo.
echo ============================================================
echo      Khmer Calendar API v2.0 - With Swagger UI
echo ============================================================
echo.
echo Starting API on http://localhost:3002
echo.
echo 📖 Swagger Documentation: http://localhost:3002/docs
echo.
echo Available Endpoints:
echo   - GET /current
echo   - GET /convert?date=YYYY-MM-DD
echo   - GET /lunar?date=YYYY-MM-DD
echo   - GET /months
echo   - GET /days
echo.
echo Press Ctrl+C to stop the server
echo ============================================================
echo.
node test-server.js

