import { Component } from '@angular/core';

@Component({
  selector: 'app-track-recheck',
  templateUrl: './track-recheck.component.html',
  styleUrls: ['./track-recheck.component.css']
})
export class TrackRecheckComponent {

  columns: string[] = ['subject', 'date', 'status'];

  requests = [
    { subject: 'Maths', date: '2025-12-01', status: 'Pending' },
    { subject: 'Science', date: '2025-11-28', status: 'Completed' }
  ];

}
