# 📊 Database Student Records Setup

## Sample Student Data for Testing

Use these INSERT statements to populate your `students` table with test data that matches the DOB-based password system.

### Format
- **DOB Format**: `DD/MM/YYYY`
- **Password Formula**: DOB digits (DDMMYYYY) + "ok"
- **Examples**: 
  - DOB `09/04/2011` → Password: `09042011ok`
  - DOB `15/06/1999` → Password: `15061999ok`

---

## 🗄️ SQL Insert Statements

### Quick Insert All Students
```sql
INSERT INTO students (name, email, className, rollNo, phone, dob, isActive, createdAt, updatedAt) VALUES
('Aisha Patel', 'aisha.patel@gmail.com', '10A', 'A001', '9876543210', '09/04/2011', 1, NOW(), NOW()),
('Arjun Singh', 'arjun.singh@gmail.com', '10A', 'A002', '9876543211', '15/06/1999', 1, NOW(), NOW()),
('Bhavna Verma', 'bhavna.verma@gmail.com', '10A', 'A003', '9876543212', '27/02/2002', 1, NOW(), NOW()),
('Chinmay Desai', 'chinmay.desai@gmail.com', '10A', 'A004', '9876543213', '12/11/2001', 1, NOW(), NOW()),
('Deepika Sharma', 'deepika.sharma@gmail.com', '10A', 'A005', '9876543214', '03/08/2000', 1, NOW(), NOW()),
('Eshan Gupta', 'eshan.gupta@gmail.com', '10B', 'B001', '9876543215', '18/01/1998', 1, NOW(), NOW()),
('Fatima Khan', 'fatima.khan@gmail.com', '10B', 'B002', '9876543216', '22/09/2003', 1, NOW(), NOW()),
('Gaurav Kumar', 'gaurav.kumar@gmail.com', '10B', 'B003', '9876543217', '07/05/2002', 1, NOW(), NOW()),
('Harshita Rao', 'harshita.rao@gmail.com', '10B', 'B004', '9876543218', '14/12/1999', 1, NOW(), NOW()),
('Ishaan Nair', 'ishaan.nair@gmail.com', '10B', 'B005', '9876543219', '26/03/2001', 1, NOW(), NOW()),
('Jaya Menon', 'jaya.menon@gmail.com', '10C', 'C001', '9876543220', '11/07/2000', 1, NOW(), NOW()),
('Karan Reddy', 'karan.reddy@gmail.com', '10C', 'C002', '9876543221', '19/04/2002', 1, NOW(), NOW()),
('Laxmi Devi', 'laxmi.devi@gmail.com', '10C', 'C003', '9876543222', '05/10/1998', 1, NOW(), NOW()),
('Manoj Sinha', 'manoj.sinha@gmail.com', '10C', 'C004', '9876543223', '23/06/2001', 1, NOW(), NOW()),
('Neha Kapoor', 'neha.kapoor@gmail.com', '10C', 'C005', '9876543224', '08/02/2003', 1, NOW(), NOW()),
('Omkar Joshi', 'omkar.joshi@gmail.com', '10D', 'D001', '9876543225', '16/11/2000', 1, NOW(), NOW()),
('Priya Singh', 'priya.singh@gmail.com', '10D', 'D002', '9876543226', '30/08/1999', 1, NOW(), NOW()),
('Qureshi Ali', 'qureshi.ali@gmail.com', '10D', 'D003', '9876543227', '13/05/2002', 1, NOW(), NOW()),
('Riya Chatterjee', 'riya.chatterjee@gmail.com', '10D', 'D004', '9876543228', '21/01/2001', 1, NOW(), NOW()),
('Sameer Malik', 'sameer.malik@gmail.com', '10D', 'D005', '9876543229', '04/09/2000', 1, NOW(), NOW()),
('Tanya Bhat', 'tanya.bhat@gmail.com', '10E', 'E001', '9876543230', '28/07/2002', 1, NOW(), NOW()),
('Udit Sharma', 'udit.sharma@gmail.com', '10E', 'E002', '9876543231', '10/03/1999', 1, NOW(), NOW()),
('Vanshika Iyer', 'vanshika.iyer@gmail.com', '10E', 'E003', '9876543232', '17/12/2001', 1, NOW(), NOW()),
('Vikram Patel', 'vikram.patel@gmail.com', '10E', 'E004', '9876543233', '06/06/2000', 1, NOW(), NOW()),
('Wanda Singh', 'wanda.singh@gmail.com', '10E', 'E005', '9876543234', '24/04/2003', 1, NOW(), NOW()),
('Xavier Fernandes', 'xavier.fernandes@gmail.com', '10F', 'F001', '9876543235', '09/11/1998', 1, NOW(), NOW()),
('Yara Khan', 'yara.khan@gmail.com', '10F', 'F002', '9876543236', '15/08/2002', 1, NOW(), NOW()),
('Zain Ahmed', 'zain.ahmed@gmail.com', '10F', 'F003', '9876543237', '02/05/2001', 1, NOW(), NOW()),
('Aarav Joshi', 'aarav.joshi@gmail.com', '10F', 'F004', '9876543238', '19/10/1999', 1, NOW(), NOW()),
('Bhumika Rao', 'bhumika.rao@gmail.com', '10F', 'F005', '9876543239', '11/07/2000', 1, NOW(), NOW()),
('Chetan Verma', 'chetan.verma@gmail.com', '11A', 'A006', '9876543240', '27/02/2002', 1, NOW(), NOW()),
('Divya Sharma', 'divya.sharma@gmail.com', '11A', 'A007', '9876543241', '14/09/2001', 1, NOW(), NOW()),
('Ekta Singh', 'ekta.singh@gmail.com', '11A', 'A008', '9876543242', '03/06/1998', 1, NOW(), NOW()),
('Farhan Malik', 'farhan.malik@gmail.com', '11A', 'A009', '9876543243', '21/01/2003', 1, NOW(), NOW()),
('Geetika Patel', 'geetika.patel@gmail.com', '11A', 'A010', '9876543244', '08/12/1999', 1, NOW(), NOW()),
('Hardik Desai', 'hardik.desai@gmail.com', '11B', 'B006', '9876543245', '16/04/2002', 1, NOW(), NOW()),
('Isha Nair', 'isha.nair@gmail.com', '11B', 'B007', '9876543246', '05/11/2000', 1, NOW(), NOW()),
('Jitendra Singh', 'jitendra.singh@gmail.com', '11B', 'B008', '9876543247', '19/07/2001', 1, NOW(), NOW()),
('Kavya Iyer', 'kavya.iyer@gmail.com', '11B', 'B009', '9876543248', '12/03/1999', 1, NOW(), NOW()),
('Laksh Reddy', 'laksh.reddy@gmail.com', '11B', 'B010', '9876543249', '30/05/2002', 1, NOW(), NOW()),
('Meera Kapoor', 'meera.kapoor@gmail.com', '11C', 'C006', '9876543250', '22/08/2000', 1, NOW(), NOW()),
('Nikhil Gupta', 'nikhil.gupta@gmail.com', '11C', 'C007', '9876543251', '07/02/2003', 1, NOW(), NOW()),
('Onika Dutta', 'onika.dutta@gmail.com', '11C', 'C008', '9876543252', '13/10/2001', 1, NOW(), NOW()),
('Palak Sinha', 'palak.sinha@gmail.com', '11C', 'C009', '9876543253', '28/06/1998', 1, NOW(), NOW()),
('Radhika Rao', 'radhika.rao@gmail.com', '11C', 'C010', '9876543254', '04/04/2002', 1, NOW(), NOW()),
('Siddharth Khan', 'siddharth.khan@gmail.com', '11D', 'D006', '9876543255', '17/12/1999', 1, NOW(), NOW()),
('Tanvi Sharma', 'tanvi.sharma@gmail.com', '11D', 'D007', '9876543256', '21/09/2001', 1, NOW(), NOW()),
('Ujjwal Singh', 'ujjwal.singh@gmail.com', '11D', 'D008', '9876543257', '09/05/2000', 1, NOW(), NOW()),
('Varsha Patel', 'varsha.patel@gmail.com', '11D', 'D009', '9876543258', '14/11/2002', 1, NOW(), NOW()),
('Yogesh Kumar', 'yogesh.kumar@gmail.com', '11D', 'D010', '9876543259', '06/07/1999', 1, NOW(), NOW());
```

