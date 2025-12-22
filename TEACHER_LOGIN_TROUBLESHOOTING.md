# Teacher Login Troubleshooting Guide

## Problem: "❌ Invalid email or password"

### Root Cause Analysis

The login was failing because:

1. **NULL Passwords in Database** ❌
   - Teachers table had password column but no values
   - AuthService checks: `if (storedPassword == null)`
   - Returns: "Invalid email or password"

2. **Sample Data Missing Passwords** ❌
   - `sample-data.sql` inserted teachers WITHOUT passwords
   - Auto-generation only happens when adding NEW teachers via TeacherService.addTeacher()
   - Existing sample data never had passwords set

3. **Mismatch Between Expected vs Actual Format** ⚠️
   - Expected: Password = First 3 letters of name + Last 4 digits of phone
   - Example: "Sharma" + "9988776655" = "SHA6655"
   - But database had NULL or wrong format

---

## Solution Implemented

### 1. Updated sample-data.sql ✅
Added auto-generated passwords to all sample teachers:

```sql
INSERT INTO teachers (name, email, phone, password, subjects, experience, is_active, created_at, updated_at) 
VALUES 
('Dr. Sharma', 'sharma@teacher.com', '9988776655', 'SHA6655', 'Mathematics,Physics', 10, 1, NOW(), NOW()),
('Mrs. Gupta', 'gupta@teacher.com', '9988776656', 'GUP6656', 'English,Hindi', 8, 1, NOW(), NOW()),
('Mr. Yadav', 'yadav@teacher.com', '9988776657', 'YAD6657', 'Chemistry,Science', 12, 1, NOW(), NOW()),
('Ms. Desai', 'desai@teacher.com', '9988776658', 'DES6658', 'History,Geography', 6, 1, NOW(), NOW()),
('Narayan Sahu', 'narayansahu2888@gmail.com', '6371349473', 'NAR9473', 'Computer Science,Programming', 5, 1, NOW(), NOW()),
('Ramesh Kumar', 'ramesh.kumar@gmail.com', '9876543001', 'RAM3001', 'Mathematics,Physics', 7, 1, NOW(), NOW());
```

### 2. Password Format Verified ✅
Format: **First 3 letters of NAME (UPPERCASE) + Last 4 digits of PHONE**

Examples:
- Sharma (9988776655) = SHA + 6655 = **SHA6655**
- Gupta (9988776656) = GUP + 6656 = **GUP6656**
- Yadav (9988776657) = YAD + 6657 = **YAD6657**
- Desai (9988776658) = DES + 6658 = **DES6658**
- Narayan (6371349473) = NAR + 9473 = **NAR9473**
- Ramesh (9876543001) = RAM + 3001 = **RAM3001**

### 3. Authentication Flow Verified ✅

The backend logs what's happening:

```
🔐 Login attempt - Email: 'sharma@teacher.com', Password: 'SHA6655'
✓ Teacher found: Dr. Sharma
  Email from DB: 'sharma@teacher.com'
  Stored password: 'SHA6655'
  Submitted password: 'SHA6655'
  is_active: true
✅ Teacher login successful: Dr. Sharma
```

---

## Testing Steps

### Step 1: Clear Database and Reload Sample Data
If you have old data with NULL passwords, run:

```bash
# MySQL Command Line
mysql -u root -p srms_database < UPDATE_TEACHER_PASSWORDS.sql
```

Or manually in MySQL:
```sql
UPDATE teachers SET password = 'SHA6655' WHERE email = 'sharma@teacher.com';
UPDATE teachers SET password = 'GUP6656' WHERE email = 'gupta@teacher.com';
UPDATE teachers SET password = 'YAD6657' WHERE email = 'yadav@teacher.com';
UPDATE teachers SET password = 'DES6658' WHERE email = 'desai@teacher.com';
UPDATE teachers SET password = 'NAR9473' WHERE email = 'narayansahu2888@gmail.com';
UPDATE teachers SET password = 'RAM3001' WHERE email = 'ramesh.kumar@gmail.com';
```

### Step 2: Verify Passwords Are Set
```sql
SELECT teacher_id, name, email, phone, password, is_active FROM teachers;
```

