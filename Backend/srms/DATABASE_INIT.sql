-- =============================================
-- SRMS Database Initialization Script
-- Database Name: srms_db
-- MySQL Version: 8.0+
-- =============================================

-- Step 1: Create Database
CREATE DATABASE IF NOT EXISTS srms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE srms_db;

-- Step 2: Create Users Table (For Authentication - Admin, Teacher, Student)
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

-- Step 3: Create Student Table
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

-- Step 4: Create Marks Table
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

-- Step 5: Create Recheck Request Table
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

-- =============================================
-- INITIAL DATA INSERTION
-- =============================================

-- Step 6: Insert Admin User
INSERT INTO users (email, password, role, is_active) VALUES 
('admin@gmail.com', '123456', 'admin', TRUE);

-- Step 7: Insert Teacher Users
INSERT INTO users (email, password, role, is_active) VALUES 
('rahul@gmail.com', '123456', 'teacher', TRUE),
('ananya@gmail.com', '123456', 'teacher', TRUE),
('sanjay@gmail.com', '123456', 'teacher', TRUE),
('priya@gmail.com', '123456', 'teacher', TRUE),
('vikram@gmail.com', '123456', 'teacher', TRUE);

-- Step 8: Insert Student Users (20 students)
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

-- Step 9: Insert Students (Class-wise)
-- Class 1 (Students 1-5)
INSERT INTO student (name, email, roll_no, class_name, date_of_birth, phone, address, is_active) VALUES 
('John Doe', 'john@gmail.com', '101', 'Class 1', '10/05/2008', '9876543210', '123 Main Street', TRUE),
('Alice Johnson', 'alice@gmail.com', '102', 'Class 1', '15/03/2008', '9876543211', '456 Oak Avenue', TRUE),
('Bob Smith', 'bob@gmail.com', '103', 'Class 1', '20/07/2008', '9876543212', '789 Pine Road', TRUE),
('Charlie Brown', 'charlie@gmail.com', '104', 'Class 1', '25/11/2007', '9876543213', '321 Elm Street', TRUE),
('Diana Prince', 'diana@gmail.com', '105', 'Class 1', '30/01/2008', '9876543214', '654 Maple Drive', TRUE),

-- Class 2 (Students 6-10)
('Emma Watson', 'emma@gmail.com', '201', 'Class 2', '05/04/2007', '9876543215', '987 Cedar Lane', TRUE),
('Frank Miller', 'frank@gmail.com', '202', 'Class 2', '12/08/2007', '9876543216', '147 Birch Court', TRUE),
('Grace Lee', 'grace@gmail.com', '203', 'Class 2', '18/02/2007', '9876543217', '258 Spruce Way', TRUE),
('Henry Davis', 'henry@gmail.com', '204', 'Class 2', '24/09/2007', '9876543218', '369 Ash Path', TRUE),
('Iris Martinez', 'iris@gmail.com', '205', 'Class 2', '31/06/2007', '9876543219', '741 Willow Street', TRUE),

-- Class 3 (Students 11-15)
('Jack Anderson', 'jack@gmail.com', '301', 'Class 3', '08/03/2006', '9876543220', '852 Hickory Lane', TRUE),
('Kate Wilson', 'kate@gmail.com', '302', 'Class 3', '14/07/2006', '9876543221', '963 Walnut Road', TRUE),
('Leo Thompson', 'leo@gmail.com', '303', 'Class 3', '22/11/2005', '9876543222', '159 Chestnut Ave', TRUE),
('Mona Garcia', 'mona@gmail.com', '304', 'Class 3', '29/05/2006', '9876543223', '357 Poplar Lane', TRUE),
('Noah Rodriguez', 'noah@gmail.com', '305', 'Class 3', '06/12/2005', '9876543224', '246 Sycamore Drive', TRUE),

-- Class 4 (Students 16-20)
('Olivia Taylor', 'olivia@gmail.com', '401', 'Class 4', '11/08/2005', '9876543225', '135 Cottonwood St', TRUE),
('Paul Thomas', 'paul@gmail.com', '402', 'Class 4', '17/04/2005', '9876543226', '579 Fir Street', TRUE),
('Quinn Jackson', 'quinn@gmail.com', '403', 'Class 4', '23/10/2004', '9876543227', '468 Juniper Road', TRUE),
('Rachel White', 'rachel@gmail.com', '404', 'Class 4', '28/06/2005', '9876543228', '802 Larch Avenue', TRUE),
('Steve Harris', 'steve@gmail.com', '405', 'Class 4', '04/01/2005', '9876543229', '913 Oak Lane', TRUE);

-- Step 10: Insert Marks Data (6 subjects × 20 students)
-- Subjects: Mathematics, English, Science, History, Geography, Physical Education

-- Class 1 Students Marks (Students 1-5)
INSERT INTO marks (student_id, subject, marks_obtained, max_marks, term, year) VALUES 
(1, 'Mathematics', 92, 100, 'Term 1', 2024),
(1, 'English', 88, 100, 'Term 1', 2024),
(1, 'Science', 85, 100, 'Term 1', 2024),
(1, 'History', 90, 100, 'Term 1', 2024),
(1, 'Geography', 87, 100, 'Term 1', 2024),
(1, 'Physical Education', 95, 100, 'Term 1', 2024),

