# ⚡ QUICK FIX - Teacher Login Not Working

## THE PROBLEM
❌ "Invalid email or password" - Teacher login fails

## THE ROOT CAUSE
🔴 Database teachers table has **NULL passwords**

## THE SOLUTION (Pick ONE)

### Option A: Clean Database (RECOMMENDED) ⭐
```bash
# 1. Stop backend (Ctrl+C in terminal)

# 2. Open MySQL
mysql -u root -p

# 3. Run:
DROP DATABASE srms_database;
CREATE DATABASE srms_database;

# 4. Exit MySQL
EXIT;

# 5. Restart backend - will auto-load sample data with passwords ✅
```

### Option B: Update Existing Database
```bash
# 1. Open MySQL
mysql -u root -p srms_database

# 2. Copy-paste and run:
UPDATE teachers SET password = 'SHA6655' WHERE email = 'sharma@teacher.com';
UPDATE teachers SET password = 'GUP6656' WHERE email = 'gupta@teacher.com';
UPDATE teachers SET password = 'YAD6657' WHERE email = 'yadav@teacher.com';
UPDATE teachers SET password = 'DES6658' WHERE email = 'desai@teacher.com';
UPDATE teachers SET password = 'NAR9473' WHERE email = 'narayansahu2888@gmail.com';
UPDATE teachers SET password = 'RAM3001' WHERE email = 'ramesh.kumar@gmail.com';

# 3. Verify:
SELECT email, password FROM teachers;
```

## TEST CREDENTIALS ✅

| Email | Password |
|-------|----------|
| sharma@teacher.com | SHA6655 |
| gupta@teacher.com | GUP6656 |
| yadav@teacher.com | YAD6657 |
| desai@teacher.com | DES6658 |
| narayansahu2888@gmail.com | NAR9473 |
| ramesh.kumar@gmail.com | RAM3001 |
| **admin@gmail.com** | **123456** |

## TEST IN BROWSER

1. Open login page
2. Enter: `sharma@teacher.com` / `SHA6655`
3. **Open DevTools** (F12) → Console tab
4. Should see: ✅ `Teacher login successful`
5. Should redirect to `/teacher/dashboard`

## IF STILL FAILING

**Check Console Output**:
- Should show 4 steps of authentication attempts
- Each step shows what went wrong
- Share this console output for debugging

**Test with Postman First**:
- POST: `http://localhost:8080/auth/teachers-login`
- Body: `{"email": "sharma@teacher.com", "password": "SHA6655"}`
- If this works in Postman but not browser, it's a frontend issue
- If this fails in Postman, it's a backend issue

---

**Need Help?** Share:
1. Browser console output (F12)
2. Backend console output
3. MySQL query result: `SELECT email, password FROM teachers;`
