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
  displayedColumns: string[] = ['studentName', 'subject', 'marksObtained', 'status', 'action'];
  displayedColumnsWithExpand: string[] = ['expand', ...this.displayedColumns];
  dataSource: any;
  pageSize = 10;
  resolvedRequests = 0;
  pendingRequests = 0;
  inReviewRequests = 0;
  approvedRequests = 0;
  rejectedRequests = 0;
  totalRequests = 0;

  // Expanded row state
  expandedRow: number | null = null;

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
   * Toggle expanded row
   */
  toggleRow(request: any): void {
    this.expandedRow = this.expandedRow === request.recheckId ? null : request.recheckId;
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

            // Also enrich with latest marks details (marksObtained/maxMarks/term/year)
            this.marksService.getAllMarks().subscribe({
              next: (marksResponse: any) => {
                const marksList = Array.isArray(marksResponse)
                  ? marksResponse
                  : (Array.isArray(marksResponse?.data) ? marksResponse.data : []);

                const marksById = new Map<number, any>();
                for (const m of marksList) {
                  const id = Number((m as any)?.marksId);
                  if (Number.isFinite(id) && id > 0) {
                    marksById.set(id, m);
                  }
                }

                const finalRequests = enrichedRequests.map(r => {
                  const mark = marksById.get(Number((r as any)?.marksId));
                  return {
                    ...r,
                    marksObtained: mark?.marksObtained ?? r.marksObtained ?? 0,
                    maxMarks: mark?.maxMarks ?? r.maxMarks ?? 100,
                    term: mark?.term ?? r.term,
                    year: mark?.year ?? r.year
                  };
                });

                this.dataSource = new MatTableDataSource(finalRequests);
                if (this.paginator) {
                  this.dataSource.paginator = this.paginator;
                }

                this.calculateStatistics(finalRequests);
                console.log('✓ Recheck requests loaded:', finalRequests);
              },
              error: (err) => {
                console.error('Error loading marks:', err);
                this.dataSource = new MatTableDataSource(enrichedRequests);
                if (this.paginator) {
                  this.dataSource.paginator = this.paginator;
                }
                this.calculateStatistics(enrichedRequests);
              }
            });
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
    const normalizedStatus = (status: any) => String(status || '').toLowerCase();
    this.pendingRequests = requests.filter(r => normalizedStatus(r.status) === 'pending').length;
    this.approvedRequests = requests.filter(r => normalizedStatus(r.status) === 'approved').length;
    this.rejectedRequests = requests.filter(r => normalizedStatus(r.status) === 'rejected').length;
    this.resolvedRequests = requests.filter(r => normalizedStatus(r.status) === 'completed').length;

    // Kept for backward compatibility (if any template still references it)
    this.inReviewRequests = this.approvedRequests;
  }

  /**
   * Get status class for styling
   */
  getStatusClass(status: string): string {
    const key = String(status || '').toLowerCase();
    const statusMap: { [key: string]: string } = {
      'pending': 'status-pending',
      'completed': 'status-completed',
      'approved': 'status-approved',
      'rejected': 'status-rejected'
    };
    return statusMap[key] || 'status-pending';
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
    const key = String(status || '').toLowerCase();
    const iconMap: { [key: string]: string } = {
      'pending': 'schedule',
      'completed': 'check_circle',
      'approved': 'thumb_up',
      'rejected': 'cancel'
    };
    return iconMap[key] || 'help';
  }

  /**
   * Get status display text
   */
  getStatusText(status: string): string {
    const key = String(status || '').toLowerCase();
    const textMap: { [key: string]: string } = {
      'pending': 'Pending',
      'completed': 'Completed',
      'approved': 'Approved',
      'rejected': 'Rejected'
    };
    return textMap[key] || String(status ?? '');
  }

  /**
   * Start editing mark
   */
  editMark(request: any): void {
    const status = String(request?.status || '').toLowerCase();
    if (status !== 'approved') {
      this.submitError = 'You can update marks only after admin approves the recheck.';
      return;
    }
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
    const status = String(request?.status || '').toLowerCase();
    if (status !== 'approved') {
      this.submitError = 'You can update marks only after admin approves the recheck.';
      return;
    }
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
   * Send notification to student
   */
  sendNotification(request: any): void {
    if (confirm(`Send notification to ${request.studentName} about recheck status?`)) {
      alert(`Notification sent to ${request.studentName}`);
    }
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