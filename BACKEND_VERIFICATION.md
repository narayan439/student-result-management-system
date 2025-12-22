# ✅ Backend Test Verification

## Confirm: Database is GOOD ✅
- ✅ Teacher table EXISTS
- ✅ Schema is CORRECT  
- ✅ Passwords are NOT NULL
- ✅ Teachers have data

---

## NOW TEST: Is Backend Running?

### Option 1: Use Automated Test Script

1. **Double-click**: `TEST_BACKEND.bat`
2. Shows if backend is responding
3. Tests all endpoints
4. Shows actual response

### Option 2: Manual Test in Postman

**Test 1: Simple Health Check**
```
GET http://localhost:8080/auth/check-email/test@test.com
```

**Expected Response (any response = backend working)**:
```json
{
  "success": true,
  "message": "Email check completed",
  "data": false
}
```

**If Error**: 
- ❌ 404 → Backend NOT running
- ✅ Any 200/401 → Backend IS running

---

## Test Teacher Login Endpoint

### Postman Request:
```
Method: POST
URL: http://localhost:8080/auth/teachers-login
Headers: Content-Type: application/json

Body:
{
  "email": "sharma@teacher.com",
  "password": "SHA6655"
}
```

### Possible Responses:

**✅ 200 OK** - Backend working, login successful:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "userId": 1,
    "role": "TEACHER",
    "name": "Dr. Sharma",
    "redirectPath": "/teacher/dashboard"
  }
}
```

**✅ 401 Unauthorized** - Backend working, password wrong:
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

**❌ 404 Not Found** - Backend NOT working:
```
404 Not Found
```

**❌ Connection Refused** - Backend NOT running at all

---

## If Getting 404 Still

Since database is good, check:

### 1. Is Backend Terminal Still Open?
- Should show: `Tomcat started on port(s): 8080`
- If closed → Start backend again
- If showing errors → Fix errors

### 2. Check Backend Console Logs
Look for these lines when backend starts:
```
Mapped POST   /auth/login
Mapped POST   /auth/teachers-login  
Mapped POST   /auth/student-login
Mapped POST   /auth/register
Mapped GET    /auth/check-email/{email}
```

If these lines are NOT there → Endpoints not loaded

### 3. Check for Compilation Errors
Backend output might show:
```
BUILD FAILURE
[ERROR] ...
```

If yes → Share the error message

### 4. Verify No Other Process on Port 8080
**Windows**:
```powershell
netstat -ano | findstr :8080
```

If shows process → Kill it:
```powershell
taskkill /PID <PID_NUMBER> /F
```

Then restart backend

---

## Full Diagnostic Steps

1. **Stop backend** (Ctrl+C)
2. **Wait 5 seconds**
3. **Kill any Java process** on port 8080
4. **Restart backend**:
   ```bash
   cd Backend/srms
   mvn clean spring-boot:run
   ```
5. **Wait for**: `Tomcat started on port(s): 8080`
6. **Test in Postman**
7. **Check response** (not 404 = working!)

---

## Debug Checklist

- [ ] Database has teacher passwords (NOT NULL)
- [ ] Backend terminal is OPEN (not closed)
- [ ] Backend shows "Tomcat started on port(s): 8080"
- [ ] No errors in backend console
- [ ] Backend shows "Mapped POST /auth/..." lines
- [ ] No other process on port 8080
- [ ] Postman URL: exactly `http://localhost:8080/auth/teachers-login`
- [ ] Postman Method: POST
- [ ] Postman Headers: Content-Type: application/json
- [ ] Postman Body: Valid JSON (proper quotes)
- [ ] Email: `sharma@teacher.com`
- [ ] Password: `SHA6655`

If ALL checked and still 404 → **Share backend console output**

---

## What's WORKING ✅
- Database schema
- Database data (passwords set)
- Backend code (compiles)
- Endpoints (defined)

## What's NOT working ❓
- Backend responding to requests (404 error)

## Most Likely Cause
**Backend is not actually running** or crashed silently

## Solution
1. Kill all Java processes
2. Start fresh: `mvn clean spring-boot:run`
3. Wait for full startup message
4. Keep terminal open
5. Test again

