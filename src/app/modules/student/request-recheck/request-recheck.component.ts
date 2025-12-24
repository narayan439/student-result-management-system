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
  subjectsWithPendingRecheck: Set<string> = new Set();
  
  recheck = {
    rollNo: '',
    subject: '',
    reason: '',
    marksObtained: null as any,  // null = not yet selected, 0 = actually no marks
    maxMarks: 100,
    marksId: 0
  };
  
  studentMarksData: { [key: string]: { marksId: number; marksObtained: number } } = {};

  constructor(
    private studentService: StudentService,
    private subjectService: SubjectService,
    private marksService: MarksService,
    private requestRecheckService: RequestRecheckService,
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Get marks ID for a specific subject
   * This function retrieves the marks ID from the loaded marks data
   * @param subjectName The name of the subject
   * @returns The marks ID if found, 0 if not found
   */
  getMarksIdForSubject(subjectName: string): number {
    console.log('🔍 getMarksIdForSubject() called with subject:', `"${subjectName}"`);
    
    if (!subjectName || subjectName.trim().length === 0) {
      console.warn('  ⚠️ Subject name is empty');
      return 0;
    }

    // Try exact match
    if (this.studentMarksData[subjectName]) {
      const marksId = this.studentMarksData[subjectName].marksId;
      console.log(`  ✓ Exact match found - marksId: ${marksId}`);
      return marksId;
    }

    // Try case-insensitive match
    const keys = Object.keys(this.studentMarksData);
    for (const key of keys) {
      if (key.toLowerCase() === subjectName.toLowerCase()) {
        const marksId = this.studentMarksData[key].marksId;
        console.log(`  ✓ Case-insensitive match: "${key}" - marksId: ${marksId}`);
        return marksId;
      }
    }

    // Try whitespace-corrected match
    for (const key of keys) {
      if (key.trim().toLowerCase() === subjectName.trim().toLowerCase()) {
        const marksId = this.studentMarksData[key].marksId;
        console.log(`  ✓ Whitespace-corrected match: "${key}" - marksId: ${marksId}`);
        return marksId;
      }
    }

    console.error(`  ❌ No marks found for subject: "${subjectName}"`);
    console.error(`  Available subjects: ${keys.join(', ')}`);
    return 0;
  }

  /**
   * Get marks obtained for a specific subject
   * @param subjectName The name of the subject
   * @returns The marks obtained if found, null if not found
   */
  getMarksObtainedForSubject(subjectName: string): number | null {
    console.log('🔍 getMarksObtainedForSubject() called with subject:', `"${subjectName}"`);
    
    if (!subjectName || subjectName.trim().length === 0) {
      console.warn('  ⚠️ Subject name is empty');
      return null;
    }

    // Try exact match
    if (this.studentMarksData[subjectName]) {
      const marksObtained = this.studentMarksData[subjectName].marksObtained;
      console.log(`  ✓ Exact match found - marksObtained: ${marksObtained}`);
      return marksObtained;
    }

    // Try case-insensitive match
    const keys = Object.keys(this.studentMarksData);
    for (const key of keys) {
      if (key.toLowerCase() === subjectName.toLowerCase()) {
        const marksObtained = this.studentMarksData[key].marksObtained;
        console.log(`  ✓ Case-insensitive match: "${key}" - marksObtained: ${marksObtained}`);
        return marksObtained;
      }
    }

    // Try whitespace-corrected match
    for (const key of keys) {
      if (key.trim().toLowerCase() === subjectName.trim().toLowerCase()) {
        const marksObtained = this.studentMarksData[key].marksObtained;
        console.log(`  ✓ Whitespace-corrected match: "${key}" - marksObtained: ${marksObtained}`);
        return marksObtained;
      }
    }

    console.error(`  ❌ No marks found for subject: "${subjectName}"`);
    console.error(`  Available subjects: ${keys.join(', ')}`);
    return null;
  }

  ngOnInit(): void {
    this.loadStudentAndSubjects();
  }

  loadStudentAndSubjects(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'STUDENT') {
      this.router.navigate(['/login']);
      return;
    }

    // Get student by email
    let students = this.studentService.getAllStudentsSync();
    
    // If cache is empty, refresh from backend
    if (!students || students.length === 0) {
      console.log('⚠️ Student cache is empty, refreshing from backend...');
      this.studentService.refreshStudents().subscribe({
        next: (refreshedStudents) => {
          this.findAndLoadStudent(currentUser.email, refreshedStudents);
        },
        error: (err) => {
          console.error('❌ Failed to refresh student data:', err);
          alert('Student profile not found. Please login again.');
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    this.findAndLoadStudent(currentUser.email, students);
  }

  /**
   * Find and load student data by email
   */
  private findAndLoadStudent(email: string, students: any[]): void {
    this.student = students.find(s => s.email === email) || null;

    if (this.student) {
      this.recheck.rollNo = this.student.rollNo;
      
      // Extract class number from className (e.g., "Class 5" -> 5)
      const classMatch = this.student.className.match(/Class\s(\d+)/);
      this.studentClassNumber = classMatch ? parseInt(classMatch[1]) : 0;
      
      console.log('📚 Loading subjects for class:', this.studentClassNumber);
      
      // FIRST: Load student marks (this is critical for filtering subjects)
      console.log('🔄 Step 1: Loading student marks first...');
      this.loadStudentMarks();
      
      // THEN: Load class-specific subjects and filter by marks
      console.log('🔄 Step 2: Loading subjects for the class...');
      this.loadSubjectsForClass();
      
      // Check if student can request recheck
      this.checkCanRequestRecheck();
      
      // Load status summary
      this.loadStatusSummary();
    } else {
      alert('Student profile not found. Please login again.');
      this.router.navigate(['/login']);
      return;
    }
  }

  /**
   * Load subjects for this class and filter by marks
   */
  private loadSubjectsForClass(): void {
    console.log('📚 ===== LOADING SUBJECTS FOR CLASS =====');
    console.log('Current class number:', this.studentClassNumber);
    console.log('Current subjectMarks map:', this.subjectMarks);
    
    this.subjectService.getSubjectsByClass(this.studentClassNumber).subscribe({
      next: (response: any) => {
        console.log('📥 Raw subjects response received:', response);
        
        let subjectsArray: any[] = [];
        
        // Handle different response formats
        if (Array.isArray(response)) {
          console.log('✓ Response is direct array');
          subjectsArray = response;
        } else if (response?.data && Array.isArray(response.data)) {
          console.log('✓ Response has data array property');
          subjectsArray = response.data;
        } else {
          console.log('⚠️ Could not extract subjects from response');
          subjectsArray = [];
        }
        
        console.log(`📊 Received ${subjectsArray.length} total subjects for Class ${this.studentClassNumber}`);
        
        // Filter to only show subjects that have marks AND don't have pending rechecks
        console.log('\n🔍 Filtering subjects by marks availability and pending rechecks:');
        const subjectsWithMarks = subjectsArray.filter((subject: any) => {
          const subjectName = subject.subjectName || subject.name || '';
          const hasMarks = this.subjectMarks[subjectName] !== undefined && this.subjectMarks[subjectName] > 0;
          const hasPendingRecheck = this.subjectsWithPendingRecheck.has(subjectName);
          
          console.log(`  "${subjectName}": marks=${hasMarks ? '✓' : '✗'}, pending=${hasPendingRecheck ? '⚠️' : '✓'}`);
          if (hasMarks) {
            console.log(`      Found in subjectMarks with value: ${this.subjectMarks[subjectName]}`);
          }
          if (hasPendingRecheck) {
            console.log(`      Already has pending recheck - EXCLUDED`);
          }
          return hasMarks && !hasPendingRecheck;
        });
        
        this.subjects = subjectsWithMarks;
        console.log(`\n✅ Filtered to ${subjectsWithMarks.length} subjects with marks (excluding pending)`);
        console.log(`   Dropdown will show:`, subjectsWithMarks.map((s: any) => s.subjectName));
        
        if (subjectsWithMarks.length === 0) {
          console.warn('⚠️ No subjects with marks found in class list');
          // Show all active subjects as fallback
          this.loadAllActiveSubjectsWithMarks();
        }
      },
      error: (err) => {
        console.error('❌ Error loading subjects from /class endpoint:', err);
        console.log('Trying fallback to /active endpoint...');
        // Fallback to all active subjects with marks
        this.loadAllActiveSubjectsWithMarks();
      }
    });
  }

  /**
   * Load all active subjects and filter by marks
   */
  private loadAllActiveSubjectsWithMarks(): void {
    console.log('🔄 Loading all active subjects with marks filter...');
    
    this.subjectService.getAllActiveSubjects().subscribe({
      next: (response: any) => {
        console.log('📥 Active subjects response:', response);
        
        let subjectsArray: any[] = [];
        
        if (Array.isArray(response)) {
          console.log('✓ Response is direct array');
          subjectsArray = response;
        } else if (response?.data && Array.isArray(response.data)) {
          console.log('✓ Response has data array property');
          subjectsArray = response.data;
        } else {
          console.log('⚠️ Could not extract subjects from response');
          subjectsArray = [];
        }
        
        console.log(`📊 Received ${subjectsArray.length} total active subjects`);
        
        // Filter to only show subjects that have marks AND don't have pending rechecks
        const subjectsWithMarks = subjectsArray.filter((subject: any) => {
          const subjectName = subject.subjectName || subject.name || '';
          const hasMarks = this.subjectMarks[subjectName] !== undefined && this.subjectMarks[subjectName] > 0;
          const hasPendingRecheck = this.subjectsWithPendingRecheck.has(subjectName);
          console.log(`  ${subjectName}: marks=${hasMarks ? '✓' : '✗'}, pending=${hasPendingRecheck ? '⚠️' : '✓'}`);
          return hasMarks && !hasPendingRecheck;
        });
        
        this.subjects = subjectsWithMarks;
        console.log(`✅ Filtered to ${subjectsWithMarks.length} subjects with marks (excluding pending)`);
        
        if (subjectsWithMarks.length === 0) {
          console.error('❌ No subjects with marks found! Student may not have any marks yet.');
        }
      },
      error: (err) => {
        console.error('❌ Error loading active subjects:', err);
        this.subjects = [];
      }
    });
  }

  loadStudentMarks(): void {
    console.log('📖 ===== LOADING STUDENT MARKS =====');
    
    if (!this.student) {
      console.error('❌ Student not available - cannot load marks');
      return;
    }

    const studentId = this.student.studentId;
    
    if (!studentId) {
      console.error('❌ Student ID is not available - cannot load marks');
      return;
    }
    
    console.log('🔄 Fetching marks for student ID:', studentId);

    // Use the marks service to get marks for this student
    this.marksService.getMarksByStudentId(studentId).subscribe({
      next: (response: any) => {
        console.log('📥 Raw response from backend:', response);
        console.log('  Type of response:', typeof response);
        console.log('  Is Array?', Array.isArray(response));
        
        let marksArray: any[] = [];
        
        // Handle different response formats
        if (Array.isArray(response)) {
          console.log('✓ Response is direct array');
          marksArray = response;
        } else if (response?.data && Array.isArray(response.data)) {
          console.log('✓ Response has data array property');
          marksArray = response.data;
        } else {
          console.log('⚠️ Could not extract marks array from response');
          marksArray = [];
        }
        
        console.log(`📊 Processing ${marksArray.length} marks from backend`);
        
        // Clear previous marks data
        this.subjectMarks = {};
        this.studentMarksData = {};
        
        // Process marks and populate maps
        marksArray.forEach((m: any, index: number) => {
          console.log(`\n  Mark ${index + 1}:`);
          console.log(`    Raw data:`, m);
          console.log(`    Keys in mark object:`, Object.keys(m));
          
          const subjectName = m.subject || m.subjectName || 'Unknown';
          const marksObtained = m.marksObtained || 0;
          const maxMarks = m.maxMarks || 100;
          const marksId = m.marksId || 0;
          
          console.log(`    Extracted: subject="${subjectName}", marksId=${marksId}, marksObtained=${marksObtained}`);
          console.log(`      - m.marksId value: ${m.marksId} (type: ${typeof m.marksId})`);
          console.log(`      - m.subject value: ${m.subject}`);
          console.log(`      - m.subjectName value: ${m.subjectName}`);
          console.log(`      - m.marksObtained value: ${m.marksObtained}`);
          
          if (marksId <= 0) {
            console.warn(`    ⚠️ SKIPPING: Invalid marksId: ${marksId}`);
            return;
          }
          
          this.subjectMarks[subjectName] = marksObtained;
          this.studentMarksData[subjectName] = {
            marksId: marksId,
            marksObtained: marksObtained
          };
          
          console.log(`    ✓ Stored in maps with key: "${subjectName}"`);
          console.log(`      - subjectMarks["${subjectName}"] = ${this.subjectMarks[subjectName]}`);
          console.log(`      - studentMarksData["${subjectName}"] = `, this.studentMarksData[subjectName]);
        });
        
        console.log(`\n✅ Marks loading complete`);
        console.log(`   Total subjects with marks: ${Object.keys(this.subjectMarks).length}`);
        console.log(`   Subject names in map:`, Object.keys(this.subjectMarks));
        console.log(`   Full subjectMarks:`, this.subjectMarks);
        console.log(`   Full studentMarksData:`, this.studentMarksData);
        console.log(`   studentMarksData entries:`, Object.entries(this.studentMarksData));
        
        // Log each entry for clarity
        if (Object.keys(this.studentMarksData).length > 0) {
          console.log('📋 Detailed marks storage:');
          Object.entries(this.studentMarksData).forEach(([key, value]) => {
            console.log(`   "${key}": marksId=${value.marksId}, marksObtained=${value.marksObtained}`);
          });
        }
        
        // Now that marks are loaded, load subjects and filter them
        this.loadSubjectsForClass();
      },
      error: (err) => {
        console.error('❌ Error loading marks from backend:', err);
        console.log('Error message:', err.message);
        console.log('Error status:', err.status);
        console.log('Error response:', err.error);
        
        // Continue to load subjects even if marks fail
        this.loadSubjectsForClass();
      }
    });
  }

  checkCanRequestRecheck(): void {
    if (this.student?.email) {
      const canReq = this.requestRecheckService.canRequestRecheck(this.student.email);
      this.canRequest = canReq.allowed;
      this.canRequestMessage = canReq.reason || '';
      
      if (!this.canRequest) {
        this.submitError = this.canRequestMessage;
      }
    }
    
    // Load existing recheck requests to populate pending subjects
    this.loadExistingRecheckRequests();
  }

  /**
   * Load existing recheck requests from backend
   * Populates subjectsWithPendingRecheck Set to track subjects that already have pending rechecks
   */
  private loadExistingRecheckRequests(): void {
    if (!this.student || !this.student.studentId) {
      console.warn('⚠️ Student or studentId not available');
      return;
    }

    console.log('🔄 Loading existing recheck requests for student:', this.student.studentId);
    
    this.requestRecheckService.getRechecksByStudentId(this.student.studentId).subscribe({
      next: (response: any) => {
        console.log('📥 Recheck requests response:', response);
        
        let requestsArray: any[] = [];
        
        // Handle different response formats
        if (Array.isArray(response)) {
          console.log('✓ Response is direct array');
          requestsArray = response;
        } else if (response?.data && Array.isArray(response.data)) {
          console.log('✓ Response has data array property');
          requestsArray = response.data;
        } else {
          console.log('⚠️ Could not extract requests from response');
          requestsArray = [];
        }
        
        console.log(`📊 Found ${requestsArray.length} total recheck requests`);
        
        // Extract subjects with pending rechecks
        requestsArray.forEach((req: any) => {
          const status = req.status?.toUpperCase() || 'PENDING';
          console.log(`  Checking request: ${req.subject} - Status: ${status}`);
          
          // If status is PENDING or no resolved date, add to pending set
          if (status === 'PENDING' || !req.resolvedDate) {
            this.subjectsWithPendingRecheck.add(req.subject);
            console.log(`    ✓ Added to pending set: ${req.subject}`);
          }
        });
        
        console.log(`✅ Loaded ${this.subjectsWithPendingRecheck.size} subjects with pending rechecks`);
        console.log(`   Pending subjects:`, Array.from(this.subjectsWithPendingRecheck));
      },
      error: (err) => {
        console.error('❌ Error loading existing recheck requests:', err);
        // Don't fail silently - log but continue
      }
    });
  }

  loadStatusSummary(): void {
    if (this.student?.email) {
      this.statusSummary = this.requestRecheckService.getStatusSummary(this.student.email);
    }
  }

  onSubjectChange(): void {
    console.log('\n🔄 ===== SUBJECT CHANGE TRIGGERED =====');
    console.log('Timestamp:', new Date().toISOString());
    
    const selectedSubject = this.recheck.subject;
    console.log('Selected subject value:', `"${selectedSubject}"`);
    console.log('  Type:', typeof selectedSubject);
    console.log('  Length:', selectedSubject?.length);
    
    if (!selectedSubject || selectedSubject.trim().length === 0) {
      console.warn('⚠️ Selected subject is empty or not provided!');
      this.recheck.marksObtained = null;
      this.recheck.marksId = 0;
      this.submitError = 'Please select a valid subject';
      console.log('🔄 ===== SUBJECT CHANGE COMPLETE (empty subject) =====\n');
      return;
    }
    
    console.log('\n🔍 Using helper functions to retrieve marks data:');
    
    // Use the dedicated helper functions
    const marksId = this.getMarksIdForSubject(selectedSubject);
    const marksObtained = this.getMarksObtainedForSubject(selectedSubject);
    
    console.log('\n📌 Retrieved values:');
    console.log('  marksId:', marksId);
    console.log('  marksObtained:', marksObtained);
    
    if (marksId && marksId > 0 && marksObtained !== null) {
      this.recheck.marksObtained = marksObtained;
      this.recheck.marksId = marksId;
      this.submitError = ''; // Clear any previous error
      console.log('✅ SUCCESS - Marks populated:');
      console.log('   MarksId:', this.recheck.marksId);
      console.log('   MarksObtained:', this.recheck.marksObtained);
    } else {
      console.error('❌ FAILURE - Could not populate marks');
      console.log('   Available subjects in studentMarksData:', Object.keys(this.studentMarksData));
      console.log('   Full studentMarksData:', this.studentMarksData);
      
      this.recheck.marksObtained = null;
      this.recheck.marksId = 0;
      this.submitError = `No marks found for "${selectedSubject}". Available: ${Object.keys(this.studentMarksData).join(', ')}`;
    }
    
    console.log('\nUpdated recheck object:', {
      subject: this.recheck.subject,
      marksObtained: this.recheck.marksObtained,
      marksId: this.recheck.marksId
    });
    console.log('🔄 ===== SUBJECT CHANGE COMPLETE =====\n');
  }

  submitRecheck(): void {
    console.log('🔄 ===== STARTING RECHECK SUBMISSION =====');
    
    if (!this.canRequest) {
      this.submitError = this.canRequestMessage || 'You cannot request recheck at this time.';
      console.error('❌ Cannot request recheck:', this.submitError);
      return;
    }

    // Validation checks
    if (!this.student) {
      this.submitError = 'Student information missing. Please reload the page.';
      console.error('❌ Student not found');
      return;
    }

    if (!this.recheck.rollNo) {
      this.submitError = 'Student information missing. Please reload the page.';
      console.error('❌ Roll number not found');
      return;
    }

    if (!this.recheck.subject) {
      this.submitError = 'Please select a subject';
      console.error('❌ No subject selected');
      return;
    }

    // Check if subject already has a pending recheck
    if (this.subjectsWithPendingRecheck.has(this.recheck.subject)) {
      this.submitError = `❌ You have already requested recheck for "${this.recheck.subject}". Please wait for the result or contact your teacher.`;
      console.error('❌ Duplicate recheck request for subject:', this.recheck.subject);
      return;
    }

    if (!this.recheck.reason || this.recheck.reason.trim().length < 10) {
      this.submitError = 'Please provide at least 10 characters for reason';
      console.error('❌ Invalid reason provided');
      return;
    }

    // Check if marks were actually loaded
    console.log('\n🔍 Checking marks data:');
    console.log('  Total subjects with marks loaded:', Object.keys(this.studentMarksData).length);
    console.log('  Available subjects:', Object.keys(this.studentMarksData));
    console.log('  Current subject selected:', this.recheck.subject);
    console.log('  Current marksId:', this.recheck.marksId);
    console.log('  Current marksObtained:', this.recheck.marksObtained);
    console.log('  Full recheck object:', this.recheck);
    console.log('  Full studentMarksData:', this.studentMarksData);
    
    if (Object.keys(this.studentMarksData).length === 0) {
      this.submitError = '❌ No marks found for any subject. The student may not have any marks entered yet. Please contact your teacher to enter marks first.';
      console.error('❌ No marks loaded at all');
      return;
    }

    if (!this.recheck.marksId || this.recheck.marksId === 0 || this.recheck.marksId < 0) {
      console.error('❌ marksId is invalid:', this.recheck.marksId);
      console.error('   Looking up marks for subject:', this.recheck.subject);
      
      // Try to get marksId again using helper function
      const marksId = this.getMarksIdForSubject(this.recheck.subject);
      console.log('   Helper function returned marksId:', marksId);
      
      if (marksId && marksId > 0) {
        console.log('   ✓ Found marksId, using it:', marksId);
        this.recheck.marksId = marksId;
      } else {
        this.submitError = `❌ Marks ID is missing or invalid for "${this.recheck.subject}". Available subjects: ${Object.keys(this.studentMarksData).join(', ')}. Please select another subject and try again.`;
        console.error('❌ Unable to retrieve marksId');
        return;
      }
    }

    // All validations passed - proceed with submission
    console.log('✓ All validations passed');
    console.log('📋 Recheck request details:', {
      studentId: this.student.studentId,
      studentName: this.student.name,
      studentEmail: this.student.email,
      rollNo: this.recheck.rollNo,
      subject: this.recheck.subject,
      marksObtained: this.recheck.marksObtained,
      marksId: this.recheck.marksId,
      reason: this.recheck.reason
    });

    this.isSubmitting = true;
    this.submitError = '';

    const recheckRequest: any = {
      studentId: this.student.studentId || 0,
      marksId: this.recheck.marksId || 0,
      studentEmail: this.student.email || '',
      studentName: this.student.name || '',
      rollNo: this.recheck.rollNo,
      subject: this.recheck.subject,
      reason: this.recheck.reason,
      marksObtained: this.recheck.marksObtained,
      maxMarks: 100,
      status: 'PENDING' as const,
      requestDate: new Date().toISOString()
    };

    console.log('🔄 Sending recheck request to backend...');
    console.log('📤 Request payload:', recheckRequest);
    console.log('   marksId in payload:', recheckRequest.marksId);

    this.requestRecheckService.addRecheck(recheckRequest).subscribe({
      next: (response) => {
        console.log('✅ Recheck request submitted successfully');
        console.log('📥 Backend response:', response);
        
        this.submitSuccess = true;
        this.isSubmitting = false;
        
        // Update status summary
        this.loadStatusSummary();
        
        // Reset form after 3 seconds
        setTimeout(() => {
          console.log('🔄 Resetting form...');
          this.recheck = {
            rollNo: this.student?.rollNo || '',
            subject: '',
            reason: '',
            marksObtained: 0,
            maxMarks: 100,
            marksId: 0
          };
          this.submitSuccess = false;
        }, 3000);
      },
      error: (err) => {
        console.error('❌ Error submitting recheck request');
        console.log('❌ Error object:', err);
        console.log('❌ Error message:', err.message);
        console.log('❌ Error status:', err.status);
        console.log('❌ Error response:', err.error);
        
        // Provide user-friendly error message based on backend response
        let errorMessage = 'Failed to submit recheck request. Please try again.';
        
        // Try to get error message from backend response
        if (err.error?.message) {
          errorMessage = err.error.message;
        } else if (err.error?.error) {
          errorMessage = err.error.error;
        }
        
        // Handle status-specific errors
        if (err.status === 400) {
          if (!errorMessage.includes('Validation error') && !errorMessage.includes('Error:')) {
            errorMessage = 'Invalid request data. Please check your input and try again.';
          }
        } else if (err.status === 401) {
          errorMessage = 'Session expired. Please login again.';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else if (err.status === 403) {
          errorMessage = 'You are not allowed to submit recheck requests.';
        } else if (err.status === 409) {
          errorMessage = 'You have already submitted a recheck for this subject.';
        } else if (err.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        
        this.submitError = errorMessage;
        this.isSubmitting = false;
        console.log('📌 User-friendly error message:', this.submitError);
      }
    });
  }

  /**
   * Get pending subjects text for display
   * @returns Comma-separated list of subjects with pending rechecks
   */
  getPendingSubjectsText(): string {
    const subjects = Array.from(this.subjectsWithPendingRecheck);
    return subjects.join(', ');
  }
}