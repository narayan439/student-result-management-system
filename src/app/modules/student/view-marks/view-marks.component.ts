import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-marks',
  templateUrl: './view-marks.component.html',
  styleUrls: ['./view-marks.component.css']
})
export class ViewMarksComponent implements OnInit {
  
  // Student Info
  studentName = 'Narayan Sharma';
  studentClass = '10';
  studentRollNo = '23';
  
  // Displayed columns for the table
  displayedColumns: string[] = ['subject', 'score', 'status'];
  
  // Marks data
  marks = [
    { subject: 'Mathematics', score: 85 },
    { subject: 'Science', score: 92 },
    { subject: 'English', score: 78 },
    { subject: 'History', score: 65 },
    { subject: 'Geography', score: 88 },
    { subject: 'Computer', score: 95 }
  ];
  
  // Calculated values
  total: number = 0;
  percentage: number = 0;
  grade: string = '';
  average: number = 0;

  ngOnInit() {
    this.calculatePerformance();
  }

  calculatePerformance() {
    // Calculate total
    this.total = this.marks.reduce((sum, mark) => sum + mark.score, 0);
    
    // Calculate percentage
    this.percentage = Math.round((this.total / (this.marks.length * 100)) * 100);
    
    // Calculate average
    this.average = this.total / this.marks.length;
    
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