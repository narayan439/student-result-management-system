# Deploy on Railway - Step by Step

## ⚡ Quick Deployment (5 Minutes)

### Step 1: Create Railway Account
```
1. Visit https://railway.app
2. Click "Sign Up"
3. Select "Continue with GitHub"
4. Authorize Railway to access your GitHub
```

### Step 2: Connect GitHub Repository
```
1. Click "New Project" in Railway dashboard
2. Select "Deploy from GitHub repo"
3. Search for your repository
4. Click "Select Repository"
5. Grant permissions if prompted
```

### Step 3: Add MySQL Database
```
1. In project dashboard, click "Add Service"
2. Search for and select "MySQL"
3. Railway creates it automatically
4. Get credentials from "Connect" tab
```

### Step 4: Configure Backend Environment Variables

In the backend service, add these variables:

**Key**: `SPRING_DATASOURCE_URL`
**Value**: `jdbc:mysql://${{MYSQL_HOSTNAME}}:${{MYSQL_PORT}}/srms_db`

**Key**: `SPRING_DATASOURCE_USERNAME`
**Value**: `${{MYSQL_USER}}`

**Key**: `SPRING_DATASOURCE_PASSWORD`
**Value**: `${{MYSQL_PASSWORD}}`

**Key**: `SPRING_JPA_HIBERNATE_DDL_AUTO`
**Value**: `update`

**Key**: `SPRING_JPA_SHOW_SQL`
**Value**: `false`

**Key**: `SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT`
**Value**: `org.hibernate.dialect.MySQL8Dialect`

### Step 5: Deploy Backend

```
1. Railway auto-detects Maven project
2. Starts building (takes 3-5 minutes)
3. Automatically runs: mvn clean package
4. Service starts on assigned PORT
5. You'll see green "Running" status
6. Click service → Settings → Networking to get public URL
```

### Step 6: Update Frontend API URL

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://YOUR-BACKEND-URL.railway.app/api'  // Copy from Step 5
};
```

### Step 7: Push Changes

```bash
git add src/environments/environment.prod.ts
git commit -m "Update API URL for production"
git push origin main
```

### Step 8: Deploy Frontend as Docker

**Option A: Separate Frontend Service**

1. In Railway, click "Add Service" → "Docker"
2. Build from Dockerfile:
   - Select branch: `main`
   - Dockerfile: `Dockerfile.frontend`
3. Set environment variable:
   - **Key**: `API_URL`
   - **Value**: `https://YOUR-BACKEND-URL.railway.app/api`
4. Click "Deploy"

**Option B: Use Frontend Dockerfile with API proxy**
1. Build with `Dockerfile.frontend`
2. Nginx automatically proxies `/api/` to backend

### Step 9: Get Your Public URLs

**For Backend:**
1. Click backend service in Railway
2. Go to "Settings" → "Networking"
3. Copy public URL (looks like: `https://srms-api-xyz.railway.app`)

**For Frontend:**
1. Click frontend service in Railway
2. Go to "Settings" → "Networking"
3. Copy public URL (looks like: `https://srms-app-abc.railway.app`)

### Step 10: Test Your Application

```
1. Open frontend URL in browser: https://srms-app-abc.railway.app
2. Should see login page
3. Test login with:
   - Email: admin@gmail.com
   - Password: 123456
4. Check browser console (F12) for errors
5. Check Railway logs for API errors
```

---

## 🔧 Configuration Files Included

### `Procfile`
Tells Railway how to start the backend
```
web: java -Dserver.port=$PORT -jar Backend/srms/target/*.jar
```

### `railway.json`
Configuration for Railway deployment
- Build settings
- Start command
- Environment variables
- Database connection info

### `Dockerfile.frontend`
Multi-stage build for Angular app
- Stage 1: Build with Node.js
- Stage 2: Serve with Nginx

### `nginx.conf`
Nginx web server configuration
- Serves Angular app
- Proxies /api/ requests to backend
- Handles routing (SPA)
- Compresses responses
- Sets security headers

