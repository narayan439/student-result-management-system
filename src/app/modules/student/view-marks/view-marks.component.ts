import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { MarksService } from '../../../core/services/marks.service';
import { SubjectService } from '../../../core/services/subject.service';
import { AuthService } from '../../../core/services/auth.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-view-marks',
  templateUrl: './view-marks.component.html',
  styleUrls: ['./view-marks.component.css']
})
export class ViewMarksComponent implements OnInit {
  
  // Student Info
  student: Student | null = null;
  studentName = '';
  studentClass = '';
  studentRollNo = '';
  studentClassNumber: number = 0;
  
  // Displayed columns for the table
  displayedColumns: string[] = ['subject', 'score', 'status'];
  
  // Marks data
  marks: any[] = [];
  classSubjects: any[] = [];
  
  // Calculated values
  total: number = 0;
  percentage: number = 0;
  grade: string = '';
  average: number = 0;

  constructor(
    private studentService: StudentService,
    private marksService: MarksService,
    private subjectService: SubjectService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadStudentMarks();
  }

  /**
   * Load current student's marks
   */
  loadStudentMarks(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'STUDENT') {
      this.router.navigate(['/login']);
      return;
    }

    // Get student by email
    const students = this.studentService.getAllStudentsSync();
    this.student = students.find(s => s.email === currentUser.email) || null;

    if (this.student) {
      this.studentName = this.student.name;
      this.studentClass = this.student.className;
      this.studentRollNo = this.student.rollNo;
      
      // Extract class number from className (e.g., "Class 5" -> 5)
      const classMatch = this.studentClass.match(/Class\s(\d+)/);
      this.studentClassNumber = classMatch ? parseInt(classMatch[1]) : 0;
      
      // Load subjects for this class
      this.classSubjects = this.subjectService.getSubjectsByClass(this.studentClassNumber);
      console.log(`✓ Loaded ${this.classSubjects.length} subjects for ${this.studentClass}`);

      // Get marks for this student
      this.marksService.getAllMarks().subscribe({
        next: (allMarks: any) => {
          // Filter marks for current student
          const marksArray = Array.isArray(allMarks) ? allMarks : [];
          const studentIdStr = String(this.student?.studentId);
          let marks = marksArray.filter(m => m.studentId === studentIdStr) || [];
          
          // Filter marks to only show subjects for this student's class
          const classSubjectNames = this.classSubjects.map(s => s.subjectName);
          this.marks = marks.filter(m => classSubjectNames.includes(m.subject));
          
          // Ensure marks have proper subject display
          this.marks = this.marks.map(mark => ({
            ...mark,
            subject: mark.subject || 'Unknown Subject'
          }));
          
          console.log(`✓ Loaded ${this.marks.length} marks for Class ${this.studentClassNumber}:`, this.marks);
          
          if (this.marks.length > 0) {
            this.calculatePerformance();
            console.log('✓ Student marks loaded (class-specific):', this.marks);
          } else {
            console.warn('No marks found for student in their class subjects:', this.student?.studentId);
            console.warn('Class subjects:', classSubjectNames);
          }
        },
        error: (err) => {
          console.error('Error loading marks:', err);
        }
      });
    } else {
      console.error('✗ Student not found for email:', currentUser.email);
      this.router.navigate(['/login']);
    }
  }

  calculatePerformance() {
    if (this.marks.length === 0) {
      this.total = 0;
      this.percentage = 0;
      this.average = 0;
      this.grade = 'N/A';
      return;
    }

    // Calculate total
    this.total = this.marks.reduce((sum, mark) => sum + (mark.marksObtained || 0), 0);
    
    // Calculate percentage
    this.percentage = Math.round((this.total / (this.marks.length * 100)) * 100);
    
    // Calculate average
    this.average = Math.round((this.total / this.marks.length) * 100) / 100;
    
    // Determine grade
    if (this.percentage >= 90) {
      this.grade = 'A+';
    } else if (this.percentage >= 80) {
      this.grade = 'A';
    } else if (this.percentage >= 70) {
      this.grade = 'B';
    } else if (this.percentage >= 60) {
      this.grade = 'C';
    } else if (this.percentage >= 33) {
      this.grade = 'D';
    } else {
      this.grade = 'F';
    }
  }
}