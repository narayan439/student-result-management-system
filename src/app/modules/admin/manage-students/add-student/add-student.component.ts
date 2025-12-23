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
    // Preload students for roll number generation
    this.preloadStudents();
  }

  /**
   * Preload students from backend to have them ready for roll number generation
   */
  private preloadStudents(): void {
    console.log('📥 Preloading students for roll number generation...');
    this.studentService.getAllStudentsFromBackend().subscribe({
      next: (students) => {
        console.log(`✅ Preloaded ${students?.length || 0} students`);
      },
      error: (err) => {
        console.warn('⚠️  Could not preload students:', err);
      }
    });
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
    console.log('🔄 onClassChange() called');
    console.log('Selected class:', this.student.className);

    if (!this.student.className) {
      this.student.rollNo = '';
      console.log('No class selected, clearing roll number');
      return;
    }

    // Extract class number from className (e.g., "Class 1" → "1")
    const classMatch = this.student.className.match(/Class\s(\d+)/);
    if (!classMatch) {
      console.error('❌ Invalid class format:', this.student.className);
      return;
    }

    const classNumber = classMatch[1];
    console.log(`📚 Extracted class number: ${classNumber}`);

    // Get all students and count how many are in this class
    this.studentService.getAllStudentsFromBackend().subscribe(
      (students: any[]) => {
        console.log(`✅ Fetched ${students?.length || 0} students from backend`);
        
        // Filter students by selected class
        const studentsInClass = students.filter(s => s.className === this.student.className) || [];
        console.log(`📊 Found ${studentsInClass.length} students in ${this.student.className}`);
        
        // Calculate next roll number
        const nextNumber = studentsInClass.length + 1;
        const paddedNumber = String(nextNumber).padStart(2, '0');
        this.student.rollNo = `${classNumber}A${paddedNumber}`;
        
        console.log(`✅ Auto-generated Roll Number: ${this.student.rollNo}`);
      },
      (error) => {
        console.warn('⚠️ Could not fetch from backend, using default:', error);
        // Fallback: use default numbering
        const nextNumber = Math.floor(Math.random() * 90) + 1; // Random 01-99
        const paddedNumber = String(nextNumber).padStart(2, '0');
        this.student.rollNo = `${classNumber}A${paddedNumber}`;
        console.log(`📝 Generated fallback Roll Number: ${this.student.rollNo}`);
      }
    );
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
      this.errorMessage = 'Roll number must be auto-generated. Please select a class first.';
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