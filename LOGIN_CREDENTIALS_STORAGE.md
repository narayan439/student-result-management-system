# Login Credentials Storage - Student Result Management System

## Current Authentication Architecture

### Frontend (Angular)
The frontend uses a **temporary fake login system** until the backend is implemented.

### 1. **Login Service** - `src/app/core/services/auth.service.ts`

**Current Implementation:**
```typescript
fakeLogin(email: string, password: string): string {
  if (email.includes('admin')) {
    return 'ADMIN';
  }
  if (email.includes('teacher')) {
    return 'TEACHER';
  }
  if (email.includes('student')) {
    return 'STUDENT';
  }
  return '';
}
```

**Location:** `c:\Users\naray_svbdnrk\Documents\GitHub\student-result-management-system\src\app\core\services\auth.service.ts`

**How it works:**
- Fake login determines role based on email keyword (admin/teacher/student)
- No password validation currently implemented
- No credentials stored in localStorage

---

### 2. **Login Component** - `src/app/modules/auth/login/login.component.ts`

**Location:** `c:\Users\naray_svbdnrk\Documents\GitHub\student-result-management-system\src\app\modules\auth/login/login.component.ts`

**Process:**
1. User enters email and password in form
2. Component calls `this.auth.fakeLogin(email, password)`
3. Based on returned role, routes to:
   - `/admin` for ADMIN role
   - `/teacher` for TEACHER role
   - `/student` for STUDENT role

**Demo Credentials** (Hardcoded in login.component.html):

| Role   | Email                | Password     |
|--------|----------------------|--------------|
| Admin  | admin@school.com     | admin123     |
| Teacher| teacher@school.com   | teacher123   |
| Student| student@school.com   | student123   |

**Location:** Lines 125-158 in `src/app/modules/auth/login/login.component.html`

---

### 3. **Logout/Token Handling**

#### Teacher Dashboard
- **File:** `src/app/modules/teacher/dashboard/dashboard.component.ts`
- **Line 34:** `localStorage.removeItem("teacherToken");`
- **Note:** Removes "teacherToken" from localStorage on logout

#### Student Dashboard
- **File:** `src/app/modules/student/student-dashboard.component.ts`
- **Line 28:** `localStorage.clear();`
- **Note:** Clears all localStorage on logout

---

## Storage Locations

### 1. **LocalStorage Keys** (Frontend)
Currently used for:
- `app_students_v1` - Sample student data
- `app_teachers_v1` - Sample teacher data
- `app_classes_v1` - Sample class data
- `app_subjects_v1` - Sample subject data
- `app_marks_v1` - Sample marks data
- `teacherToken` - Teacher session token (cleared on logout)

### 2. **Backend Database** (Not yet implemented)
When backend is implemented, credentials will be stored in:

**Database:** MySQL
**Table:** `users`
**Fields:**
- `user_id` (INT PRIMARY KEY)
- `email` (VARCHAR 255)
- `password_hash` (VARCHAR 255) - Hashed using bcrypt
- `role` (ENUM: 'ADMIN', 'TEACHER', 'STUDENT')
- `created_at` (TIMESTAMP)

**Seed Data Location:** `backend/seed_data.sql`
- admin@university.edu
- teacher1@university.edu, teacher2@university.edu
- student1@university.edu, student2@university.edu, student3@university.edu

---

## Security Status

⚠️ **Current Development Status:**
- ❌ No real password validation
- ❌ No JWT tokens stored
- ❌ No authentication guards implemented (guards are empty)
- ❌ No backend API for authentication
- ✅ Fake login uses role-based routing

## Next Steps for Production

1. **Implement Backend Authentication:**
   - Spring Boot endpoints for login/register
   - MySQL database with password hashing (bcrypt)
   - JWT token generation

2. **Update Frontend:**
   - Replace `fakeLogin()` with real HTTP calls
   - Store JWT tokens in localStorage/sessionStorage
   - Implement authentication guards
   - Add JWT interceptor for API requests

3. **Update Guards:**
   - Implement `admin.guard.ts` - Check for ADMIN role
   - Implement `teacher.guard.ts` - Check for TEACHER role
   - Implement `student.guard.ts` - Check for STUDENT role
   - Implement `auth.guard.ts` - Check for any valid token

---

## File References

| Component | File Path |
|-----------|-----------|
| Auth Service | `src/app/core/services/auth.service.ts` |
| Login Component | `src/app/modules/auth/login/login.component.ts` |
| Login Template | `src/app/modules/auth/login/login.component.html` |
| Login Styles | `src/app/modules/auth/login/login.component.css` |
| Teacher Dashboard | `src/app/modules/teacher/dashboard/dashboard.component.ts` |
| Student Dashboard | `src/app/modules/student/student-dashboard.component.ts` |
| Admin Guard | `src/app/core/guards/admin.guard.ts` (Empty) |
| Teacher Guard | `src/app/core/guards/teacher.guard.ts` (Empty) |
| Student Guard | `src/app/core/guards/student.guard.ts` (Empty) |
| Auth Guard | `src/app/core/guards/auth.guard.ts` (Empty) |
| JWT Interceptor | `src/app/core/interceptors/jwt.interceptor.ts` |

---

## Summary

**Current Location of Login Info:**
- **Demo credentials:** Hardcoded in login.component.html
- **Authentication logic:** Fake email-based check in auth.service.ts
- **Token storage:** Teacher uses "teacherToken" in localStorage
- **No actual password storage:** All passwords are demo only

**To Find Where Login Info Would Be Stored (Future Production):**
- Backend database file: `backend/seed_data.sql`
- Backend schema: `backend/database_schema.sql`
- User model: `backend/database.models.ts`
