@echo off
echo Stopping Civic Issue Backend and Frontend...
powershell -Command "Get-Process -Name java, node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue"
echo Stopped all running services.
pause

