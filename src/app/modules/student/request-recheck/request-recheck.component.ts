import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { SubjectService } from '../../../core/services/subject.service';
import { MarksService } from '../../../core/services/marks.service';
import { RequestRecheckService } from '../../../core/services/request-recheck.service';
import { AuthService } from '../../../core/services/auth.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-request-recheck',
  templateUrl: './request-recheck.component.html',
  styleUrls: ['./request-recheck.component.css']
})
export class RequestRecheckComponent implements OnInit {

  student: Student | null = null;
  subjects: any[] = [];
  studentClassNumber: number = 0;
  subjectMarks: { [key: string]: number } = {};
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: string = '';
  canRequest: boolean = true;
  canRequestMessage: string = '';
  statusSummary: any = {};
  
  recheck = {
    rollNo: '',
    subject: '',
    reason: '',
    marksObtained: 0,
    maxMarks: 100
  };

  constructor(
    private studentService: StudentService,
    private subjectService: SubjectService,
    private marksService: MarksService,
    private requestRecheckService: RequestRecheckService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudentAndSubjects();
  }

  /**
   * Load current student, subjects, and marks
   */
  loadStudentAndSubjects(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'STUDENT') {
      this.router.navigate(['/login']);
      return;
    }

    // Get student by email
    const students = this.studentService.getAllStudentsSync();
    this.student = students.find(s => s.email === currentUser.email) || null;

    if (this.student) {
      this.recheck.rollNo = this.student.rollNo;
      
      // Extract class number from className (e.g., "Class 5" -> 5)
      const classMatch = this.student.className.match(/Class\s(\d+)/);
      this.studentClassNumber = classMatch ? parseInt(classMatch[1]) : 0;
      
      console.log('✓ Student loaded for recheck:', this.student, 'Class:', this.studentClassNumber);
      
      // Load class-specific subjects
      this.subjects = this.subjectService.getSubjectsByClass(this.studentClassNumber);
      console.log(`✓ Loaded ${this.subjects.length} subjects for Class ${this.studentClassNumber}:`, this.subjects);
      
      // Load student marks
      this.loadStudentMarks();
      
      // Check if student can request recheck
      this.checkCanRequestRecheck();
      
      // Load status summary
      this.loadStatusSummary();
    } else {
      console.error('✗ Student not found for email:', currentUser.email);
      alert('Student profile not found. Please login again.');
      this.router.navigate(['/login']);
      return;
    }
  }

  /**
   * Load student marks for subject reference
   */
  loadStudentMarks(): void {
    const studentIdStr = String(this.student?.studentId);
    this.marksService.getAllMarks().subscribe({
      next: (marks: any) => {
        const marksArray = Array.isArray(marks) ? marks : [];
        marksArray
          .filter((m: any) => m.studentId === studentIdStr)
          .forEach((m: any) => {
            this.subjectMarks[m.subject] = m.marksObtained || 0;
          });
        console.log('✓ Student marks loaded:', this.subjectMarks);
      },
      error: (err) => {
        console.error('Error loading marks:', err);
      }
    });
  }

  /**
   * Check if student can request recheck
   */
  checkCanRequestRecheck(): void {
    if (this.student?.email) {
      const canReq = this.requestRecheckService.canRequestRecheck(this.student.email);
      this.canRequest = canReq.allowed;
      this.canRequestMessage = canReq.reason || '';
      
      if (!this.canRequest) {
        this.submitError = this.canRequestMessage;
      }
    }
  }

  /**
   * Load status summary
   */
  loadStatusSummary(): void {
    if (this.student?.email) {
      this.statusSummary = this.requestRecheckService.getStatusSummary(this.student.email);
      console.log('✓ Status summary loaded:', this.statusSummary);
    }
  }

  /**
   * Update marks when subject changes
   */
  onSubjectChange(): void {
    const marks = this.subjectMarks[this.recheck.subject] || 0;
    this.recheck.marksObtained = marks;
  }

  /**
   * Submit recheck request
   */
  submitRecheck(): void {
    if (!this.canRequest) {
      this.submitError = this.canRequestMessage || 'You cannot request recheck at this time.';
      return;
    }

    if (!this.recheck.rollNo) {
      this.submitError = 'Student information missing. Please reload the page.';
      return;
    }
    if (!this.recheck.subject) {
      this.submitError = 'Please select a subject';
      return;
    }
    if (!this.recheck.reason || this.recheck.reason.trim().length < 10) {
      this.submitError = 'Please provide at least 10 characters for reason';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const recheckRequest = {
      studentId: this.student?.studentId || 0,
      studentEmail: this.student?.email || '',
      studentName: this.student?.name || '',
      rollNo: this.recheck.rollNo,
      subject: this.recheck.subject,
      reason: this.recheck.reason,
      marksObtained: this.recheck.marksObtained,
      maxMarks: 100,
      status: 'pending' as const,
      requestDate: new Date().toISOString()
    };

    this.requestRecheckService.addRecheck(recheckRequest).subscribe({
      next: (response) => {
        console.log('✓ Recheck request submitted:', response);
        this.submitSuccess = true;
        this.isSubmitting = false;
        
        // Update status summary
        this.loadStatusSummary();
        
        // Reset form
        setTimeout(() => {
          this.recheck = {
            rollNo: this.student?.rollNo || '',
            subject: '',
            reason: '',
            marksObtained: 0,
            maxMarks: 100
          };
          this.submitSuccess = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error submitting recheck:', err);
        this.submitError = 'Failed to submit recheck request. Please try again.';
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Get status badge color
   */
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'warn',
      'approved': 'accent',
      'completed': 'primary',
      'rejected': 'warn'
    };
    return colors[status] || 'primary';
  }
}