import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../../core/services/student.service';
import { ClassesService } from '../../../../core/services/classes.service';
import { Student } from '../../../../core/models/student.model';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  studentId: any;
  isLoading = false;
  errorMessage = '';

  student: Student = {
    name: '',
    email: '',
    className: '',
    rollNo: '',
    dob: '',
    phone: '',
    address: ''
  };

  classes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private classesService: ClassesService
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.loadClasses();
    this.loadStudent();
  }

  loadClasses(): void {
    // Get classes from the ClassesService
    this.classes = this.classesService.getClassesArray();
  }

  loadStudent(): void {
    this.isLoading = true;
    
    // Get the student from local data
    const localStudents = this.studentService.getStudentsFromLocal();
    const foundStudent = localStudents.find(s => s.studentId === parseInt(this.studentId));
    
    if (foundStudent) {
      this.student = { ...foundStudent };
      this.isLoading = false;
    } else {
      // Try to load from backend
      this.studentService.getStudentById(parseInt(this.studentId)).subscribe({
        next: (student: Student) => {
          this.student = student;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          // Fallback: use dummy data
          this.student = {
            studentId: parseInt(this.studentId),
            name: 'Narayan',
            email: 'narayan@student.com',
            className: 'Class 1 - A',
            rollNo: '23',
            dob: '2005-02-20',
            phone: '9876543210',
            address: '123 Main Street, City'
          };
          console.warn('Could not load student, using dummy data:', err);
        }
      });
    }
  }

  updateStudent() {
    this.errorMessage = '';
    
    if (this.validateStudentData()) {
      this.isLoading = true;
      
      this.studentService.updateStudent(this.student).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          alert('🎉 Student Updated Successfully!');
          this.router.navigate(['/admin/manage-students']);
        },
        error: (err: any) => {
          this.isLoading = false;
          const errorMsg = err.error?.message || 
                          err.message || 
                          (typeof err === 'string' ? err : 'Failed to update student');
          this.errorMessage = errorMsg;
          alert("❌ Error: " + errorMsg);
          console.error('Error updating student:', err);
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