import { Component } from '@angular/core';

@Component({
  selector: 'app-recheck-requests',
  templateUrl: './recheck-requests.component.html',
  styleUrls: ['./recheck-requests.component.css']
})
export class RecheckRequestsComponent {
  cols = ['rollNo', 'subject', 'reason', 'action'];

requests = [
  { rollNo: '21', subject: 'Maths', reason: 'Marks not correct' },
  { rollNo: '34', subject: 'Science', reason: 'Please re-evaluate' }
];


}
