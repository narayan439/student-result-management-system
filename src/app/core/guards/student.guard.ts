import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('🔐 StudentGuard: Checking student authorization...');
    
    // Check if user is logged in and is a student
    const isAuthenticated = this.authService.isAuthenticated();
    const userRole = localStorage.getItem('userRole');

    console.log('ℹ Authenticated:', isAuthenticated, 'Role:', userRole);

    if (isAuthenticated && userRole === 'STUDENT') {
      console.log('✓ StudentGuard: Authorization successful');
      return true;
    }

    console.log('❌ StudentGuard: No user logged in - redirecting to login');
    this.router.navigate(['/login'], { 
      queryParams: { 
        role: 'student',
        returnUrl: state.url 
      } 
    });
    return false;
  }
}
