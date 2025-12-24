import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../core/services/student.service';
import { SubjectService } from '../../../core/services/subject.service';
import { ClassesService } from '../../../core/services/classes.service';
import { MarksService } from '../../../core/services/marks.service';
import { Student } from '../../../core/models/student.model';
import { GetMarkForSubjectPipe } from '../../../shared/pipes/get-mark-for-subject.pipe';

@Component({
  selector: 'app-add-marks',
  templateUrl: './add-marks.component.html',
  styleUrls: ['./add-marks.component.css'],
  standalone: false
})
export class AddMarksComponent implements OnInit {

  student: Student | null = null;
  subjects: any[] = [];
  studentClassNumber: number = 0;
  studentClass: any = null;
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  submitError: string = '';
  submittedMarks: any[] = [];
  isSearching: boolean = false;
  lastSubmittedRollNo: string = ''; // Track last submitted roll number
  isAlreadySubmitted: boolean = false; // Track if marks already submitted for this student
  existingMarks: any[] = []; // Store existing marks for the student

  marksData: { [key: string]: number | null } = {};
  rollNo: string = '';

  private normalizeSubjectKey(value: string | null | undefined): string {
    return (value || '').toString().trim().toLowerCase();
  }

  private findExistingMarkForSubject(subject: any): any {
    const subjectId = subject?.subjectId ?? subject?.id;
    if (subjectId != null) {
      const byId = this.existingMarks.find((m: any) => (m?.subjectId ?? m?.id) === subjectId);
      if (byId) return byId;
    }

    const subjectKey = subject?.subjectName || subject?.name;
    return this.existingMarks.find((m: any) =>
      this.normalizeSubjectKey(m?.subject) === this.normalizeSubjectKey(subjectKey)
    );
  }

  constructor(
    private studentService: StudentService,
    private subjectService: SubjectService,
    private classesService: ClassesService,
    private marksService: MarksService
  ) {}

  ngOnInit(): void {
    // Reset on component initialization (on page load/refresh)
    this.resetForm();
  }

  searchStudent(): void {
    if (!this.rollNo.trim()) {
      this.submitError = 'Please enter a roll number';
      this.student = null;
      this.subjects = [];
      this.marksData = {};
      this.isAlreadySubmitted = false;
      return;
    }

    this.isSearching = true;
    this.isAlreadySubmitted = false;
    this.submitError = ''; // Clear any previous error messages
    console.log(`🔍 Searching for student: ${this.rollNo}`);
    
    // First try local sync data
    let allStudents = this.studentService.getAllStudentsSync();
    let foundStudent = allStudents.find(s => s.rollNo.toLowerCase() === this.rollNo.toLowerCase());

    // If not found locally, try backend API
    if (!foundStudent) {
      console.log('⚠️ Student not found in cache, querying backend API...');
      
      this.studentService.getAllStudents().subscribe({
        next: (studentsFromApi: any) => {
          console.log(`✓ Backend API returned ${studentsFromApi.length} students`);
          
          // Search in API results
          foundStudent = studentsFromApi.find((s: any) => 
            s.rollNo && s.rollNo.toLowerCase() === this.rollNo.toLowerCase()
          );
          
          if (!foundStudent) {
            this.submitError = `Student with roll number ${this.rollNo} not found in database`;
            this.subjects = [];
            this.marksData = {};
            this.studentClass = null;
            this.isSearching = false;
            console.error(`✗ Student ${this.rollNo} not found in backend`);
            return;
          }
          
          // Found in backend - process student
          this.processStudentData(foundStudent);
        },
        error: (err: any) => {
          console.error('✗ Error querying backend:', err);
          this.submitError = 'Error searching student. Please try again.';
          this.isSearching = false;
        }
      });
      return;
    }

    // Found in local cache - process immediately
    console.log(`✓ Student found in cache: ${foundStudent.name}`);
    this.processStudentData(foundStudent);
  }

