# Teacher & Admin Login Implementation Guide

## 📋 Overview

This document explains the complete authentication system for Student, Teacher, and Admin roles in the SRMS (Student Result Management System).

---

## 🔐 Authentication System Architecture

### Components Added:

1. **UserService** - Authentication and user management service
2. **AuthController** - REST endpoints for login/register/verify
3. **LoginRequest/LoginResponse** - DTOs for authentication
4. **DATABASE_INIT.sql** - Complete database initialization with sample data

---

## 📊 Database Schema

### Users Table (Authentication)
```sql
CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',  -- admin, teacher, student
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Fields:**
- `user_id`: Unique identifier
- `email`: Email address (unique constraint)
- `password`: User password
- `role`: User type (admin, teacher, student)
- `is_active`: Account status
- `created_at`: Account creation time
- `updated_at`: Last update time

---

## 🗄️ Database Setup Instructions

### Step 1: Create Database Using SQL Script

```bash
# Navigate to Backend directory
cd Backend/srms

# Run the SQL script
mysql -u root -p < DATABASE_INIT.sql
```

When prompted, enter password: `541294`

### Step 2: Verify Database Creation

```bash
# Connect to MySQL
mysql -u root -p
password: 541294

# Use the database
USE srms_db;

# Check tables
SHOW TABLES;

# Count records
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM student) as total_students,
    (SELECT COUNT(*) FROM marks) as total_marks;
```

Expected output:
```
+-------------------+
| Tables_in_srms_db |
+-------------------+
| marks             |
| recheck_request   |
| student           |
| users             |
+-------------------+

total_users: 26
total_students: 20
total_marks: 120
```

---

## 👥 Sample Login Credentials

### Admin Login
```
Email: admin@gmail.com
Password: 123456
Role: admin
```

### Teacher Logins (5 teachers)
```
1. Email: rahul@gmail.com
   Password: 123456
   Role: teacher

2. Email: ananya@gmail.com
   Password: 123456
   Role: teacher

3. Email: sanjay@gmail.com
   Password: 123456
   Role: teacher

4. Email: priya@gmail.com
   Password: 123456
   Role: teacher

5. Email: vikram@gmail.com
   Password: 123456
   Role: teacher
```

### Student Logins (20 students)
```
1. Email: john@gmail.com | Password: 123456 | Roll: 101
2. Email: alice@gmail.com | Password: 123456 | Roll: 102
3. Email: bob@gmail.com | Password: 123456 | Roll: 103
4. Email: charlie@gmail.com | Password: 123456 | Roll: 104
5. Email: diana@gmail.com | Password: 123456 | Roll: 105
6. Email: emma@gmail.com | Password: 123456 | Roll: 201
7. Email: frank@gmail.com | Password: 123456 | Roll: 202
8. Email: grace@gmail.com | Password: 123456 | Roll: 203
9. Email: henry@gmail.com | Password: 123456 | Roll: 204
10. Email: iris@gmail.com | Password: 123456 | Roll: 205
11. Email: jack@gmail.com | Password: 123456 | Roll: 301
12. Email: kate@gmail.com | Password: 123456 | Roll: 302
13. Email: leo@gmail.com | Password: 123456 | Roll: 303
14. Email: mona@gmail.com | Password: 123456 | Roll: 304
15. Email: noah@gmail.com | Password: 123456 | Roll: 305
16. Email: olivia@gmail.com | Password: 123456 | Roll: 401
17. Email: paul@gmail.com | Password: 123456 | Roll: 402
18. Email: quinn@gmail.com | Password: 123456 | Roll: 403
19. Email: rachel@gmail.com | Password: 123456 | Roll: 404
20. Email: steve@gmail.com | Password: 123456 | Roll: 405
```

---

## 🔌 API Endpoints

### 1. Login Endpoint
**POST** `/api/auth/login`

**Request:**
```json
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

