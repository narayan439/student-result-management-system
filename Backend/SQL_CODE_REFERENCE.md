# SQL Database Code - Ready to Copy & Paste

## Quick Copy-Paste SQL Commands

### Option 1: Create Database Only
```sql
CREATE DATABASE IF NOT EXISTS srms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE srms_db;
```

### Option 2: Create All Tables Only

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'student',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student Table
CREATE TABLE IF NOT EXISTS student (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    roll_no VARCHAR(50) NOT NULL UNIQUE,
    class_name VARCHAR(100) NOT NULL,
    date_of_birth VARCHAR(20),
    phone VARCHAR(20),
    address VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_class_name (class_name),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Marks Table
CREATE TABLE IF NOT EXISTS marks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    marks_obtained INT NOT NULL,
    max_marks INT DEFAULT 100,
    term VARCHAR(50),
    year INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_subject (subject),
    INDEX idx_term (term)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Recheck Request Table
CREATE TABLE IF NOT EXISTS recheck_request (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    reason VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending',
    old_marks INT,
    new_marks INT,
    admin_comments VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES student(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### Option 3: Insert Admin User
```sql
INSERT INTO users (email, password, role, is_active) VALUES 
('admin@gmail.com', '123456', 'admin', TRUE);
```

### Option 4: Insert Teachers
```sql
INSERT INTO users (email, password, role, is_active) VALUES 
('rahul@gmail.com', '123456', 'teacher', TRUE),
('ananya@gmail.com', '123456', 'teacher', TRUE),
('sanjay@gmail.com', '123456', 'teacher', TRUE),
('priya@gmail.com', '123456', 'teacher', TRUE),
('vikram@gmail.com', '123456', 'teacher', TRUE);
```

### Option 5: Insert Students
```sql
INSERT INTO users (email, password, role, is_active) VALUES 
('john@gmail.com', '123456', 'student', TRUE),
('alice@gmail.com', '123456', 'student', TRUE),
('bob@gmail.com', '123456', 'student', TRUE),
('charlie@gmail.com', '123456', 'student', TRUE),
('diana@gmail.com', '123456', 'student', TRUE),
('emma@gmail.com', '123456', 'student', TRUE),
('frank@gmail.com', '123456', 'student', TRUE),
('grace@gmail.com', '123456', 'student', TRUE),
('henry@gmail.com', '123456', 'student', TRUE),
('iris@gmail.com', '123456', 'student', TRUE),
('jack@gmail.com', '123456', 'student', TRUE),
('kate@gmail.com', '123456', 'student', TRUE),
('leo@gmail.com', '123456', 'student', TRUE),
('mona@gmail.com', '123456', 'student', TRUE),
('noah@gmail.com', '123456', 'student', TRUE),
('olivia@gmail.com', '123456', 'student', TRUE),
('paul@gmail.com', '123456', 'student', TRUE),
('quinn@gmail.com', '123456', 'student', TRUE),
('rachel@gmail.com', '123456', 'student', TRUE),
('steve@gmail.com', '123456', 'student', TRUE);
```

### Option 6: Insert All Students Data
```sql
INSERT INTO student (name, email, roll_no, class_name, date_of_birth, phone, address, is_active) VALUES 
('John Doe', 'john@gmail.com', '101', 'Class 1', '10/05/2008', '9876543210', '123 Main Street', TRUE),
('Alice Johnson', 'alice@gmail.com', '102', 'Class 1', '15/03/2008', '9876543211', '456 Oak Avenue', TRUE),
('Bob Smith', 'bob@gmail.com', '103', 'Class 1', '20/07/2008', '9876543212', '789 Pine Road', TRUE),
('Charlie Brown', 'charlie@gmail.com', '104', 'Class 1', '25/11/2007', '9876543213', '321 Elm Street', TRUE),
('Diana Prince', 'diana@gmail.com', '105', 'Class 1', '30/01/2008', '9876543214', '654 Maple Drive', TRUE),
('Emma Watson', 'emma@gmail.com', '201', 'Class 2', '05/04/2007', '9876543215', '987 Cedar Lane', TRUE),
('Frank Miller', 'frank@gmail.com', '202', 'Class 2', '12/08/2007', '9876543216', '147 Birch Court', TRUE),
('Grace Lee', 'grace@gmail.com', '203', 'Class 2', '18/02/2007', '9876543217', '258 Spruce Way', TRUE),
('Henry Davis', 'henry@gmail.com', '204', 'Class 2', '24/09/2007', '9876543218', '369 Ash Path', TRUE),
('Iris Martinez', 'iris@gmail.com', '205', 'Class 2', '31/06/2007', '9876543219', '741 Willow Street', TRUE),
('Jack Anderson', 'jack@gmail.com', '301', 'Class 3', '08/03/2006', '9876543220', '852 Hickory Lane', TRUE),
('Kate Wilson', 'kate@gmail.com', '302', 'Class 3', '14/07/2006', '9876543221', '963 Walnut Road', TRUE),
('Leo Thompson', 'leo@gmail.com', '303', 'Class 3', '22/11/2005', '9876543222', '159 Chestnut Ave', TRUE),
('Mona Garcia', 'mona@gmail.com', '304', 'Class 3', '29/05/2006', '9876543223', '357 Poplar Lane', TRUE),
('Noah Rodriguez', 'noah@gmail.com', '305', 'Class 3', '06/12/2005', '9876543224', '246 Sycamore Drive', TRUE),
('Olivia Taylor', 'olivia@gmail.com', '401', 'Class 4', '11/08/2005', '9876543225', '135 Cottonwood St', TRUE),
('Paul Thomas', 'paul@gmail.com', '402', 'Class 4', '17/04/2005', '9876543226', '579 Fir Street', TRUE),
('Quinn Jackson', 'quinn@gmail.com', '403', 'Class 4', '23/10/2004', '9876543227', '468 Juniper Road', TRUE),
('Rachel White', 'rachel@gmail.com', '404', 'Class 4', '28/06/2005', '9876543228', '802 Larch Avenue', TRUE),
('Steve Harris', 'steve@gmail.com', '405', 'Class 4', '04/01/2005', '9876543229', '913 Oak Lane', TRUE);
```

### Option 7: Insert Sample Marks (All 120 records)
See DATABASE_INIT.sql file for complete marks data.

Quick insert for one student (6 subjects):
```sql
INSERT INTO marks (student_id, subject, marks_obtained, max_marks, term, year) VALUES 
(1, 'Mathematics', 92, 100, 'Term 1', 2024),
(1, 'English', 88, 100, 'Term 1', 2024),
(1, 'Science', 85, 100, 'Term 1', 2024),
(1, 'History', 90, 100, 'Term 1', 2024),
(1, 'Geography', 87, 100, 'Term 1', 2024),
(1, 'Physical Education', 95, 100, 'Term 1', 2024);
```

### Option 8: Verify Database
```sql
-- Show all tables
SHOW TABLES;

-- Count records in each table
SELECT 'Users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'Students', COUNT(*) FROM student
UNION ALL
SELECT 'Marks', COUNT(*) FROM marks
UNION ALL
SELECT 'Recheck Requests', COUNT(*) FROM recheck_request;

-- Show users by role
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Show students by class
SELECT class_name, COUNT(*) as count FROM student GROUP BY class_name;

-- Show all users
SELECT user_id, email, role, is_active FROM users;

-- Show all students
SELECT id, name, email, roll_no, class_name FROM student;
```

---

## How to Use These Commands

### Method 1: MySQL Command Line
```bash
# Connect to MySQL
mysql -u root -p
# Password: 541294

# Paste any SQL command above and press Enter
```

### Method 2: Via MySQL File
```bash
# Create a file called setup.sql and paste the SQL above
# Then run:
mysql -u root -p < setup.sql
```

### Method 3: Use Complete Script
```bash
# Use the complete DATABASE_INIT.sql file
mysql -u root -p < Backend/srms/DATABASE_INIT.sql
```

### Method 4: Workbench/PhpMyAdmin
1. Open MySQL Workbench or PhpMyAdmin
2. Create new connection to localhost:3306
3. Username: root, Password: 541294
4. Open SQL editor
5. Paste any SQL command
6. Execute (Ctrl+Enter)

---

## Single Command to Setup Everything

```bash
mysql -u root -p541294 < Backend/srms/DATABASE_INIT.sql
```

Note: This assumes password `541294` and MySQL is running.

---

## Verify Setup with Single Command

```bash
mysql -u root -p541294 -e "USE srms_db; SELECT 'Users:' as info, COUNT(*) FROM users UNION ALL SELECT 'Students', COUNT(*) FROM student UNION ALL SELECT 'Marks', COUNT(*) FROM marks;"
```

---

## Reset Database (Clean Start)

```sql
-- Drop everything and start fresh
DROP DATABASE IF EXISTS srms_db;

-- Then run DATABASE_INIT.sql to recreate
```

Or as single command:
```bash
mysql -u root -p541294 -e "DROP DATABASE IF EXISTS srms_db;"
mysql -u root -p541294 < Backend/srms/DATABASE_INIT.sql
```

---

## Quick Test Queries

```sql
-- Login test: Check if admin exists
SELECT * FROM users WHERE email = 'admin@gmail.com';

-- Get all teachers
SELECT * FROM users WHERE role = 'teacher';

-- Get all students
SELECT * FROM users WHERE role = 'student';

-- Get student with marks
SELECT s.name, s.email, m.subject, m.marks_obtained 
FROM student s 
LEFT JOIN marks m ON s.id = m.student_id 
WHERE s.email = 'john@gmail.com';

-- Get recheck requests
SELECT r.*, s.name FROM recheck_request r 
JOIN student s ON r.student_id = s.id;

-- Class-wise student count
SELECT class_name, COUNT(*) FROM student GROUP BY class_name;

-- Subject-wise average marks
SELECT subject, AVG(marks_obtained) as avg_marks FROM marks GROUP BY subject;
```

---

## Notes

- **Default Password:** 123456 (all users)
- **Database Charset:** utf8mb4 (supports emojis)
- **Password Encoding:** Currently plaintext (change to BCrypt for production)
- **Timezone:** UTC
- **Auto-increment IDs:** All tables use auto-increment
- **Foreign Keys:** Child tables have cascading delete

---

## All Credentials at a Glance

```
ADMIN:
Email: admin@gmail.com | Pass: 123456

TEACHERS:
Email: rahul@gmail.com | Pass: 123456
Email: ananya@gmail.com | Pass: 123456
Email: sanjay@gmail.com | Pass: 123456
Email: priya@gmail.com | Pass: 123456
Email: vikram@gmail.com | Pass: 123456

STUDENTS (Sample 3 of 20):
Email: john@gmail.com | Pass: 123456
Email: alice@gmail.com | Pass: 123456
Email: bob@gmail.com | Pass: 123456
(17 more students...)

DATABASE:
Host: localhost:3306
Database: srms_db
Username: root
Password: 541294
```

---

This file contains ready-to-copy SQL code for complete database setup!
