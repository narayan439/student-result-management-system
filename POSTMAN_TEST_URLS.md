# Postman Test URLs for Teacher Login

## ✅ Teacher Login Endpoint

**Method**: POST  
**URL**: `http://localhost:8080/auth/teachers-login`

### Headers
```
Content-Type: application/json
```

### Request Body (JSON)
```json
{
  "email": "sharma@teacher.com",
  "password": "SHA6655"
}
```

### Expected Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "message": "Login successful",
    "userId": 1,
    "role": "TEACHER",
    "name": "Dr. Sharma",
    "redirectPath": "/teacher/dashboard"
  }
}
```

### Expected Error Response (401 Unauthorized)
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

---

## Test Different Teachers

### Test 1: Dr. Sharma
```json
{
  "email": "sharma@teacher.com",
  "password": "SHA6655"
}
```

### Test 2: Mrs. Gupta
```json
{
  "email": "gupta@teacher.com",
  "password": "GUP6656"
}
```

### Test 3: Mr. Yadav
```json
{
  "email": "yadav@teacher.com",
  "password": "YAD6657"
}
```

### Test 4: Ms. Desai
```json
{
  "email": "desai@teacher.com",
  "password": "DES6658"
}
```

### Test 5: Narayan Sahu
```json
{
  "email": "narayansahu2888@gmail.com",
  "password": "NAR9473"
}
```

### Test 6: Ramesh Kumar
```json
{
  "email": "ramesh.kumar@gmail.com",
  "password": "RAM3001"
}
```

---

## Also Available

### Generic Login Endpoint (Works for Admin/Teacher/Student)
**URL**: `POST http://localhost:8080/auth/login`
```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### Student Login Endpoint
**URL**: `POST http://localhost:8080/auth/student-login`
```json
{
  "email": "raj.kumar@student.com",
  "password": "15052005"
}
```

---

## Steps in Postman

1. **Create New Request**
   - Method: POST
   - URL: `http://localhost:8080/auth/teachers-login`

2. **Set Headers**
   - Content-Type: application/json

3. **Set Body** (raw, JSON)
   - Copy one of the request bodies above

4. **Send Request** (Ctrl+Enter or Click Send)

5. **Check Response**
   - Status code: 200 (success) or 401 (failure)
   - Look at response JSON

---

## Debugging Response

**If Success (200)**:
- ✅ Database password is correct
- ✅ Teacher exists
- ✅ Backend is working
- ✅ Frontend can now use this endpoint

**If Error (401 or 400)**:
- Check backend console for error message
- Verify password in database: `SELECT email, password FROM teachers WHERE email = 'sharma@teacher.com';`
- Try different email/password combination

---

## Copy-Paste Ready

### For Postman Pre-request Script (optional)
```javascript
pm.test("Check response structure", function() {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('success');
    pm.expect(jsonData).to.have.property('data');
    if (jsonData.success) {
        pm.expect(jsonData.data).to.have.property('role');
        pm.expect(jsonData.data).to.have.property('name');
    }
});
```

### For Postman Test Script (optional)
```javascript
var jsonData = pm.response.json();

if (jsonData.success) {
    pm.test("✅ Login Successful", function() {
        pm.expect(jsonData.success).to.equal(true);
        pm.expect(jsonData.data.role).to.equal("TEACHER");
    });
} else {
    pm.test("❌ Login Failed", function() {
        pm.expect(jsonData.success).to.equal(false);
    });
}
```

