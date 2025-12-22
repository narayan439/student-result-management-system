@echo off
REM ========================================
REM BACKEND CONNECTIVITY TEST
REM ========================================

echo.
echo ========================================
echo TESTING BACKEND CONNECTIVITY
echo ========================================
echo.

REM Test 1: Ping localhost:8080
echo [TEST 1] Checking if backend responds...
curl -s http://localhost:8080/auth/check-email/test@test.com > nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ PASS - Backend is RUNNING
) else (
    echo ✗ FAIL - Backend NOT responding
    echo.
    echo ACTION: Start backend with:
    echo   cd Backend\srms
    echo   mvn spring-boot:run
    echo.
    pause
    exit /b 1
)

REM Test 2: Test /login endpoint
echo.
echo [TEST 2] Testing /login endpoint...
curl -X POST http://localhost:8080/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"admin@gmail.com\",\"password\":\"123456\"}" 2>nul > nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ PASS - /login endpoint works
) else (
    echo ✗ FAIL - /login endpoint error
)

REM Test 3: Test /teachers-login endpoint
echo.
echo [TEST 3] Testing /teachers-login endpoint...
curl -X POST http://localhost:8080/auth/teachers-login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"sharma@teacher.com\",\"password\":\"SHA6655\"}" 2>nul > nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ PASS - /teachers-login endpoint works
) else (
    echo ✗ FAIL - /teachers-login endpoint error
)

REM Test 4: Test /student-login endpoint
echo.
echo [TEST 4] Testing /student-login endpoint...
curl -X POST http://localhost:8080/auth/student-login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"raj.kumar@student.com\",\"password\":\"15052005\"}" 2>nul > nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ PASS - /student-login endpoint works
) else (
    echo ✗ FAIL - /student-login endpoint error
)

echo.
echo ========================================
echo FULL TEST WITH RESPONSE
echo ========================================
echo.
echo [FULL TEST] Teacher Login with response:
echo.
curl -X POST http://localhost:8080/auth/teachers-login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"sharma@teacher.com\",\"password\":\"SHA6655\"}"

echo.
echo.
echo ========================================
pause
