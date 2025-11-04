Write-Host "========================================" -ForegroundColor Green
Write-Host "  MetaCodsar Application Startup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check and free port 5001 if needed
Write-Host "[1/5] Checking port 5001..." -ForegroundColor Yellow
$portCheck = netstat -ano | findstr ":5001"
if ($portCheck) {
    Write-Host "⚠️  Port 5001 is in use. Attempting to free it..." -ForegroundColor Yellow
    Set-Location server
    node free-port.js
    Set-Location ..
    Start-Sleep -Seconds 3
} else {
    Write-Host "✅ Port 5001 is free" -ForegroundColor Green
}
Write-Host ""

# Start Server
Write-Host "[2/5] Starting Server on port 5001..." -ForegroundColor Yellow
Set-Location server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Server Starting...' -ForegroundColor Yellow; npm start"
Set-Location ..
Write-Host "✅ Server process started" -ForegroundColor Green
Write-Host ""

# Wait for server to initialize
Write-Host "[3/5] Waiting for server to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Test server connection
Write-Host "[4/5] Testing server connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001/api/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Server is running and responding!" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Server may still be starting. This is normal if it's the first time." -ForegroundColor Yellow
}
Write-Host ""

# Start Client
Write-Host "[5/5] Starting Client on port 5173..." -ForegroundColor Yellow
Set-Location client
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Client Starting...' -ForegroundColor Yellow; npm run dev"
Set-Location ..
Write-Host "✅ Client process started" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "     🚀 READY TO USE! 🚀" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Client: http://localhost:5173" -ForegroundColor Cyan
Write-Host "🔧 Server: http://localhost:5001" -ForegroundColor Cyan
Write-Host "🔗 Health: http://localhost:5001/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔐 Login Credentials:" -ForegroundColor Yellow
Write-Host "   Email: admin@metacodsar.com" -ForegroundColor White
Write-Host "   Password: password" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
