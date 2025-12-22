# Quick Fix for Teacher Login Issue

## Problem
❌ Invalid email or password - Teacher login failing

## Root Cause
**Passwords in database are NULL** - Teachers table never had password values set

## Quick Fix (3 Steps)

### Step 1: Stop Backend
Press `Ctrl+C` in the Spring Boot terminal

### Step 2: Delete Database (if possible)
```bash
mysql -u root -p
DROP DATABASE srms_database;
CREATE DATABASE srms_database;
EXIT;
```

### Step 3: Restart Backend
Backend will automatically run `sample-data.sql` which now includes all passwords ✅

---

## If You Can't Delete Database

Run this SQL in MySQL Workbench or Command Line:

```sql
USE srms_database;

UPDATE teachers SET password = 'SHA6655' WHERE email = 'sharma@teacher.com';
UPDATE teachers SET password = 'GUP6656' WHERE email = 'gupta@teacher.com';
UPDATE teachers SET password = 'YAD6657' WHERE email = 'yadav@teacher.com';
UPDATE teachers SET password = 'DES6658' WHERE email = 'desai@teacher.com';
UPDATE teachers SET password = 'NAR9473' WHERE email = 'narayansahu2888@gmail.com';
UPDATE teachers SET password = 'RAM3001' WHERE email = 'ramesh.kumar@gmail.com';

-- Verify
SELECT teacher_id, name, email, password FROM teachers;
```

---

## Test Credentials After Fix ✅

### Teachers
| Email | Password |
|-------|----------|
| sharma@teacher.com | SHA6655 |
| gupta@teacher.com | GUP6656 |
| yadav@teacher.com | YAD6657 |
| desai@teacher.com | DES6658 |
| narayansahu2888@gmail.com | NAR9473 |
| ramesh.kumar@gmail.com | RAM3001 |

### Admin
| Email | Password |
|-------|----------|
| admin@gmail.com | 123456 |

---

## Expected Result

✅ Login should work and redirect to `/teacher/dashboard`

Check backend console for:
```
✅ Teacher login successful: Dr. Sharma
```

---
