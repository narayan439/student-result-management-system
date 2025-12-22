# Deployment Guide - Railway.app

## Overview
This guide covers deploying the Student Result Management System on Railway.app, including both the Angular frontend and Spring Boot backend.

## Prerequisites
- Railway.app account (https://railway.app)
- GitHub repository with your code
- MySQL database (Railway provides this)

## Step 1: Prepare Your GitHub Repository

### 1.1 Create `.railwayignore` file
Create a file in the root directory to ignore unnecessary files during deployment:

```
node_modules/
.angular/
dist/
Backend/target/
.git/
.gitignore
README.md
```

### 1.2 Push your code to GitHub
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

## Step 2: Deploy Backend (Spring Boot)

### 2.1 Create Railway Project

1. Go to https://railway.app and log in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect it's a Spring Boot project

### 2.2 Set Environment Variables

In Railway dashboard, add these environment variables:

```
DATABASE_URL = [Will be auto-set by Railway MySQL]
SPRING_DATASOURCE_URL = jdbc:mysql://[host]:[port]/[database]
SPRING_DATASOURCE_USERNAME = [db_user]
SPRING_DATASOURCE_PASSWORD = [db_password]
SPRING_JPA_HIBERNATE_DDL_AUTO = update
SPRING_JPA_SHOW_SQL = false
SPRING_JPA_PROPERTIES_HIBERNATE_DIALECT = org.hibernate.dialect.MySQL8Dialect
CORS_ALLOWED_ORIGINS = https://your-frontend-domain.railway.app
```

### 2.3 Configure Backend Procfile

Create `Procfile` in root directory:

```
web: java -Dserver.port=$PORT -jar Backend/srms/target/*.jar
```

### 2.4 Add MySQL Database

1. Click "Add Service" in Railway project
2. Select "MySQL"
3. Railway automatically sets DATABASE_URL
4. Update spring datasource variables with provided credentials

### 2.5 Deploy Backend

1. Connect your GitHub repository
2. Railway automatically detects `pom.xml` and builds with Maven
3. Application runs on randomly assigned PORT (set via $PORT variable)

## Step 3: Deploy Frontend (Angular)

### 3.1 Create Frontend Build Script

Create `build-frontend.sh`:

```bash
#!/bin/bash
cd /
npm install -g @angular/cli
cd /app
npm install
ng build --configuration production
```

### 3.2 Create nginx Configuration

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name _;
    
    root /app/dist/frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://backend-service:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3.3 Create Dockerfile for Frontend

Create `Dockerfile.frontend`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/student-result-management-system /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3.4 Update Angular Environment Files

Update `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-domain.railway.app/api'
};
```

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

## Step 4: Alternative - Monorepo Deployment

If deploying both frontend and backend from same repo:

### 4.1 Create `railway.json`

```json
{
  "name": "Student Result Management System",
  "build": {
    "builder": "nixpacks"
  },
  "deploy": {
    "startCommand": "java -Dserver.port=$PORT -jar Backend/srms/target/srms*.jar",
    "environmentVariables": {
      "SPRING_DATASOURCE_URL": "$DATABASE_URL",
      "SPRING_DATASOURCE_USERNAME": "$DATABASE_USER",
      "SPRING_DATASOURCE_PASSWORD": "$DATABASE_PASSWORD",
      "SPRING_JPA_HIBERNATE_DDL_AUTO": "update"
    }
  }
}
```

### 4.2 Create `package.json` at root (if not exists)

```json
{
  "name": "student-result-management",
  "version": "1.0.0",
  "scripts": {
    "build:frontend": "cd . && npm install && ng build --configuration production",
    "build:backend": "cd Backend/srms && mvn clean package -DskipTests",
    "start": "java -Dserver.port=$PORT -jar Backend/srms/target/srms*.jar"
  }
}
```

## Step 5: Database Setup

### 5.1 MySQL on Railway

1. Add MySQL service in Railway
2. Get credentials from "Connect" tab
3. Update application properties with:
   - Host
   - Port (usually 3306)
   - Database name
   - Username
   - Password

### 5.2 Initialize Database

Spring Boot with `spring.jpa.hibernate.ddl-auto=update` will automatically:
- Create tables
- Update schema
- Run on first deployment

## Step 6: API Communication

### 6.1 Update API URLs

In `src/app/core/services/auth.service.ts`:

```typescript
private readonly API_URL = 'https://your-backend-domain.railway.app/api';
```

In all other services, update baseUrl:

```typescript
private baseUrl = 'https://your-backend-domain.railway.app/api/students';
```

### 6.2 CORS Configuration

Update `Backend/srms/src/main/resources/application.properties`:

```properties
# CORS Configuration
cors.allowed-origins=https://your-frontend-domain.railway.app,https://www.your-frontend-domain.railway.app
cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
cors.allowed-headers=*
cors.allow-credentials=true
```

## Step 7: Deploy on Railway

### 7.1 Backend Deployment

1. Create new Railway project
2. Connect GitHub repository
3. Configure environment variables
4. Add MySQL database
5. Deploy (Railway auto-detects and builds)

### 7.2 Frontend Deployment

**Option A: Separate Frontend Project**
1. Create new Railway project for frontend
2. Use Dockerfile.frontend
3. Set API_URL environment variable
4. Deploy

**Option B: Serve from Backend**
1. Build Angular app: `ng build --configuration production`
2. Copy dist folder to Backend resources
3. Configure Spring Boot to serve static files
4. Deploy single project

## Step 8: Configure Custom Domains (Optional)

1. Go to Railway project settings
2. Add custom domain
3. Update DNS records at your domain provider
4. Wait for SSL certificate (automatic)

## Step 9: Environment Variables Checklist

### Backend Variables:
```
PORT                                    (set by Railway)
DATABASE_URL                            (MySQL connection string)
SPRING_DATASOURCE_URL                   (JDBC URL)
SPRING_DATASOURCE_USERNAME              (DB user)
SPRING_DATASOURCE_PASSWORD              (DB password)
SPRING_JPA_HIBERNATE_DDL_AUTO          update
CORS_ALLOWED_ORIGINS                    (Frontend URL)
```

### Frontend Variables:
```
API_URL                                 (Backend API URL)
NODE_ENV                                production
```

## Step 10: Monitoring & Logs

1. View logs in Railway dashboard
2. Check deployment status
3. Monitor resource usage
4. View database connections

## Troubleshooting

### Port Issues
- Railway assigns random PORT via $PORT variable
- Ensure app listens on this port
- For Spring Boot: `-Dserver.port=$PORT`

### Database Connection
- Verify JDBC URL format: `jdbc:mysql://host:port/database`
- Check credentials match Railway MySQL service
- Ensure SSL mode if required: `?useSSL=true&serverTimezone=UTC`

### CORS Errors
- Update CORS_ALLOWED_ORIGINS with frontend domain
- Match exactly with browser URL

### Build Failures
- Check Maven/npm installation
- Verify Java version (11+)
- Review build logs in Railway dashboard

## Rollback

1. Go to Railway project
2. View "Deployments" tab
3. Select previous successful deployment
4. Click "Redeploy"

## Cost Estimation

Railway pricing (as of 2024):
- First $5/month free
- Pay-as-you-go after that
- MySQL: Usually $5-15/month
- Backend: $5-20/month depending on usage
- Frontend (Nginx): $5-10/month

## Next Steps

1. Test login functionality
2. Verify database operations
3. Check API communication
4. Monitor logs for errors
5. Set up automatic deployments from GitHub

---

For more help: https://docs.railway.app
