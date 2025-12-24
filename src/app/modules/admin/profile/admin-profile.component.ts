import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  adminName: string = '';
  adminEmail: string = '';
  
  // Change Password Form
  showChangePassword = false;
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  passwordStrengthLabel: 'Weak' | 'Medium' | 'Strong' = 'Weak';
  passwordStrengthIssues: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAdminProfile();
  }

  /**
   * Load admin profile details
   */
  loadAdminProfile(): void {
    // Get admin info from local storage or auth service
    const user = this.authService.getCurrentUser();
    if (user) {
      this.adminName = user.name || user.username || 'Administrator';
      this.adminEmail = user.email || 'admin@school.com';
    } else {
      this.adminName = 'Administrator';
      this.adminEmail = 'admin@school.com';
    }
  }

  /**
   * Toggle change password form
   */
  toggleChangePassword(): void {
    this.showChangePassword = !this.showChangePassword;
    this.resetPasswordForm();
  }

  onNewPasswordChange(): void {
    const result = this.evaluatePasswordStrength(this.newPassword, this.adminEmail);
    this.passwordStrengthLabel = result.label;
    this.passwordStrengthIssues = result.issues;
  }

  canSubmitPasswordChange(): boolean {
    if (this.isLoading) return false;
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

    const categories = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(p)).length;
    if (p.length >= 8 && categories >= 3) return { label: 'Medium', issues };
    return { label: 'Weak', issues };
  }

  /**
   * Change password
   */
  changePassword(): void {
    // Validation
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.errorMessage = 'All fields are required';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'New password and confirm password do not match';
      return;
    }

    this.onNewPasswordChange();
    if (this.passwordStrengthLabel !== 'Strong') {
      this.errorMessage = this.passwordStrengthIssues[0] || 'Please choose a stronger password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Call API to change password
    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (response: any) => {
        this.successMessage = '✅ Password changed successfully!';
        this.resetPasswordForm();
        this.showChangePassword = false;
        this.isLoading = false;

        // Logout after 2 seconds for security
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err: any) => {
        console.error('Error changing password:', err);
        this.errorMessage = err.error?.message || 'Failed to change password. Please try again.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Reset password form
   */
  private resetPasswordForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.passwordStrengthLabel = 'Weak';
    this.passwordStrengthIssues = [];
  }

  /**
   * Go back
   */
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