(2, 'Mathematics', 85, 100, 'Term 1', 2024),
(2, 'English', 92, 100, 'Term 1', 2024),
(2, 'Science', 88, 100, 'Term 1', 2024),
(2, 'History', 84, 100, 'Term 1', 2024),
(2, 'Geography', 90, 100, 'Term 1', 2024),
(2, 'Physical Education', 91, 100, 'Term 1', 2024),

(3, 'Mathematics', 78, 100, 'Term 1', 2024),
(3, 'English', 80, 100, 'Term 1', 2024),
(3, 'Science', 82, 100, 'Term 1', 2024),
(3, 'History', 79, 100, 'Term 1', 2024),
(3, 'Geography', 81, 100, 'Term 1', 2024),
(3, 'Physical Education', 88, 100, 'Term 1', 2024),

(4, 'Mathematics', 95, 100, 'Term 1', 2024),
(4, 'English', 93, 100, 'Term 1', 2024),
(4, 'Science', 94, 100, 'Term 1', 2024),
(4, 'History', 92, 100, 'Term 1', 2024),
(4, 'Geography', 91, 100, 'Term 1', 2024),
(4, 'Physical Education', 89, 100, 'Term 1', 2024),

(5, 'Mathematics', 87, 100, 'Term 1', 2024),
(5, 'English', 89, 100, 'Term 1', 2024),
(5, 'Science', 86, 100, 'Term 1', 2024),
(5, 'History', 88, 100, 'Term 1', 2024),
(5, 'Geography', 85, 100, 'Term 1', 2024),
(5, 'Physical Education', 92, 100, 'Term 1', 2024),

-- Class 2 Students Marks (Students 6-10)
(6, 'Mathematics', 91, 100, 'Term 1', 2024),
(6, 'English', 87, 100, 'Term 1', 2024),
(6, 'Science', 89, 100, 'Term 1', 2024),
(6, 'History', 86, 100, 'Term 1', 2024),
(6, 'Geography', 88, 100, 'Term 1', 2024),
(6, 'Physical Education', 93, 100, 'Term 1', 2024),

(7, 'Mathematics', 84, 100, 'Term 1', 2024),
(7, 'English', 86, 100, 'Term 1', 2024),
(7, 'Science', 83, 100, 'Term 1', 2024),
(7, 'History', 85, 100, 'Term 1', 2024),
(7, 'Geography', 82, 100, 'Term 1', 2024),
(7, 'Physical Education', 87, 100, 'Term 1', 2024),

(8, 'Mathematics', 90, 100, 'Term 1', 2024),
(8, 'English', 91, 100, 'Term 1', 2024),
(8, 'Science', 92, 100, 'Term 1', 2024),
(8, 'History', 89, 100, 'Term 1', 2024),
(8, 'Geography', 90, 100, 'Term 1', 2024),
(8, 'Physical Education', 94, 100, 'Term 1', 2024),

(9, 'Mathematics', 76, 100, 'Term 1', 2024),
(9, 'English', 78, 100, 'Term 1', 2024),
(9, 'Science', 75, 100, 'Term 1', 2024),
(9, 'History', 77, 100, 'Term 1', 2024),
(9, 'Geography', 79, 100, 'Term 1', 2024),
(9, 'Physical Education', 85, 100, 'Term 1', 2024),

(10, 'Mathematics', 88, 100, 'Term 1', 2024),
(10, 'English', 85, 100, 'Term 1', 2024),
(10, 'Science', 87, 100, 'Term 1', 2024),
(10, 'History', 84, 100, 'Term 1', 2024),
(10, 'Geography', 86, 100, 'Term 1', 2024),
(10, 'Physical Education', 90, 100, 'Term 1', 2024),

-- Class 3 Students Marks (Students 11-15)
(11, 'Mathematics', 93, 100, 'Term 1', 2024),
(11, 'English', 91, 100, 'Term 1', 2024),
(11, 'Science', 94, 100, 'Term 1', 2024),
(11, 'History', 92, 100, 'Term 1', 2024),
(11, 'Geography', 90, 100, 'Term 1', 2024),
(11, 'Physical Education', 96, 100, 'Term 1', 2024),

(12, 'Mathematics', 80, 100, 'Term 1', 2024),
(12, 'English', 82, 100, 'Term 1', 2024),
(12, 'Science', 81, 100, 'Term 1', 2024),
(12, 'History', 80, 100, 'Term 1', 2024),
(12, 'Geography', 83, 100, 'Term 1', 2024),
(12, 'Physical Education', 89, 100, 'Term 1', 2024),

(13, 'Mathematics', 86, 100, 'Term 1', 2024),
(13, 'English', 88, 100, 'Term 1', 2024),
(13, 'Science', 87, 100, 'Term 1', 2024),
(13, 'History', 85, 100, 'Term 1', 2024),
(13, 'Geography', 89, 100, 'Term 1', 2024),
(13, 'Physical Education', 91, 100, 'Term 1', 2024),

