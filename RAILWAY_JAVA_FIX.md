# Railway Java Deployment Fix

## Problem
Error: `/bin/bash: line 1: java: command not found`

This occurs when Railway cannot find Java in the environment to run your Spring Boot application.

## Solution Applied

### 1. **Updated Dockerfile.backend** ✅
- Uses `openjdk:11-jre-slim` which includes Java runtime
- Adds Java version verification during build
- Includes proper JVM memory settings
- Uses PORT environment variable from Railway

### 2. **Added system.properties** ✅
File: `system.properties`
```properties
java.runtime.version=11
maven.version=3.8.6
```
This tells Railway to provision Java 11 runtime automatically.

### 3. **Updated Procfile** ✅
Now includes memory settings for better performance:
```
web: java -Dserver.port=$PORT -Xmx512m -jar Backend/srms/target/*.jar
```

### 4. **Updated railway.json** ✅
- Changed builder to `dockerfile` to use your Dockerfile.backend
- Configured proper environment variables
- Removed hardcoded startCommand

## How to Deploy (Updated Steps)

### Option 1: Using Dockerfile (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Fix Java deployment for Railway"
   git push origin main
   ```

2. **In Railway Dashboard:**
   - Create new project
   - Connect GitHub repository
   - Select "Deploy from Dockerfile"
   - Use `Dockerfile.backend` for backend service

3. **Add MySQL Service**
   - Click "Add Service"
   - Select MySQL
   - Get credentials from "Connect" tab

4. **Set Environment Variables**
   - `SPRING_DATASOURCE_URL`: `jdbc:mysql://${{MYSQL_HOSTNAME}}:${{MYSQL_PORT}}/srms_db`
   - `SPRING_DATASOURCE_USERNAME`: `${{MYSQL_USER}}`
   - `SPRING_DATASOURCE_PASSWORD`: `${{MYSQL_PASSWORD}}`
   - `SPRING_JPA_HIBERNATE_DDL_AUTO`: `update`

5. **Deploy**
   - Push to trigger automatic deployment
   - Monitor logs in Railway dashboard

### Option 2: Using Procfile (Alternative)

If using Procfile instead of Docker:

1. Ensure system.properties exists in root
2. Maven will automatically install Java 11
3. Railway will use Procfile to start application

## Verification

Once deployed, check:
1. Backend logs show "Tomcat started on port 8080"
2. No "java: command not found" errors
3. Database connection successful
4. Endpoints responding

## Common Issues

### Issue: Still Getting "java: command not found"
**Solution:**
- Verify system.properties exists in repository root
- Check Dockerfile.backend uses openjdk image
- Rebuild/redeploy from Railway dashboard

### Issue: JAR file not found
**Solution:**
- Ensure `Backend/srms/target/*.jar` exists
- Check Maven build completes successfully
- Verify pom.xml is correct

### Issue: Port binding error
**Solution:**
- Ensure PORT environment variable is set
- Check no hardcoded port 8080 without dynamic binding
- Dockerfile uses: `java -Dserver.port=${PORT:-8080}`

## Files Modified

1. ✅ `Dockerfile.backend` - Updated Java configuration
2. ✅ `Procfile` - Added memory settings
3. ✅ `railway.json` - Updated build configuration
4. ✅ `system.properties` - NEW - Java version specification

## Next Steps

1. Commit and push changes to GitHub
2. In Railway, rebuild and redeploy
3. Verify backend is running without Java errors
4. Test API endpoints
5. Configure frontend to point to backend URL

---

**Status:** ✅ Ready for deployment
**Java Version:** 11 (LTS)
**Memory:** 512MB heap
**Database:** MySQL 8
