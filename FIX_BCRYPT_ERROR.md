# Fix BCrypt Password Error

## Problem
"Encoded password does not look like BCrypt" error means the password in database is NOT a valid BCrypt hash.

## Solution

### Step 1: Delete all old users from database

```bash
mysql -u root -p srms_db
```

Then in MySQL:
```sql
DELETE FROM users;
COMMIT;
```

### Step 2: Verify table is empty

```sql
SELECT * FROM users;
```

Should return: **Empty set**

### Step 3: Re-insert sample data with correct BCrypt hashes

```bash
mysql -u root -p srms_db < Backend/srms/src/main/resources/sample-data.sql
```

### Step 4: Verify data was inserted correctly

```sql
SELECT email, password FROM users;
```

Should show 9 users with passwords starting with `$2a$10$`

### Step 5: Restart backend

```bash
# Kill existing backend process (Ctrl+C)
# Then restart:
cd Backend/srms
mvn clean spring-boot:run
```

### Step 6: Test login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srms.com","password":"-12345"}'
```

## Expected Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "userId": 9,
    "role": "ADMIN",
    "name": "Admin",
    "redirectPath": "/admin/dashboard"
  }
}
```

## What Makes a Valid BCrypt Hash

Valid BCrypt hash format:
- Starts with `$2a$`, `$2b$`, `$2x$`, or `$2y$`
- Exactly 60 characters long
- Example: `$2a$10$nKpz6v/oa.WzSF2a2WH1vOxnXCJqJHH1UfJ8RQtx1J2K1L3.I.NVm`

If password is stored as plain text like `-12345`, BCrypt will fail.

## Test Credentials After Fix

| User | Email | Password | Role | Redirect |
|------|-------|----------|------|----------|
| Admin | admin@srms.com | -12345 | ADMIN | /admin/dashboard |
| Teacher 1 | sharma@teacher.com | -12345 | TEACHER | /teacher/dashboard |
| Student 1 | raj.kumar@student.com | -12345 | STUDENT | /student/dashboard |

All passwords are: **-12345**