  /**
   * Process student data after search
   */
  private processStudentData(foundStudent: any): void {
    this.student = foundStudent;
    this.submitError = '';
    
    if (!this.student) {
      this.submitError = 'Student data is invalid';
      this.isSearching = false;
      return;
    }
    
    // Extract class number and load subjects
    const classMatch = this.student.className?.match(/Class\s(\d+)/);
    this.studentClassNumber = classMatch ? parseInt(classMatch[1]) : 0;
    
    console.log(`✓ Student found: ${this.student.name}`);
    console.log(`📚 Class Number: ${this.studentClassNumber}`);
    
    // Load existing marks for this student
    this.loadExistingMarks();
    
    // Load class details including subject list
    this.classesService.getClassByNumber(this.studentClassNumber).subscribe({
      next: (response: any) => {
        const classData = response.data;
        this.studentClass = classData;
        
        console.log('✓ Class data loaded:', classData);
        
        // Load subjects from backend so we get REAL subjectId values.
        // (Do NOT fabricate IDs from the class's comma-separated list.)
        if (classData && classData.subjectList) {
          const subjectNames = classData.subjectList.split(',').map((s: string) => s.trim()).filter(Boolean);
          console.log('📖 Subjects from class definition:', subjectNames);

          this.subjectService.getSubjectsByClass(this.studentClassNumber).subscribe({
            next: (subjectsResponse: any) => {
              const subjectsArray = Array.isArray(subjectsResponse?.data) ? subjectsResponse.data : [];

              // If backend returns nothing, fall back to showing names (but submission will be blocked without IDs)
              if (!subjectsArray || subjectsArray.length === 0) {
                console.warn('⚠️ No subjects returned from backend; falling back to class subject names without IDs');
                this.subjects = subjectNames.map((name: string) => ({
                  subjectId: null,
                  subjectName: name,
                  name
                }));
              } else {
                // Backend might return more than this class needs; enforce class subjectList order strictly.
                const subjectByName = new Map<string, any>();
                subjectsArray.forEach((s: any) => {
                  const key = this.normalizeSubjectKey(s?.subjectName || s?.name);
                  if (key && !subjectByName.has(key)) {
                    subjectByName.set(key, s);
                  }
                });

                this.subjects = subjectNames.map((name: string) => {
                  const key = this.normalizeSubjectKey(name);
                  return subjectByName.get(key) || { subjectId: null, subjectName: name, name };
                });
              }

              // Initialize marks data with existing marks if available (match by subject name)
              this.marksData = {};
              this.subjects.forEach((s: any) => {
                const subjectKey = s.subjectName || s.name;
                const existingMark = this.findExistingMarkForSubject(s);
                this.marksData[subjectKey] = existingMark ? existingMark.marksObtained : null;
              });

              console.log(`✓ Loaded ${this.subjects.length} subjects for Class ${this.studentClassNumber}`);
              this.isSearching = false;
            },
            error: (err: any) => {
              console.error('Error loading subjects by class:', err);
              this.loadSubjectsByClass();
            }
          });
          return;
        }

        // Fallback: Load subjects by class from service
        console.log('ℹ️ No subjects in class definition, using fallback...');
        this.loadSubjectsByClass();
      },
      error: (err) => {
        console.error('Error loading class details:', err);
        // Fallback to service-based subject loading
        this.loadSubjectsByClass();
      }
    });
  }

  /**
   * Load existing marks for the student
   */
  private loadExistingMarks(): void {
    if (!this.student || !this.student.studentId) return;

    // 🔄 Fetch fresh marks from backend (not cached)
    this.marksService.getMarksByStudentId(this.student.studentId as number).subscribe({
      next: (response: any) => {
        this.existingMarks = response.data || [];
        console.log(`✓ Found ${this.existingMarks.length} existing marks for student:`, this.existingMarks);
        
        // Initialize marks data with existing marks and disable fields
        this.marksData = {};
        this.subjects.forEach((s: any) => {
          const subjectKey = s.subjectName || s.name;
          const existingMark = this.findExistingMarkForSubject(s);
          // Pre-fill with existing marks value (read-only will be enforced via [disabled])
          this.marksData[subjectKey] = existingMark ? existingMark.marksObtained : null;
        });
      },
      error: (err) => {
        console.warn('⚠️ Could not load existing marks:', err);
        this.existingMarks = [];
      }
    });
  }

  /**
   * Load subjects by class (fallback method)
   */
  private loadSubjectsByClass(): void {
    this.subjectService.getSubjectsByClass(this.studentClassNumber).subscribe({
      next: (response: any) => {
        const subjectsArray = Array.isArray(response.data) ? response.data : [];
        this.subjects = subjectsArray;
        
        // Initialize marks data
        this.marksData = {};
        this.subjects.forEach((s: any) => {
          this.marksData[s.subjectName || s.name] = null;
        });
        
        console.log('✓ Fallback: Loaded subjects from service');
        console.log(`✓ Total ${subjectsArray.length} subjects for Class ${this.studentClassNumber}`);
        this.isSearching = false;
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.submitError = 'Could not load subjects for this class';
        this.subjects = [];
        this.marksData = {};
        this.isSearching = false;
      }
    });
  }

