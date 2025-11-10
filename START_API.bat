@echo off
cls
echo ============================================================
echo      Khmer Calendar API v2.0 - Test Server
echo ============================================================
echo.
echo Starting API on http://localhost:3002
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

