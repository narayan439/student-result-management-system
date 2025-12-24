import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../core/services/student.service';
import { AuthService } from '../../core/services/auth.service';
import { Student } from '../../core/models/student.model';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent implements OnInit {

  mobileMenuOpen = false;
  currentStudent: Student | null = null;
  studentName: string = 'Student';
  studentClass: string = '';
  studentRoll: string = '';

  constructor(
    private router: Router,
    private studentService: StudentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCurrentStudent();
  }

  /**
   * Load current logged-in student's data
   */
  loadCurrentStudent(): void {
    console.log('🔍 StudentDashboard: Checking current user session...');
    
    const currentUser = this.authService.getCurrentUser();
    console.log('📋 CurrentUser retrieved:', currentUser);
    
    if (!currentUser) {
      console.error('❌ No current user found - redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    
    if (currentUser.role !== 'STUDENT') {
      console.error('❌ User is not a STUDENT (role:', currentUser.role, ') - redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    console.log('✓ User authenticated as STUDENT:', currentUser.email);

    // Get student by email
    try {
      let students = this.studentService.getAllStudentsSync();
      console.log('📚 Total students loaded:', students ? students.length : 0);
      
      // If cache is empty, refresh from backend
      if (!students || students.length === 0) {
        console.log('⚠️ Student cache is empty, refreshing from backend...');
        this.studentService.refreshStudents().subscribe({
          next: (refreshedStudents) => {
            this.findAndLoadStudent(currentUser.email, refreshedStudents);
          },
          error: (err) => {
            console.error('❌ Failed to refresh student data:', err);
            this.router.navigate(['/login']);
          }
        });
        return;
      }
      
      this.findAndLoadStudent(currentUser.email, students);
    } catch (error) {
      console.error('❌ Error loading students:', error);
    }
  }

  /**
   * Find and load student data by email
   */
  private findAndLoadStudent(email: string, students: any[]): void {
    this.currentStudent = students.find(s => s.email === email) || null;

    if (this.currentStudent) {
      this.studentName = this.currentStudent.name;
      this.studentClass = this.currentStudent.className;
      this.studentRoll = this.currentStudent.rollNo;
      console.log('✓ Current student loaded:', {
        name: this.studentName,
        class: this.studentClass,
        roll: this.studentRoll
      });
    } else {
      console.error('❌ Student not found for email:', email);
      console.log('Available student emails:', students.map(s => s.email));
    }
  }

  // Toggle mobile menu
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Close mobile menu
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  // Logout function
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Navigation methods
  goToViewMarks() {
    this.router.navigate(['/student/view-marks']);
    this.closeMobileMenu();
  }

  goToRequestRecheck() {
    this.router.navigate(['/student/request-recheck']);
    this.closeMobileMenu();
  }

  goToTrackRecheck() {
    this.router.navigate(['/student/track-recheck']);
    this.closeMobileMenu();
  }

  goToProfile() {
    this.router.navigate(['/student/profile']);
    this.closeMobileMenu();
  }
}