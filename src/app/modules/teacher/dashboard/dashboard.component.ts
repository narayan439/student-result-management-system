import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {




  students = [
    { name: 'Narayan', rollNo: '23' },
    { name: 'Rakesh', rollNo: '19' }
  ];

  subjects = ['Maths', 'Science', 'English', 'History'];

  marks = {
    student: '',
    subject: '',
    score: ''
  };

  constructor(private router: Router) {}

  saveMarks() {
    console.log("MARKS SUBMITTED:", this.marks);
    alert("Marks Submitted Successfully!");
  }

  logout() {
    localStorage.removeItem("teacherToken");
    this.router.navigate(['/login']);
  }

}
