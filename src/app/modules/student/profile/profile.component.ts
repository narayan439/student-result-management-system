import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  student: Student | null = null;
  isEditing = false;
  editData: any = {};

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudentProfile();
  }

  /**
   * Load current student's profile
   */
  loadStudentProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'STUDENT') {
      this.router.navigate(['/login']);
      return;
    }

    // Get student by email
    let students = this.studentService.getAllStudentsSync();
    
    // If cache is empty, refresh from backend
    if (!students || students.length === 0) {
      console.log('⚠️ Student cache is empty, refreshing from backend...');
      this.studentService.refreshStudents().subscribe({
        next: (refreshedStudents) => {
          this.findAndLoadStudent(currentUser.email, refreshedStudents);
        },
        error: (err) => {
          console.error('❌ Failed to refresh student data:', err);
          alert('Student profile not found. Please login again.');
          this.router.navigate(['/login']);
        }
      });
      return;
    }
    
    this.findAndLoadStudent(currentUser.email, students);
  }

  /**
   * Find and load student profile by email
   */
  private findAndLoadStudent(email: string, students: any[]): void {
    this.student = students.find(s => s.email === email) || null;

    if (this.student) {
      this.editData = { ...this.student };
      console.log('✓ Student profile loaded:', this.student);
    } else {
      console.error('✗ Student not found for email:', email);
      alert('Student profile not found. Please login again.');
      this.router.navigate(['/login']);
    }
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing && this.student) {
      this.editData = { ...this.student };
    }
  }

  saveProfile() {
    if (this.student) {
      this.student = { ...this.editData };
      this.isEditing = false;
      alert('Profile updated successfully!');
      console.log('Profile saved:', this.student);
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }
}