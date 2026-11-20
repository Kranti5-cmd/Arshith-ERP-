@echo off
echo ===================================================================
echo   ARSHITH GROUP ERM - UNIFIED ENTERPRISE WITH FINANCE & CRM
echo ===================================================================

set "BASE_DIR=%~dp0"
if exist "%BASE_DIR%apps\finance" (
  set "FINANCE_DIR=%BASE_DIR%apps\finance"
) else (
  set "FINANCE_DIR=%BASE_DIR%..\crm_finance_repo"
)

if exist "%BASE_DIR%apps\codelekho-crm\server" (
  set "CRM_SERVER_DIR=%BASE_DIR%apps\codelekho-crm\server"
  set "CRM_CLIENT_DIR=%BASE_DIR%apps\codelekho-crm\client"
) else (
  set "CRM_SERVER_DIR=C:\Users\KRANTI\CRM\server"
  set "CRM_CLIENT_DIR=C:\Users\KRANTI\CRM\client"
)

echo [1/5] Checking PostgreSQL cluster on port 5434...
netstat -ano | findstr :5434 >nul 2>&1
if %errorlevel% equ 0 (
  echo   -- PostgreSQL is already running on port 5434.
) else (
  echo   -- Starting PostgreSQL on port 5434...
  start "Postgres 5434" /min "C:\Users\KRANTI\tools\pgsql\bin\postgres.exe" -D "%FINANCE_DIR%\.pgdata_clean" -p 5434
  timeout /t 2 >nul
)

echo [2/5] Checking Finance ERP service on port 3100...
netstat -ano | findstr :3100 >nul 2>&1
if %errorlevel% equ 0 (
  echo   -- Finance ERP is already running on http://localhost:3100
) else (
  echo   -- Starting Finance ERP on port 3100...
  start "Finance ERP 3100" /min cmd /c "cd /d %FINANCE_DIR% && npm run dev -- -p 3100"
  timeout /t 3 >nul
)

echo [3/5] Checking CodeLekho CRM Backend on port 5000...
netstat -ano | findstr :5000 >nul 2>&1
if %errorlevel% equ 0 (
  echo   -- CodeLekho CRM Backend is already running on http://localhost:5000
) else (
  echo   -- Starting CodeLekho CRM Backend on port 5000...
  start "CRM Backend 5000" /min cmd /c "cd /d %CRM_SERVER_DIR% && node server.js"
  timeout /t 2 >nul
)

echo [4/5] Checking CodeLekho CRM Frontend on port 5173...
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
  echo   -- CodeLekho CRM Frontend is already running on http://localhost:5173
) else (
  echo   -- Starting CodeLekho CRM Frontend on port 5173...
  start "CRM Frontend 5173" /min cmd /c "cd /d %CRM_CLIENT_DIR% && npm run dev"
  timeout /t 3 >nul
)

echo [5/5] Checking Main ERM Server on port 5001...
netstat -ano | findstr :5001 >nul 2>&1
if %errorlevel% equ 0 (
  echo   -- Main ERM Server is already running on http://localhost:5001
) else (
  echo   -- Starting Main ERM Server on port 5001...
  start "ERM Server 5001" /min cmd /c "cd /d %BASE_DIR%server && node src/server.js"
  timeout /t 2 >nul
)

echo.
echo ===================================================================
echo   ALL SYSTEMS ONLINE:
echo   - Arshith Group ERM:   http://localhost:5001
echo   - CodeLekho CRM Hub:   http://localhost:5173
echo   - Multi-Co Finance:    http://localhost:3100
echo   - PostgreSQL Cluster:  127.0.0.1:5434 (Database: erp)
echo ===================================================================
start http://localhost:5001
exit /b 0

