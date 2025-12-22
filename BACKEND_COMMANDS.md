# Backend Status Check Commands

## Windows Command Prompt

### 1. Check if Backend is Running
```cmd
curl http://localhost:8080/auth/check-email/test@test.com
```
- ✅ Shows JSON response = Backend running
- ❌ Connection refused = Backend not running
- ❌ 404 = Backend not recognizing endpoint

### 2. Check Port 8080
```cmd
netstat -ano | findstr :8080
```
- Shows process using 8080
- If shows Java process = Backend running
- If nothing = Port free, backend not running

### 3. Kill Process on Port 8080
```cmd
taskkill /PID <PID_NUMBER> /F
```

### 4. Test Teacher Login Endpoint
```cmd
curl -X POST http://localhost:8080/auth/teachers-login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"sharma@teacher.com\",\"password\":\"SHA6655\"}"
```

---

## PowerShell

### 1. Check if Backend is Running
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/auth/check-email/test@test.com" -Method Get
```

### 2. Check Port 8080
```powershell
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | Select-Object OwningProcess
```

### 3. Kill Process on Port 8080
```powershell
$process = Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
Stop-Process -Id $process.OwningProcess -Force
```

### 4. Test Teacher Login
```powershell
$body = @{
    email = "sharma@teacher.com"
    password = "SHA6655"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/auth/teachers-login" `
  -Method Post `
  -Headers @{"Content-Type"="application/json"} `
  -Body $body
```

---

## Backend Start Commands

### Option 1: Maven Direct
```bash
cd Backend/srms
mvn spring-boot:run
```

### Option 2: Maven Clean
```bash
cd Backend/srms
mvn clean install
mvn spring-boot:run
```

### Option 3: IDE (Eclipse/IntelliJ)
- Right-click project
- Run As → Spring Boot Application

---

## Expected Output When Backend Starts

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/

2025-12-21 xx:xx:xx.xxx INFO  - Starting SrmsApplication v1.0.0
2025-12-21 xx:xx:xx.xxx INFO  - No active profile set
2025-12-21 xx:xx:xx.xxx INFO  - JPA metamodel generation took xxx ms
2025-12-21 xx:xx:xx.xxx INFO  - HikariPool-1 - Driver does not support Statement.query with integer columns
2025-12-21 xx:xx:xx.xxx INFO  - Mapped POST   /auth/login
2025-12-21 xx:xx:xx.xxx INFO  - Mapped POST   /auth/teachers-login
2025-12-21 xx:xx:xx.xxx INFO  - Mapped POST   /auth/student-login
2025-12-21 xx:xx:xx.xxx INFO  - Mapped POST   /auth/register
2025-12-21 xx:xx:xx.xxx INFO  - Mapped GET    /auth/check-email/{email}
2025-12-21 xx:xx:xx.xxx INFO  - Tomcat started on port(s): 8080 (http)
2025-12-21 xx:xx:xx.xxx INFO  - Started SrmsApplication in x.xxx seconds
```

**KEY LINE**: `Tomcat started on port(s): 8080 (http)` = Ready!

---

## Test Sequence

1. **Run**: `mvn spring-boot:run`
2. **Wait for**: "Tomcat started on port(s): 8080"
3. **Open new terminal/command**
4. **Run test command** from above
5. **Check response**

If response is NOT 404 → Backend working! ✅

