import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RequestRecheckService } from '../../../core/services/request-recheck.service';
import { MarksService } from '../../../core/services/marks.service';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-recheck-requests',
  templateUrl: './recheck-requests.component.html',
  styleUrls: ['./recheck-requests.component.css']
})
export class RecheckRequestsComponent implements OnInit {
  
  // Table configuration
  displayedColumns: string[] = ['studentName', 'subject', 'reason', 'marksObtained', 'status', 'action'];
  dataSource: any;
  pageSize = 10;
  resolvedRequests = 0;
  pendingRequests = 0;
  inReviewRequests = 0;
  totalRequests = 0;

  // Edit mode
  editingMarkId: number | null = null;
  editedMarks: { [key: number]: number } = {};
  isSubmitting = false;
  submitError = '';
  submitSuccess = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private requestRecheckService: RequestRecheckService,
    private marksService: MarksService,
    private studentService: StudentService
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
        
        // Fetch fresh student data from backend
        this.studentService.getAllStudents().subscribe({
          next: (studentsResponse: any) => {
            const students = Array.isArray(studentsResponse) ? studentsResponse : (studentsResponse.data || []);
            
            // Enrich with student names and class
            const enrichedRequests = this.enrichStudentDataFresh(requestsArray, students);
            
            this.dataSource = new MatTableDataSource(enrichedRequests);
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            
            this.calculateStatistics(enrichedRequests);
            console.log('✓ Recheck requests loaded:', enrichedRequests);
          },
          error: (err) => {
            console.error('Error loading students:', err);
            // Fallback to cached data if fresh fetch fails
            const enrichedRequests = this.enrichStudentData(requestsArray);
            this.dataSource = new MatTableDataSource(enrichedRequests);
            if (this.paginator) {
              this.dataSource.paginator = this.paginator;
            }
            this.calculateStatistics(enrichedRequests);
          }
        });
      },
      error: (err) => {
        console.error('Error loading recheck requests:', err);
        this.dataSource = new MatTableDataSource([]);
      }
    });
  }

  /**
   * Enrich recheck requests with fresh student data from backend
   */
  private enrichStudentDataFresh(requests: any[], students: any[]): any[] {
    return requests.map(request => {
      const student = students.find(s => s.studentId === request.studentId);
      return {
        ...request,
        studentName: student?.name || 'Unknown',
        rollNo: student?.rollNo || 'N/A',
        className: student?.className || 'N/A',
        marksObtained: request.marksObtained || 0
      };
    });
  }

  /**
   * Enrich recheck requests with student data (cached fallback)
   */
  private enrichStudentData(requests: any[]): any[] {
    const students = this.studentService.getAllStudentsSync();
    
    return requests.map(request => {
      const student = students.find(s => s.studentId === request.studentId);
      return {
        ...request,
        studentName: student?.name || 'Unknown',
        rollNo: student?.rollNo || 'N/A',
        className: student?.className || 'N/A',
        marksObtained: request.marksObtained || 0
      };
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
   * Start editing mark
   */
  editMark(request: any): void {
    this.editingMarkId = request.marksId;
    this.editedMarks[request.marksId] = request.marksObtained;
    this.submitError = '';
  }

  /**
   * Cancel editing
   */
  cancelEdit(): void {
    this.editingMarkId = null;
    this.editedMarks = {};
  }

  /**
   * Save updated mark
   */
  saveMark(request: any): void {
    const newMarks = this.editedMarks[request.marksId];

    if (newMarks === undefined || newMarks === null) {
      this.submitError = 'Please enter a valid mark value';
      return;
    }

    if (newMarks < 0 || newMarks > 100) {
      this.submitError = 'Marks must be between 0 and 100';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    const updateRequest = {
      marksObtained: newMarks,
      maxMarks: request.maxMarks || 100,
      term: request.term || 'Term 1',
      year: request.year || new Date().getFullYear(),
      isRecheckRequested: false // Mark recheck as resolved
    };

    this.marksService.updateMarks(request.marksId, updateRequest).subscribe({
      next: (response: any) => {
        console.log(`✓ Mark updated for ${request.studentName}`, response);
        this.submitSuccess = `✓ Mark updated successfully for ${request.studentName}`;
        this.editingMarkId = null;
        this.editedMarks = {};
        this.isSubmitting = false;

        // Reload data
        this.loadRecheckRequests();

        setTimeout(() => {
          this.submitSuccess = '';
        }, 3000);
      },
      error: (err: any) => {
        console.error('❌ Error updating mark:', err);
        const errorMsg = err.error?.message || err.message || 'Failed to update mark';
        this.submitError = `Error: ${errorMsg}`;
        this.isSubmitting = false;
      }
    });
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