---

## 📋 Student Credentials Reference

| Email | DOB | **Password for Login** | Class | Roll No |
|-------|-----|----------------------|-------|---------|
| aisha.patel@gmail.com | 09/04/2011 | **09042011ok** | 10A | A001 |
| arjun.singh@gmail.com | 15/06/1999 | **15061999ok** | 10A | A002 |
| bhavna.verma@gmail.com | 27/02/2002 | **27022002ok** | 10A | A003 |
| chinmay.desai@gmail.com | 12/11/2001 | **12112001ok** | 10A | A004 |
| deepika.sharma@gmail.com | 03/08/2000 | **03082000ok** | 10A | A005 |
| eshan.gupta@gmail.com | 18/01/1998 | **18011998ok** | 10B | B001 |
| fatima.khan@gmail.com | 22/09/2003 | **22092003ok** | 10B | B002 |
| gaurav.kumar@gmail.com | 07/05/2002 | **07052002ok** | 10B | B003 |
| harshita.rao@gmail.com | 14/12/1999 | **14121999ok** | 10B | B004 |
| ishaan.nair@gmail.com | 26/03/2001 | **26032001ok** | 10B | B005 |

*(Continue for remaining 40 students...)*

---

## ✅ Verification Query

After inserting, verify students were added:

```sql
SELECT COUNT(*) as total_students FROM students;
-- Should return: 50

SELECT email, dob, isActive FROM students LIMIT 5;
-- Verify DOB format is DD/MM/YYYY and isActive = 1

SELECT DISTINCT className FROM students ORDER BY className;
-- Should see: 10A, 10B, 10C, 10D, 10E, 10F, 11A, 11B, 11C, 11D
```

