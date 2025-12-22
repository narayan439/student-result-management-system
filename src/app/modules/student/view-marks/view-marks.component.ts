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
    console.log('📖 ViewMarks: Loading student marks...');
    console.log('📖 Clearing previous data...');
    
    // Clear previous data to ensure fresh load
    this.marks = [];
    this.classSubjects = [];
    this.total = 0;
    this.percentage = 0;
    this.grade = 'N/A';
    this.average = 0;
    
    const currentUser = this.authService.getCurrentUser();
    console.log('🔑 Current user:', currentUser);
    
    if (!currentUser) {
      console.error('❌ No authenticated user - redirecting to login');
      this.router.navigate(['/login']);
      return;
    }

    if (currentUser.role !== 'STUDENT') {
      console.error('❌ User is not a STUDENT (role:', currentUser.role, ')');
      this.router.navigate(['/login']);
      return;
    }

    // Get student by email
    try {
      let students = this.studentService.getAllStudentsSync();
      console.log('📚 Students loaded:', students ? students.length : 0);
      
      // If cache is empty, refresh from backend
      if (!students || students.length === 0) {
        console.log('⚠️ Student cache is empty, refreshing from backend...');
        this.studentService.refreshStudents().subscribe({
          next: (refreshedStudents) => {
            this.findAndLoadStudentMarks(currentUser.email, refreshedStudents);
          },
          error: (err) => {
            console.error('❌ Failed to refresh student data:', err);
            this.router.navigate(['/login']);
          }
        });
        return;
      }
      
      this.findAndLoadStudentMarks(currentUser.email, students);
    } catch (error) {
      console.error('❌ Error in loadStudentMarks:', error);
      this.marks = [];
    }
  }

  /**
   * Find and load student marks by email
   */
  private findAndLoadStudentMarks(email: string, students: any[]): void {
    this.student = students.find(s => s.email === email) || null;

    if (!this.student) {
      console.error('❌ Student not found for email:', email);
      console.log('Available emails:', students.map(s => s.email));
      return;
    }

    this.studentName = this.student.name;
    this.studentClass = this.student.className;
    this.studentRollNo = this.student.rollNo;
    
    console.log('✓ Student found:', { name: this.studentName, class: this.studentClass });
    
    // Extract class number from className (e.g., "Class 5" -> 5)
    const classMatch = this.studentClass.match(/Class\s(\d+)/);
    this.studentClassNumber = classMatch ? parseInt(classMatch[1]) : 0;
    
    // Load subjects for this class FIRST, then load marks after subjects are ready
    console.log(`🔄 Loading subjects for class number: ${this.studentClassNumber}`);
    
    this.subjectService.getSubjectsByClass(this.studentClassNumber).subscribe({
      next: (response: any) => {
        console.log('📥 Subjects response:', response);
        
        const subjectsArray = Array.isArray(response) ? response : (Array.isArray(response.data) ? response.data : []);
        this.classSubjects = subjectsArray;
        
        console.log(`✓ Loaded ${subjectsArray.length} subjects for Class ${this.studentClassNumber}:`);
        subjectsArray.forEach((s: any) => {
          console.log(`  - ${s.subjectName} (ID: ${s.subjectId})`);
        });
        
        // NOW load marks after subjects are ready
        console.log('🔄 Subjects loaded, now loading marks...');
        this.loadMarksForStudent();
      },
      error: (err) => {
        console.error('❌ Error loading subjects:', err);
        console.log('Error details:', err.message);
        this.classSubjects = [];
        // Still load marks even if subjects fail
        console.log('⚠️ Continuing without subjects...');
        this.loadMarksForStudent();
      }
    });
  }

  /**
   * Load marks for the current student (called after subjects are loaded)
   */
  private loadMarksForStudent(): void {
    console.log('🔄 loadMarksForStudent() called');
    
    if (!this.student || !this.student.studentId) {
      console.warn('⚠️ Cannot load marks - student or studentId not available');
      console.log('Student:', this.student);
      this.marks = [];
      return;
    }

    const studentId = this.student.studentId;
    console.log('🔄 Fetching marks for student ID:', studentId);
    console.log('📋 Student details:', {
      id: this.student.studentId,
      name: this.student.name,
      class: this.student.className,
      email: this.student.email
    });
    
    this.marksService.getMarksByStudentId(studentId).subscribe({
      next: (response: any) => {
        console.log('📥 Raw API response received');
        console.log('📥 Response type:', typeof response);
        console.log('📥 Response:', response);
        
        // Handle different response formats
        let marksArray: any[] = [];
        
        if (Array.isArray(response)) {
          console.log('✓ Response is direct array');
          marksArray = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          console.log('✓ Response has data array property');
          marksArray = response.data;
        } else if (response && response.data && typeof response.data === 'object') {
          console.log('✓ Response has single data object');
          marksArray = [response.data];
        } else if (response && typeof response === 'object' && response.marksId) {
          console.log('✓ Response is single mark object');
          marksArray = [response];
        } else if (!response) {
          console.log('ℹ️ Response is null/empty');
          marksArray = [];
        } else {
          console.log('⚠️ Unknown response format');
          console.log('Response keys:', Object.keys(response || {}));
          marksArray = [];
        }
        
        console.log(`✅ Extracted marks array with ${marksArray.length} items`);
        
        if (marksArray.length === 0) {
          console.log('⚠️ No marks received - student may not have marks yet');
          this.marks = [];
          return;
        }
        
        // Log each mark
        console.log('📊 Marks from backend:');
        marksArray.forEach((m: any, i: number) => {
          console.log(`  [${i}] ID: ${m.marksId}, Subject: ${m.subject || m.subjectName}, Marks: ${m.marksObtained}/${m.maxMarks || 100}`);
        });
        
        // Assign all marks (no filtering)
        this.marks = marksArray;
        console.log(`✓ Assigned ${this.marks.length} marks to component`);
        
        // Process and format marks
        this.marks = this.marks.map((mark: any) => ({
          ...mark,
          subject: mark.subject || mark.subjectName || 'Unknown Subject',
          marksObtained: mark.marksObtained || 0,
          maxMarks: mark.maxMarks || 100
        }));
      
        console.log(`✅ Final marks ready: ${this.marks.length} marks`);
        console.log('✅ Marks array:', this.marks);
        
        if (this.marks.length > 0) {
          this.calculatePerformance();
          console.log('✅ Performance metrics calculated');
          console.log(`   Total: ${this.total}, Percentage: ${this.percentage}%, Grade: ${this.grade}`);
        } else {
          console.warn('⚠️ No marks to process');
        }
      },
      error: (err: any) => {
        console.error('❌ ERROR loading marks from API');
        console.log('❌ Error object:', err);
        console.log('❌ Error message:', err.message);
        console.log('❌ Error status:', err.status);
        console.log('❌ Error response:', err.error);
        
        this.marks = [];
      }
    });
  }

  /**
   * Calculate student performance metrics
   */
  calculatePerformance(): void {
    if (!this.marks || this.marks.length === 0) {
      this.total = 0;
      this.percentage = 0;
      this.average = 0;
      this.grade = 'N/A';
      return;
    }

    // Calculate total
    this.total = this.marks.reduce((sum: number, mark: any) => sum + (mark.marksObtained || 0), 0);
    
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