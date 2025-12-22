# 404 Not Found Error - Diagnostic Guide

## Problem
```
404 Not Found - http://localhost:8080/auth/teachers-login
```

## Root Causes (In Order of Likelihood)

### 1. ❌ Backend Not Running
**Symptom**: All endpoints return 404

**Solution**:
```bash
# Terminal 1: Navigate to backend
cd Backend/srms

# Terminal 2: Start Spring Boot
mvn spring-boot:run

# Wait for: "Tomcat started on port(s): 8080"
```

### 2. ❌ Old Backend Process Still Running
**Symptom**: Changes don't take effect even after rebuilding

**Solution - Windows**:
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Restart backend
mvn spring-boot:run
```

**Solution - Mac/Linux**:
```bash
# Find process
lsof -i :8080

# Kill it (replace PID)
kill -9 <PID>

# Restart backend
mvn spring-boot:run
```

### 3. ⚠️ Wrong URL Format
**Check**:
- ✅ Correct: `http://localhost:8080/auth/teachers-login`
- ❌ Wrong: `http://localhost:8080/auth/teacher-login` (missing 's')
- ❌ Wrong: `http://localhost:8080/teachers-login` (missing '/auth')
- ❌ Wrong: `http://localhost:8080/api/auth/teachers-login` (extra '/api')

### 4. ⚠️ CORS Issue
**Symptom**: Request sent but blocked by browser

**Solution**: Already configured in AuthController:
```java
@CrossOrigin(origins = "http://localhost:4200")
```

Make sure frontend is running on `http://localhost:4200`

### 5. ⚠️ Controller Not Loaded
**Symptom**: Backend starts but endpoints missing

**Solution**: Check backend console for:
```
Mapped POST   /auth/login
Mapped POST   /auth/teachers-login
Mapped POST   /auth/student-login
```

If NOT showing, controller wasn't scanned. Restart backend.

---

## Verification Steps

### Step 1: Check Backend Console
Restart backend and look for:
```
2025-12-21 xx:xx:xx - Starting SrmsApplication
...
Tomcat started on port(s): 8080 (http)
Starting Spring embedded web server
```

### Step 2: Test Basic Endpoint First
In Postman, try simpler endpoint first:

```
GET http://localhost:8080/auth/check-email/test@test.com
```

**If works**: Backend is running, routing works
**If fails**: Backend not running

### Step 3: Check Mapped Endpoints
In backend console, look for this pattern:

```
Mapped POST   /auth/login
Mapped POST   /auth/teachers-login
Mapped POST   /auth/student-login
Mapped POST   /auth/register
Mapped GET    /auth/check-email/{email}
Mapped GET    /auth/check-username/{username}
```

### Step 4: Full URL Test Sequence

**Test 1: Generic Login**
```
POST http://localhost:8080/auth/login
Body: {"email": "admin@gmail.com", "password": "123456"}
```

**Test 2: Teacher Login**
```
POST http://localhost:8080/auth/teachers-login
Body: {"email": "sharma@teacher.com", "password": "SHA6655"}
```

**Test 3: Student Login**
```
POST http://localhost:8080/auth/student-login
Body: {"email": "raj.kumar@student.com", "password": "15052005"}
```

---

## Quick Restart Procedure

### If Using IDE (Eclipse/IntelliJ)
1. Stop Spring Boot application (red square button)
2. Wait 5 seconds
3. Start Spring Boot application (green play button)
4. Wait for "Tomcat started..."
5. Try Postman again

### If Using Terminal/Command Line
```bash
# Stop (Ctrl+C in terminal)
# Then restart:
mvn clean spring-boot:run
```

### If Using Maven Directly
```bash
cd Backend/srms
mvn clean install
mvn spring-boot:run
```

---

## Expected Console Output After Start

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/

2025-12-21 xx:xx:xx - Starting SrmsApplication v1.0.0
2025-12-21 xx:xx:xx - No active profile set, falling back to 1 default profile
2025-12-21 xx:xx:xx - Starting SRMS using Java 17.0.x
...
2025-12-21 xx:xx:xx - Mapped POST   /auth/login
2025-12-21 xx:xx:xx - Mapped POST   /auth/teachers-login
2025-12-21 xx:xx:xx - Mapped POST   /auth/student-login
...
2025-12-21 xx:xx:xx - Tomcat started on port(s): 8080 (http) with context path ''
2025-12-21 xx:xx:xx - Started SrmsApplication in x.xxx seconds
```

If you DON'T see "Tomcat started on port 8080", backend didn't start.

---

## Postman Troubleshooting

### In Postman Console
Press `Ctrl+Alt+C` to show console

**Should show**:
```
→ POST /auth/teachers-login
← 200 OK
```

**If shows**:
```
← 404 Not Found
```

Then backend endpoints not recognized.

---

## MySQL Database Check

Ensure database is running:

```sql
-- In MySQL terminal
USE srms_database;
SELECT COUNT(*) FROM teachers;
-- Should show: 6 (or your teacher count)
```

If can't connect, MySQL not running.

---

## Final Checklist

- [ ] MySQL running
- [ ] Backend started (Tomcat on port 8080)
- [ ] No old process on port 8080
- [ ] Controllers loaded ("Mapped POST /auth/...")
- [ ] URL exact: `http://localhost:8080/auth/teachers-login`
- [ ] Method: POST
- [ ] Headers: Content-Type: application/json
- [ ] Body: Valid JSON
- [ ] Teachers table has passwords (NOT NULL)

---

## If Still Failing After All This

**Share these details**:
1. Backend console full output
2. MySQL query result: `SELECT COUNT(*) FROM teachers;`
3. Postman response (including headers)
4. URL you're testing
5. Request body format

