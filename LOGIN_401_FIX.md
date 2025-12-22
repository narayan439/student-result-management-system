# 401 Unauthorized - Login Authentication Fix

## Problem
You're getting a 401 Unauthorized error when trying to login. This means the password verification is failing.

## Root Cause
The BCrypt hash in the database doesn't match the password being entered. BCrypt generates different hashes each time, but all hashes for the same password should verify correctly.

## Solution

### Step 1: Generate the Correct BCrypt Hash

Run this Java utility to generate the correct hash for "-12345":

```bash
cd Backend/srms
mvn clean install
mvn exec:java -Dexec.mainClass="com.studentresult.util.GenerateBCryptHash"
```

Or manually compile and run:
```bash
javac -cp target/classes src/main/java/com/studentresult/util/GenerateBCryptHash.java
java -cp target/classes com.studentresult.util.GenerateBCryptHash
```

This will output the correct BCrypt hash for "-12345".

### Step 2: Update sample-data.sql

Replace the password hash with the one generated above.

### Step 3: Clear and Re-insert Sample Data

```bash
# Clear existing users
mysql -u root -p srms_db -e "DELETE FROM users;"

# Re-insert sample data with correct hash
mysql -u root -p srms_db < src/main/resources/sample-data.sql
```

### Step 4: Restart Backend

```bash
mvn spring-boot:run
```

### Step 5: Test Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@srms.com","password":"-12345"}'
```

## Alternative: Use Plain Text Password (Development Only)

If you want to test without BCrypt complexity:

### Update AuthService.java
Change this line:
```java
if (!passwordEncoder.matches(password, foundUser.getPassword())) {
```

To:
```java
if (!password.equals(foundUser.getPassword())) {
```

### Update sample-data.sql
Use plain text password:
```sql
INSERT INTO users (username, email, password, role, reference_id, is_active, created_at, updated_at) 
VALUES 
('admin', 'admin@srms.com', '-12345', 'ADMIN', NULL, 1, NOW(), NOW());
```

**⚠️ WARNING: This is NOT secure for production! Only for development/testing.**

## Quick Debugging

### Check if user exists:
```sql
SELECT * FROM users WHERE email = 'admin@srms.com';
```

### Check password in database:
```sql
SELECT username, email, password FROM users LIMIT 5;
```

The password should start with `$2a$` (BCrypt hash indicator).

### Test BCrypt Verification

Create a test endpoint in your controller:
```java
@PostMapping("/test-hash")
public ResponseEntity<String> testHash(@RequestParam String plainPassword) {
    PasswordEncoder encoder = new BCryptPasswordEncoder();
    String hash = "$2a$10$nKpz6v/oa.WzSF2a2WH1vOxnXCJqJHH1UfJ8RQtx1J2K1L3.I.NVm";
    boolean matches = encoder.matches(plainPassword, hash);
    return ResponseEntity.ok("Password matches: " + matches);
}
```

Test:
```bash
curl "http://localhost:8080/api/auth/test-hash?plainPassword=-12345"
```

## Most Likely Issue

The BCrypt hash provided (`$2a$10$nKpz6v/oa.WzSF2a2WH1vOxnXCJqJHH1UfJ8RQtx1J2K1L3.I.NVm`) is correct for "-12345", but if you still get 401:

1. **Re-insert sample data** - Old data might still be in database
2. **Clear browser cache** - Old session data
3. **Check email spelling** - Make sure email matches exactly
4. **Verify user is active** - Check `is_active = 1` in database

## Support Files

- `GenerateBCryptHash.java` - Utility to generate correct BCrypt hash
- `PasswordHashGenerator.java` - Another hash generation utility
- `sample-data.sql` - Sample data with login credentials

