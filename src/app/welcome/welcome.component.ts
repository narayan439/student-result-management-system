import { Component } from '@angular/core';
import { Router } from '@angular/router';   // ✅ ADD THIS

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  rollNo: string = '';
  dob: string = '';

  constructor(private router: Router) {}   // ✅ constructor at top

  viewResult() {
    if (!this.rollNo || !this.dob) {
      alert("Please enter Roll Number and Date of Birth");
      return;
    }

    this.router.navigate(['/student/view-result', this.rollNo, this.dob]);
  }

}
