import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

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
      console.warn('❌ AuthGuard: No user logged in. Redirecting to login...');
      this.router.navigate(['/login']);
      return false;
    }

    console.log(`✅ AuthGuard: User ${currentUser.name} is authenticated`);
    return true;
  }
}
