# Login Testing Guide - Student Result Management System

## 🔐 Authentication Flow

The system now supports role-based login with automatic redirection:
- **STUDENT** → Redirects to `/student/dashboard`
- **TEACHER** → Redirects to `/teacher/dashboard`
- **ADMIN** → Redirects to `/admin/dashboard`

---

## 🚀 Getting Started

### Step 1: Insert Sample Data
Run this SQL script in your MySQL database:
```sql
-- Execute the file: Backend/srms/src/main/resources/sample-data.sql
```

Or manually execute the sample-data.sql file:
```bash
mysql -u root -p srms_db < sample-data.sql
```

### Step 2: Start the Backend
```bash
cd Backend/srms
mvn spring-boot:run
```

---

## 📋 Test Login Credentials

### ADMIN LOGIN
```
Email: admin@srms.com
Password: -12345
Expected Redirect: /admin/dashboard
```

### TEACHER LOGINS
```
Email: sharma@teacher.com
Password: -12345
Expected Redirect: /teacher/dashboard
---
Email: gupta@teacher.com
Password: -12345
Expected Redirect: /teacher/dashboard
---
Email: yadav@teacher.com
Password: -12345
Expected Redirect: /teacher/dashboard
---
Email: desai@teacher.com
Password: -12345
Expected Redirect: /teacher/dashboard
```

### STUDENT LOGINS
```
Email: raj.kumar@student.com
Password: -12345
Expected Redirect: /student/dashboard
---
Email: priya.singh@student.com
Password: -12345
Expected Redirect: /student/dashboard
---
Email: amit.patel@student.com
Password: -12345
Expected Redirect: /student/dashboard
---
Email: neha.verma@student.com
Password: -12345
Expected Redirect: /student/dashboard
```

---

## 🧪 Testing with cURL

### Test Admin Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srms.com","password":"-12345"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "message": "Login successful",
    "userId": 9,
    "role": "ADMIN",
    "name": "Admin",
    "redirectPath": "/admin/dashboard"
  }
}
```

### Test Teacher Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"sharma@teacher.com","password":"-12345"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "message": "Login successful",
    "userId": 6,
    "role": "TEACHER",
    "name": "Dr. Sharma",
    "redirectPath": "/teacher/dashboard"
  }
}
```

### Test Student Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"raj.kumar@student.com","password":"-12345"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "success": true,
    "message": "Login successful",
    "userId": 1,
    "role": "STUDENT",
    "name": "Raj Kumar",
    "redirectPath": "/student/dashboard"
  }
}
```

### Test Invalid Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrongpassword"}'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "data": null
}
```

---

## 📱 Testing in Angular Frontend

### Update login component to handle redirect:
```typescript
// In your login component
login() {
  this.authService.login(this.email, this.password).subscribe(
    (response) => {
      if (response.data.success) {
        // Save user info
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Redirect based on role
        this.router.navigate([response.data.redirectPath]);
      }
    }
  );
}
```

---

## ✅ API Endpoints

### Login
- **POST** `/api/auth/login`
- **Body:** `{"email": "string", "password": "string"}`
- **Response:** `LoginResponse` with redirect path

### Register
- **POST** `/api/auth/register`
- **Body:** User object with username, email, password, role, referenceId
- **Response:** User object

### Check Email
- **GET** `/api/auth/check-email/{email}`
- **Response:** Boolean (true if exists)

### Check Username
- **GET** `/api/auth/check-username/{username}`
- **Response:** Boolean (true if exists)

---

## 🔍 Sample Data Summary

### Students Created: 4
- Raj Kumar (STU001) - Class 12A
- Priya Singh (STU002) - Class 12A
- Amit Patel (STU003) - Class 12B
- Neha Verma (STU004) - Class 12B

### Teachers Created: 4
- Dr. Sharma (Mathematics, Physics)
- Mrs. Gupta (English, Hindi)
- Mr. Yadav (Chemistry, Science)
- Ms. Desai (History, Geography)

### Subjects Created: 8
- Mathematics, Physics, Chemistry, English
- Hindi, History, Geography, Science

### Marks Created: 8
- Sample marks for each student across different subjects and terms

---

## 🐛 Troubleshooting

### Issue: "User not found"
- Check if sample data is inserted correctly
- Verify email address matches exactly (case-sensitive)

### Issue: "Invalid password"
- Ensure password is correct
- Default password: `password123` (for students/teachers)
- Admin password: `admin123`

### Issue: "User account is disabled"
- Check `is_active` field in database
- User might be soft-deleted

### Issue: No redirect path
- Verify `reference_id` in users table points to correct student/teacher
- Check student/teacher record exists with correct ID

---

## ⚠️ Important Notes

1. **Passwords are stored in plain text** - Use BCrypt in production!
2. **No JWT tokens** - Consider adding JWT for stateless authentication
3. **CORS enabled** - Allows requests from `http://localhost:4200` (Angular frontend)
4. **Soft delete** - Deleted users still exist in database with `is_active = false`

---

## 🔐 Future Enhancements

1. Implement BCrypt password hashing
2. Add JWT token generation
3. Add token refresh mechanism
4. Add logout endpoint
5. Add password reset functionality
6. Add 2FA (Two-Factor Authentication)
7. Add session management
8. Add login audit logging
