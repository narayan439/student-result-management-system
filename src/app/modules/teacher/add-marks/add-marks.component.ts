import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../core/services/student.service';
import { SubjectService } from '../../../core/services/subject.service';
import { MarksService } from '../../../core/services/marks.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-add-marks',
  templateUrl: './add-marks.component.html',
  styleUrls: ['./add-marks.component.css']
})
export class AddMarksComponent implements OnInit {

  student: Student | null = null;
  subjects: any[] = [];
  studentClassNumber: number = 0;
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: string = '';
  submittedMarks: any[] = [];

  marksData: { [key: string]: number | null } = {};
  rollNo: string = '';

  constructor(
    private studentService: StudentService,
    private subjectService: SubjectService,
    private marksService: MarksService
  ) {}

  ngOnInit(): void {}

  /**
   * Search student by roll number
   */
  searchStudent(): void {
    if (!this.rollNo.trim()) {
      this.submitError = 'Please enter a roll number';
      this.student = null;
      this.subjects = [];
      this.marksData = {};
      return;
    }

    const allStudents = this.studentService.getAllStudentsSync();
    this.student = allStudents.find(s => s.rollNo.toLowerCase() === this.rollNo.toLowerCase()) || null;

    if (!this.student) {
      this.submitError = `Student with roll number ${this.rollNo} not found`;
      this.subjects = [];
      this.marksData = {};
      return;
    }

    // Student found - extract class number and load subjects
    this.submitError = '';
    const classMatch = this.student.className.match(/Class\s(\d+)/);
    this.studentClassNumber = classMatch ? parseInt(classMatch[1]) : 0;
    
    // Load class-specific subjects
    this.subjects = this.subjectService.getSubjectsByClass(this.studentClassNumber);
    
    // Initialize marks data
    this.marksData = {};
    this.subjects.forEach(s => {
      this.marksData[s.subjectName] = null;
    });
    
    console.log('✓ Student found:', this.student);
    console.log(`✓ Loaded ${this.subjects.length} subjects for Class ${this.studentClassNumber}`);
  }

  /**
   * Reset form
   */
  resetForm(): void {
    this.rollNo = '';
    this.student = null;
    this.subjects = [];
    this.marksData = {};
    this.submitError = '';
    this.submitSuccess = false;
    this.submittedMarks = [];
  }

  /**
   * Submit all marks at once
   */
  submitAllMarks(): void {
    if (!this.student) {
      this.submitError = 'Please search for a student first';
      return;
    }

    // Validate at least one mark is entered
    const hasMarks = Object.values(this.marksData).some(m => m !== null && m !== undefined);
    if (!hasMarks) {
      this.submitError = 'Please enter marks for at least one subject';
      return;
    }

    // Validate all marks are between 0-100
    for (const [subject, marks] of Object.entries(this.marksData)) {
      if (marks !== null && marks !== undefined) {
        if (marks < 0 || marks > 100) {
          this.submitError = `Marks for ${subject} must be between 0 and 100`;
          return;
        }
      }
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submittedMarks = [];
    let submitted = 0;
    let failed = 0;

    // Submit marks for each subject
    Object.entries(this.marksData).forEach(([subject, marks]) => {
      if (marks !== null && marks !== undefined) {
        const markRecord = {
          studentId: String(this.student!.studentId),
          subject: subject,
          marksObtained: marks,
          maxMarks: 100,
          term: 'Term 1',
          year: 2024
        };

        this.marksService.addMark(markRecord as any).subscribe({
          next: (response) => {
            submitted++;
            this.submittedMarks.push({ subject, marks, status: 'success' });
            console.log(`✓ Mark added for ${subject}:`, response);

            // If all marks submitted successfully
            if (submitted + failed === Object.keys(this.marksData).length) {
              this.completeSubmission(submitted, failed);
            }
          },
          error: (err) => {
            failed++;
            this.submittedMarks.push({ subject, marks, status: 'failed' });
            console.error(`Error adding mark for ${subject}:`, err);

            // If all marks processed
            if (submitted + failed === Object.keys(this.marksData).length) {
              this.completeSubmission(submitted, failed);
            }
          }
        });
      }
    });
  }

  private completeSubmission(submitted: number, failed: number): void {
    this.isSubmitting = false;

    if (failed === 0) {
      this.submitSuccess = true;
      setTimeout(() => {
        this.resetForm();
      }, 2000);
    } else {
      this.submitError = `${submitted} marks added, ${failed} failed. Please try again.`;
    }
  }
}
