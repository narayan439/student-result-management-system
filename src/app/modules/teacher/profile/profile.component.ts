import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeacherService } from '../../../core/services/teacher.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  teacher: any = {
    name: 'Loading...',
    email: 'Loading...',
    subject: 'Loading...',
    phone: 'Loading...',
    experience: 0,
    isActive: true
  };

  isLoading = true;
  errorMessage = '';
  currentUserEmail = '';
  showLogoutConfirm = false;

  constructor(
    private teacherService: TeacherService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeacherProfile();
  }

  /**
   * Load current teacher's profile from backend
   */
  loadTeacherProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Get current logged-in user's email from localStorage
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        this.currentUserEmail = userData.email || '';
      } catch (e) {
        console.error('Error parsing currentUser:', e);
        this.errorMessage = 'Error reading user session data. Please login again.';
        this.isLoading = false;
        return;
      }
    } else {
      // Fallback: Check session storage
      this.currentUserEmail = sessionStorage.getItem('userEmail') || 
                             sessionStorage.getItem('email') || '';
    }

    if (!this.currentUserEmail) {
      this.errorMessage = 'No teacher email found in session. Please login again.';
      this.isLoading = false;
      return;
    }

    // Fetch all teachers and find current one
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers: any[]) => {
        // Find current teacher by email (case-insensitive)
        const currentTeacher = teachers.find(t => {
          const backendEmail = (t.email || '').toLowerCase().trim();
          const currentEmail = this.currentUserEmail.toLowerCase().trim();
          return backendEmail === currentEmail;
        });

        if (currentTeacher) {
          // Map backend fields to component properties
          this.teacher = {
            teacherId: currentTeacher.teacherId || currentTeacher.id || 'N/A',
            name: currentTeacher.name || 'N/A',
            email: currentTeacher.email || 'N/A',
            subject: Array.isArray(currentTeacher.subjects) 
              ? currentTeacher.subjects.join(', ') 
              : (currentTeacher.subject || 'N/A'),
            phone: currentTeacher.phone || 'N/A',
            experience: currentTeacher.experience || 0,
            isActive: currentTeacher.isActive !== false
          };

          console.log('Teacher profile loaded:', this.teacher);
        } else {
          this.errorMessage = `Teacher with email "${this.currentUserEmail}" not found.`;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading teacher profile:', err);
        this.errorMessage = 'Failed to load teacher profile. Please refresh the page.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Refresh teacher profile
   */
  refreshProfile(): void {
    this.loadTeacherProfile();
  }

  /**
   * Show logout confirmation
   */
  logout(): void {
    this.showLogoutConfirm = true;
  }

  /**
   * Cancel logout
   */
  cancelLogout(): void {
    this.showLogoutConfirm = false;
  }

  /**
   * Confirm and perform logout
   */
  confirmLogout(): void {
    console.log('Teacher logout confirmed');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}