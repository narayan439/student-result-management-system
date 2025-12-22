import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RequestRecheckService } from '../../../core/services/request-recheck.service';
import { Recheck } from '../../../core/models/recheck.model';

@Component({
  selector: 'app-manage-rechecks',
  templateUrl: './manage-rechecks.component.html',
  styleUrls: ['./manage-rechecks.component.css']
})
export class ManageRechecksComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['studentName', 'subject', 'reason', 'status', 'actions'];
  dataSource = new MatTableDataSource<Recheck>([]);

  rechecks: Recheck[] = [];
  filteredRechecks: Recheck[] = [];
  
  // Filter
  searchTerm = '';
  selectedStatus = 'all';
  
  // Loading state
  isLoading = false;

  constructor(private recheckService: RequestRecheckService) {}

  ngOnInit(): void {
    // Initialize with sample data first for immediate display
    this.rechecks = [
      {
        recheckId: 1,
        studentId: 1,
        marksId: 1,
        studentEmail: 'arjun.kumar1@student.com',
        rollNo: '1A01',
        studentName: 'Arjun Kumar',
        subject: 'Mathematics',
        reason: 'Question 5 calculation seems wrong. The answer key shows 25 but my calculation is correct.',
        adminNotes: 'Reviewed - calculation is correct, marks adjusted',
        status: 'APPROVED',
        requestDate: new Date().toISOString(),
        resolvedDate: new Date().toISOString(),
        marksObtained: 85,
        maxMarks: 100
      },
      {
        recheckId: 2,
        studentId: 2,
        marksId: 2,
        studentEmail: 'priya.singh2@student.com',
        rollNo: '1A02',
        studentName: 'Priya Singh',
        subject: 'Science',
        reason: 'Want to review answer key for section B',
        adminNotes: '',
        status: 'PENDING',
        requestDate: new Date().toISOString(),
        marksObtained: 95,
        maxMarks: 100
      }
    ];
    this.applyFilters();
    // Then load from backend
    this.loadRechecks();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadRechecks(): void {
    this.isLoading = true;

    // Load from backend API
    this.recheckService.getAllRechecks().subscribe({
      next: (rechecks: Recheck[]) => {
        // If we get valid data from backend, use it; otherwise keep sample data
        if (rechecks && rechecks.length > 0) {
          this.rechecks = rechecks;
        }
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading rechecks:', err);
        // Keep the sample data on error instead of clearing
        console.log('Using sample data. Current rechecks count:', this.rechecks.length);
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.rechecks];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === this.selectedStatus || r.status === this.selectedStatus.toUpperCase());
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        r.subject?.toLowerCase().includes(term) ||
        r.reason?.toLowerCase().includes(term) ||
        r.rollNo?.toLowerCase().includes(term) ||
        r.studentId?.toString().includes(term)
      );
    }

    this.filteredRechecks = filtered;
    this.dataSource.data = this.filteredRechecks;
  }

  onSearch(searchValue: any): void {
    this.searchTerm = (searchValue || '').toLowerCase();
    this.applyFilters();
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  updateStatus(recheck: Recheck, status: 'PENDING' | 'APPROVED' | 'REJECTED'): void {
    if (confirm(`Update recheck status to ${status}?`)) {
      this.recheckService.updateRecheckStatus(recheck.recheckId!, status).subscribe({
        next: (response: any) => {
          alert('✓ Status updated successfully!');
          // Update the recheck in the array immediately for real-time count update
          const index = this.rechecks.findIndex(r => r.recheckId === recheck.recheckId);
          if (index > -1) {
            this.rechecks[index].status = status;
            if (status === 'APPROVED' || status === 'REJECTED') {
              this.rechecks[index].resolvedDate = new Date().toISOString();
            }
            this.applyFilters(); // Reapply filters to update display and counts
          }
        },
        error: (err: any) => {
          const errorMsg = err.error?.message || 'Failed to update status';
          alert('✗ Error: ' + errorMsg);
          console.error('Error updating status:', err);
        }
      });
    }
  }

  // Helper methods for stats - use ALL rechecks array for total counts
  getPendingCount(): number {
    return this.rechecks.filter(r => r.status === 'PENDING' || r.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.rechecks.filter(r => r.status === 'APPROVED' || r.status === 'approved').length;
  }

  getRejectedCount(): number {
    return this.rechecks.filter(r => r.status === 'REJECTED' || r.status === 'rejected').length;
  }
}