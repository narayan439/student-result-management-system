import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-recheck-requests',
  templateUrl: './recheck-requests.component.html',
  styleUrls: ['./recheck-requests.component.css']
})
export class RecheckRequestsComponent implements OnInit {
  
  // Table configuration
  displayedColumns: string[] = ['rollNo', 'subject', 'reason', 'status', 'action'];
  dataSource!: MatTableDataSource<any>; // Add ! to tell TypeScript it will be initialized
  pageSize = 10;
  resolvedRequests = 2;
  
  // Sample data
  requests = [
    { rollNo: '21', subject: 'Maths', reason: 'Marks not correct as per calculation', status: 'pending', date: '2023-10-15' },
    { rollNo: '34', subject: 'Science', reason: 'Please re-evaluate practical marks', status: 'in-review', date: '2023-10-14' },
    { rollNo: '45', subject: 'English', reason: 'Essay marking seems inconsistent', status: 'completed', date: '2023-10-13' },
    { rollNo: '56', subject: 'History', reason: 'Some answers were not considered', status: 'pending', date: '2023-10-12' },
    { rollNo: '67', subject: 'Geography', reason: 'Map work needs rechecking', status: 'in-review', date: '2023-10-11' },
    { rollNo: '78', subject: 'Maths', reason: 'Formula application issue', status: 'pending', date: '2023-10-10' },
    { rollNo: '89', subject: 'Science', reason: 'Physics numerical incorrect', status: 'completed', date: '2023-10-09' },
    { rollNo: '90', subject: 'English', reason: 'Grammar section needs review', status: 'pending', date: '2023-10-08' },
    { rollNo: '101', subject: 'History', reason: 'Dates mentioned incorrectly', status: 'completed', date: '2023-10-07' },
    { rollNo: '112', subject: 'Geography', reason: 'Climate graph interpretation', status: 'in-review', date: '2023-10-06' }
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.requests);
    this.calculateResolvedRequests();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Helper methods
  getSubjectClass(subject: string): string {
    return subject.toLowerCase();
  }

  getStatusClass(status: string): string {
    return status;
  }

  getStatusIcon(status: string): string {
    switch(status) {
      case 'pending': return 'pending';
      case 'in-review': return 'hourglass_empty';
      case 'completed': return 'check_circle';
      default: return 'help';
    }
  }

  onPageSizeChange() {
    if (this.paginator) {
      this.paginator.pageSize = this.pageSize;
      this.paginator.firstPage();
    }
  }

  calculateResolvedRequests() {
    this.resolvedRequests = this.requests.filter(req => req.status === 'completed').length;
  }

  viewDetails(request: any) {
    alert(`Viewing details for Roll No: ${request.rollNo}\nSubject: ${request.subject}\nStatus: ${request.status}`);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}