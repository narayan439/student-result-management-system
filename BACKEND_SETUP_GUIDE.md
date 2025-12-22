# Backend Implementation Guide - Student Result Management System

## 📊 Overview
This guide documents the complete backend implementation for the Student Result Management System using Spring Boot 3.2.5 with Java 17.

## 🗂️ Project Structure

```
Backend/srms/src/main/java/com/studentresult/
├── entity/                          # JPA Entities
│   ├── Student.java                 # Student entity with personal details
│   ├── Marks.java                   # Marks entity with marks data
│   ├── Teacher.java                 # Teacher entity with subject mapping
│   ├── User.java                    # User entity for authentication
│   └── RecheckRequest.java          # Recheck request entity
│
├── repository/                      # Spring Data JPA Repositories
│   ├── StudentRepository.java       # Student CRUD & custom queries
│   ├── MarksRepository.java         # Marks CRUD & filtering
│   ├── TeacherRepository.java       # Teacher CRUD & search
│   ├── UserRepository.java          # User authentication queries
│   └── RecheckRequestRepository.java# Recheck request queries
│
├── service/                         # Business Logic Layer
│   ├── StudentService.java          # Student management logic
│   ├── MarksService.java            # Marks calculation & management
│   ├── TeacherService.java          # Teacher management logic
│   └── RecheckRequestService.java   # Recheck request handling
│
├── controller/                      # REST API Endpoints
│   ├── StudentController.java       # Student API endpoints
│   ├── MarksController.java         # Marks API endpoints
│   ├── TeacherController.java       # Teacher API endpoints
│   └── RecheckRequestController.java# Recheck API endpoints
│
├── dto/                             # Data Transfer Objects
│   ├── ApiResponse.java             # Standard API response wrapper
│   ├── StudentDTO.java              # Student data transfer object
│   ├── MarksDTO.java                # Marks data transfer object
│   ├── TeacherDTO.java              # Teacher data transfer object
│   ├── UserDTO.java                 # User data transfer object
│   └── RecheckRequestDTO.java       # Recheck request DTO
│
├── exception/                       # Exception Handling
│   ├── GlobalExceptionHandler.java  # Centralized exception handler
│   ├── ResourceNotFoundException.java
│   ├── ValidationException.java
│   └── DuplicateEntryException.java
│
└── SrmsApplication.java             # Main Spring Boot application
```

## 🚀 Quick Start

### Prerequisites
1. Java 17 or higher
2. Maven 3.8+
3. MySQL Server 8.0+
4. IDE (IntelliJ IDEA or VS Code with Java extensions)

### Database Setup

1. Create database:
```sql
CREATE DATABASE srms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE srms_db;
```

2. Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/srms_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

3. Run application - tables will be auto-created via Hibernate JPA.

### Running the Backend

```bash
# Navigate to backend directory
cd Backend/srms

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or package and run as JAR
mvn package
java -jar target/srms-1.0.0.jar
```

The backend will start on `http://localhost:8080/api`

## 📡 API Endpoints

### Student Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students/all` | Get all students |
| GET | `/students/active` | Get active students only |
| GET | `/students/{id}` | Get student by ID |
| GET | `/students/class/{className}` | Get students by class |
| GET | `/students/rollno/{rollNo}` | Get student by roll number |
| GET | `/students/search?searchTerm=value` | Search students |
| POST | `/students/add` | Create new student |
| PUT | `/students/{id}` | Update student |
| DELETE | `/students/{id}` | Delete student |

### Marks Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/marks/all` | Get all marks |
| GET | `/marks/{id}` | Get mark by ID |
| GET | `/marks/student/{studentId}` | Get student's marks |
| GET | `/marks/class/{className}` | Get class marks |
| GET | `/marks/student/{studentId}/term/{term}/year/{year}` | Get marks by term |
| GET | `/marks/student/{studentId}/statistics` | Get mark statistics |
| POST | `/marks/add` | Add new mark |
| PUT | `/marks/{id}` | Update mark |
| DELETE | `/marks/{id}` | Delete mark |

