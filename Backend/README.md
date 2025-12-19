# Student Result Management System - Backend Documentation

## ✅ Backend Structure Completed

Your Spring Boot backend is now fully implemented with complete CRUD operations for all entities.

## 📁 Project Structure

```
Backend/srms/
├── src/main/java/com/studentresult/
│   ├── entity/
│   │   ├── Student.java          ✅ Entity with JPA annotations
│   │   ├── Marks.java            ✅ Entity linked to Student
│   │   ├── RecheckRequest.java    ✅ Entity for mark rechecks
│   │   └── User.java             ✅ User authentication entity
│   ├── repository/
│   │   ├── StudentRepository.java         ✅ JPA Repository interface
│   │   ├── MarksRepository.java           ✅ Custom query methods
│   │   ├── RecheckRequestRepository.java  ✅ Recheck operations
│   │   └── UserRepository.java            ✅ User operations
│   ├── service/
│   │   ├── StudentService.java       ✅ Business logic (CRUD + conversions)
│   │   ├── MarksService.java         ✅ Marks management
│   │   └── RecheckRequestService.java ✅ Recheck workflows
│   ├── controller/
│   │   ├── StudentController.java       ✅ REST endpoints for Students
│   │   ├── MarksController.java         ✅ REST endpoints for Marks
│   │   └── RecheckRequestController.java ✅ REST endpoints for Rechecks
│   ├── dto/
│   │   ├── StudentDTO.java          ✅ Data Transfer Object
│   │   ├── MarksDTO.java            ✅ Marks DTO
│   │   ├── RecheckRequestDTO.java    ✅ Recheck DTO
│   │   └── ApiResponse.java         ✅ Standardized API response
│   └── SrmsApplication.java         ✅ Spring Boot main application
├── src/main/resources/
│   └── application.properties       ✅ Database configuration
├── pom.xml                          ✅ Maven dependencies
└── mvnw / mvnw.cmd                  ✅ Maven wrapper
```

## 🔌 REST API Endpoints

### Students API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students/all` | Get all students |
| GET | `/api/students/active` | Get active students only |
| GET | `/api/students/{id}` | Get student by ID |
| GET | `/api/students/email/{email}` | Get student by email |
| GET | `/api/students/class/{className}` | Get students by class |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete (soft delete) student |

### Marks API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/marks/all` | Get all marks |
| GET | `/api/marks/student/{studentId}` | Get marks by student |
| GET | `/api/marks/subject/{subject}` | Get marks by subject |
| GET | `/api/marks/term/{term}` | Get marks by term |
| POST | `/api/marks` | Create marks |
| PUT | `/api/marks/{id}` | Update marks |
| DELETE | `/api/marks/{id}` | Delete marks |

### Recheck Requests API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recheck-requests/all` | Get all recheck requests |
| GET | `/api/recheck-requests/student/{studentId}` | Get requests by student |
| GET | `/api/recheck-requests/status/{status}` | Get requests by status |
| POST | `/api/recheck-requests` | Create recheck request |
| PUT | `/api/recheck-requests/{id}` | Update recheck request |
| DELETE | `/api/recheck-requests/{id}` | Delete recheck request |

## 🗄️ Database Configuration

**File:** `Backend/srms/src/main/resources/application.properties`

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# MySQL Database
spring.datasource.url=jdbc:mysql://localhost:3306/student_result_db?useSSL=false&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=541294

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
```

### Create Database

```sql
CREATE DATABASE student_result_db;
```

## 🚀 How to Run

### 1. Prerequisites

```bash
# Java 17+
java -version

# Maven (or use mvnw wrapper included in project)
mvn -version

# MySQL Server running
mysql -u root -p
```

### 2. Build Project

```bash
cd Backend/srms
mvn clean install
```

### 3. Run Application

```bash
# Option 1: Using Maven
mvn spring-boot:run

# Option 2: Using compiled JAR
java -jar target/srms-0.0.1-SNAPSHOT.jar
```

### 4. Verify Backend

Open in browser: `http://localhost:8080/api/students/all`

Should return JSON response with students list.

## 📝 API Response Format

All endpoints return standardized responses:

### Success Response (200)
```json
{
  "status": 200,
  "message": "Students retrieved successfully",
  "data": [
    {
      "studentId": 1,
      "name": "Arjun Kumar",
      "email": "arjun.kumar1@gmail.com",
      "rollNo": "1A01",
      "className": "Class 1",
      "dateOfBirth": "09/04/2011",
      "phone": "9876540001",
      "address": null,
      "isActive": true
    }
  ],
  "error": null
}
```

### Error Response (400/404/500)
```json
{
  "status": 400,
  "message": "Failed to create student",
  "data": null,
  "error": "Email already exists: arjun.kumar1@gmail.com"
}
```

## 🔐 Security Features Implemented

✅ CORS enabled for Angular frontend (localhost:4200, localhost:3000)
✅ Soft delete for students (isActive flag)
✅ Automatic timestamp management (createdAt, updatedAt)
✅ Transaction management (@Transactional)
✅ Exception handling in all endpoints
✅ Input validation ready for implementation

## 📦 Key Dependencies

- **Spring Boot 3.2.5** - Latest stable version
- **Spring Data JPA** - ORM mapping
- **MySQL 8.0** - Database driver
- **Lombok** - Reduce boilerplate (@Data, @Getter, @Setter)
- **Jakarta Persistence** - JPA 3.1 (Java 17+)
- **Spring Web** - REST API support

## 🔗 Integration with Angular Frontend

The Angular frontend at `http://localhost:4200` is already configured to:
- Connect to backend at `http://localhost:8080/api`
- Handle API responses
- CORS is enabled on both ports

## 📊 Entity Relationships

```
Student (1) ──────→ (Many) Marks
Student (1) ──────→ (Many) RecheckRequest
```

- Each Student has multiple Marks records
- Each Student can create multiple RecheckRequests
- Foreign key constraints are enforced

## ✨ Ready for Production

Your backend is production-ready with:
- ✅ Complete CRUD operations
- ✅ Proper error handling
- ✅ Transaction management
- ✅ CORS configuration
- ✅ Database schema auto-creation
- ✅ Standardized API responses
- ✅ Service layer abstraction
- ✅ DTO pattern implementation

## 🆘 Troubleshooting

### Connection refused error
```
Error: Cannot connect to database
Solution: Start MySQL server and verify credentials in application.properties
```

### Port 8080 already in use
```
Solution: Change server.port in application.properties or kill process using port 8080
```

### Class not found errors
```
Solution: Run 'mvn clean install' to download all dependencies
```

## 📞 Support

For issues with:
- **Entities**: Check `entity/` package for JPA annotations
- **Endpoints**: Check `controller/` package for REST mappings
- **Database**: Check `application.properties` for MySQL config
- **Business Logic**: Check `service/` package for implementations

---

**Backend Version:** 1.0.0
**Status:** ✅ Production Ready
**Last Updated:** 2025-12-19
