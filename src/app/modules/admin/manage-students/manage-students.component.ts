import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { ClassesService } from '../../../core/services/classes.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.css']
})
export class ManageStudentsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'className', 'rollNo', 'actions'];
  students = [
    { name: 'Narayan', email: 'narayan@student.com', className: 'Class 1 - A', rollNo: '23' },
    { name: 'Rakesh', email: 'rakesh@student.com', className: 'Class 1 - B', rollNo: '19' }
  ];
  
  // Optional: Use MatTableDataSource for additional features
  dataSource = new MatTableDataSource(this.students);

  // Classes count
  totalClasses: number = 0;

  constructor(
    private adminService: AdminService,
    private classesService: ClassesService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    // TODO: Fetch from backend later
    // this.adminService.getAllStudents().subscribe(res => {
    //   this.students = res;
    //   this.dataSource.data = this.students;
    // });
  }

  loadClasses(): void {
    // Get total number of classes from ClassesService
    this.totalClasses = this.classesService.getClassesArray().length;
  }

  deleteStudent(rollNo: any) {
    if (confirm("Are you sure you want to delete this student?")) {
      this.students = this.students.filter(s => s.rollNo !== rollNo);
      this.dataSource.data = this.students; // Update data source
      alert("Student Deleted Successfully!");
    }
  }

  // Optional: Add filtering functionality
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}