### Teacher Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/teachers/all` | Get all teachers |
| GET | `/teachers/active` | Get active teachers |
| GET | `/teachers/{id}` | Get teacher by ID |
| GET | `/teachers/email/{email}` | Get teacher by email |
| GET | `/teachers/search?searchTerm=value` | Search teachers |
| GET | `/teachers/subject/{subject}` | Get teachers by subject |
| POST | `/teachers/add` | Create new teacher |
| PUT | `/teachers/{id}` | Update teacher |
| DELETE | `/teachers/{id}` | Delete teacher |

### Recheck Request Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/rechecks/all` | Get all recheck requests |
| GET | `/rechecks/{id}` | Get recheck by ID |
| GET | `/rechecks/student/{studentId}` | Get student's rechecks |
| GET | `/rechecks/status/{status}` | Get rechecks by status |
| POST | `/rechecks/request` | Create recheck request |
| PUT | `/rechecks/{id}/status?status=value` | Update status |
| PUT | `/rechecks/{id}/notes` | Add admin notes |
| DELETE | `/rechecks/{id}` | Delete recheck request |

## 📝 Request/Response Examples

### Create Student
**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "className": "Class 10",
  "rollNo": "10A01",
  "phone": "9876543210",
  "dob": "2007-05-15"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Student added successfully",
  "data": {
    "studentId": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "className": "Class 10",
    "rollNo": "10A01",
    "phone": "9876543210",
    "dob": "2007-05-15",
    "isActive": true,
    "createdAt": "2024-12-20T10:30:00",
    "updatedAt": "2024-12-20T10:30:00"
  }
}
```

### Add Marks
**Request:**
```json
{
  "student": {
    "studentId": 1
  },
  "subject": "Mathematics",
  "marksObtained": 85,
  "maxMarks": 100,
  "term": "Term 1",
  "year": 2024
}
```

**Response:**
```json
{
  "success": true,
  "message": "Mark added successfully",
  "data": {
    "marksId": 1,
    "studentId": 1,
    "studentName": "John Doe",
    "subject": "Mathematics",
    "marksObtained": 85,
    "maxMarks": 100,
    "term": "Term 1",
    "year": 2024,
    "isRecheckRequested": false,
    "createdAt": "2024-12-20T11:00:00",
    "updatedAt": "2024-12-20T11:00:00"
  }
}
```

### Get Mark Statistics
**Request:**
```
GET /marks/student/1/statistics
```

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total": 425,
    "percentage": "85.00",
    "average": "85.00",
    "grade": "A",
    "status": "PASS"
  }
}
```

## 🔒 Security Features

### Implemented
- ✅ CORS configuration for frontend communication
- ✅ DTO-based request/response handling (no direct entity exposure)
- ✅ Exception handling with meaningful error messages
- ✅ Validation of input data
- ✅ Soft delete implementation (isActive flag)
- ✅ Timestamp tracking (createdAt, updatedAt)

### To Be Implemented
- 🔄 JWT authentication
- 🔄 Role-based access control (RBAC)
- 🔄 Password hashing with BCrypt
- 🔄 API rate limiting
- 🔄 SQL injection prevention enhancements

## 🔄 Entity Relationships

### Student → Marks
- One Student has Many Marks
- Marks entity has `@ManyToOne` relationship with Student
- Foreign key: `student_id` in marks table

### Student → RecheckRequest
- One Student has Many RecheckRequests
- RecheckRequest entity has `@ManyToOne` relationship with Student

### Marks → RecheckRequest
- One Mark has Many RecheckRequests
- RecheckRequest entity has `@ManyToOne` relationship with Marks

## 📊 Database Schema

