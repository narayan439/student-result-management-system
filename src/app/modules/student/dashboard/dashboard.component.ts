import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { MarksService } from '../../../core/services/marks.service';
import { AuthService } from '../../../core/services/auth.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  student: Student | null = null;
  studentClassNumber: number = 0;
  marks: any[] = [];
  displayedColumns: string[] = ['subject', 'marks', 'percentage'];

  total = 0;
  percentage = 0;
  grade = '';
  resultStatus = 'PASS';
  totalMarks = 100;

  constructor(
    private studentService: StudentService,
    private marksService: MarksService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudentDashboard();
  }

  /**
   * Load student dashboard data
   */
  loadStudentDashboard(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'STUDENT') {
      this.router.navigate(['/login']);
      return;
    }

    // Get student by email
    const students = this.studentService.getAllStudentsSync();
    this.student = students.find(s => s.email === currentUser.email) || null;

    if (this.student) {
      // Extract class number
      const classMatch = this.student.className.match(/Class\s(\d+)/);
      this.studentClassNumber = classMatch ? parseInt(classMatch[1]) : 0;
      
      console.log('✓ Student loaded:', this.student);
      
      // Load student marks
      this.loadStudentMarks();
    } else {
      console.error('✗ Student not found for email:', currentUser.email);
      this.router.navigate(['/login']);
    }
  }

  /**
   * Load student's marks
   */
  loadStudentMarks(): void {
    const studentIdStr = String(this.student?.studentId);
    
    this.marksService.getAllMarks().subscribe({
      next: (marksData: any) => {
        const marksArray = Array.isArray(marksData) ? marksData : [];
        this.marks = marksArray
          .filter((m: any) => m.studentId === studentIdStr)
          .map((m: any) => ({
            subject: m.subject,
            marks: m.marksObtained,
            maxMarks: m.maxMarks || 100,
            percentage: Math.round((m.marksObtained / (m.maxMarks || 100)) * 100)
          }));
        
        console.log('✓ Student marks loaded:', this.marks);
        this.calculateResult();
      },
      error: (err) => {
        console.error('Error loading marks:', err);
        this.marks = [];
      }
    });
  }

  /**
   * Calculate result: total, percentage, grade, status
   */
  calculateResult(): void {
    if (this.marks.length === 0) {
      this.total = 0;
      this.percentage = 0;
      this.grade = '-';
      this.resultStatus = 'NO DATA';
      return;
    }

    // Calculate total marks
    this.total = this.marks.reduce((sum, m) => sum + m.marks, 0);
    
    // Calculate total max marks
    const totalMaxMarks = this.marks.reduce((sum, m) => sum + (m.maxMarks || 100), 0);
    
    // Calculate percentage
    this.percentage = totalMaxMarks > 0 ? Math.round((this.total / totalMaxMarks) * 100) : 0;

    // Determine grade
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B';
    else if (this.percentage >= 60) this.grade = 'C';
    else if (this.percentage >= 40) this.grade = 'D';
    else this.grade = 'F';

    // Determine status
    this.resultStatus = this.percentage >= 40 ? 'PASS' : 'FAIL';

    console.log(`✓ Result calculated: Total=${this.total}, Percentage=${this.percentage}%, Grade=${this.grade}, Status=${this.resultStatus}`);
  }
}
