import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent {

  mobileMenuOpen = false;


  constructor(private router: Router) {}

  // Toggle mobile menu
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  // Close mobile menu
  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  // Logout function
  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }

  // Navigation methods
  goToViewMarks() {
    this.router.navigate(['/student/view-marks']);
    this.closeMobileMenu();
  }

  goToRequestRecheck() {
    this.router.navigate(['/student/request-recheck']);
    this.closeMobileMenu();
  }

  goToTrackRecheck() {
    this.router.navigate(['/student/track-recheck']);
    this.closeMobileMenu();
  }

  goToProfile() {
    this.router.navigate(['/student/profile']);
    this.closeMobileMenu();
  }
  /* Force show menu button on mobile */


}