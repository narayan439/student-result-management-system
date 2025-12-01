import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent {

  constructor(private router: Router) {}

  // Mock Data (You will replace with API response later)
  result = {
    total: 358,
    percentage: 72,
    grade: 'B'
  };

  // Logout function
  logout() {
    localStorage.clear();
    alert("Logged out successfully!");
    this.router.navigate(['/login']);
  }

  // Navigation (Optional Helper methods)
  goToViewMarks() {
    this.router.navigate(['/student/view-marks']);
  }

  goToRequestRecheck() {
    this.router.navigate(['/student/request-recheck']);
  }

  goToTrackRecheck() {
    this.router.navigate(['/student/track-recheck']);
  }

  goToProfile() {
    this.router.navigate(['/student/profile']);
  }
}
