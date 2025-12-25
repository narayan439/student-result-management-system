import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../../core/services/student.service';
import { ClassesService } from '../../../../core/services/classes.service';
import { Student } from '../../../../core/models/student.model';
import { NotificationService } from '../../../../core/services/notification.service';

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
    studentId: undefined,
    name: '',
    email: '',
    className: '',
    rollNo: '',
    dob: '',
    phone: ''
  };

  dobDate: Date | null = null;

  classes: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private classesService: ClassesService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');
    this.loadClasses();
    this.loadStudent();
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

  loadStudent(): void {
    this.isLoading = true;
    
    // Get the student from local data
    const localStudents = this.studentService.getStudentsFromLocal();
    const foundStudent = localStudents.find(s => s.studentId === parseInt(this.studentId));
    
    if (foundStudent) {
      this.student = { ...foundStudent };
      this.dobDate = this.parseDobToDate(this.student.dob);
      this.isLoading = false;
    } else {
      // Try to load from backend
      this.studentService.getStudentById(parseInt(this.studentId)).subscribe({
        next: (student: Student) => {
          this.student = { ...student, studentId: parseInt(this.studentId) };
          this.dobDate = this.parseDobToDate(this.student.dob);
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          // Fallback: use dummy data
          const id = parseInt(this.studentId);
          this.student = {
            studentId: id,
            name: 'Narayan',
            email: 'narayan@student.com',
            className: 'Class 1 - A',
            rollNo: '23',
            dob: '2005-02-20',
            phone: '9876543210'
          };
          this.dobDate = this.parseDobToDate(this.student.dob);
          console.warn('Could not load student, using dummy data:', err);
        }
      });
    }
  }

  updateStudent() {
    this.errorMessage = '';
    
    // Ensure studentId is set on the student object
    const id = parseInt(this.studentId);
    if (!id && id !== 0) {
      this.errorMessage = 'Student ID is invalid';
      this.notify.error('Error: ' + this.errorMessage);
      return;
    }
    
    this.student.studentId = id;

    // Store DOB in DB as DD/MM/YYYY
    this.student.dob = this.formatDobDDMMYYYY(this.dobDate);

    if (this.validateStudentData()) {
      this.isLoading = true;
      
      this.studentService.updateStudent(id, this.student).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          this.notify.success('Student updated successfully!');
          this.router.navigate(['/admin/manage-students']);
        },
        error: (err: any) => {
          this.isLoading = false;
          const errorMsg = err.error?.message || 
                          err.message || 
                          (typeof err === 'string' ? err : 'Failed to update student');
          this.errorMessage = errorMsg;
          this.notify.error('Error: ' + errorMsg);
          console.error('Error updating student:', err);
        }
      });
    }
  }

  private validateStudentData(): boolean {
    // Basic validation
    if (!this.student.name.trim()) {
      this.errorMessage = 'Please enter student name';
      this.notify.warn(this.errorMessage);
      return false;
    }
    
    if (!this.student.email.trim()) {
      this.errorMessage = 'Please enter email address';
      this.notify.warn(this.errorMessage);
      return false;
    }
    
    if (!this.isValidEmail(this.student.email)) {
      this.errorMessage = 'Please enter a valid email address';
      this.notify.warn(this.errorMessage);
      return false;
    }
    
    if (!this.student.className) {
      this.errorMessage = 'Please select class';
      this.notify.warn(this.errorMessage);
      return false;
    }
    
    if (!this.student.rollNo.trim()) {
      this.errorMessage = 'Please enter roll number';
      this.notify.warn(this.errorMessage);
      return false;
    }
    
    if (!this.dobDate) {
      this.errorMessage = 'Please select date of birth';
      this.notify.warn(this.errorMessage);
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private parseDobToDate(dob: any): Date | null {
    if (!dob) {
      return null;
    }

    if (dob instanceof Date) {
      return dob;
    }

    const value = String(dob).trim();
    if (!value) {
      return null;
    }

    // ISO timestamp / YYYY-MM-DD
    const isoDate = value.includes('T') ? value.split('T')[0] : value;
    if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
      const [y, m, d] = isoDate.split('-').map(v => parseInt(v, 10));
      return new Date(y, m - 1, d);
    }

    // DD/MM/YYYY
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value)) {
      const [dStr, mStr, yStr] = value.split('/');
      const d = parseInt(dStr, 10);
      const m = parseInt(mStr, 10);
      const y = parseInt(yStr, 10);
      return new Date(y, m - 1, d);
    }

    // DD-MM-YYYY
    if (/^\d{1,2}-\d{1,2}-\d{4}$/.test(value)) {
      const [dStr, mStr, yStr] = value.split('-');
      const d = parseInt(dStr, 10);
      const m = parseInt(mStr, 10);
      const y = parseInt(yStr, 10);
      return new Date(y, m - 1, d);
    }

    const parsed = new Date(value);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  private formatDobDDMMYYYY(date: Date | null): string {
    if (!date) {
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear());
    return `${day}/${month}/${year}`;
  }
}