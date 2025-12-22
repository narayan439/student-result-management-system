import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  
  constructor(private authService: AuthService, private router: Router) {}
  
  mobileMenuOpen = false;
  mobileDropdowns = {
    students: false,
    teachers: false
  };

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close mobile menu if clicking outside
    const menuToggle = (event.target as HTMLElement).closest('.menu-toggle');
    const mobileMenu = (event.target as HTMLElement).closest('.mobile-menu');
    const mobileOverlay = (event.target as HTMLElement).closest('.mobile-menu-overlay');
    const mobileToggle = (event.target as HTMLElement).closest('.mobile-toggle');
    
    // Don't close if clicking on mobile toggle buttons
    if (!menuToggle && !mobileMenu && !mobileOverlay && !mobileToggle && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Close all dropdowns when toggling menu
    if (!this.mobileMenuOpen) {
      this.closeAllDropdowns();
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.closeAllDropdowns();
  }

  toggleMobileDropdown(dropdown: string) {
    // Toggle the clicked dropdown
    this.mobileDropdowns[dropdown as keyof typeof this.mobileDropdowns] = 
      !this.mobileDropdowns[dropdown as keyof typeof this.mobileDropdowns];
    
    // Close other dropdowns
    Object.keys(this.mobileDropdowns).forEach(key => {
      if (key !== dropdown) {
        this.mobileDropdowns[key as keyof typeof this.mobileDropdowns] = false;
      }
    });
  }

  private closeAllDropdowns() {
    this.mobileDropdowns.students = false;
    this.mobileDropdowns.teachers = false;
  }

  logout(): void {
    console.log('🔓 Admin logout initiated');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}