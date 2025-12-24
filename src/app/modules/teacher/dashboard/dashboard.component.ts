import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { TeacherService } from '../../../core/services/teacher.service';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  mobileMenuOpen = false;
  teacherName = 'Teacher';
  teacherEmail = '';
  
  students = [
    { name: 'Narayan', rollNo: '23' },
    { name: 'Rakesh', rollNo: '19' }
  ];

  subjects = ['Maths', 'Science', 'English', 'History'];

  marks = {
    student: '',
    subject: '',
    score: ''
  };
teacher: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private teacherService: TeacherService
  ) {}

  ngOnInit(): void {
    this.loadTeacherInfo();
  }

  /**
   * Load teacher info from localStorage
   */
  loadTeacherInfo(): void {
    const currentUser = this.authService.getCurrentUser();
    this.teacherEmail = currentUser?.email || '';

    if (!this.teacherEmail) {
      console.warn('⚠️ No teacher email found in session');
      this.teacherName = 'Teacher';
      return;
    }

    // Fast fallback (offline): show formatted email name
    this.teacherName = this.formatNameFromEmail(this.teacherEmail);

    // Preferred: load real name from backend
    this.teacherService.getTeacherByEmail(this.teacherEmail).subscribe({
      next: (teacher: any) => {
        this.teacherName = teacher?.name?.trim() || this.teacherName;
        this.teacherEmail = teacher?.email?.trim() || this.teacherEmail;
      },
      error: (err) => {
        console.warn('⚠️ Failed to load teacher details from API; using fallback name.', err);
      }
    });
  }

  /**
   * Format a proper name from email
   * Example: "raj.kumar@school.com" → "Raj Kumar"
   */
  private formatNameFromEmail(email: string): string {
    if (!email) return 'Teacher';
    
    // Extract name part before @
    const namePart = email.split('@')[0];
    
    // Replace dots/underscores/hyphens with spaces and capitalize
    return namePart
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  saveMarks() {
    console.log("MARKS SUBMITTED:", this.marks);
    alert("Marks Submitted Successfully!");
  }

  logout() {
    console.log('🔓 Teacher logout initiated');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Mobile menu methods
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}