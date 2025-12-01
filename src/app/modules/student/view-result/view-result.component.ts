import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    let roll = this.route.snapshot.paramMap.get('rollNo');
    let dob = this.route.snapshot.paramMap.get('dob');

    this.qrData = `ROLL:${roll},DOB:${dob},RESULT:VERIFIED`;

    // Dynamic data based on roll number
    const studentData: any = {
      '101': {
        name: "Rahul Kumar",
        className: "10th A",
        marks: [
          { subject: "Mathematics", score: 92 },
          { subject: "Science", score: 85 },
          { subject: "English", score: 88 },
          { subject: "Hindi", score: 90 },
          { subject: "Social Science", score: 78 }
        ]
      },
      '102': {
        name: "Priya Sharma",
        className: "10th B",
        marks: [
          { subject: "Mathematics", score: 78 },
          { subject: "Science", score: 81 },
          { subject: "English", score: 74 },
          { subject: "Hindi", score: 88 },
          { subject: "Social Science", score: 85 }
        ]
      },
      '103': {
        name: "Amit Patel",
        className: "10th C",
        marks: [
          { subject: "Mathematics", score: 65 },
          { subject: "Science", score: 58 },
          { subject: "English", score: 72 },
          { subject: "Hindi", score: 68 },
          { subject: "Social Science", score: 70 }
        ]
      }
    };

    const student = studentData[roll || '101'] || studentData['101'];
    
    const totalMarks = student.marks.reduce((sum: number, mark: any) => sum + mark.score, 0);
    const percentage = (totalMarks / (student.marks.length * 100) * 100).toFixed(2);
    
    this.result = {
      name: student.name,
      rollNo: roll,
      dob: dob,
      className: student.className,
      marks: student.marks,
      total: totalMarks,
      percentage: percentage,
      status: parseFloat(percentage) >= 33 ? "PASS" : "FAIL"
    };
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
      backgroundColor: '#ffffff'
    }).then(canvas => {
      const imgWidth = 208; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const position = 0;
      
      pdf.addImage(canvas.toDataURL('image/png', 1.0), 'PNG', 0, position, imgWidth, imgHeight);
      pdf.setProperties({
        title: `Marksheet - ${this.result.name}`,
        subject: 'Student Result',
        author: 'School Management System'
      });
      
      pdf.save(`${this.result.name}_${this.result.rollNo}_Marksheet.pdf`);
    }).catch(error => {
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

  // Helper method to parse float in template
  parseFloat(value: string): number {
    return parseFloat(value);
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