**Success Response (200 OK):**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "userId": 1,
    "email": "admin@gmail.com",
    "role": "admin",
    "message": "Login successful",
    "success": true
  },
  "error": null
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": 401,
  "message": "Invalid email or password",
  "data": null,
  "error": "Invalid email or password"
}
```

### 2. Register User Endpoint
**POST** `/api/auth/register`

**Request:**
```json
{
  "email": "newteacher@gmail.com",
  "password": "newpass123",
  "role": "teacher",
  "isActive": true
}
```

**Success Response (201 Created):**
```json
{
  "status": 201,
  "message": "User registered successfully",
  "data": {
    "userId": 27,
    "email": "newteacher@gmail.com",
    "password": "newpass123",
    "role": "teacher",
    "isActive": true,
    "createdAt": "2024-12-19T10:30:00",
    "updatedAt": "2024-12-19T10:30:00"
  },
  "error": null
}
```

### 3. Verify User Endpoint
**GET** `/api/auth/verify/{email}`

**Response:**
```json
{
  "status": 200,
  "message": "User verified",
  "data": {
    "userId": 1,
    "email": "admin@gmail.com",
    "role": "admin",
    "isActive": true
  },
  "error": null
}
```

### 4. Get User Details
**GET** `/api/auth/user/{userId}`

### 5. Update User
**PUT** `/api/auth/user/{userId}`

### 6. Check Email Availability
**GET** `/api/auth/check-email/{email}`

**Response:**
```json
{
  "status": 200,
  "message": "Email is available",
  "data": true,
  "error": null
}
```

### 7. Logout
**POST** `/api/auth/logout`

---

## 🧪 Testing the Authentication

### Test 1: Admin Login (Postman)
```
Method: POST
URL: http://localhost:8080/api/auth/login
Headers: Content-Type: application/json
Body:
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

Expected: 200 OK with role = "admin"

### Test 2: Teacher Login (cURL)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "rahul@gmail.com",
    "password": "123456"
  }'
```

Expected: 200 OK with role = "teacher"

### Test 3: Student Login (cURL)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@gmail.com",
    "password": "123456"
  }'
```

Expected: 200 OK with role = "student"

### Test 4: Invalid Credentials (cURL)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@gmail.com",
    "password": "wrongpassword"
  }'
```

Expected: 401 Unauthorized

### Test 5: Check Email Availability (cURL)
```bash
# Check existing email (should return false)
curl -X GET http://localhost:8080/api/auth/check-email/admin@gmail.com

# Check new email (should return true)
curl -X GET http://localhost:8080/api/auth/check-email/newemail@gmail.com
```

---

## 🚀 How to Run Backend with Authentication

### Step 1: Start MySQL
```bash
# Windows
net start MySQL80

# Linux
sudo service mysql start

# macOS
brew services start mysql
```

### Step 2: Create Database
```bash
mysql -u root -p < Backend/srms/DATABASE_INIT.sql
# Enter password: 541294
```

### Step 3: Start Spring Boot Application
```bash
cd Backend/srms
mvn clean install
mvn spring-boot:run
```

Expected output:
```
Started SrmsApplication in X.XXX seconds (JVM running for Y.YYY s)
```

### Step 4: Test Login Endpoint
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"123456"}'
```

---

## 📱 Frontend Integration

### Update Angular AuthService

The frontend's `AuthService` should be updated to use the backend login:

```typescript
// src/app/core/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {}

  // Login with backend
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email: email,
      password: password
    });
  }

  // Register new user
  register(email: string, password: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, {
      email: email,
      password: password,
      role: role,
      isActive: true
    });
  }

  // Save token/session
  saveUserSession(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('userToken', user.userId.toString());
  }

  // Get current user
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  // Logout
  logout(): void {
    localStorage.clear();
  }

  // Verify user token
  isAuthenticated(): boolean {
    return !!localStorage.getItem('userToken');
  }

  // Check user role
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }
}
```

### Update Login Component

```typescript
// src/app/modules/auth/login/login.component.ts

onLogin() {
  this.isLoading = true;
  
  this.auth.login(this.loginData.email, this.loginData.password)
    .subscribe({
      next: (response) => {
        if (response.data.success) {
          this.auth.saveUserSession(response.data);
          
          // Navigate based on role
          if (response.data.role === 'ADMIN') {
            this.router.navigate(['/admin']);
          } else if (response.data.role === 'TEACHER') {
            this.router.navigate(['/teacher']);
          } else if (response.data.role === 'STUDENT') {
            this.router.navigate(['/student']);
          }
        }
      },
      error: (error) => {
        alert('❌ Invalid email or password');
        this.isLoading = false;
      }
    });
}
```

---

## 🔒 Security Best Practices

### Current Implementation:
✅ Password stored in database (plaintext - for development)
✅ Email unique constraint prevents duplicates
✅ Soft delete (is_active flag) for data retention
✅ Role-based access control
✅ CORS enabled for frontend origin

