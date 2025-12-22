# START_BACKEND.ps1
# PowerShell script to start backend with automatic port cleanup

Write-Host "Checking if port 8080 is in use..." -ForegroundColor Cyan

# Check if port 8080 is already in use
$portInUse = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue

if ($portInUse) {
    Write-Host "Port 8080 is IN USE!" -ForegroundColor Red
    Write-Host "Killing existing process..." -ForegroundColor Yellow
    
    # Get process using port 8080
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "Process: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Write-Host "Process killed!" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "Port 8080 is FREE" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting backend..." -ForegroundColor Cyan
Write-Host "Location: Backend\srms" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend and start
Set-Location "Backend\srms"
Write-Host "Running: mvn spring-boot:run" -ForegroundColor Cyan
Write-Host ""

mvn spring-boot:run

Write-Host ""
Write-Host "Press any key to close..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