  resetForm(): void {
    this.rollNo = '';
    this.student = null;
    this.subjects = [];
    this.marksData = {};
    this.submitError = '';
    this.submitSuccess = false;
    this.submittedMarks = [];
    this.studentClass = null;
    this.isSearching = false;
    this.lastSubmittedRollNo = ''; // Reset on form clear
    this.isAlreadySubmitted = false;
  }

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
    let duplicate = 0;
    const totalSubjects = this.subjects.filter((s: any) => 
      this.marksData[s.subjectName || s.name] !== null && 
      this.marksData[s.subjectName || s.name] !== undefined
    ).length;

    console.log(`📊 Starting to submit ${totalSubjects} marks for student ${this.student.name}`);

    // Submit marks for each subject
    this.subjects.forEach((subject: any) => {
      const subjectName = subject.subjectName || subject.name;
      const marks = this.marksData[subjectName];
      
      if (marks !== null && marks !== undefined) {
        // Use correct subject ID (subjectId not subject name)
        const subjectId = subject.subjectId || subject.id;
        const studentId = this.student?.studentId;

        if (!subjectId) {
          failed++;
          this.submittedMarks.push({ subject: subjectName, marks, status: 'failed', message: 'Missing subject ID' });
          console.error(`❌ Cannot submit marks: missing subjectId for ${subjectName}`);
          if (submitted + failed + duplicate === totalSubjects) {
            this.completeSubmission(submitted, failed, duplicate);
          }
          return;
        }
        
        console.log(`📤 Submitting: Student ${studentId}, Subject ${subjectId} (${subjectName}), Marks ${marks}`);
        
        const markRecord = {
          studentId: studentId,
          subjectId: subjectId,
          marksObtained: marks,
          maxMarks: 100,
          term: 'Term 1',
          year: 2024
        };

        this.marksService.createMarks(markRecord as any).subscribe({
          next: (response: any) => {
            submitted++;
            this.submittedMarks.push({ subject: subjectName, marks, status: 'success' });
            console.log(`✓ Mark added for ${subjectName}: ${marks}/100`, response);

            // If all marks submitted/processed
            if (submitted + failed + duplicate === totalSubjects) {
              this.completeSubmission(submitted, failed, duplicate);
            }
          },
          error: (err: any) => {
            const errorMessage = (err.error?.message || err.error || err.message || '').toString();

            console.error(`❌ Error adding mark for ${subjectName}:`, {
              status: err.status,
              statusText: err.statusText,
              message: errorMessage,
              fullError: err
            });

            // Check if it's a "duplicate/already added" error
            if (errorMessage.toLowerCase().includes('already added') || errorMessage.toLowerCase().includes('cannot add duplicate')) {
              duplicate++;
              this.submittedMarks.push({ subject: subjectName, marks, status: 'duplicate', message: 'Already added' });
              console.warn(`⚠️ Mark already exists for ${subjectName}`);
            } else {
              failed++;
              this.submittedMarks.push({ subject: subjectName, marks, status: 'failed' });
            }

            // If all marks processed
            if (submitted + failed + duplicate === totalSubjects) {
              this.completeSubmission(submitted, failed, duplicate);
            }
          }
        });
      }
    });
  }

  private completeSubmission(submitted: number, failed: number, duplicate: number): void {
    this.isSubmitting = false;

    // If at least one mark successfully saved, treat as success
    if (submitted > 0 && failed === 0) {
      this.lastSubmittedRollNo = this.rollNo.toLowerCase();
      this.submitSuccess = true;
      let msg = `✓ Success! ${submitted} mark(s) added.`;
      if (duplicate > 0) {
        msg += ` ${duplicate} already existed (not added again).`;
      }
      this.submitError = '';
      console.log(`✓ Marks submission complete for ${this.rollNo}: ${msg}`);

      // 🔄 Refresh existing marks so the "Already Added" badge appears
      this.loadExistingMarks();

      setTimeout(() => {
        this.resetForm();
      }, 2000);
      return;
    }

    // If nothing saved but duplicates exist
    if (submitted === 0 && duplicate > 0 && failed === 0) {
      this.submitSuccess = false;
      this.submitError = `❌ All marks were already added for this student. No new marks added.`;
      return;
    }

    // Some failures occurred
    this.submitSuccess = false;
    if (failed > 0 && duplicate > 0) {
      this.submitError = `${submitted} added, ${duplicate} already existed, ${failed} failed. Please check and try again.`;
    } else if (failed > 0) {
      this.submitError = `${submitted} added, ${failed} failed. Please try again.`;
    } else {
      this.submitError = 'Error occurred. Please try again.';
    }
  }
}