---

## 🧪 Test Login Process

1. **Pick a student** from the list above
2. **Extract their email** (e.g., `aisha.patel@gmail.com`)
3. **Construct password**:
   - Take DOB: `09/04/2011`
   - Remove separators: `09042011`
   - Add "ok": `09042011ok`
4. **Test login** on frontend:
   - Email: `aisha.patel@gmail.com`
   - Password: `09042011ok`
   - Should succeed ✅

---

## 🔄 Password Calculation Examples

| DOB | Calculation | Final Password |
|-----|-------------|-----------------|
| 09/04/2011 | 09+04+2011 + ok | 09042011ok |
| 15/06/1999 | 15+06+1999 + ok | 15061999ok |
| 27/02/2002 | 27+02+2002 + ok | 27022002ok |
| 12/11/2001 | 12+11+2001 + ok | 12112001ok |
| 03/08/2000 | 03+08+2000 + ok | 03082000ok |

---

## 🛠️ Additional Notes

- All students have `isActive = 1` (enabled)
- Roll numbers are unique within each class
- Email addresses are unique across all students
- DOB format must be exactly `DD/MM/YYYY` in database
- Use `NOW()` for createdAt/updatedAt timestamps
- Students span from Class 10A to 11D (5 students per class, 10 classes)

---

## 🚀 Ready to Test

After inserting this data:
1. Start backend: `mvn spring-boot:run`
2. Start frontend: `ng serve`
3. Open login page
4. Use any email + corresponding password from the table above
5. Should login successfully and redirect to student dashboard ✅