(14, 'Mathematics', 77, 100, 'Term 1', 2024),
(14, 'English', 79, 100, 'Term 1', 2024),
(14, 'Science', 76, 100, 'Term 1', 2024),
(14, 'History', 78, 100, 'Term 1', 2024),
(14, 'Geography', 80, 100, 'Term 1', 2024),
(14, 'Physical Education', 84, 100, 'Term 1', 2024),

(15, 'Mathematics', 89, 100, 'Term 1', 2024),
(15, 'English', 90, 100, 'Term 1', 2024),
(15, 'Science', 88, 100, 'Term 1', 2024),
(15, 'History', 87, 100, 'Term 1', 2024),
(15, 'Geography', 91, 100, 'Term 1', 2024),
(15, 'Physical Education', 92, 100, 'Term 1', 2024),

-- Class 4 Students Marks (Students 16-20)
(16, 'Mathematics', 92, 100, 'Term 1', 2024),
(16, 'English', 94, 100, 'Term 1', 2024),
(16, 'Science', 91, 100, 'Term 1', 2024),
(16, 'History', 93, 100, 'Term 1', 2024),
(16, 'Geography', 92, 100, 'Term 1', 2024),
(16, 'Physical Education', 97, 100, 'Term 1', 2024),

(17, 'Mathematics', 81, 100, 'Term 1', 2024),
(17, 'English', 83, 100, 'Term 1', 2024),
(17, 'Science', 80, 100, 'Term 1', 2024),
(17, 'History', 82, 100, 'Term 1', 2024),
(17, 'Geography', 84, 100, 'Term 1', 2024),
(17, 'Physical Education', 88, 100, 'Term 1', 2024),

(18, 'Mathematics', 75, 100, 'Term 1', 2024),
(18, 'English', 77, 100, 'Term 1', 2024),
(18, 'Science', 74, 100, 'Term 1', 2024),
(18, 'History', 76, 100, 'Term 1', 2024),
(18, 'Geography', 78, 100, 'Term 1', 2024),
(18, 'Physical Education', 82, 100, 'Term 1', 2024),

(19, 'Mathematics', 88, 100, 'Term 1', 2024),
(19, 'English', 86, 100, 'Term 1', 2024),
(19, 'Science', 89, 100, 'Term 1', 2024),
(19, 'History', 87, 100, 'Term 1', 2024),
(19, 'Geography', 85, 100, 'Term 1', 2024),
(19, 'Physical Education', 93, 100, 'Term 1', 2024),

(20, 'Mathematics', 90, 100, 'Term 1', 2024),
(20, 'English', 92, 100, 'Term 1', 2024),
(20, 'Science', 91, 100, 'Term 1', 2024),
(20, 'History', 90, 100, 'Term 1', 2024),
(20, 'Geography', 89, 100, 'Term 1', 2024),
(20, 'Physical Education', 95, 100, 'Term 1', 2024);

-- Step 11: Insert Sample Recheck Requests
INSERT INTO recheck_request (student_id, subject, reason, status, old_marks) VALUES 
(1, 'Mathematics', 'I believe my calculation was correct', 'pending', 92),
(2, 'English', 'Please review my essay', 'pending', 92),
(3, 'Science', 'Recount my practical marks', 'approved', 82),
(4, 'History', 'I want to contest my answer', 'rejected', 92),
(5, 'Geography', 'Please check my map work', 'completed', 85);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify database creation
SELECT 'Database and tables created successfully' as status;

-- Show all tables
SHOW TABLES;

-- Count records
SELECT 
    (SELECT COUNT(*) FROM users) as total_users,
    (SELECT COUNT(*) FROM student) as total_students,
    (SELECT COUNT(*) FROM marks) as total_marks,
    (SELECT COUNT(*) FROM recheck_request) as total_rechecks;

-- Show users by role
SELECT 'Users by Role:' as info;
SELECT role, COUNT(*) as count FROM users GROUP BY role;

-- Show students by class
SELECT 'Students by Class:' as info;
SELECT class_name, COUNT(*) as count FROM student GROUP BY class_name;

-- =============================================
-- CREDENTIALS FOR LOGIN
-- =============================================

-- Admin Login:
-- Email: admin@gmail.com
-- Password: 123456
-- Role: admin

-- Teacher Login Examples:
-- Email: rahul@gmail.com, Password: 123456, Role: teacher
-- Email: ananya@gmail.com, Password: 123456, Role: teacher
-- Email: sanjay@gmail.com, Password: 123456, Role: teacher
-- Email: priya@gmail.com, Password: 123456, Role: teacher
-- Email: vikram@gmail.com, Password: 123456, Role: teacher

-- Student Login Examples:
-- Email: john@gmail.com, Password: 123456, Role: student
-- Email: alice@gmail.com, Password: 123456, Role: student
-- ... (20 students total with same pattern)

-- =============================================
-- END OF INITIALIZATION SCRIPT
-- =============================================
