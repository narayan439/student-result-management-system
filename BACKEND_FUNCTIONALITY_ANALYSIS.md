# Student Result Management System - Backend Functionality Analysis

## 📋 Frontend Features Overview

### 1. **Admin Panel Features**
- **Dashboard**: Overview of the system
- **Manage Students**:
  - View all students (with pagination)
  - Filter by class
  - Search by name/email/rollNo
  - Add new student
  - Delete student
  - Edit student
- **Manage Teachers**:
  - View all teachers
  - Search and filter by subject
  - Add new teacher
  - Delete teacher
  - Edit teacher
- **Manage Subjects**: View, add, delete subjects
- **Manage Classes**: View and manage class information
- **Manage Rechecks**: View recheck requests from students

### 2. **Teacher Panel Features**
- **Dashboard**: Overview with student list
- **Add Marks**:
  - Search student by roll number
  - View student class and subjects for that class
  - Enter marks for multiple subjects (0-100)
  - Submit marks for all subjects at once
  - Validation for marks range
  - Success/failure feedback for each subject
- **Update Marks**: Edit existing marks
- **Recheck Requests**: View student recheck requests
- **Profile**: View teacher profile

### 3. **Student Panel Features**
- **Dashboard**: Overview of their information
- **View Marks**:
  - Display all marks in table format
  - Calculate total marks
  - Calculate percentage
  - Display grade (A, B, C, D, F)
  - Calculate average marks
  - Mark status (Pass/Fail)
- **View Result**: Comprehensive result card
- **Request Recheck**: Request recheck for subjects
- **Track Recheck**: Track recheck status
- **Profile**: View student profile

## 🎯 Key Services & Operations

### marks.service.ts (Frontend)
```
Methods:
- addMark(mark): Add new mark for a student
- getMark(markId): Get specific mark
- getMarksByStudent(studentId): Get all marks for a student
- getMarksByClass(classNumber): Get all marks for a class
- updateMark(markId, mark): Update mark
- deleteMark(markId): Delete mark
```

### student.service.ts (Frontend)
```
Methods:
- getAllStudents(): Get all students
- getAllStudentsSync(): Get students synchronously
- getStudentsFromLocal(): Get from local storage
- getStudentById(studentId): Get specific student
- addStudent(student): Add new student
- updateStudent(studentId, student): Update student
- deleteStudent(studentId): Delete student
- getStudentsByClass(className): Filter by class
```

### teacher.service.ts (Frontend)
```
Methods:
- getAllTeachers(): Get all teachers
- getTeacherById(teacherId): Get specific teacher
- addTeacher(teacher): Add new teacher
- updateTeacher(teacherId, teacher): Update teacher
- deleteTeacher(teacherId): Delete teacher
```

## 🗄️ Database Schema Required

### Student Table
```
- studentId (PK)
- name
- email (unique)
- className
- rollNo (unique)
- dob
- phone
- isActive
```

### Marks Table
```
- marksId (PK)
- studentId (FK)
- subject
- marksObtained (0-100)
- maxMarks (usually 100)
- term (Term 1, Term 2, etc.)
- year
- isRecheckRequested (boolean)
```

### Teacher Table
```
- teacherId (PK)
- name
- email (unique)
- subjects (comma-separated or separate table)
- phone
- experience
- isActive
```

### User Table
```
- userId (PK)
- username (unique)
- email (unique)
- password (hashed)
- role (ADMIN, TEACHER, STUDENT)
- isActive
```

### RecheckRequest Table
```
- recheckId (PK)
- studentId (FK)
- markId (FK)
- subject
- reason
- status (PENDING, APPROVED, REJECTED)
- requestDate
- resolvedDate
```

## 🔌 API Endpoints Required

### Students API
- `GET /api/students/all` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `POST /api/students/add` - Add new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student
- `GET /api/students/class/{className}` - Get students by class

### Marks API
- `GET /api/marks/all` - Get all marks
- `GET /api/marks/{id}` - Get mark by ID
- `GET /api/marks/student/{studentId}` - Get marks by student
- `GET /api/marks/class/{className}` - Get marks by class
- `POST /api/marks/add` - Add new mark
- `PUT /api/marks/{id}` - Update mark
- `DELETE /api/marks/{id}` - Delete mark

### Teachers API
- `GET /api/teachers/all` - Get all teachers
- `GET /api/teachers/{id}` - Get teacher by ID
- `POST /api/teachers/add` - Add new teacher
- `PUT /api/teachers/{id}` - Update teacher
- `DELETE /api/teachers/{id}` - Delete teacher

### Auth API
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Recheck API
- `GET /api/rechecks/all` - Get all recheck requests
- `GET /api/rechecks/student/{studentId}` - Get student's rechecks
- `POST /api/rechecks/request` - Request recheck
- `PUT /api/rechecks/{id}` - Update recheck status

## ✅ Validation Rules
- Marks must be between 0-100
- Roll number and email must be unique
- Username must be unique
- Student email should be valid
- Teacher must have at least one subject
- Password must be hashed before storing
- Active status validation

## 🔒 Security Requirements
- JWT token authentication
- Role-based access control (RBAC)
- Password hashing (BCrypt)
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (using JPA)
