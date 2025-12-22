import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  mobileMenuOpen = false;
  teacherName = 'Teacher';
  teacherEmail = '';
  
  students = [
    { name: 'Narayan', rollNo: '23' },
    { name: 'Rakesh', rollNo: '19' }
  ];

  subjects = ['Maths', 'Science', 'English', 'History'];

  marks = {
    student: '',
    subject: '',
    score: ''
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadTeacherInfo();
  }

  /**
   * Load teacher info from localStorage
   */
  loadTeacherInfo(): void {
    const currentUser = localStorage.getItem('currentUser');
    
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        this.teacherEmail = userData.email || '';
        console.log(`📋 Loaded teacher email: ${this.teacherEmail}`);
        
        // Extract name from email (before @) for display
        if (this.teacherEmail) {
          this.teacherName = this.formatNameFromEmail(this.teacherEmail);
          console.log(`👤 Teacher name formatted: ${this.teacherName}`);
        }
      } catch (e) {
        console.error('❌ Error parsing currentUser:', e);
      }
    } else {
      console.warn('⚠️ No currentUser found in localStorage');
    }
  }

  /**
   * Format a proper name from email
   * Example: "raj.kumar@school.com" → "Raj Kumar"
   */
  private formatNameFromEmail(email: string): string {
    if (!email) return 'Teacher';
    
    // Extract name part before @
    const namePart = email.split('@')[0];
    
    // Replace dots/underscores/hyphens with spaces and capitalize
    return namePart
      .replace(/[._-]/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  saveMarks() {
    console.log("MARKS SUBMITTED:", this.marks);
    alert("Marks Submitted Successfully!");
  }

  logout() {
    localStorage.removeItem("teacherToken");
    localStorage.removeItem("currentUser");
    this.router.navigate(['/login']);
  }

  // Mobile menu methods
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }
}