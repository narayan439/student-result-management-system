import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-marks',
  templateUrl: './view-marks.component.html',
  styleUrls: ['./view-marks.component.css']
})
export class ViewMarksComponent implements OnInit {

  displayedColumns: string[] = ['subject', 'marks', 'status'];

  marks = [
    { subject: 'Maths', score: 80 },
    { subject: 'Science', score: 72 },
    { subject: 'English', score: 90 },
    { subject: 'Geography', score: 45 }
  ];

  total = 0;
  percentage = 0;
  grade = '';

  ngOnInit(): void {
    this.calculateResult();
  }

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
}
