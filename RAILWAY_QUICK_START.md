# Railway Deployment - Quick Start

## Step 1: Prepare Code for Deployment

```bash
# Ensure all changes are committed
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

## Step 2: Create Railway Account & Project

1. Go to https://railway.app
2. Sign up / Log in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Authorize Railway to access your GitHub
6. Select your repository

## Step 3: Configure Backend (Spring Boot)

### Add MySQL Database
1. In Railway project, click "Add Service"
2. Select "MySQL"
3. Railway creates database automatically

### Set Environment Variables
In Railway dashboard, go to Variables tab and add:

```
SPRING_DATASOURCE_URL=jdbc:mysql://${{MYSQL_HOSTNAME}}:${{MYSQL_PORT}}/srms_db
SPRING_DATASOURCE_USERNAME=${{MYSQL_USER}}
SPRING_DATASOURCE_PASSWORD=${{MYSQL_PASSWORD}}
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT=org.hibernate.dialect.MySQL8Dialect
CORS_ALLOWED_ORIGINS=https://your-frontend.railway.app,http://localhost:4200
```

### Start Backend Deployment
- Railway auto-detects Maven project
- Builds with `mvn clean package`
- Runs with Procfile or start command
- Get backend URL from Railway dashboard

## Step 4: Deploy Frontend

### Option A: Create Separate Frontend Service
1. Click "Add Service" → "Docker"
2. Use Dockerfile.frontend
3. Set environment:
   - `API_URL=https://your-backend-url.railway.app/api`

### Option B: Deploy with Backend
1. Update `src/environments/environment.prod.ts` with backend URL
2. Add build step in railway.json
3. Serve from Spring Boot static resources

## Step 5: Update API URLs

### For Frontend
Edit `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.railway.app/api'
};
```

### For Backend CORS
Update `application.properties`:
```
server.servlet.context-path=/api
cors.allowed-origins=https://your-frontend.railway.app,https://www.your-frontend.railway.app
```

## Step 6: View Deployment

1. Go to Railway project dashboard
2. Click on service to view logs
3. Check "Deployments" tab
4. Get public URL from "Settings" → "Networking"

## Step 7: Test Your Application

1. Open frontend URL in browser
2. Test login functionality
3. Check browser console for API errors
4. Monitor Railway logs for backend issues

## Environment Variables Reference

### Backend (Spring Boot)
```
SPRING_DATASOURCE_URL          jdbc:mysql://host:port/database
SPRING_DATASOURCE_USERNAME     database_user
SPRING_DATASOURCE_PASSWORD     database_password
SPRING_JPA_HIBERNATE_DDL_AUTO  update
CORS_ALLOWED_ORIGINS           frontend_url
SERVER_PORT                    (auto-set by Railway)
```

### Frontend (Angular)
```
API_URL                        backend_api_url
NODE_ENV                       production
```

## Troubleshooting

### Backend won't start
- Check Maven build logs
- Verify Java version (11 or higher)
- Check environment variables are set correctly

### Frontend can't reach API
- Verify API_URL in environment.prod.ts
- Check CORS settings in backend
- Look for 404 or 403 errors in network tab

### Database connection fails
- Verify DATABASE_URL format
- Check MySQL service is running
- Ensure credentials match

### Build takes too long
- First build can take 5-10 minutes
- Subsequent builds use cache
- Check build logs for errors

## Getting Backend URL
1. Go to Railway project
2. Select backend service
3. Click "Settings" → "Networking"
4. Copy public URL (looks like: https://abc-xyz.railway.app)

## Getting Database Credentials
1. Go to MySQL service in Railway
2. Click "Connect" tab
3. View connection details
4. Use in SPRING_DATASOURCE_URL

## Deploy New Changes

After pushing to GitHub:
1. Railway automatically detects changes
2. Triggers new build
3. Shows deployment progress in dashboard
4. Automatic rollback if build fails

## View Logs

1. Click service in Railway dashboard
2. "Deployments" tab shows build logs
3. "Logs" tab shows runtime output
4. Use for debugging issues

## Delete Service/Project

1. Go to project settings
2. Scroll to "Danger Zone"
3. Click "Delete project"
⚠️ This cannot be undone

---

**For more help:** https://docs.railway.app
**Discord Support:** https://discord.gg/railway
