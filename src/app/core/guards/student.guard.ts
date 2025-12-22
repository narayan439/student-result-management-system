import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class StudentGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      console.warn('❌ StudentGuard: No user logged in - redirecting to login');
      // Replace history to prevent going back
      window.history.replaceState(null, '', window.location.href);
      this.router.navigate(['/login']);
      return false;
    }

    if (currentUser.role !== 'STUDENT') {
      console.warn(`❌ StudentGuard: User role is ${currentUser.role}, not STUDENT. Access denied.`);
      this.router.navigate(['/']);
      return false;
    }

    console.log(`✅ StudentGuard: User ${currentUser.email} (${currentUser.role}) has access`);
    return true;
  }
}
