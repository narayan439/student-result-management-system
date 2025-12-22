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
    dob: 'Loading...',
    experience: 0,
    phone: 'Loading...',
    address: 'Loading...',
    qualifications: 'Loading...',
    employmentStatus: 'Loading...',
    dateOfJoining: 'Loading...'
  };

  isLoading = true;
  errorMessage = '';
  currentUserEmail = '';

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

    // Get current logged-in user's email from localStorage (stored as 'currentUser')
    const currentUser = localStorage.getItem('currentUser');
    console.log('📦 Current user from localStorage:', currentUser);

    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        this.currentUserEmail = userData.email || '';
        console.log(`📋 Extracted email from currentUser: "${this.currentUserEmail}"`);
      } catch (e) {
        console.error('❌ Error parsing currentUser:', e);
        this.errorMessage = 'Error reading user session data. Please login again.';
        this.isLoading = false;
        return;
      }
    } else {
      // Fallback: Check other storage locations
      this.currentUserEmail = sessionStorage.getItem('userEmail') || 
                             sessionStorage.getItem('email') || '';
      console.log(`📋 Fallback email from session storage: "${this.currentUserEmail}"`);
    }

    if (!this.currentUserEmail) {
      this.errorMessage = 'No teacher email found in session. Please login again.';
      this.isLoading = false;
      console.warn('⚠️ No email found in any storage location');
      return;
    }

    // Fetch all teachers and find current one
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers: any[]) => {
        console.log(`✓ Fetched ${teachers.length} teachers from backend:`, teachers);
        
        // Debug: Log all emails for comparison
        console.log('📧 All teacher emails in backend:', teachers.map(t => t.email));
        console.log(`🔍 Looking for email: "${this.currentUserEmail}"`);

        // Find current teacher by email (case-insensitive)
        const currentTeacher = teachers.find(t => {
          const backendEmail = (t.email || '').toLowerCase().trim();
          const currentEmail = this.currentUserEmail.toLowerCase().trim();
          console.log(`   Comparing: "${backendEmail}" === "${currentEmail}" ? ${backendEmail === currentEmail}`);
          return backendEmail === currentEmail;
        });

        if (currentTeacher) {
          // Map backend fields to component properties
          this.teacher = {
            teacherId: currentTeacher.teacherId || currentTeacher.id,
            name: currentTeacher.name || 'N/A',
            email: currentTeacher.email || 'N/A',
            subject: Array.isArray(currentTeacher.subjects) 
              ? currentTeacher.subjects.join(', ') 
              : (currentTeacher.subject || 'N/A'),
            phone: currentTeacher.phone || 'N/A',
            dob: currentTeacher.dob || 'N/A',
            experience: currentTeacher.experience || 0,
            address: currentTeacher.address || 'N/A',
            qualifications: currentTeacher.qualifications || 'N/A',
            employmentStatus: currentTeacher.employmentStatus || 'Active',
            dateOfJoining: currentTeacher.dateOfJoining || 'N/A',
            isActive: currentTeacher.isActive !== false
          };

          console.log(`✅ Teacher profile loaded:`, this.teacher);
        } else {
          this.errorMessage = `Teacher with email "${this.currentUserEmail}" not found in backend. Available emails: ${teachers.map(t => t.email).join(', ')}`;
          console.warn(this.errorMessage);
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Error loading teacher profile:', err);
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
   * Logout user
   */
  logout(): void {
    console.log('🔓 Teacher logout initiated');
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
