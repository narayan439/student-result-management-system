import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../../core/services/student.service';
import { ClassesService } from '../../../../core/services/classes.service';
import { Router } from '@angular/router';
import { Student } from '../../../../core/models/student.model';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent implements OnInit {

  student: Student = {
    name: '',
    email: '',
    className: '',
    rollNo: '',
    dob: '',
    phone: ''
  };

  classes: any[] = [];
  isLoading = false;
  errorMessage = '';
  isGeneratingRollNo = false;

  constructor(
    private studentService: StudentService,
    private classesService: ClassesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    // Load classes from backend API
    this.classesService.getAllClasses().subscribe({
      next: (response: any) => {
        const classesArray = Array.isArray(response?.data) ? response.data : 
                            Array.isArray(response) ? response : [];
        this.classes = classesArray || [];
      },
      error: (err: any) => {
        console.error('Error loading classes:', err);
        // Fallback to cached classes
        this.classes = this.classesService.getClassesArray();
      }
    });
  }

  /**
   * Auto-generate roll number when class is selected
   * Format: {ClassNumber}A{SequentialNumber}
   * Example: Class 1 with 7 students → next is 1A08
   */
  onClassChange(): void {
    if (!this.student.className) {
      this.student.rollNo = '';
      return;
    }

    this.isGeneratingRollNo = true;
    console.log(`🔄 Generating roll number for ${this.student.className}...`);

    // Extract class number from className (e.g., "Class 1" → "1")
    const classMatch = this.student.className.match(/Class\s(\d+)/);
    if (!classMatch) {
      this.isGeneratingRollNo = false;
      this.errorMessage = 'Invalid class format';
      return;
    }

    const classNumber = classMatch[1];

    // Get all students and find those in this class
    this.studentService.getAllStudentsFromBackend().subscribe({
      next: (students: any[]) => {
        // Count students in the selected class
        const studentsInClass = students.filter(s => 
          s.className === this.student.className
        );

        // Calculate next roll number
        const nextNumber = studentsInClass.length + 1;
        const paddedNumber = nextNumber.toString().padStart(2, '0');
        this.student.rollNo = `${classNumber}A${paddedNumber}`;

        console.log(`✅ Generated Roll Number: ${this.student.rollNo}`);
        console.log(`   Class: ${this.student.className}, Total students: ${studentsInClass.length}, Next: ${nextNumber}`);

        this.isGeneratingRollNo = false;
      },
      error: (err: any) => {
        console.error('❌ Error fetching students for roll number generation:', err);
        // Fallback: Try to use local cache
        const cachedStudents = this.studentService.getAllStudentsSync();
        if (cachedStudents && cachedStudents.length > 0) {
          const studentsInClass = cachedStudents.filter(s => 
            s.className === this.student.className
          );
          const nextNumber = studentsInClass.length + 1;
          const paddedNumber = nextNumber.toString().padStart(2, '0');
          this.student.rollNo = `${classNumber}A${paddedNumber}`;
          console.log(`✅ Generated Roll Number (from cache): ${this.student.rollNo}`);
        } else {
          this.errorMessage = 'Could not generate roll number. Please enter manually.';
        }
        this.isGeneratingRollNo = false;
      }
    });
  }

  createStudent() {
    // Clear previous error message
    this.errorMessage = '';

    if (this.validateStudentData()) {
      this.isLoading = true;
      
      this.studentService.saveStudent(this.student).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          alert("🎉 Student Added Successfully!");
          this.router.navigate(['/admin/manage-students']);
        },
        error: (err: any) => {
          this.isLoading = false;
          const errorMsg = err.error?.message || 
                          err.message || 
                          (typeof err === 'string' ? err : 'Failed to add student');
          this.errorMessage = errorMsg;
          alert("❌ Error: " + errorMsg);
          console.error('Error adding student:', err);
        }
      });
    }
  }

  private validateStudentData(): boolean {
    // Basic validation
    if (!this.student.name.trim()) {
      this.errorMessage = 'Please enter student name';
      alert(this.errorMessage);
      return false;
    }
    
    if (!this.student.email.trim()) {
      this.errorMessage = 'Please enter email address';
      alert(this.errorMessage);
      return false;
    }
    
    if (!this.isValidEmail(this.student.email)) {
      this.errorMessage = 'Please enter a valid email address';
      alert(this.errorMessage);
      return false;
    }
    
    if (!this.student.className) {
      this.errorMessage = 'Please select class';
      alert(this.errorMessage);
      return false;
    }
    
    if (!this.student.rollNo.trim()) {
      this.errorMessage = 'Roll number should be auto-generated. If not, enter manually.';
      alert(this.errorMessage);
      return false;
    }
    
    if (!this.student.dob) {
      this.errorMessage = 'Please select date of birth';
      alert(this.errorMessage);
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

  createStudent() {
    // Clear previous error message
    this.errorMessage = '';

    if (this.validateStudentData()) {
      this.isLoading = true;
      
      this.studentService.saveStudent(this.student).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          alert("🎉 Student Added Successfully!");
          this.router.navigate(['/admin/manage-students']);
        },
        error: (err: any) => {
          this.isLoading = false;
          const errorMsg = err.error?.message || 
                          err.message || 
                          (typeof err === 'string' ? err : 'Failed to add student');
          this.errorMessage = errorMsg;
          alert("❌ Error: " + errorMsg);
          console.error('Error adding student:', err);
        }
      });
    }
  }

  private validateStudentData(): boolean {
    // Validate name
    if (!this.student.name.trim()) {
      this.errorMessage = 'Please enter student name';
      alert(this.errorMessage);
      return false;
    }
    
    // Validate email exists
    if (!this.student.email.trim()) {
      this.errorMessage = 'Please enter email address';
      alert(this.errorMessage);
      return false;
    }
    
    // Validate email format
    if (!this.isValidEmail(this.student.email)) {
      this.errorMessage = 'Please enter a valid email address (e.g., student@example.com)';
      alert(this.errorMessage);
      return false;
    }
    
    // Check if email is unique
    const allStudents = this.studentService.getAllStudentsSync();
    const emailExists = allStudents.some(s => s.email.toLowerCase() === this.student.email.toLowerCase());
    if (emailExists) {
      this.errorMessage = `Email "${this.student.email}" is already registered. Please use a different email.`;
      alert(this.errorMessage);
      return false;
    }
    
    // Validate phone number if provided
    if (this.student.phone.trim()) {
      // Validate phone format
      if (!this.isValidPhoneNumber(this.student.phone)) {
        this.errorMessage = 'Please enter a valid phone number (10 digits, e.g., 9876543210)';
        alert(this.errorMessage);
        return false;
      }
      
      // Check if phone is unique
      const phoneExists = allStudents.some(s => s.phone === this.student.phone);
      if (phoneExists) {
        this.errorMessage = `Phone number "${this.student.phone}" is already registered. Please use a different number.`;
        alert(this.errorMessage);
        return false;
      }
    }
    
    // Validate class selected
    if (!this.student.className) {
      this.errorMessage = 'Please select class';
      alert(this.errorMessage);
      return false;
    }
    
    // Validate roll number
    if (!this.student.rollNo.trim()) {
      this.errorMessage = 'Roll number should be auto-generated. If not, enter manually.';
      alert(this.errorMessage);
      return false;
    }
    
    // Check if roll number is unique
    const rollNoExists = allStudents.some(s => s.rollNo === this.student.rollNo);
    if (rollNoExists) {
      this.errorMessage = `Roll number "${this.student.rollNo}" is already in use. Please use a different number.`;
      alert(this.errorMessage);
      return false;
    }
    
    // Validate date of birth
    if (!this.student.dob) {
      this.errorMessage = 'Please select date of birth';
      alert(this.errorMessage);
      return false;
    }
    
    // Validate DOB is not in future
    const dobDate = new Date(this.student.dob);
    const today = new Date();
    if (dobDate > today) {
      this.errorMessage = 'Date of birth cannot be in the future';
      alert(this.errorMessage);
      return false;
    }
    
    // Validate student age (should be at least 4 years old)
    const age = today.getFullYear() - dobDate.getFullYear();
    if (age < 4) {
      this.errorMessage = 'Student should be at least 4 years old';
      alert(this.errorMessage);
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number
   * Format: 10 digits (Indian format)
   * Can start with +91, 0, or just digits
   */
  private isValidPhoneNumber(phone: string): boolean {
    // Remove spaces, hyphens, and +91 prefix
    let cleanPhone = phone.replace(/[\s\-]/g, '').replace(/^\+91/, '');
    
    // Remove leading 0 if present (0 9876543210 -> 9876543210)
    if (cleanPhone.startsWith('0')) {
      cleanPhone = cleanPhone.substring(1);
    }
    
    // Must be exactly 10 digits
    const phoneRegex = /^[6-9]\d{9}$/; // Indian phone numbers start with 6-9
    
    if (!phoneRegex.test(cleanPhone)) {
      return false;
    }
    
    return true;
  }
}