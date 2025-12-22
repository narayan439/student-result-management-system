@echo off
REM Check if port 8080 is in use
echo Checking port 8080...
netstat -ano | findstr :8080

if errorlevel 1 (
    echo Port 8080 is FREE - Backend not running
    echo.
    echo Starting backend...
    cd Backend\srms
    mvn spring-boot:run
) else (
    echo Port 8080 is IN USE - Killing process...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
        echo Killing PID: %%a
        taskkill /PID %%a /F
    )
    echo.
    echo Starting backend...
    cd Backend\srms
    mvn spring-boot:run
)

pause
