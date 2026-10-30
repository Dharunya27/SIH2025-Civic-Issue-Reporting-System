@echo off
echo ========================================================
echo  Starting Civic Issue Reporting & Resolution System
echo ========================================================

echo Starting Spring Boot Backend (Port 8080)...
start "CivicIssue Backend" cmd /k "cd SIH_2025_civic_issue_reporting_reporting_system && mvnw.cmd spring-boot:run"

echo Waiting 5 seconds before launching frontend...
timeout /t 5 /nobreak >nul

echo Starting React Frontend (Port 3000)...
start "CivicIssue Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo  Both services launched!
echo  Frontend UI:  http://localhost:3000
echo  Swagger API:  http://localhost:8080/swagger-ui/index.html
echo ========================================================
pause

