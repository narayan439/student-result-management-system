import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { RequestRecheckService } from '../../../core/services/request-recheck.service';
import { AuthService } from '../../../core/services/auth.service';
import { Student } from '../../../core/models/student.model';

@Component({
  selector: 'app-track-recheck',
  templateUrl: './track-recheck.component.html',
  styleUrls: ['./track-recheck.component.css']
})
export class TrackRecheckComponent implements OnInit {

  student: Student | null = null;
  columns: string[] = ['subject', 'date', 'status'];

  requests: any[] = [];

  // Statistics
  totalRequests: number = 0;
  pendingRequests: number = 0;
  completedRequests: number = 0;
  approvedRequests: number = 0;
  rejectedRequests: number = 0;

  constructor(
    private studentService: StudentService,
    private requestRecheckService: RequestRecheckService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudentRecheckRequests();
  }

  /**
   * Load current student's recheck requests
   */
  loadStudentRecheckRequests(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'STUDENT') {
      this.router.navigate(['/login']);
      return;
    }

    // Get student by email
    const students = this.studentService.getAllStudentsSync();
    this.student = students.find(s => s.email === currentUser.email) || null;

    if (this.student && this.student.email) {
      console.log('✓ Student loaded for recheck tracking:', this.student);

      // Load recheck requests for this student by email
      this.requestRecheckService.getRechecksByStudentEmail(this.student.email).subscribe({
        next: (allRequests: any) => {
          const requestsArray = Array.isArray(allRequests) ? allRequests : [];
          this.requests = requestsArray || [];
          this.calculateStatistics();
          console.log('✓ Recheck requests loaded:', this.requests);
        },
        error: (err: any) => {
          console.error('Error loading recheck requests:', err);
          this.requests = [];
          this.calculateStatistics();
        }
      });
    } else {
      console.error('✗ Student not found for email:', currentUser?.email);
      this.router.navigate(['/login']);
    }
  }

  /**
   * Calculate statistics
   */
  calculateStatistics(): void {
    this.totalRequests = this.requests.length;
    this.pendingRequests = this.requests.filter(r => r.status === 'pending').length;
    this.completedRequests = this.requests.filter(r => r.status === 'completed').length;
    this.approvedRequests = this.requests.filter(r => r.status === 'approved').length;
    this.rejectedRequests = this.requests.filter(r => r.status === 'rejected').length;
  }

  /**
   * Get requests by status
   */
  getRequestsByStatus(status: string): any[] {
    return this.requests.filter(r => r.status === status);
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    switch(status) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return 'status-pending';
    }
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'completed': 'Completed',
      'approved': 'Approved',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
  }
}