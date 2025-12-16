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

  constructor(
    private studentService: StudentService,
    private classesService: ClassesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    // Get classes from the ClassesService
    this.classes = this.classesService.getClassesArray();
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
      this.errorMessage = 'Please enter roll number';
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