### For Production, Add:
🔒 Hash passwords using BCrypt
🔒 Implement JWT tokens
🔒 Add refresh token mechanism
🔒 Implement rate limiting on login
🔒 Add email verification
🔒 Use HTTPS only
🔒 Implement CSRF protection

### Example: Password Hashing with BCrypt

```java
// Add dependency in pom.xml
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-crypto</artifactId>
</dependency>

// In AuthController
@Autowired
private PasswordEncoder passwordEncoder;

// When registering
user.setPassword(passwordEncoder.encode(user.getPassword()));
userService.createUser(user);

// When authenticating
public Optional<User> authenticateUser(String email, String rawPassword) {
    Optional<User> user = userRepository.findByEmail(email);
    if (user.isPresent()) {
        if (passwordEncoder.matches(rawPassword, user.get().getPassword())) {
            return user;
        }
    }
    return Optional.empty();
}
```

---

## 📊 Data Structure Summary

### Users Table
- 1 Admin user
- 5 Teacher users
- 20 Student users
- **Total: 26 users**

### Student Table
- 20 students (5 per class)
- Distributed across 4 classes
- Email linked to users table

### Marks Table
- 120 records (6 subjects × 20 students)
- Linked to student table via foreign key

### Recheck Request Table
- 5 sample requests
- Various statuses: pending, approved, rejected, completed

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Database `srms_db` created successfully
- [ ] All 4 tables present (users, student, marks, recheck_request)
- [ ] 26 users in database (1 admin, 5 teachers, 20 students)
- [ ] 20 students in student table
- [ ] 120 marks records in marks table
- [ ] Spring Boot backend starts without errors
- [ ] Login endpoint returns 200 for valid credentials
- [ ] Login endpoint returns 401 for invalid credentials
- [ ] Admin login works with email: admin@gmail.com
- [ ] Teacher login works with email: rahul@gmail.com
- [ ] Student login works with email: john@gmail.com
- [ ] CORS headers present in responses
- [ ] Swagger API docs available at http://localhost:8080/api/swagger-ui.html

---

## 🆘 Troubleshooting

### Issue: "Unknown database 'srms_db'"
```
Solution: 
Run: mysql -u root -p < Backend/srms/DATABASE_INIT.sql
```

### Issue: "Access denied for user 'root'"
```
Solution:
1. Verify MySQL is running
2. Check password: 541294
3. Run: mysql -u root -p -e "SELECT VERSION();"
```

### Issue: "Duplicate entry for email"
```
Solution:
1. Delete user: DELETE FROM users WHERE email = 'email@gmail.com';
2. Or clear all: DELETE FROM users;
```

### Issue: "Login returns 401 for valid credentials"
```
Solution:
1. Check if email exists: SELECT * FROM users WHERE email = 'email@gmail.com';
2. Verify password matches (123456)
3. Check is_active = 1
4. Restart backend: mvn spring-boot:run
```

### Issue: "CORS error in browser"
```
Solution:
1. Check AuthController has @CrossOrigin annotation
2. Verify frontend URL is localhost:4200
3. Check CorsConfig is properly configured
```

---

## 📝 Files Added/Modified

### New Files Created:
1. `Backend/srms/src/main/java/com/studentresult/service/UserService.java`
2. `Backend/srms/src/main/java/com/studentresult/controller/AuthController.java`
3. `Backend/srms/src/main/java/com/studentresult/dto/LoginRequest.java`
4. `Backend/srms/src/main/java/com/studentresult/dto/LoginResponse.java`
5. `Backend/srms/DATABASE_INIT.sql`

### Updated Files:
- None (all new files)

---

## 🎯 Next Steps

1. **Database Setup**: Run the SQL script to create database
2. **Build Backend**: Run `mvn clean install`
3. **Start Backend**: Run `mvn spring-boot:run`
4. **Test APIs**: Use Postman or cURL to test login
5. **Frontend Integration**: Update Angular service to use new API
6. **UI Testing**: Test full login flow in browser

---

## 📞 Summary

| Component | Details |
|-----------|---------|
| **Database** | MySQL srms_db with 4 tables |
| **Users** | 26 total (1 admin, 5 teachers, 20 students) |
| **Auth Endpoint** | POST /api/auth/login |
| **Password** | 123456 (all users) |
| **Roles** | admin, teacher, student |
| **CORS** | Enabled for localhost:4200 |
| **API Docs** | http://localhost:8080/api/swagger-ui.html |

**Everything is ready for testing!** 🚀
