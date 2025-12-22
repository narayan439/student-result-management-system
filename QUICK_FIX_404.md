# ⚡ Quick Fix for 404 Not Found Error

## Problem
```
404 Not Found
POST http://localhost:8080/auth/teachers-login
```

## Most Likely Causes (in order)

### 1. ❌ **Backend Not Running** (Most Common!)

**Fix**:
```bash
# Open terminal/command prompt
cd Backend/srms
mvn spring-boot:run

# Wait for:
# "Tomcat started on port(s): 8080 (http)"
```

### 2. ❌ **Port 8080 Already in Use**

**Fix - Windows**:
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID> /F
# Then restart backend
```

**Fix - Mac/Linux**:
```bash
lsof -i :8080
kill -9 <PID>
# Then restart backend
```

### 3. ⚠️ **Wrong URL Format**

**Correct**: `http://localhost:8080/auth/teachers-login`
**Wrong**: 
- `http://localhost:8080/teachers-login` (missing /auth)
- `http://localhost:8080/teacher-login` (missing 's')
- `http://localhost:8080/api/auth/teachers-login` (extra /api)

### 4. ⚠️ **Database Not Running**

**Check MySQL**:
```bash
# Try to connect
mysql -u root -p srms_database
SELECT COUNT(*) FROM teachers;
EXIT;
```

---

## Verification Checklist

- [ ] **MySQL running** - Can connect to database
- [ ] **Backend started** - Terminal shows "Tomcat started on port 8080"
- [ ] **No port conflict** - Port 8080 is free
- [ ] **URL correct** - Exactly: `http://localhost:8080/auth/teachers-login`
- [ ] **Method**: POST
- [ ] **Headers**: `Content-Type: application/json`
- [ ] **Request Body** (valid JSON):
```json
{
  "email": "sharma@teacher.com",
  "password": "SHA6655"
}
```

---

## Test in This Order

### Test 1: Backend Running?
```
GET http://localhost:8080/auth/check-email/test@test.com
```
- ✅ **200 OK** → Backend running
- ❌ **404 or connection refused** → Backend not running

### Test 2: Generic Login Works?
```
POST http://localhost:8080/auth/login
{"email": "admin@gmail.com", "password": "123456"}
```
- ✅ **200 OK** → Controllers working
- ❌ **404** → Endpoint not found

### Test 3: Teacher Login Works?
```
POST http://localhost:8080/auth/teachers-login
{"email": "sharma@teacher.com", "password": "SHA6655"}
```
- ✅ **200 OK** → SUCCESS!
- ❌ **404** → Controller issue
- ❌ **401** → Password wrong (database issue)

---

## 99% Solution

```bash
# Step 1: Kill any Java process on port 8080
# (Use Windows: taskkill command above, or Mac: kill command)

# Step 2: Navigate to backend
cd Backend/srms

# Step 3: Clean and rebuild
mvn clean spring-boot:run

# Step 4: Wait for this message
# "Tomcat started on port(s): 8080 (http)"

# Step 5: In Postman - Try again
POST http://localhost:8080/auth/teachers-login
```

---

## Backend Console Should Show

```
Mapped POST   /auth/login
Mapped POST   /auth/teachers-login
Mapped POST   /auth/student-login
Mapped POST   /auth/register
Mapped GET    /auth/check-email/{email}
```

If you DON'T see these "Mapped" messages, controllers not loaded.

---

**Still 404?** → Backend not running or wrong URL format.
**Now getting 401?** → Good! Backend works, password issue.