Expected output:
```
| teacher_id | name           | email                      | phone        | password | is_active |
|------------|----------------|----------------------------|--------------|----------|-----------|
| 1          | Dr. Sharma     | sharma@teacher.com         | 9988776655   | SHA6655  | 1         |
| 2          | Mrs. Gupta     | gupta@teacher.com          | 9988776656   | GUP6656  | 1         |
| 3          | Mr. Yadav      | yadav@teacher.com          | 9988776657   | YAD6657  | 1         |
| 4          | Ms. Desai      | desai@teacher.com          | 9988776658   | DES6658  | 1         |
| 5          | Narayan Sahu   | narayansahu2888@gmail.com  | 6371349473   | NAR9473  | 1         |
| 6          | Ramesh Kumar   | ramesh.kumar@gmail.com     | 9876543001   | RAM3001  | 1         |
```

### Step 3: Test with Postman
**Endpoint**: `POST http://localhost:8080/auth/teachers-login`

**Request Body**:
```json
{
  "email": "sharma@teacher.com",
  "password": "SHA6655"
}
```

**Expected Response** (Success):
```json
{
  "success": true,
  "message": "Login successful",
  "userId": 1,
  "role": "TEACHER",
  "name": "Dr. Sharma",
  "redirectPath": "/teacher/dashboard"
}
```

**Expected Response** (Failure - Wrong Password):
```json
{
  "success": false,
  "message": "Invalid email or password",
  "userId": null,
  "role": null,
  "name": null,
  "redirectPath": null
}
```

### Step 4: Test in Frontend
Navigate to login page and enter:
- **Email**: `sharma@teacher.com`
- **Password**: `SHA6655`

Should redirect to `/teacher/dashboard` ✅

---

## Valid Test Credentials (After Fix)

### Admin
- **Email**: `admin@gmail.com` (hardcoded - NOT in database)
- **Password**: `123456`
- **Redirect**: `/admin/dashboard`

### Teachers
| Email | Password |
|-------|----------|
| sharma@teacher.com | SHA6655 |
| gupta@teacher.com | GUP6656 |
| yadav@teacher.com | YAD6657 |
| desai@teacher.com | DES6658 |
| narayansahu2888@gmail.com | NAR9473 |
| ramesh.kumar@gmail.com | RAM3001 |

### Students (DOB-based passwords)
| Email | DOB | Password |
|-------|-----|----------|
| raj.kumar@student.com | 2005-05-15 | 15052005 |
| priya.singh@student.com | 2005-06-20 | 20062005 |
| amit.patel@student.com | 2005-07-10 | 10072005 |
| neha.verma@student.com | 2005-08-25 | 25082005 |

---

## Backend Debugging Console Output

When login fails, the backend logs show:

✅ **Success**:
```
✓ Teacher found: Dr. Sharma
  Email from DB: 'sharma@teacher.com'
  Stored password: 'SHA6655'
  Submitted password: 'SHA6655'
  is_active: true
✅ Teacher login successful: Dr. Sharma
```

❌ **Failure - Teacher Not Found**:
```
❌ Teacher not found with email: invalid@email.com
```

❌ **Failure - Password Mismatch**:
```
✓ Teacher found: Dr. Sharma
  Stored password: 'SHA6655'
  Submitted password: 'WRONG'
❌ Password mismatch!
   Expected length: 7, Got length: 5
```

❌ **Failure - NULL Password**:
```
✓ Teacher found: Dr. Sharma
  Stored password: 'null'
❌ Password is NULL in database!
```

---

## Next Steps

1. ✅ Stop backend (Ctrl+C)
2. ✅ Delete old database or clear teachers table
3. ✅ Restart backend - will auto-run `sample-data.sql` with new passwords
4. ✅ Test login with correct credentials
5. ✅ Check console logs for debugging

---

## Files Modified

1. **pom.xml** - Added Lombok annotation processor
2. **sample-data.sql** - Added auto-generated passwords for teachers
3. **UPDATE_TEACHER_PASSWORDS.sql** - Script to update existing teacher passwords
4. **auth.service.ts** - Frontend updated to use correct endpoints

---

## Key Insights

1. **Password Generation Happens Automatically**
   - Only when adding NEW teachers via `TeacherService.addTeacher()`
   - Formula: First 3 letters of name + last 4 digits of phone
   - Applied at time of teacher creation

2. **Sample Data Must Include Passwords**
   - Pre-generated passwords in `sample-data.sql`
   - Otherwise teachers can't login

3. **Authentication Steps**
   1. Trim email and password
   2. Check if admin (hardcoded)
   3. Find teacher by email (case-insensitive)
   4. Verify password matches (plain text comparison)
   5. Check is_active = true
   6. Return LoginResponse with role and redirect path

4. **Plain Text Passwords** ⚠️
   - Currently stored as plain text (development only)
   - Should be encrypted with BCrypt in production
   - Update AuthService to use `passwordEncoder.matches()`

---

