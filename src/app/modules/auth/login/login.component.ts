import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginData = {
    email: '',
    password: ''
  };

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    // Later replace with backend API
    const role = this.auth.fakeLogin(this.loginData.email, this.loginData.password);

    if (role === 'ADMIN') {
      this.router.navigate(['/admin']);
    }
    else if (role === 'TEACHER') {
      this.router.navigate(['/teacher']);
    }
    else if (role === 'STUDENT') {
      this.router.navigate(['/student']);
    }
    else {
      alert("❌ Invalid credentials");
    }
  }
}
