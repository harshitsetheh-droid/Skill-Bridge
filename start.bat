@echo off
echo =========================================
echo  SkillBridge - Backend + Frontend
echo =========================================
echo.
echo Starting backend on port 3001...
start "SkillBridge Backend" cmd /k "npm run server"
echo Starting frontend on port 3000...
start "SkillBridge Frontend" cmd /k "npm run dev"
echo.
echo Both servers starting. Frontend: http://localhost:3000
echo Backend API: http://localhost:3001
pause