### `Dockerfile.backend`
Multi-stage build for Spring Boot
- Stage 1: Build with Maven
- Stage 2: Run with Java 11

---

## 📊 Architecture on Railway

```
┌─────────────────────────────────┐
│     Railway.app Platform        │
├─────────────────────────────────┤
│                                 │
│  ┌──────────────────────────┐   │
│  │   Frontend (Nginx)       │   │
│  │   https://srms.app       │   │
│  │  ├─ Angular app          │   │
│  │  ├─ Static assets        │   │
│  │  └─ API proxy to backend │   │
│  └──────────────────────────┘   │
│           │                      │
│           ▼ /api/               │
│  ┌──────────────────────────┐   │
│  │   Backend (Spring Boot)  │   │
│  │   https://srms-api.app   │   │
│  │  ├─ REST API             │   │
│  │  ├─ Auth service         │   │
│  │  └─ Business logic       │   │
│  └──────────────────────────┘   │
│           │                      │
│           ▼ JDBC                │
│  ┌──────────────────────────┐   │
│  │    MySQL Database        │   │
│  │  (Railway MySQL service) │   │
│  │  ├─ Students table       │   │
│  │  ├─ Teachers table       │   │
│  │  ├─ Marks table          │   │
│  │  └─ Rechecks table       │   │
│  └──────────────────────────┘   │
│                                 │
└─────────────────────────────────┘
```

---

## 🚀 Deployment Timeline

| Time | Action |
|------|--------|
| 0m | Start: Create Railway account & repo |
| 2m | Add MySQL service |
| 3m | Set environment variables |
| 5m | Backend deployment starts |
| 10m | Backend ready (green status) |
| 11m | Update frontend API URL |
| 12m | Frontend deployment starts |
| 17m | Frontend ready (green status) |
| 18m | Test application |

---

## ✅ Deployment Checklist

- [ ] GitHub repo connected to Railway
- [ ] MySQL service added
- [ ] Backend environment variables set
- [ ] Backend deployed successfully (green status)
- [ ] Backend public URL obtained
- [ ] Frontend API URL updated
- [ ] Frontend code pushed to GitHub
- [ ] Frontend deployed successfully (green status)
- [ ] Frontend public URL obtained
- [ ] Login tested successfully
- [ ] Database operations verified
- [ ] API calls working (no CORS errors)

---

## 🐛 Common Issues & Solutions

### Issue: Backend won't start
**Solution:**
- Check Maven build logs
- Verify Java version (11+)
- Check MySQL is connected
- Verify SPRING_DATASOURCE_URL format

### Issue: Frontend shows "Cannot GET /api/"
**Solution:**
- Verify API_URL in environment.prod.ts
- Check backend public URL
- Ensure backend is running (green status)
- Wait 30 seconds for DNS propagation

### Issue: Login fails
**Solution:**
- Check browser network tab for API response
- Verify CORS settings in backend
- Check database is initialized
- Look at Railway backend logs

### Issue: Database connection times out
**Solution:**
- Verify MySQL service is running
- Check SPRING_DATASOURCE_URL format
- Use correct port (usually 3306)
- Verify credentials match exactly

### Issue: Build takes too long
**Solution:**
- First build can take 5-10 minutes
- Subsequent builds use cache
- Check "Deployments" tab for build logs
- Maven downloads dependencies on first build

---

## 📚 Additional Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **Angular Docs:** https://angular.io/docs
- **MySQL Docs:** https://dev.mysql.com/doc/

---

## 💰 Cost Estimation

Railway offers free tier ($5/month):

| Service | Cost |
|---------|------|
| Frontend (Nginx) | ~$2/month |
| Backend (Spring Boot) | ~$5/month |
| MySQL Database | ~$5/month |
| **Total** | **~$12/month** (with free tier included) |

First $5 of usage is free every month!

---

## 🎉 Congratulations!

Your Student Result Management System is now deployed on Railway.app!

**Share your deployment:**
- Frontend: https://srms-app-xyz.railway.app
- API: https://srms-api-xyz.railway.app

---

**Questions?** Check RAILWAY_DEPLOYMENT_GUIDE.md for detailed information.
