import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @ViewChild('loginForm', { static: false }) loginForm!: NgForm;

  loginData = {
    email: '',
    password: ''
  };

  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    // Check if form is valid
    if (this.loginForm && this.loginForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.controls[key];
        control.markAsTouched();
      });
      return;
    }

    // If no form reference, do basic validation
    if (!this.loginData.email || !this.loginData.password) {
      alert("Please enter both email and password");
      return;
    }

    this.isLoading = true;
    
    console.log('📝 Login attempt initiated');
    console.log('   Email:', this.loginData.email);
    console.log('   Password: ' + '*'.repeat(this.loginData.password.length));
    
    // Call async fakeLogin
    this.auth.fakeLogin(this.loginData.email, this.loginData.password).then((role) => {
      console.log('📊 Login response received:', role);
      
      if (role && role.length > 0) {
        console.log(`✅ Login successful - Role: ${role}`);
        
        // Prevent going back to login page using browser back button
        window.history.replaceState(null, '', window.location.href);
        
        // Session already saved in auth service, no need to call again
        
        // Navigate based on role
        if (role === 'ADMIN') {
          console.log('🔀 Redirecting to /admin');
          this.router.navigate(['/admin']);
        }
        else if (role === 'TEACHER') {
          console.log('🔀 Redirecting to /teacher');
          this.router.navigate(['/teacher']);
        }
        else if (role === 'STUDENT') {
          console.log('🔀 Redirecting to /student');
          this.router.navigate(['/student']);
        }
        else {
          console.warn('⚠️ Unknown role:', role);
          alert(`Unknown user role: ${role}`);
        }
      }
      else {
        console.error('❌ Login failed - No role returned');
        alert("❌ Invalid email or password");
      }
      
      this.isLoading = false;
    }).catch((error) => {
      console.error('❌ Login error caught:', error);
      alert("❌ Invalid email or password");
      this.isLoading = false;
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goBack() {
    this.router.navigate(['/']);
  }

  // Helper method to check form validity
  isFormValid(): boolean {
    if (this.loginForm) {
      return !!this.loginForm.valid;
    }
    return !!(this.loginData.email && this.loginData.password);
  }
}