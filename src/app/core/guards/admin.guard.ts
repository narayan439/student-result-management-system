import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

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
      console.warn('❌ AdminGuard: No user logged in - redirecting to login');
      // Replace history to prevent going back
      window.history.replaceState(null, '', window.location.href);
      this.router.navigate(['/login']);
      return false;
    }

    if (currentUser.role !== 'ADMIN') {
      console.warn(`❌ AdminGuard: User role is ${currentUser.role}, not ADMIN. Access denied.`);
      this.router.navigate(['/']);
      return false;
    }

    console.log(`✅ AdminGuard: User ${currentUser.email} (${currentUser.role}) has access`);
    return true;
  }
}
