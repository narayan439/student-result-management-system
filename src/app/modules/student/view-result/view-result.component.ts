import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { MarksService } from '../../../core/services/marks.service';
import { SubjectService } from '../../../core/services/subject.service';
import { forkJoin } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.css']
})
export class ViewResultComponent implements OnInit {

  result: any = {};
  qrData: string = '';
  student: any = null;
  classNumber: number = 0;
  marks: any[] = [];
  classSubjects: any[] = [];
  
  // Loading and error states
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  
  // Track data source
  marksSource: string = 'unknown';
  marksMessage: string = '';

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private studentService: StudentService,
    private marksService: MarksService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    console.log('📖 ViewResultComponent initializing...');
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    
    // Get parameters from route
    let rollNo = this.route.snapshot.paramMap.get('rollNo');
    let studentEmail = this.route.snapshot.paramMap.get('email');

    console.log('Route params:', { rollNo, studentEmail });

    // Load student data directly from backend using rollNo
    if (!rollNo) {
      console.error('❌ No rollNo provided in route parameters');
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = 'Invalid URL. Roll number is required.';
      setTimeout(() => this.router.navigate(['/welcome']), 2000);
      return;
    }

    console.log('🔄 Loading student data from backend using rollNo:', rollNo);
    this.studentService.getStudentByRollNo(rollNo).subscribe({
      next: (student) => {
        console.log('✓ Student loaded from backend:', student);
        this.student = student;
        this.loadStudentDataAndMarks();
      },
      error: (err) => {
        console.error('❌ Error loading student from backend:', err);
        console.log('Falling back to local cached data...');
        
        // Fallback: Try to get from cache
        const students = this.studentService.getAllStudentsSync();
        
        if (students && students.length > 0) {
          let foundStudent = students.find(s => s.rollNo === rollNo);
          if (!foundStudent && studentEmail) {
            foundStudent = students.find(s => s.email === studentEmail);
          }
          
          if (foundStudent) {
            console.log('✓ Student found in cache:', foundStudent);
            this.student = foundStudent;
            this.loadStudentDataAndMarks();
          } else {
            this.isLoading = false;
            this.hasError = true;
            this.errorMessage = 'Student not found. Please check the roll number and try again.';
            console.error('❌ Student not found in cache either');
          }
        } else {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage = 'Unable to load student data. Please try again.';
          console.error('❌ No cached students available');
        }
      }
    });
  }

  /**
   * Load student data and marks using parallel loading
   */
  private loadStudentDataAndMarks(): void {
    if (!this.student) {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = 'Student data not available';
      console.error('❌ Student data not available');
      return;
    }

    console.log('✓ Student loaded:', this.student.name, '(ID:', this.student.studentId, ')');
    
    // Extract class number
    const classMatch = this.student.className.match(/Class\s(\d+)/);
    this.classNumber = classMatch ? parseInt(classMatch[1]) : 1;
    console.log('📚 Class number:', this.classNumber);

    // Generate QR data
    this.qrData = `ROLL:${this.student.rollNo},EMAIL:${this.student.email},CLASS:${this.student.className}`;
    console.log('✓ QR data generated');

    // Load marks and subjects in parallel
    console.log('🔄 Loading marks and subjects in parallel...');
    
    forkJoin({
      marks: this.marksService.getMarksByStudentId(this.student.studentId),
      subjects: this.subjectService.getSubjectsByClass(this.classNumber)
    }).subscribe({
      next: (data) => {
        console.log('✓ Both marks and subjects loaded successfully');
        console.log('Marks response:', data.marks);
        
        // Determine data source and message
        if (data.marks?.source) {
          this.marksSource = data.marks.source;
          this.marksMessage = data.marks?.message || '';
          console.log(`📊 DATA SOURCE: ${this.marksSource.toUpperCase()}`);
          console.log(`📝 MESSAGE: ${this.marksMessage}`);
        }
        
        // ============ PROCESS MARKS ============
        let marksArray: any[] = [];
        
        // Extract marks array from response
        if (Array.isArray(data.marks)) {
          marksArray = data.marks;
        } else if (data.marks?.data && Array.isArray(data.marks.data)) {
          marksArray = data.marks.data;
        } else if (data.marks?.success !== false && data.marks?.data) {
          if (Array.isArray(data.marks.data)) {
            marksArray = data.marks.data;
          }
        }
        
        this.marks = marksArray;
        console.log(`✓ Marks array set: ${marksArray.length} marks loaded`);
        
        // ============ PROCESS SUBJECTS ============
        let subjectsArray: any[] = [];
        if (Array.isArray(data.subjects)) {
          subjectsArray = data.subjects;
        } else if (data.subjects?.data && Array.isArray(data.subjects.data)) {
          subjectsArray = data.subjects.data;
        }
        
        this.classSubjects = subjectsArray;
        console.log(`✓ Loaded ${subjectsArray.length} subjects for Class ${this.classNumber}`);
        
        // Process the result
        this.processResult();
        
        // Set loading to false - ALWAYS show content even if no marks
        this.isLoading = false;
        this.hasError = false; // Reset error state
      },
      error: (err) => {
        console.error('❌ Error loading marks or subjects:', err);
        
        // Set empty arrays and continue
        this.marks = [];
        this.classSubjects = [];
        this.processResult();
        
        // Don't set hasError to true - still show the result container
        this.isLoading = false;
        this.hasError = false;
        this.marksMessage = 'Failed to load marks data. Please try refreshing.';
      }
    });
  }

  /**
   * Refresh marks - reload marks data
   */
  refreshMarks(): void {
    console.log('🔄 Refreshing marks data...');
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';

    if (!this.student) {
      console.error('❌ Student data not available for marks refresh');
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = 'Student data not available. Please reload the page.';
      return;
    }

    console.log('Reloading marks for student ID:', this.student.studentId);
    this.marksService.getMarksByStudentId(this.student.studentId).subscribe({
      next: (marksResponse: any) => {
        console.log('✓ Marks response received:', marksResponse);
        
        let marksArray: any[] = [];
        
        // Update source info
        if (marksResponse?.source) {
          this.marksSource = marksResponse.source;
          this.marksMessage = marksResponse?.message || '';
        }
        
        // Extract marks array
        if (Array.isArray(marksResponse)) {
          marksArray = marksResponse;
        } else if (marksResponse?.data && Array.isArray(marksResponse.data)) {
          marksArray = marksResponse.data;
        } else if (marksResponse?.success !== false && marksResponse?.data && Array.isArray(marksResponse.data)) {
          marksArray = marksResponse.data;
        }
        
        this.marks = marksArray;
        console.log(`✓ Refreshed marks: ${marksArray.length} marks loaded`);
        
        // Re-process result with new marks
        this.processResult();
        this.isLoading = false;
        this.hasError = false; // NEVER set hasError for "no marks" scenario
        console.log('✓ Marks refresh complete');
      },
      error: (err) => {
        console.error('❌ Error refreshing marks:', err);
        this.isLoading = false;
        
        // Handle different error types
        if (err.status === 404 || err.message?.includes('not found')) {
          // 404 is NOT an error - just means no marks yet
          this.marks = [];
          this.processResult();
          this.hasError = false;
          this.marksSource = 'backend-404';
          this.marksMessage = 'Marks not found. They may not be entered yet.';
          console.log('ℹ️  No marks found for this student (404)');
        } else if (err.status === 0) {
          // Network error
          this.marks = [];
          this.processResult();
          this.hasError = false; // Still show the page
          this.marksMessage = 'Cannot connect to server. Please check your connection.';
          console.error('❌ Network error - cannot connect to server');
        } else {
          // Other errors
          this.hasError = false; // Still show the page
          this.marksMessage = 'Failed to refresh marks. Please try again later.';
          console.error('❌ Error refreshing marks:', err);
        }
      }
    });
  }

  private processResult() {
    console.log('\n📊 Processing result data...');
    console.log('  Marks count:', this.marks.length);

    if (!this.student) {
      console.error('❌ No student data available');
      this.result = {};
      return;
    }

    // Validate and extract marks data
    const validMarks = this.marks.filter((m: any) => {
      const hasMarks = m.marksObtained !== undefined && m.marksObtained !== null;
      const hasSubject = m.subject || m.subjectName;
      return hasMarks && hasSubject;
    });

    console.log('  Valid marks count:', validMarks.length);

    const totalMarks = validMarks.reduce((sum: number, mark: any) => {
      const obtained = parseInt(mark.marksObtained) || 0;
      return sum + obtained;
    }, 0);

    const maxTotal = validMarks.length > 0 ? validMarks.length * 100 : 0;
    const percentage = maxTotal > 0 
      ? ((totalMarks / maxTotal) * 100).toFixed(2)
      : '0.00';
    
    // Determine result status - if no marks, show "PENDING" instead of "FAIL"
    let resultStatus = "PENDING";
    if (validMarks.length > 0) {
      resultStatus = parseFloat(percentage) >= 33 ? "PASS" : "FAIL";
    }
    
    this.result = {
      name: this.student.name,
      rollNo: this.student.rollNo,
      email: this.student.email,
      dob: this.student.dob || 'N/A',
      phone: this.student.phone || 'N/A',
      className: this.student.className,
      marks: validMarks.map((m: any) => ({
        marksId: m.marksId,
        subject: m.subject || m.subjectName || 'Unknown',
        marksObtained: parseInt(m.marksObtained) || 0,
        maxMarks: parseInt(m.maxMarks) || 100,
        term: m.term || 'N/A',
        year: m.year || new Date().getFullYear()
      })),
      subjects: this.classSubjects,
      total: totalMarks,
      maxTotal: maxTotal,
      percentage: percentage,
      status: resultStatus,
      hasMarks: validMarks.length > 0
    };

    console.log('✅ Result processed successfully:');
    console.log('  Total marks:', totalMarks);
    console.log('  Max total:', maxTotal);
    console.log('  Percentage:', percentage + '%');
    console.log('  Status:', this.result.status);
    console.log('  Has marks:', this.result.hasMarks);
  }

  goToLoginForRecheck() {
    this.router.navigate(['/login'], {
      queryParams: { role: 'student', recheck: 'true', rollNo: this.result.rollNo }
    });
  }

  getGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B+';
    if (score >= 60) return 'B';
    if (score >= 50) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  }

  downloadPDF() {
    const DATA: any = document.querySelector('.result-container');
    
    html2canvas(DATA, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true
    }).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`Result_${this.result.rollNo}.pdf`);
    }).catch((error: any) => {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    });
  }

  printResult() {
    window.print();
  }

  getCurrentDate(): string {
    const now = new Date();
    return now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  shareResult(): void {
    if (navigator.share) {
      navigator.share({
        title: `Result - ${this.result.name}`,
        text: `Check out my result! Total: ${this.result.total}, Percentage: ${this.result.percentage}%`,
        url: window.location.href
      });
    } else {
      // Fallback: Copy to clipboard
      const textToCopy = `Name: ${this.result.name}\nRoll No: ${this.result.rollNo}\nPercentage: ${this.result.percentage}%\nStatus: ${this.result.status}`;
      navigator.clipboard.writeText(textToCopy).then(() => {
        alert('Result details copied to clipboard!');
      });
    }
  }

  // Method to get performance category
  getPerformanceCategory(): string {
    const percentage = parseFloat(this.result.percentage);
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 60) return 'Average';
    return 'Poor';
  }

  // Method to check if marks are available
  hasMarksAvailable(): boolean {
    return this.result.marks && this.result.marks.length > 0;
  }
}