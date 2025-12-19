# SRMS Backend - Quick Reference

## 🚀 Quick Start (5 Steps)

### 1. Create Database
```bash
mysql -u root -p < Backend/srms/DATABASE_INIT.sql
# Password: 541294
```

### 2. Build Backend
```bash
cd Backend/srms
mvn clean install
```

### 3. Start Backend
```bash
mvn spring-boot:run
```

### 4. Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"123456"}'
```

### 5. Access Swagger
```
http://localhost:8080/api/swagger-ui.html
```

---

## 🔑 Login Credentials

### Admin
```
Email: admin@gmail.com
Password: 123456
```

### Teachers
```
rahul@gmail.com | 123456
ananya@gmail.com | 123456
sanjay@gmail.com | 123456
priya@gmail.com | 123456
vikram@gmail.com | 123456
```

### Students (20 total)
```
john@gmail.com | 123456
alice@gmail.com | 123456
bob@gmail.com | 123456
... (17 more students)
```

---

## 📍 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | Create user |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/verify/{email}` | Check user |
| GET | `/api/auth/user/{id}` | Get user details |
| PUT | `/api/auth/user/{id}` | Update user |
| GET | `/api/auth/check-email/{email}` | Check availability |
| GET | `/api/students/all` | List students |
| GET | `/api/marks/all` | List marks |
| GET | `/api/recheck-requests/all` | List rechecks |

---

## 📊 Database Info

```
Database: srms_db
Username: root
Password: 541294
Port: 3306
Host: localhost
```

**Tables:**
- users (26 records)
- student (20 records)
- marks (120 records)
- recheck_request (5 records)

---

## 🎯 Files Added

1. **UserService.java** - Authentication service
2. **AuthController.java** - Auth endpoints
3. **LoginRequest.java** - Login DTO
4. **LoginResponse.java** - Response DTO
5. **DATABASE_INIT.sql** - Database setup
6. **AUTH_IMPLEMENTATION_GUIDE.md** - Detailed guide

---

## ✅ Verification

```bash
# Test admin login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","password":"123456"}'

# Expected: {"status":200,"message":"Login successful",...}
```

---

## 🔧 Common Issues

| Issue | Solution |
|-------|----------|
| Database not found | Run DATABASE_INIT.sql |
| Port 8080 in use | Change server.port in application.properties |
| Login fails | Check users in database: `SELECT * FROM users;` |
| CORS error | Verify frontend URL in CorsConfig |
| Build fails | Run `mvn clean install -DskipTests` |

---

## 📝 Key Points

✅ 3 User Roles: Admin, Teacher, Student
✅ 26 Users with sample data
✅ Password: 123456 (all users)
✅ Email unique constraint
✅ Soft delete (is_active flag)
✅ CORS enabled for localhost:4200
✅ MySQL auto-creates tables
✅ Swagger API documentation

---

## 🌐 Frontend Integration

Update `auth.service.ts`:
```typescript
login(email: string, password: string): Observable<any> {
  return this.http.post('http://localhost:8080/api/auth/login', {
    email, password
  });
}
```

Then save response:
```typescript
this.auth.login(email, password).subscribe(res => {
  localStorage.setItem('currentUser', JSON.stringify(res.data));
  // Route based on res.data.role
});
```

---

## 📚 Documentation Files

1. **SETUP_GUIDE.md** - Backend configuration
2. **TESTING_GUIDE.md** - How to test API
3. **AUTH_IMPLEMENTATION_GUIDE.md** - Complete auth guide
4. **DATABASE_INIT.sql** - Database initialization
5. **QUICK_REFERENCE.md** - This file

---

## 🎓 Learning Path

1. Start with SETUP_GUIDE.md for configuration
2. Run DATABASE_INIT.sql for database
3. Start backend with mvn spring-boot:run
4. Test with cURL or Postman
5. Check TESTING_GUIDE.md for detailed tests
6. Read AUTH_IMPLEMENTATION_GUIDE.md for deep understanding
7. Integrate with frontend

---

## 💡 Pro Tips

**Tip 1:** Use Postman for easier API testing
- Import endpoints from Swagger
- Save credentials for quick testing

**Tip 2:** Check logs while developing
```bash
tail -f /path/to/application.log
```

**Tip 3:** Reset database quickly
```bash
mysql -u root -p -e "DROP DATABASE srms_db;"
mysql -u root -p < DATABASE_INIT.sql
```

**Tip 4:** Test with different roles
- Try admin login for admin features
- Try teacher login for teacher features
- Try student login for student features

---

## 🎯 Success Checklist

- [ ] Database created (srms_db)
- [ ] Backend builds successfully
- [ ] Backend starts on port 8080
- [ ] Admin login returns success
- [ ] Teacher login returns success
- [ ] Student login returns success
- [ ] Invalid login returns 401
- [ ] Swagger docs accessible
- [ ] No CORS errors
- [ ] Frontend ready for integration

**You're all set! 🚀**
