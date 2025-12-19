# Testing Guide for SRMS Backend

## 📋 Table of Contents

1. [Unit Testing](#unit-testing)
2. [Integration Testing](#integration-testing)
3. [Manual API Testing](#manual-api-testing)
4. [Database Testing](#database-testing)
5. [Frontend Integration Testing](#frontend-integration-testing)
6. [Performance Testing](#performance-testing)

---

## Unit Testing

### Run All Tests

```bash
cd Backend/srms
mvn test
```

### Run Specific Test Class

```bash
mvn test -Dtest=StudentServiceTest
```

### Run Tests with Coverage Report

```bash
mvn test jacoco:report
# Report generated in: target/site/jacoco/index.html
```

### Example Test File Structure

Create test files in `src/test/java/com/studentresult/`:

```
src/test/java/com/studentresult/
├── service/
│   ├── StudentServiceTest.java
│   ├── MarksServiceTest.java
│   └── RecheckRequestServiceTest.java
├── controller/
│   ├── StudentControllerTest.java
│   ├── MarksControllerTest.java
│   └── RecheckRequestControllerTest.java
└── repository/
    └── StudentRepositoryTest.java
```

### Sample Test: StudentServiceTest

```java
package com.studentresult.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import com.studentresult.entity.Student;
import com.studentresult.repository.StudentRepository;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    private Student student;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        student = new Student();
        student.setId(1L);
        student.setName("John Doe");
        student.setEmail("john@gmail.com");
        student.setRollNo("101");
        student.setClassName("Class 1");
        student.setIsActive(true);
    }

    @Test
    void testGetStudentById() {
        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));
        
        Student result = studentService.getStudentById(1L);
        
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        assertEquals("john@gmail.com", result.getEmail());
        verify(studentRepository, times(1)).findById(1L);
    }

    @Test
    void testGetStudentByEmail() {
        when(studentRepository.findByEmail("john@gmail.com")).thenReturn(Optional.of(student));
        
        Student result = studentService.getStudentByEmail("john@gmail.com");
        
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
    }

    @Test
    void testCreateStudent() {
        when(studentRepository.save(student)).thenReturn(student);
        
        Student result = studentService.createStudent(student);
        
        assertNotNull(result);
        assertEquals("John Doe", result.getName());
        verify(studentRepository, times(1)).save(student);
    }
}
```

---

## Integration Testing

### Run Integration Tests Only

```bash
mvn test -Dtest=*IntegrationTest
```

### Sample Integration Test: StudentControllerIntegrationTest

```java
package com.studentresult.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.studentresult.dto.StudentDTO;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
public class StudentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllStudents() throws Exception {
        mockMvc.perform(get("/api/students/all")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void testGetStudentById() throws Exception {
        mockMvc.perform(get("/api/students/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateStudent() throws Exception {
        StudentDTO studentDTO = new StudentDTO();
        studentDTO.setName("Test Student");
        studentDTO.setEmail("test@gmail.com");
        studentDTO.setRollNo("999");
        studentDTO.setClassName("Test Class");

        mockMvc.perform(post("/api/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(studentDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200));
    }
}
```

### Create application-test.properties

```properties
# Test Database (H2 In-Memory)
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.show-sql=true
```

---

## Manual API Testing

### Option 1: Using Postman

#### Step 1: Install Postman
Download from: https://www.postman.com/downloads/

#### Step 2: Create Collection & Requests

**Test Student Endpoints:**

```
1. GET http://localhost:8080/api/students/all
   - Description: Retrieve all students
   - Expected: 200 OK, JSON array of students

2. GET http://localhost:8080/api/students/1
   - Description: Get student by ID
   - Expected: 200 OK with student details

3. GET http://localhost:8080/api/students/email/john@gmail.com
   - Description: Get student by email
   - Expected: 200 OK with student details

4. GET http://localhost:8080/api/students/class/Class%201
   - Description: Get students by class
   - Expected: 200 OK with filtered students

5. POST http://localhost:8080/api/students
   - Headers: Content-Type: application/json
   - Body:
   {
     "name": "New Student",
     "email": "newstudent@gmail.com",
     "rollNo": "999",
     "className": "Class 1",
     "dateOfBirth": "15/06/2005",
     "phone": "9876543210",
     "address": "123 Main Street",
     "isActive": true
   }
   - Expected: 200 OK, student created

6. PUT http://localhost:8080/api/students/1
   - Headers: Content-Type: application/json
   - Body: (Updated student object)
   - Expected: 200 OK, student updated

7. DELETE http://localhost:8080/api/students/1
   - Expected: 200 OK, student deleted (soft delete)
```

### Option 2: Using cURL Commands

#### 1. Test All Students Endpoint

```bash
curl -X GET http://localhost:8080/api/students/all \
  -H "Content-Type: application/json"
```

#### 2. Test Get Student by ID

```bash
curl -X GET http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json"
```

#### 3. Test Create Student

```bash
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@gmail.com",
    "rollNo": "501",
    "className": "Class 1",
    "dateOfBirth": "20/03/2005",
    "phone": "9876543210",
    "address": "456 Oak Avenue",
    "isActive": true
  }'
```

#### 4. Test Update Student

```bash
curl -X PUT http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@gmail.com",
    "rollNo": "101",
    "className": "Class 1",
    "dateOfBirth": "15/06/2004",
    "phone": "9876543210",
    "address": "Updated Address",
    "isActive": true
  }'
```

#### 5. Test Delete Student

```bash
curl -X DELETE http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json"
```

#### 6. Test Marks Endpoints

```bash
# Get all marks
curl -X GET http://localhost:8080/api/marks/all \
  -H "Content-Type: application/json"

# Get marks by student
curl -X GET http://localhost:8080/api/marks/student/1 \
  -H "Content-Type: application/json"

# Get marks by subject
curl -X GET http://localhost:8080/api/marks/subject/Mathematics \
  -H "Content-Type: application/json"

# Create marks
curl -X POST http://localhost:8080/api/marks \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "subject": "Physics",
    "marksObtained": 85,
    "maxMarks": 100,
    "term": "Term 1",
    "year": 2024
  }'
```

#### 7. Test Recheck Request Endpoints

```bash
# Get all recheck requests
curl -X GET http://localhost:8080/api/recheck-requests/all \
  -H "Content-Type: application/json"

# Get recheck requests by student
curl -X GET http://localhost:8080/api/recheck-requests/student/1 \
  -H "Content-Type: application/json"

# Get recheck requests by status
curl -X GET http://localhost:8080/api/recheck-requests/status/pending \
  -H "Content-Type: application/json"

# Create recheck request
curl -X POST http://localhost:8080/api/recheck-requests \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "subject": "Mathematics",
    "reason": "I believe my marks are incorrect",
    "oldMarks": 75,
    "status": "pending"
  }'
```

### Option 3: Using REST Client Extension (VS Code)

Create file: `.vscode/requests.http`

```http
### Get All Students
GET http://localhost:8080/api/students/all

### Get Student by ID
GET http://localhost:8080/api/students/1

### Get Student by Email
GET http://localhost:8080/api/students/email/john@gmail.com

### Create Student
POST http://localhost:8080/api/students
Content-Type: application/json

{
  "name": "Test Student",
  "email": "test@gmail.com",
  "rollNo": "999",
  "className": "Class 1",
  "dateOfBirth": "15/06/2005",
  "phone": "9876543210",
  "address": "Test Address",
  "isActive": true
}

### Update Student
PUT http://localhost:8080/api/students/1
Content-Type: application/json

{
  "name": "Updated Student",
  "email": "updated@gmail.com",
  "rollNo": "101",
  "className": "Class 1",
  "dateOfBirth": "15/06/2004",
  "phone": "9876543210",
  "address": "Updated Address",
  "isActive": true
}

### Delete Student
DELETE http://localhost:8080/api/students/1

### Get All Marks
GET http://localhost:8080/api/marks/all

### Get Marks by Student
GET http://localhost:8080/api/marks/student/1

### Create Marks
POST http://localhost:8080/api/marks
Content-Type: application/json

{
  "studentId": 1,
  "subject": "Chemistry",
  "marksObtained": 88,
  "maxMarks": 100,
  "term": "Term 1",
  "year": 2024
}

### Get Recheck Requests
GET http://localhost:8080/api/recheck-requests/all

### Create Recheck Request
POST http://localhost:8080/api/recheck-requests
Content-Type: application/json

{
  "studentId": 1,
  "subject": "Mathematics",
  "reason": "Marks seem incorrect",
  "oldMarks": 75,
  "status": "pending"
}
```

Install REST Client extension: `ms-vscode.rest-client`

---

## Database Testing

### 1. Connect to MySQL Database

```bash
mysql -u root -p
password: 541294
USE srms_db;
```

### 2. Verify Tables Created

```sql
SHOW TABLES;
```

Expected output:
```
+------------------+
| Tables_in_srms_db |
+------------------+
| marks            |
| recheck_request  |
| student          |
| user             |
+------------------+
```

### 3. Verify Table Structures

```sql
-- Check Student Table
DESCRIBE student;

-- Check Marks Table
DESCRIBE marks;

-- Check Recheck Request Table
DESCRIBE recheck_request;

-- Check User Table
DESCRIBE user;
```

### 4. Query Sample Data

```sql
-- Count students
SELECT COUNT(*) as total_students FROM student;

-- Get all students
SELECT id, name, email, roll_no, class_name, is_active FROM student;

-- Get students in Class 1
SELECT * FROM student WHERE class_name = 'Class 1';

-- Get student email verification
SELECT name, email FROM student WHERE email LIKE '%@gmail.com';

-- Count marks by subject
SELECT subject, COUNT(*) as count FROM marks GROUP BY subject;

-- Get marks statistics
SELECT 
  subject, 
  AVG(marks_obtained) as avg_marks,
  MAX(marks_obtained) as max_marks,
  MIN(marks_obtained) as min_marks
FROM marks
GROUP BY subject;

-- Get recheck requests by status
SELECT status, COUNT(*) as count FROM recheck_request GROUP BY status;
```

### 5. Test Insert Operations

```sql
-- Insert test student
INSERT INTO student (name, email, roll_no, class_name, date_of_birth, phone, address, is_active, created_at, updated_at)
VALUES ('Test User', 'test@gmail.com', '999', 'Class 1', '15/06/2005', '9999999999', 'Test Address', 1, NOW(), NOW());

-- Insert test marks
INSERT INTO marks (student_id, subject, marks_obtained, max_marks, term, year, created_at, updated_at)
VALUES (1, 'English', 92, 100, 'Term 1', 2024, NOW(), NOW());

-- Verify insertion
SELECT * FROM student WHERE email = 'test@gmail.com';
SELECT * FROM marks WHERE student_id = 1;
```

---

## Frontend Integration Testing

### 1. Start Backend Server

```bash
cd Backend/srms
mvn spring-boot:run
```

Expected output:
```
Started SrmsApplication in X.XXX seconds
```

### 2. Start Angular Frontend

```bash
ng serve
# or
npm start
```

Expected output:
```
Application bundle generated successfully (X MB)
Application is serving at http://localhost:4200/
```

### 3. Test Frontend-Backend Communication

#### Test 1: Welcome Page Search

1. Open http://localhost:4200
2. Go to "Welcome" page
3. Search for student by Roll No: "101"
4. Expected: Student details with marks should load

#### Test 2: View Results

1. Search for student: Roll No "101", DOB "15/06/2005"
2. Click "View Results"
3. Expected: All 6 subject marks should display

#### Test 3: Student Dashboard (Requires Login)

1. Register new student: 
   - Email: test@gmail.com
   - Password: test123
2. Login with those credentials
3. Dashboard should load without errors
4. View marks should show subject-wise marks
5. Check browser console for API calls (F12)

#### Test 4: Check API Calls in Browser

1. Open Developer Tools (F12)
2. Go to Network tab
3. Perform student actions
4. Verify API calls to http://localhost:8080/api/students/*
5. Check Response should be 200 OK

### 5. Monitor Logs

#### Backend Logs (Terminal)

Look for:
```
[DEBUG] GET /api/students/1
[DEBUG] Hibernate: select ... from student where ...
```

#### Frontend Logs (Browser Console)

- No CORS errors
- No 404 errors
- API responses should be successful

---

## Performance Testing

### 1. Load Testing with Apache JMeter

```bash
# Download: https://jmeter.apache.org/download_jmeter.html

# Create test plan:
# 1. Add Thread Group (10 threads, 100 ramp-up, 2 loop counts)
# 2. Add HTTP Request Sampler
#    - Server: localhost
#    - Port: 8080
#    - Path: /api/students/all
# 3. Add Response Assertion
# 4. Add Summary Report
```

### 2. Stress Testing

```bash
# Test with 100 concurrent requests
ab -n 100 -c 100 http://localhost:8080/api/students/all
```

### 3. Check Response Times

```bash
# Measure endpoint response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8080/api/students/all
```

Create `curl-format.txt`:
```
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                      ----------\n
          time_total:  %{time_total}\n
```

---

## Test Checklist

### ✅ Unit Tests
- [ ] StudentService tests pass
- [ ] MarksService tests pass
- [ ] RecheckRequestService tests pass
- [ ] Repository custom queries work

### ✅ Integration Tests
- [ ] StudentController tests pass
- [ ] MarksController tests pass
- [ ] RecheckRequestController tests pass
- [ ] CORS headers present in response

### ✅ API Tests (Manual)
- [ ] GET /students/all returns list
- [ ] GET /students/{id} returns student
- [ ] POST /students creates new student
- [ ] PUT /students/{id} updates student
- [ ] DELETE /students/{id} deletes student
- [ ] GET /marks/all returns marks
- [ ] POST /marks creates new marks
- [ ] GET /recheck-requests/all returns requests

### ✅ Database Tests
- [ ] Tables created successfully
- [ ] Data persists after restart
- [ ] Soft delete works (isActive = false)
- [ ] Relationships between tables work
- [ ] Timestamps auto-populate

### ✅ Frontend Integration
- [ ] Angular frontend loads at localhost:4200
- [ ] API calls reach backend successfully
- [ ] CORS errors do not occur
- [ ] Student search works
- [ ] Marks display correctly
- [ ] No console errors

### ✅ Security Tests
- [ ] Invalid email format rejected
- [ ] Null values handled gracefully
- [ ] Duplicate emails prevented
- [ ] Exception handling works

---

## Common Test Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Port 8080 in use** | Change `server.port` in application.properties |
| **MySQL connection error** | Verify MySQL is running: `mysql -u root -p` |
| **CORS errors in browser** | Ensure CorsConfig is properly configured |
| **H2 database not found in tests** | Add H2 dependency and create `application-test.properties` |
| **Null pointer in tests** | Use `@BeforeEach` to initialize mock objects |
| **Tests timeout** | Increase timeout: `@Test(timeout = 10000)` |
| **Database table mismatch** | Set `spring.jpa.hibernate.ddl-auto=create-drop` in test properties |

---

## Summary

**Testing Pyramid:**
```
         /\
        /  \  Unit Tests (Fast)
       /____\
      /      \
     / Integ  \  Integration Tests (Medium)
    /_________ \
   /          \
  / End-to-End \  Manual/API Tests (Slow)
 /_____________ \
```

**Run All Tests:**
```bash
mvn clean test
```

**Generate Coverage Report:**
```bash
mvn test jacoco:report
```

**Expected Results:**
- ✅ All unit tests pass
- ✅ All integration tests pass
- ✅ All API endpoints respond with 200 OK
- ✅ No CORS errors
- ✅ Frontend connects successfully
- ✅ Database queries return expected data
