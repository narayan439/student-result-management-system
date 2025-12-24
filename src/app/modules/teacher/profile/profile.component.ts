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
    subjects: [] as string[],
    phone: '',
    experience: 0,
    isActive: true
  };

  isLoading = true;
  errorMessage = '';
  currentUserEmail = '';
  showLogoutConfirm = false;

  // Change password
  showChangePassword = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isChangingPassword = false;
  changePasswordError = '';
  changePasswordSuccess = '';

  passwordStrengthLabel: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  passwordStrengthIssues: string[] = [];

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
          const subjectsRaw = (currentTeacher as any).subjects;
          const subjectsArray: string[] = Array.isArray(subjectsRaw)
            ? subjectsRaw
            : (typeof subjectsRaw === 'string'
              ? subjectsRaw.split(',')
              : ((currentTeacher as any).subject ? [String((currentTeacher as any).subject)] : []));

          const subjects = subjectsArray
            .map(s => String(s || '').trim())
            .filter(s => !!s);

          // Map backend fields to component properties
          this.teacher = {
            teacherId: currentTeacher.teacherId || currentTeacher.id,
            name: currentTeacher.name || '',
            email: currentTeacher.email || '',
            subjects,
            phone: currentTeacher.phone || '',
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

  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.changePasswordError = '';
    this.changePasswordSuccess = '';
    if (!this.showChangePassword) {
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.passwordStrengthLabel = 'Weak';
      this.passwordStrengthIssues = [];
    }
  }

  onNewPasswordChange(): void {
    const result = this.evaluatePasswordStrength(this.newPassword, this.teacher?.email || this.currentUserEmail);
    this.passwordStrengthLabel = result.label;
    this.passwordStrengthIssues = result.issues;
  }

  canSubmitPasswordChange(): boolean {
    if (this.isChangingPassword) return false;
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) return false;
    if (this.newPassword !== this.confirmPassword) return false;
    return this.passwordStrengthLabel === 'Strong';
  }

  private evaluatePasswordStrength(password: string, email?: string): { label: 'Weak' | 'Medium' | 'Strong'; issues: string[] } {
    const issues: string[] = [];
    const p = (password || '').trimEnd();

    if (!p) {
      return { label: 'Weak', issues: ['Enter a new password.'] };
    }

    if (p.length < 8) issues.push('Use at least 8 characters.');
    if (/\s/.test(p)) issues.push('Do not use spaces.');
    if (!/[a-z]/.test(p)) issues.push('Add at least one lowercase letter.');
    if (!/[A-Z]/.test(p)) issues.push('Add at least one uppercase letter.');
    if (!/\d/.test(p)) issues.push('Add at least one number.');
    if (!/[^A-Za-z0-9]/.test(p)) issues.push('Add at least one special character.');

    const common = ['password', '123456', 'qwerty', 'admin', 'teacher', 'student', 'welcome'];
    if (common.includes(p.toLowerCase())) issues.push('Avoid common passwords.');

    const localPart = (email || '').split('@')[0]?.toLowerCase();
    if (localPart && localPart.length >= 3 && p.toLowerCase().includes(localPart)) {
      issues.push('Do not include your email/username in the password.');
    }

    if (/(.)\1\1/.test(p)) issues.push('Avoid repeated characters (e.g., aaa).');
    if (/0123|1234|2345|3456|4567|5678|6789/.test(p)) issues.push('Avoid simple number sequences (e.g., 1234).');
    if (/abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|qwer|asdf|zxcv/i.test(p)) issues.push('Avoid common keyboard/sequential patterns.');

    // Labeling: Strong requires all core rules.
    const coreStrong = (
      p.length >= 8 &&
      !/\s/.test(p) &&
      /[a-z]/.test(p) &&
      /[A-Z]/.test(p) &&
      /\d/.test(p) &&
      /[^A-Za-z0-9]/.test(p) &&
      !common.includes(p.toLowerCase())
    );

    if (coreStrong && issues.length === 0) return { label: 'Strong', issues: [] };

    // Medium: meets length + at least 3 categories.
    const categories = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(p)).length;
    if (p.length >= 8 && categories >= 3) return { label: 'Medium', issues };
    return { label: 'Weak', issues };
  }

  submitChangePassword(): void {
    this.changePasswordError = '';
    this.changePasswordSuccess = '';

    this.onNewPasswordChange();

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.changePasswordError = 'Please fill all password fields.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.changePasswordError = 'New password and confirm password do not match.';
      return;
    }

    if (this.passwordStrengthLabel !== 'Strong') {
      this.changePasswordError = this.passwordStrengthIssues[0] || 'Please choose a stronger password.';
      return;
    }

    this.isChangingPassword = true;

    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (res: any) => {
        const success = res?.success !== false;
        if (success) {
          this.changePasswordSuccess = res?.message || 'Password updated successfully.';
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
          this.showChangePassword = false;
        } else {
          this.changePasswordError = res?.message || 'Failed to change password.';
        }
        this.isChangingPassword = false;
      },
      error: (err: any) => {
        const msg = err?.error?.message || err?.message || 'Failed to change password.';
        this.changePasswordError = msg;
        this.isChangingPassword = false;
      }
    });
  }
}