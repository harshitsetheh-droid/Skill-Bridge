@echo off
echo =========================================
echo  TalentBridge - Backend + Frontend
echo =========================================
echo.
echo Starting backend on port 3001...
start "TalentBridge Backend" cmd /k "npm run server"
echo Starting frontend on port 3000...
start "TalentBridge Frontend" cmd /k "npm run dev"
echo.
echo Both servers starting. Frontend: http://localhost:3000
echo Backend API: http://localhost:3001
pause
