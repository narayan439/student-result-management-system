import { Component } from '@angular/core';

@Component({
  selector: 'app-request-recheck',
  templateUrl: './request-recheck.component.html',
  styleUrls: ['./request-recheck.component.css']
})
export class RequestRecheckComponent {

  subjects = ['Maths', 'Science', 'English', 'History', 'Geography'];

  recheck = {
    subject: '',
    reason: ''
  };

  submitRecheck() {
    alert(`Recheck request for ${this.recheck.subject} submitted!`);
    this.recheck = { subject: '', reason: '' };
  }
}
