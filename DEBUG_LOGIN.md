# Debug Login 401 Error

## Step 1: Check Database for Users

```sql
SELECT id, email, password FROM users;
```

**Expected Output**: Should show users with BCrypt hashes starting with `$2a$`

## Step 2: Test Debug Endpoint

```bash
curl -X POST http://localhost:8080/auth/debug-password \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srms.com","password":"-12345"}'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Debug info",
  "data": {
    "inputPassword": "-12345",
    "encodedPassword": "$2a$10$...",
    "databaseHash": "$2a$10$nKpz6v/oa.WzSF2a2WH1vOxnXCJqJHH1UfJ8RQtx1J2K1L3.I.NVm",
    "matchesResult": true
  }
}
```

**If matchesResult is false**: Database hash is incorrect or password doesn't match

## Step 3: Clear and Re-insert Data

If debug shows mismatch, run these commands:

```bash
# Clear old data
mysql -u root -p srms_db -e "DELETE FROM users;"

# Re-insert sample data
mysql -u root -p srms_db < Backend/srms/src/main/resources/sample-data.sql

# Verify
mysql -u root -p srms_db -e "SELECT COUNT(*) FROM users;"
```

Expected: Should return 9 (4 students + 4 teachers + 1 admin)

## Step 4: Test Login After Fix

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srms.com","password":"-12345"}'
```

Expected response:
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

## Current BCrypt Hash for "-12345"

```
$2a$10$nKpz6v/oa.WzSF2a2WH1vOxnXCJqJHH1UfJ8RQtx1J2K1L3.I.NVm
```

All test users should have this exact hash in the database.
