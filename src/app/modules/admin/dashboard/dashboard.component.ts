import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalStudents = 0;
  totalTeachers = 0;
  totalSubjects = 0;
  totalRechecks = 0;

  // dummy data for now – later replace with API calls
  students = [
    { name: 'Narayan', className: '10', rollNo: '23' },
    { name: 'Rakesh', className: '9', rollNo: '19' }
  ];

  teachers = [
    { name: 'Rahul', subject: 'Maths' },
    { name: 'Ananya', subject: 'Science' }
  ];

  subjects = ['Maths', 'Science', 'English', 'History'];

  rechecks = [
    { rollNo: '21', subject: 'Maths', status: 'PENDING' },
    { rollNo: '34', subject: 'Science', status: 'APPROVED' }
  ];

  ngOnInit(): void {
    this.totalStudents = this.students.length;
    this.totalTeachers = this.teachers.length;
    this.totalSubjects = this.subjects.length;
    this.totalRechecks = this.rechecks.length;
  }
}
