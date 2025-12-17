import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RequestRecheckService } from '../../../core/services/request-recheck.service';

@Component({
  selector: 'app-recheck-requests',
  templateUrl: './recheck-requests.component.html',
  styleUrls: ['./recheck-requests.component.css']
})
export class RecheckRequestsComponent implements OnInit {
  
  // Table configuration
  displayedColumns: string[] = ['rollNo', 'studentName', 'subject', 'reason', 'status', 'date', 'action'];
  dataSource: any;
  pageSize = 10;
  resolvedRequests = 0;
  pendingRequests = 0;
  inReviewRequests = 0;
  totalRequests = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private requestRecheckService: RequestRecheckService
  ) {}

  ngOnInit(): void {
    this.loadRecheckRequests();
  }

  ngAfterViewInit(): void {
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Load all recheck requests
   */
  loadRecheckRequests(): void {
    this.requestRecheckService.getAllRechecks().subscribe({
      next: (requests: any) => {
        const requestsArray = Array.isArray(requests) ? requests : [];
        this.dataSource = new MatTableDataSource(requestsArray);
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
        
        this.calculateStatistics(requestsArray);
        console.log('✓ Recheck requests loaded:', requestsArray);
      },
      error: (err) => {
        console.error('Error loading recheck requests:', err);
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  /**
   * Calculate request statistics
   */
  calculateStatistics(requests: any[]): void {
    this.totalRequests = requests.length;
    this.pendingRequests = requests.filter(r => r.status === 'pending').length;
    this.inReviewRequests = requests.filter(r => r.status === 'completed' || r.status === 'approved').length;
    this.resolvedRequests = requests.filter(r => r.status === 'completed').length;
  }

  /**
   * Get status class for styling
   */
  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'completed': 'status-completed',
      'approved': 'status-approved',
      'rejected': 'status-rejected'
    };
    return statusMap[status] || 'status-pending';
  }

  /**
   * Get subject class for styling
   */
  getSubjectClass(subject: string): string {
    return subject.toLowerCase().replace(/\s+/g, '-');
  }

  /**
   * Get status icon
   */
  getStatusIcon(status: string): string {
    const iconMap: { [key: string]: string } = {
      'pending': 'schedule',
      'completed': 'check_circle',
      'approved': 'thumb_up',
      'rejected': 'cancel'
    };
    return iconMap[status] || 'help';
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    const textMap: { [key: string]: string } = {
      'pending': 'Pending',
      'completed': 'Completed',
      'approved': 'Approved',
      'rejected': 'Rejected'
    };
    return textMap[status] || status;
  }

  /**
   * Update recheck status
   */
  updateStatus(recheckId: number, newStatus: string): void {
    this.requestRecheckService.updateRecheckStatus(recheckId, newStatus).subscribe({
      next: (response) => {
        console.log('✓ Recheck status updated:', response);
        this.loadRecheckRequests();
      },
      error: (err) => {
        console.error('Error updating recheck status:', err);
        alert('Failed to update status. Please try again.');
      }
    });
  }

  /**
   * View request details
   */
  viewDetails(request: any): void {
    alert(
      `Recheck Request Details\n\n` +
      `Student: ${request.studentName} (${request.rollNo})\n` +
      `Subject: ${request.subject}\n` +
      `Status: ${this.getStatusText(request.status)}\n` +
      `Reason: ${request.reason}\n` +
      `Marks: ${request.marksObtained}/${request.maxMarks}`
    );
  }

  /**
   * Approve request
   */
  approveRequest(request: any): void {
    if (confirm(`Approve recheck request for ${request.studentName} in ${request.subject}?`)) {
      this.updateStatus(request.recheckId, 'approved');
    }
  }

  /**
   * Reject request
   */
  rejectRequest(request: any): void {
    if (confirm(`Reject recheck request for ${request.studentName} in ${request.subject}?`)) {
      this.updateStatus(request.recheckId, 'rejected');
    }
  }

  /**
   * Complete request
   */
  completeRequest(request: any): void {
    if (confirm(`Mark recheck request as completed for ${request.studentName} in ${request.subject}?`)) {
      this.updateStatus(request.recheckId, 'completed');
    }
  }

  /**
   * Apply filter to table
   */
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /**
   * Change page size
   */
  onPageSizeChange(): void {
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      this.paginator.firstPage();
    }
  }
}