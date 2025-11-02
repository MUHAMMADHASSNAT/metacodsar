@echo off
echo ========================================
echo    MetaCodsar Application Startup
echo ========================================
echo.

echo [1/5] Checking and freeing port 5001...
cd server
node free-port.js >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Port may be in use, attempting to free it...
    timeout /t 2 /nobreak >nul
)
cd ..
echo ✓ Port check complete

echo.
echo [2/5] Starting Server on port 5001...
cd server
start "MetaCodsar Server" cmd /k "echo Server Starting... && npm start"
cd ..
echo ✓ Server process started

echo.
echo [3/5] Waiting for server to initialize...
timeout /t 5 /nobreak >nul

echo.
echo [4/5] Testing server connection...
curl -s http://localhost:5001/api/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Server may still be starting. This is normal if first time.
) else (
    echo ✓ Server is running and responding!
)

echo.
echo [5/5] Starting Client on port 5173...
cd client
start "MetaCodsar Client" cmd /k "echo Client Starting... && npm run dev"
cd ..
echo ✓ Client process started

echo.
echo ========================================
echo           🚀 READY TO USE! 🚀
echo ========================================
echo.
echo 📱 Client: http://localhost:5173
echo 🔧 Server: http://localhost:5001
echo 🔗 Health: http://localhost:5001/api/health
echo.
echo 🔐 Login Credentials:
echo    Email: admin@metacodsar.com
echo    Password: password
echo.
echo Press any key to exit this window...
pause >nul