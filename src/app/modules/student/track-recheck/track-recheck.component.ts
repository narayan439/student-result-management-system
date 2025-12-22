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
  expandedRequestIndex: number | null = null;

  // Statistics
  totalRequests: number = 0;
  pendingRequests: number = 0;
  
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
    let students = this.studentService.getAllStudentsSync();
    
    // If cache is empty, refresh from backend
    if (!students || students.length === 0) {
      console.log('⚠️ Student cache is empty, refreshing from backend...');
      this.studentService.refreshStudents().subscribe({
        next: (refreshedStudents) => {
          this.loadRecheckRequestsForStudent(currentUser.email, refreshedStudents);
        },
        error: (err) => {
          console.error('❌ Failed to refresh student data:', err);
          alert('Student profile not found. Please login again.');
          this.router.navigate(['/login']);
        }
      });
      return;
    }

    this.loadRecheckRequestsForStudent(currentUser.email, students);
  }

  /**
   * Load recheck requests for a specific student
   */
  private loadRecheckRequestsForStudent(email: string, students: any[]): void {
    this.student = students.find(s => s.email === email) || null;

    if (!this.student) {
      console.error('❌ Student not found for email:', email);
      alert('Student profile not found. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    console.log('✓ Student loaded for recheck tracking:', this.student);
    console.log(`📥 Loading recheck requests for student ID: ${this.student.studentId}`);

    // Load recheck requests from backend using student ID
    if (!this.student || !this.student.studentId) {
      console.error('❌ Student or studentId is undefined');
      alert('Invalid student data. Please login again.');
      this.router.navigate(['/login']);
      return;
    }

    this.requestRecheckService.getRechecksByStudentId(this.student.studentId).subscribe({
      next: (response: any) => {
        console.log('📥 Raw response from backend:', response);
        
        let requestsArray: any[] = [];
        
        // Handle different response formats
        if (Array.isArray(response)) {
          console.log('✓ Response is direct array');
          requestsArray = response;
        } else if (response?.data && Array.isArray(response.data)) {
          console.log('✓ Response has data array property');
          requestsArray = response.data;
        } else {
          console.log('⚠️ Could not extract requests from response');
          requestsArray = [];
        }
        
        console.log(`📊 Received ${requestsArray.length} recheck requests`);
        
        // Convert status to proper format (backend returns uppercase, UI expects lowercase)
        this.requests = requestsArray.map((r: any) => ({
          ...r,
          status: r.status ? r.status.toLowerCase() : 'pending'
        }));
        
        console.log('✓ Recheck requests loaded and processed:', this.requests);
        
        // Log detailed information about each request
        this.requests.forEach((r, index) => {
          console.log(`  Request ${index + 1}: ${r.subject} - Status: ${r.status}, Date: ${r.requestDate}`);
        });
        
        this.calculateStatistics();
      },
      error: (err) => {
        console.error('❌ Error loading recheck requests from backend:', err);
        console.log('  Error message:', err.message);
        console.log('  Error status:', err.status);
        console.log('  Error response:', err.error);
        this.requests = [];
        this.calculateStatistics();
      }
    });
  }

  /**
   * Calculate statistics
   */
  calculateStatistics(): void {
    this.totalRequests = this.requests.length;
    
    // Normalize status values for comparison (backend may return uppercase)
    this.pendingRequests = this.requests.filter(r => 
      r.status === 'pending' || r.status === 'PENDING'
    ).length;
    
    this.rejectedRequests = this.requests.filter(r => 
      r.status === 'completed' || r.status === 'COMPLETED'
    ).length;
    
    this.approvedRequests = this.requests.filter(r => 
      r.status === 'approved' || r.status === 'APPROVED'
    ).length;
    
    this.rejectedRequests = this.requests.filter(r => 
      r.status === 'rejected' || r.status === 'REJECTED'
    ).length;
    
    console.log('📊 Statistics calculated:');
    console.log(`  Total: ${this.totalRequests}`);
    console.log(`  Pending: ${this.pendingRequests}`);
    console.log(`  Rejected: ${this.rejectedRequests}`);
    console.log(`  Approved: ${this.approvedRequests}`);
    console.log(`  Rejected: ${this.rejectedRequests}`);
  }

  /**
   * Get requests by status (case-insensitive)
   */
  getRequestsByStatus(status: string): any[] {
    const statusLower = status.toLowerCase();
    return this.requests.filter(r => 
      r.status && r.status.toLowerCase() === statusLower
    );
  }

  /**
   * Get status badge class
   */
  getStatusClass(status: string): string {
    const statusLower = status ? status.toLowerCase() : 'pending';
    switch(statusLower) {
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
    const statusLower = status ? status.toLowerCase() : 'pending';
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending Review',
      'completed': 'Completed',
      'approved': 'Approved',
      'rejected': 'Rejected'
    };
    return statusMap[statusLower] || status;
  }

  /**
   * Toggle request details visibility
   */
  toggleRequestDetails(index: number): void {
    console.log('🔄 Toggling details for request at index:', index);
    this.expandedRequestIndex = this.expandedRequestIndex === index ? null : index;
    console.log('  Expanded request index is now:', this.expandedRequestIndex);
  }
}