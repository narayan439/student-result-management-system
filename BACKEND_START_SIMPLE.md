# SIMPLE STEP-BY-STEP - Start Backend Now

## OPTION 1: Automated (Recommended for Windows) ⭐

**Double-click one of these files in your project root**:
- `START_BACKEND.bat` (Windows Command Prompt)
- `START_BACKEND.ps1` (PowerShell)

This will:
1. ✅ Check if port 8080 is in use
2. ✅ Kill old process if running
3. ✅ Start backend automatically

**Done!** Wait for message: `Tomcat started on port(s): 8080`

---

## OPTION 2: Manual (Terminal) ⚙️

### Step 1: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac/Linux**: Open Terminal app

### Step 2: Navigate to Backend
```bash
cd Backend/srms
```

### Step 3: Start Backend
```bash
mvn spring-boot:run
```

### Step 4: Wait for This Message
```
Tomcat started on port(s): 8080 (http) with context path ''
Started SrmsApplication in x.xxx seconds
```

**When you see this message → Backend is READY ✅**

---

## OPTION 3: Visual Studio Code (If using it)

1. Open VS Code terminal (Ctrl+`)
2. Paste:
```bash
cd Backend/srms && mvn clean spring-boot:run
```
3. Press Enter
4. Wait for "Tomcat started..." message

---

## Test Backend is Running

### Open New Terminal/Command Prompt
```bash
# Windows - Test if backend responds
curl http://localhost:8080/auth/check-email/test@test.com

# Or use Postman - GET request
GET http://localhost:8080/auth/check-email/test@test.com
```

✅ **If you get response** → Backend working!
❌ **If error** → Backend not running

---

## Now Test Teacher Login in Postman

```
Method: POST
URL: http://localhost:8080/auth/teachers-login

Headers:
Content-Type: application/json

Body (JSON):
{
  "email": "sharma@teacher.com",
  "password": "SHA6655"
}
```

### Expected Responses:

✅ **Status 200** (Success):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "role": "TEACHER",
    "name": "Dr. Sharma",
    "redirectPath": "/teacher/dashboard"
  }
}
```

⚠️ **Status 401** (Wrong password - but backend works!):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

❌ **Status 404** (Backend still not running):
```
404 Not Found
```

---

## Backend Console Output Sample

When successfully started, you should see:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_|\__, | / / / /
 =========|_|==============|___/=/_/_/_/

2025-12-21 01:47:56 - Starting SrmsApplication v1.0.0
2025-12-21 01:47:56 - No active profile set, falling back
2025-12-21 01:47:58 - JPA metamodel generation took 123 ms
2025-12-21 01:47:58 - Tomcat started on port(s): 8080 (http)
2025-12-21 01:47:58 - Started SrmsApplication in 2.456 seconds
```

If you don't see "Tomcat started on port(s): 8080", it failed.

---

## Troubleshooting

### "Port 8080 in use"
This is normal if backend was running before. The scripts handle this automatically.
If manual, see next step.

### "Connection refused" or "Cannot connect"
1. Make sure backend terminal is still open (not closed)
2. Wait full 5-10 seconds for startup
3. Check for errors in backend console

### "BUILD FAILURE" message
1. Make sure MySQL is running
2. Make sure Maven is installed
3. Navigate to correct folder: `Backend/srms`

### Still Getting 404?
1. Is terminal still showing startup messages? (It should not be waiting for input)
2. Is backend console showing "Tomcat started"?
3. Try: `curl http://localhost:8080/auth/check-email/test@test.com`

---

## Quick Checklist

- [ ] MySQL running
- [ ] Backend started (Tomcat on 8080)
- [ ] URL exactly: `http://localhost:8080/auth/teachers-login`
- [ ] Method: POST
- [ ] Content-Type: application/json
- [ ] Email: `sharma@teacher.com`
- [ ] Password: `SHA6655`
- [ ] Request sent from Postman
- [ ] Postman shows response (not 404)

Once all checked → Should see success response!
