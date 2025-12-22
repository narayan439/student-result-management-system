import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { StudentService } from './core/services/student.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if user is already logged in (restore session on page refresh)
    const currentUser = this.authService.getCurrentUser();
    
    if (currentUser) {
      console.log('✓ Session restored for:', currentUser.email);
      
      // If user is authenticated, refresh students data to ensure it's available
      if (currentUser.role === 'STUDENT') {
        console.log('🔄 Refreshing student data for authenticated user...');
        this.studentService.refreshStudents().subscribe({
          next: (students) => {
            console.log(`✅ Student data refreshed: ${students.length} students loaded`);
          },
          error: (err) => {
            console.warn('⚠️ Failed to refresh student data, using cached data:', err);
          }
        });
      }
      
      // Redirect to appropriate dashboard based on role
      if (currentUser.role === 'ADMIN') {
        // Admin route handling can be added here if needed
      } else if (currentUser.role === 'TEACHER') {
        // Teacher dashboard is auto-navigated by routing
      } else if (currentUser.role === 'STUDENT') {
        // Student dashboard is auto-navigated by routing
      }
    } else {
      console.log('ℹ No active session found');
    }
  }
}
