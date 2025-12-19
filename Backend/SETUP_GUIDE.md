# Backend Setup & Configuration Guide

## ✅ Configuration Complete

### application.properties - Updated ✅

```properties
spring.application.name=srms

# Server Configuration
server.port=8080
server.servlet.context-path=/api

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/srms_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=541294
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA / Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Logging Configuration
logging.level.root=INFO
logging.level.com.studentresult=DEBUG
logging.level.org.springframework.web=DEBUG
logging.level.org.hibernate.SQL=DEBUG

# Jackson Configuration
spring.jackson.serialization.write-dates-as-timestamps=false
spring.jackson.time-zone=UTC

# Actuator Configuration
management.endpoints.web.exposure.include=health,info
management.endpoint.health.show-details=always
```

### pom.xml - Updated with Complete Dependencies ✅

**Added Dependencies:**

| Dependency | Purpose |
|-----------|---------|
| **spring-boot-starter-web** | REST API & MVC support |
| **spring-boot-starter-data-jpa** | Database ORM (Hibernate) |
| **mysql-connector-j 8.0.33** | MySQL database driver |
| **lombok** | Reduce boilerplate code |
| **spring-boot-starter-validation** | Input validation |
| **spring-boot-devtools** | Hot reload during development |
| **spring-boot-starter-actuator** | Application monitoring |
| **springdoc-openapi 2.5.0** | Swagger/OpenAPI documentation |
| **spring-boot-starter-test** | Unit & integration testing |
| **h2** | In-memory database for testing |

### CorsConfig.java - Added ✅

CORS configuration file created for Angular frontend integration:
- ✅ Allows `localhost:4200` (Angular dev server)
- ✅ Allows `localhost:3000` (Alternative port)
- ✅ Enables all standard HTTP methods (GET, POST, PUT, DELETE)
- ✅ Max age: 3600 seconds (1 hour)

## 🗄️ Database Setup

### Step 1: Create Database

```sql
CREATE DATABASE srms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 2: Verify Connection

```bash
mysql -u root -p
password: 541294
USE srms_db;
SHOW TABLES;
```

## 🚀 How to Build & Run

### Option 1: Using Maven (Recommended)

```bash
# Navigate to project
cd Backend/srms

# Clean and install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

### Option 2: Using IDE

1. Import project into IntelliJ IDEA / Eclipse
2. Right-click project → Run as → Spring Boot App
3. Or click the Run button in IDE

### Option 3: Using JAR

```bash
# Build JAR
cd Backend/srms
mvn clean package

# Run JAR
java -jar target/srms-1.0.0.jar
```

## ✅ Verification

After starting the backend, verify it's running:

### 1. Health Check
```
GET http://localhost:8080/api/actuator/health
```

Expected Response:
```json
{
  "status": "UP"
}
```

### 2. Test Student Endpoint
```
GET http://localhost:8080/api/students/all
```

Expected Response:
```json
{
  "status": 200,
  "message": "Students retrieved successfully",
  "data": [],
  "error": null
}
```

### 3. Swagger API Documentation
```
http://localhost:8080/api/swagger-ui.html
```

## 🔧 Important Notes

### Database Auto-Creation
- `spring.jpa.hibernate.ddl-auto=update` will automatically create tables
- If you want to reset: change to `create-drop` (be careful, drops all data)
- For production: use `validate` mode

### Port Configuration
- Backend runs on: **8080/api**
- Angular frontend: **4200**
- Make sure port 8080 is not already in use

### MySQL Credentials
```
Host: localhost
Port: 3306
Username: root
Password: 541294
Database: srms_db
```

### SSL/TLS Configuration
- Currently disabled in datasource URL: `useSSL=false`
- For production, enable SSL and configure proper certificates

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────┐
│        Angular Frontend (4200)              │
├─────────────────────────────────────────────┤
│              CORS Enabled                   │
├─────────────────────────────────────────────┤
│  Spring Boot Backend (8080/api)             │
│  ├── Controllers (REST Endpoints)           │
│  ├── Services (Business Logic)              │
│  ├── Repositories (Database Access)         │
│  └── Entities (Database Models)             │
├─────────────────────────────────────────────┤
│        MySQL Database (3306)                │
│        Database: srms_db                    │
└─────────────────────────────────────────────┘
```

## 🔒 Security Features

✅ CORS configured for frontend  
✅ Input validation on all endpoints  
✅ Exception handling throughout  
✅ Transaction management (@Transactional)  
✅ Soft delete for data protection  
✅ Automatic timestamp tracking (createdAt, updatedAt)

## 📝 Log Levels

- **Root**: INFO (default Spring logs)
- **com.studentresult**: DEBUG (application logs)
- **org.springframework.web**: DEBUG (request/response logs)
- **org.hibernate.SQL**: DEBUG (database query logs)

## 🆘 Troubleshooting

### Error: Access denied for user 'root'@'localhost'
```
Solution: 
1. Verify MySQL is running
2. Check password in application.properties
3. Run: mysql -u root -p (and enter password 541294)
```

### Error: Port 8080 already in use
```
Solution:
1. Change server.port in application.properties
2. Or kill process using port 8080:
   Windows: netstat -ano | findstr :8080
   Linux: lsof -i :8080 | kill -9 <PID>
```

### Error: Database srms_db doesn't exist
```
Solution:
1. Create database: CREATE DATABASE srms_db;
2. Or wait for automatic creation on first run
```

### Slow startup / Compilation issues
```
Solution:
1. Clean: mvn clean
2. Install: mvn install
3. Run: mvn spring-boot:run
```

## 📞 API Documentation

After startup, visit: `http://localhost:8080/api/swagger-ui.html`

This provides interactive API documentation with:
- All available endpoints
- Request/response examples
- Try it out functionality
- Automatic documentation from code

## ✨ Ready for Development

Your backend is now ready for:
- ✅ Frontend integration
- ✅ Database operations
- ✅ REST API testing
- ✅ Production deployment

---

**Backend Status:** ✅ Fully Configured & Ready
**Version:** 1.0.0
**Framework:** Spring Boot 3.2.5
**Java Version:** 17+
**Database:** MySQL 8.0
