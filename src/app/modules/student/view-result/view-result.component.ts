import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { MarksService } from '../../../core/services/marks.service';
import { SubjectService } from '../../../core/services/subject.service';
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

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private studentService: StudentService,
    private marksService: MarksService,
    private subjectService: SubjectService
  ) {}

  ngOnInit() {
    let rollNo = this.route.snapshot.paramMap.get('rollNo');
    let studentEmail = this.route.snapshot.paramMap.get('email');

    // Try to find student by roll no or email
    const students = this.studentService.getAllStudentsSync();
    
    if (studentEmail) {
      this.student = students.find(s => s.email === studentEmail);
    } else if (rollNo) {
      this.student = students.find(s => s.rollNo === rollNo);
    }

    if (!this.student && students.length > 0) {
      // Default to first student if not found
      this.student = students[0];
    }

    if (this.student) {
      // Extract class number
      const classMatch = this.student.className.match(/Class\s(\d+)/);
      this.classNumber = classMatch ? parseInt(classMatch[1]) : 1;

      // Load class-specific subjects
      this.classSubjects = this.subjectService.getSubjectsByClass(this.classNumber);

      // Load marks for this student
      this.marksService.getAllMarks().subscribe({
        next: (allMarks: any) => {
          const marksArray = Array.isArray(allMarks) ? allMarks : [];
          const studentIdStr = String(this.student.studentId);
          this.marks = marksArray.filter(m => m.studentId === studentIdStr) || [];
          this.processResult();
        },
        error: () => {
          console.warn('Error loading marks');
          this.processResult();
        }
      });

      this.qrData = `ROLL:${this.student.rollNo},EMAIL:${this.student.email},CLASS:${this.student.className}`;
    }
  }

  private processResult() {
    const totalMarks = this.marks.reduce((sum, mark) => sum + (mark.marksObtained || 0), 0);
    const percentage = this.marks.length > 0 
      ? (totalMarks / (this.marks.length * 100) * 100).toFixed(2)
      : '0.00';
    
    this.result = {
      name: this.student.name,
      rollNo: this.student.rollNo,
      email: this.student.email,
      dob: this.student.dob,
      phone: this.student.phone,
      className: this.student.className,
      marks: this.marks,
      subjects: this.classSubjects,
      total: totalMarks,
      maxTotal: this.marks.length * 100,
      percentage: percentage,
      status: parseFloat(percentage) >= 33 ? "PASS" : "FAIL"
    };

    console.log('Result processed:', this.result);
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

  // Method to check performance class
  isPerformanceExcellent(): boolean {
    return parseFloat(this.result.percentage) >= 90;
  }

  isPerformanceGood(): boolean {
    const percentage = parseFloat(this.result.percentage);
    return percentage >= 75 && percentage < 90;
  }

  isPerformanceAverage(): boolean {
    const percentage = parseFloat(this.result.percentage);
    return percentage >= 60 && percentage < 75;
  }

  isPerformancePoor(): boolean {
    return parseFloat(this.result.percentage) < 60;
  }
}