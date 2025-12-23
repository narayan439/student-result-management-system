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

  displayedColumns: string[] = ['studentName', 'subject', 'reason', 'status', 'adminNotes', 'actions'];
  dataSource = new MatTableDataSource<Recheck>([]);

  rechecks: Recheck[] = [];
  filteredRechecks: Recheck[] = [];
  
  // Filter
  searchTerm = '';
  selectedStatus = 'all';
  
  // Loading state
  isLoading = false;

  // Admin note modal state
  showNoteModal = false;
  currentAction: 'APPROVE' | 'REJECT' | 'NOTE' = 'NOTE';
  selectedRecheck: Recheck | null = null;
  adminNote = '';

  constructor(
    private recheckService: RequestRecheckService
  ) {}

  ngOnInit(): void {
    this.loadRechecks();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadRechecks(): void {
    this.isLoading = true;
    
    this.recheckService.getAllRechecks().subscribe({
      next: (rechecks: Recheck[]) => {
        this.rechecks = rechecks || [];
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading rechecks:', err);
        this.rechecks = [];
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.rechecks];

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(r => 
        r.status === this.selectedStatus || 
        r.status === this.selectedStatus.toUpperCase()
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r =>
        (r.subject?.toLowerCase().includes(term)) ||
        (r.reason?.toLowerCase().includes(term)) ||
        (r.rollNo?.toLowerCase().includes(term)) ||
        (r.studentName?.toLowerCase().includes(term))
      );
    }

    this.filteredRechecks = filtered;
    this.dataSource.data = this.filteredRechecks;
    
    // Update paginator
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onSearch(searchValue: any): void {
    this.searchTerm = (searchValue?.value || '').toLowerCase();
    this.applyFilters();
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  // Get subject class for dynamic coloring
  getSubjectClass(subject: string): string {
    if (!subject) return 'subject-other';
    
    const subjectMap: {[key: string]: string} = {
      'mathematics': 'mathematics',
      'maths': 'mathematics',
      'physics': 'physics',
      'chemistry': 'chemistry',
      'english': 'english',
      'hindi': 'hindi',
      'history': 'history',
      'geography': 'geography',
      'science': 'science',
      'odia': 'odia',
      'drawing': 'drawing',
      'environmental studies': 'env-studies',
      'env studies': 'env-studies',
      'music': 'music',
      'general science': 'gen-science',
      'biology': 'biology',
      'social science': 'social-science',
      'social studies': 'social-science'
    };
    
    const normalizedSubject = subject.toLowerCase().trim();
    return `subject-${subjectMap[normalizedSubject] || 'other'}`;
  }

  // Open modal to add admin note and then approve
  approveWithNote(recheck: Recheck): void {
    this.selectedRecheck = recheck;
    this.currentAction = 'APPROVE';
    this.adminNote = recheck.adminNotes || '';
    this.showNoteModal = true;
  }

  // Open modal to add admin note and then reject
  rejectWithNote(recheck: Recheck): void {
    this.selectedRecheck = recheck;
    this.currentAction = 'REJECT';
    this.adminNote = recheck.adminNotes || '';
    this.showNoteModal = true;
  }

  // Open modal to add/edit admin note
  openNoteModal(recheck: Recheck): void {
    this.selectedRecheck = recheck;
    this.currentAction = 'NOTE';
    this.adminNote = recheck.adminNotes || '';
    this.showNoteModal = true;
  }

  // Close note modal
  closeNoteModal(): void {
    this.showNoteModal = false;
    this.selectedRecheck = null;
    this.adminNote = '';
    this.currentAction = 'NOTE';
  }

  // Submit admin note and update recheck
  submitNote(): void {
    if (!this.selectedRecheck) {
      alert('No recheck selected');
      return;
    }

    // For approve/reject, require note
    if ((this.currentAction === 'APPROVE' || this.currentAction === 'REJECT') && !this.adminNote.trim()) {
      alert('Please enter a note for ' + (this.currentAction === 'APPROVE' ? 'approval' : 'rejection'));
      return;
    }

    if (this.currentAction === 'NOTE') {
      // Just update the note
      this.updateAdminNote(this.selectedRecheck, this.adminNote);
    } else if (this.currentAction === 'APPROVE') {
      // Update with approval
      this.updateRecheckWithNote(this.selectedRecheck, 'APPROVED', this.adminNote);
    } else if (this.currentAction === 'REJECT') {
      // Update with rejection
      this.updateRecheckWithNote(this.selectedRecheck, 'REJECTED', this.adminNote);
    }

    this.closeNoteModal();
  }

  // Update recheck with status and admin note
  updateRecheckWithNote(recheck: Recheck, status: 'APPROVED' | 'REJECTED', note: string): void {
    const updatedRecheck: Recheck = {
      ...recheck,
      status: status,
      adminNotes: note,
      resolvedDate: new Date().toISOString()
    };

    this.recheckService.updateRecheck(updatedRecheck).subscribe({
      next: (response: Recheck) => {
        alert(`✓ Recheck ${status.toLowerCase()} successfully!`);
        this.loadRechecks(); // Reload to get updated data
      },
      error: (err: any) => {
        const errorMsg = err?.error?.message || 'Failed to update recheck';
        alert(`✗ Error: ${errorMsg}`);
        console.error('Error updating recheck:', err);
      }
    });
  }

  // Update only admin note
  updateAdminNote(recheck: Recheck, note: string): void {
    const updatedRecheck: Recheck = {
      ...recheck,
      adminNotes: note
    };

    this.recheckService.updateRecheck(updatedRecheck).subscribe({
      next: () => {
        alert('✓ Admin note updated successfully!');
        this.loadRechecks(); // Reload to get updated data
      },
      error: (err: any) => {
        const errorMsg = err?.error?.message || 'Failed to update note';
        alert(`✗ Error: ${errorMsg}`);
        console.error('Error updating note:', err);
      }
    });
  }

  // Helper methods for stats
  getPendingCount(): number {
    return this.rechecks.filter(r => r.status === 'PENDING' || r.status === 'pending').length;
  }

  getApprovedCount(): number {
    return this.rechecks.filter(r => r.status === 'APPROVED' || r.status === 'approved').length;
  }

  getRejectedCount(): number {
    return this.rechecks.filter(r => r.status === 'REJECTED' || r.status === 'rejected').length;
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return 'Invalid date';
    }
  }

  // Get modal title
  getModalTitle(): string {
    if (!this.selectedRecheck) return '';
    
    switch (this.currentAction) {
      case 'APPROVE': return `Approve Recheck - ${this.selectedRecheck.subject}`;
      case 'REJECT': return `Reject Recheck - ${this.selectedRecheck.subject}`;
      case 'NOTE': return `Add Note - ${this.selectedRecheck.subject}`;
      default: return 'Admin Action';
    }
  }

  // Get modal button text
  getModalButtonText(): string {
    switch (this.currentAction) {
      case 'APPROVE': return 'Approve with Note';
      case 'REJECT': return 'Reject with Note';
      case 'NOTE': return 'Save Note';
      default: return 'Submit';
    }
  }
}