### Students Table
```sql
CREATE TABLE students (
  student_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  class_name VARCHAR(50) NOT NULL,
  roll_no VARCHAR(20) UNIQUE NOT NULL,
  phone VARCHAR(20),
  dob VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

### Marks Table
```sql
CREATE TABLE marks (
  marks_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  student_id BIGINT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  marks_obtained INT NOT NULL,
  max_marks INT DEFAULT 100,
  term VARCHAR(50),
  year INT NOT NULL,
  is_recheck_requested BOOLEAN DEFAULT false,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(student_id)
);
```

### Teachers Table
```sql
CREATE TABLE teachers (
  teacher_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  subjects VARCHAR(500),
  experience INT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

## 🛠️ Service Layer Features

### StudentService
- ✅ Get all students (with active filter)
- ✅ Get student by ID, email, or rollNo
- ✅ Search students by name/email
- ✅ Filter students by class
- ✅ Add, update, delete operations
- ✅ Soft delete with isActive flag

### MarksService
- ✅ CRUD operations for marks
- ✅ Get marks by student, class, term, year
- ✅ Calculate total marks
- ✅ Calculate percentage (total/max)
- ✅ Calculate average marks
- ✅ Generate grade (A+, A, B, C, D, F)
- ✅ Determine pass/fail status
- ✅ Manage recheck requests

### TeacherService
- ✅ CRUD operations for teachers
- ✅ Search teachers by name/email
- ✅ Filter teachers by subject
- ✅ Active teacher filtering

### RecheckRequestService
- ✅ CRUD operations for recheck requests
- ✅ Get rechecks by student or status
- ✅ Update status (PENDING, APPROVED, REJECTED)
- ✅ Add admin notes
- ✅ Track request and resolution dates

## 🚦 Status Code Reference

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET/PUT/DELETE |
| 201 | Created | Successful POST |
| 400 | Bad Request | Invalid input data |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry |
| 500 | Server Error | Unexpected error |

## 📋 Validation Rules

### Student
- Name: Required, max 100 characters
- Email: Required, unique, valid email format
- ClassName: Required
- RollNo: Required, unique
- Phone: Optional, max 20 characters
- DOB: Optional

### Marks
- MarksObtained: Required, must be 0-100
- MaxMarks: Default 100
- Subject: Required
- Term: Optional (e.g., "Term 1", "Term 2")
- Year: Required

### Teacher
- Name: Required, max 100 characters
- Email: Required, unique
- Subjects: Comma-separated values
- Experience: Optional, in years

## 🔧 Configuration

The application is configured in `application.properties`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/srms_db
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false

# Logging
logging.level.root=INFO
logging.level.com.studentresult=DEBUG
```

## 📚 Testing the API

### Using cURL

```bash
# Get all students
curl http://localhost:8080/api/students/all

# Add a student
curl -X POST http://localhost:8080/api/students/add \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "className": "Class 10",
    "rollNo": "10A01",
    "phone": "9876543210",
    "dob": "2007-05-15"
  }'

# Get student marks
curl http://localhost:8080/api/marks/student/1

# Get mark statistics
curl http://localhost:8080/api/marks/student/1/statistics
```

### Using Postman
1. Import the API endpoints
2. Set base URL to `http://localhost:8080/api`
3. Create requests for each endpoint
4. Test with sample data

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check database URL and credentials in `application.properties`
- Ensure database exists

### Port Already in Use
- Change port in `application.properties`: `server.port=8081`

### Entity Not Found
- Ensure all entities are in correct package structure
- Rebuild with `mvn clean build`

### CORS Issues
- Check `@CrossOrigin` annotation on controllers
- Verify frontend URL matches configuration

## 📞 Next Steps

1. **Authentication**: Implement JWT token-based authentication
2. **Authorization**: Add role-based access control
3. **Caching**: Implement Redis caching for frequently accessed data
4. **Logging**: Add AOP-based request/response logging
5. **Testing**: Write unit and integration tests
6. **Documentation**: Generate API documentation with Swagger/SpringDoc
7. **Deployment**: Containerize with Docker and deploy to cloud

---

**Created**: December 20, 2024
**Version**: 1.0
