import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../core/services/student.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  rollNo: string = '';
  dob: string = '';
  rollNoError: string = '';
  dobError: string = '';
  isSearching: boolean = false;
  foundStudent: any = null;

  constructor(
    private router: Router,
    private studentService: StudentService
  ) {}

  /**
   * Format DOB input to DD/MM/YYYY format
   */
  formatDob(): void {
    // This function is no longer needed with date input type
    // But keeping for backward compatibility
  }

  /**
   * Validate DOB format (DD/MM/YYYY from text input or YYYY-MM-DD from date picker)
   */
  private isValidDobFormat(dob: string): boolean {
    // Check if it's HTML date input format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(dob)) {
      const [year, month, day] = dob.split('-');
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      const d = parseInt(day, 10);
      
      if (d < 1 || d > 31) return false;
      if (m < 1 || m > 12) return false;
      if (y < 1900 || y > 2100) return false;
      return true;
    }
    
    // Check if it's manual DD/MM/YYYY format
    const manualRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (manualRegex.test(dob)) {
      const [day, month, year] = dob.split('/');
      const d = parseInt(day, 10);
      const m = parseInt(month, 10);
      const y = parseInt(year, 10);
      
      if (d < 1 || d > 31) return false;
      if (m < 1 || m > 12) return false;
      if (y < 1900 || y > 2100) return false;
      return true;
    }
    
    return false;
  }

  /**
   * Search student by roll number and DOB
   */
  viewResult(): void {
    this.rollNoError = '';
    this.dobError = '';
    this.foundStudent = null;

    // Validate Roll Number
    if (!this.rollNo.trim()) {
      this.rollNoError = 'Please enter Roll Number';
      return;
    }

    // Validate DOB
    if (!this.dob) {
      this.dobError = 'Please enter Date of Birth';
      return;
    }

    // Validate DOB format
    if (!this.isValidDobFormat(this.dob)) {
      this.dobError = 'Please enter valid Date of Birth';
      return;
    }

    this.isSearching = true;

    console.log('🔍 Searching for student with roll number:', this.rollNo);
    
    // Use getAllStudents() endpoint to fetch all students and search locally
    // This avoids CORS issues with individual lookup endpoints
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        console.log('✓ Students loaded from backend:', students.length, 'students');
        
        // Search for the student in the fetched list
        const studentWithRoll = students.find(s => 
          s.rollNo && s.rollNo.toLowerCase() === this.rollNo.toLowerCase()
        );
        
        if (!studentWithRoll) {
          this.isSearching = false;
          this.rollNoError = `Roll Number "${this.rollNo}" not found in our system`;
          console.error('❌ Student not found with roll number:', this.rollNo);
          console.log('Available roll numbers:', students.map(s => s.rollNo).join(', '));
          return;
        }
        
        console.log('✓ Student found:', studentWithRoll);
        this.validateAndNavigate(studentWithRoll);
      },
      error: (err) => {
        console.error('❌ Failed to load students from backend:', err);
        console.log('Falling back to local cached data...');
        
        // Fallback: Search in local cached students
        const students = this.studentService.getAllStudentsSync();
        console.log('Total students loaded from cache:', students.length);
        console.log('Available roll numbers in cache:', students.map(s => s.rollNo).join(', '));
        
        const studentWithRoll = students.find(s => 
          s.rollNo && s.rollNo.toLowerCase() === this.rollNo.toLowerCase()
        );

        if (!studentWithRoll) {
          this.isSearching = false;
          this.rollNoError = `Roll Number "${this.rollNo}" not found in our system. Available: ${students.map(s => s.rollNo).join(', ')}`;
          console.error('❌ Student not found with roll number:', this.rollNo);
          return;
        }

        console.log('✓ Student found in cache:', studentWithRoll);
        this.validateAndNavigate(studentWithRoll);
      }
    });
  }

  /**
   * Validate DOB and navigate to view result
   */
  private validateAndNavigate(studentWithRoll: any) {
    console.log('Student to validate:', studentWithRoll);

    // Check if DOB matches - normalize both dates to YYYY-MM-DD format
    let inputDobNormalized = this.dob;
    let studentDobNormalized = studentWithRoll.dob;

    // If input is in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (this.dob && this.dob.includes('/')) {
      const [day, month, year] = this.dob.split('/');
      inputDobNormalized = `${year}-${month}-${day}`;
    }

    // If student DOB is in DD/MM/YYYY format, convert to YYYY-MM-DD
    if (studentWithRoll.dob && studentWithRoll.dob.includes('/')) {
      const [day, month, year] = studentWithRoll.dob.split('/');
      studentDobNormalized = `${year}-${month}-${day}`;
    }

    console.log('Comparing DOB - Input (YYYY-MM-DD):', inputDobNormalized, 'Student DOB (YYYY-MM-DD):', studentDobNormalized);

    if (inputDobNormalized !== studentDobNormalized) {
      this.isSearching = false;
      this.dobError = 'Date of Birth does not match our records';
      console.error('DOB mismatch - Expected:', studentDobNormalized, 'Got:', inputDobNormalized);
      return;
    }

    // Both match - student found!
    this.isSearching = false;
    this.foundStudent = studentWithRoll;
    console.log('✓ Student found:', studentWithRoll);
    
    // Navigate to view result with student email
    console.log('Navigating to:', ['/student/view-result', studentWithRoll.rollNo, studentWithRoll.email]);
    this.router.navigate(['/student/view-result', studentWithRoll.rollNo, studentWithRoll.email]);
  }

  /**
   * Clear search form
   */
  clearForm(): void {
    this.rollNo = '';
    this.dob = '';
    this.rollNoError = '';
    this.dobError = '';
    this.foundStudent = null;
  }
}