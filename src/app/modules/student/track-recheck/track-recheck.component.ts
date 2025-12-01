import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-track-recheck',
  templateUrl: './track-recheck.component.html',
  styleUrls: ['./track-recheck.component.css']
})
export class TrackRecheckComponent implements OnInit {

  columns: string[] = ['subject', 'date', 'status'];

  requests = [
    { subject: 'Maths', date: '2025-12-01', status: 'Pending' },
    { subject: 'Science', date: '2025-11-28', status: 'Completed' }
  ];

  // Statistics
  totalRequests: number = 0;
  pendingRequests: number = 0;
  completedRequests: number = 0;
  inProgressRequests: number = 0;

  ngOnInit(): void {
    this.calculateStatistics();
  }

  calculateStatistics(): void {
    this.totalRequests = this.requests.length;
    this.pendingRequests = this.getRequestsByStatus('Pending').length;
    this.completedRequests = this.getRequestsByStatus('Completed').length;
    this.inProgressRequests = this.getRequestsByStatus('In Progress').length;
  }

  getRequestsByStatus(status: string): any[] {
    return this.requests.filter(r => r.status === status);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Pending': return 'pending';
      case 'Completed': return 'completed';
      case 'In Progress': return 'in-progress';
      case 'Rejected': return 'rejected';
      default: return '';
    }
  }
}