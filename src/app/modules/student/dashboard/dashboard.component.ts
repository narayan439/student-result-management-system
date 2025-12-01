import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  displayedColumns: string[] = ['subject', 'marks', 'status', 'recheck'];

  // Dummy Data (Replace with API response later)
  marks = [
    { subject: 'Maths', score: 85 },
    { subject: 'Science', score: 72 },
    { subject: 'English', score: 91 },
    { subject: 'History', score: 66 },
    { subject: 'Geography', score: 44 }
  ];

  total = 0;
  percentage = 0;
  grade = '';
  resultStatus = "PASS";


  // Recheck
  selectedSubject: string | null = null;
  recheckReason = '';

  ngOnInit(): void {
    this.calculateResult();
  }

  // Calculate total, percentage, grade
  calculateResult() {
    this.total = this.marks.reduce((sum, m) => sum + m.score, 0);
    this.percentage = Math.round(this.total / this.marks.length);

    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B';
    else if (this.percentage >= 60) this.grade = 'C';
    else if (this.percentage >= 33) this.grade = 'D';
    else this.grade = 'F';
  }

  openRecheck(subject: string) {
    this.selectedSubject = subject;
  }

  submitRecheck() {
    if (!this.recheckReason.trim()) {
      alert("Please enter a reason for recheck.");
      return;
    }

    alert(`Recheck request for ${this.selectedSubject} submitted!`);

    // Reset form
    this.selectedSubject = null;
    this.recheckReason = '';
  }

}
