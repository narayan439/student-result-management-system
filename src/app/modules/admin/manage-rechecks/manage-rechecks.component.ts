import { Component } from '@angular/core';

interface Recheck {
  id: number;
  rollNo: string;
  subject: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

@Component({
  selector: 'app-manage-rechecks',
  templateUrl: './manage-rechecks.component.html',
  styleUrls: ['./manage-rechecks.component.css']
})
export class ManageRechecksComponent {

  displayedColumns: string[] = ['rollNo', 'subject', 'reason', 'status', 'actions'];

  rechecks: Recheck[] = [
    { id: 1, rollNo: '21', subject: 'Maths', reason: 'Marks not correct', status: 'PENDING' },
    { id: 2, rollNo: '34', subject: 'Science', reason: 'Please re-evaluate', status: 'PENDING' },
    { id: 3, rollNo: '45', subject: 'English', reason: 'Recheck requested', status: 'APPROVED' }
  ];

  updateStatus(item: Recheck, status: 'APPROVED' | 'REJECTED') {
    item.status = status;
    // later: call backend API here
  }
}
