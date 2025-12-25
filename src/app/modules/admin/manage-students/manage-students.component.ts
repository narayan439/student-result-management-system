import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StudentService } from '../../../core/services/student.service';
import { ClassesService } from '../../../core/services/classes.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Student } from '../../../core/models/student.model';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.css']
})
export class ManageStudentsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['studentId', 'name', 'email', 'className', 'rollNo', 'actions'];
  students: Student[] = [];
  filteredStudents: Student[] = [];
  
  // Use MatTableDataSource for additional features
  dataSource = new MatTableDataSource(this.students);

  // Classes count and list
  totalClasses: number = 0;
  classes: any[] = [];
  selectedClass: string = 'all';
  
  // Search term
  searchTerm: string = '';
  
  isLoading = false;

  constructor(
    private studentService: StudentService,
    private classesService: ClassesService,
    private notify: NotificationService,
    private confirmDialog: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
    this.loadStudents();
  }

  ngAfterViewInit(): void {
    // Set up paginator after view initialization
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadClasses(): void {
    // Load classes from backend API
    this.classesService.getAllClasses().subscribe({
      next: (response: any) => {
        const classesArray = Array.isArray(response?.data) ? response.data : 
                            Array.isArray(response) ? response : [];
        this.classes = classesArray || [];
        this.totalClasses = this.classes.length;
      },
      error: (err: any) => {
        console.error('Error loading classes:', err);
        // Fallback to cached classes
        this.classes = this.classesService.getClassesArray();
        this.totalClasses = this.classes.length;
      }
    });
  }

  loadStudents(): void {
    this.isLoading = true;
    
    // Get students from local data first
    this.students = this.studentService.getStudentsFromLocal();
    this.applyFilters();
    this.isLoading = false;

    // Try to load from backend
    this.studentService.getAllStudents().subscribe({
      next: (students: Student[]) => {
        this.students = students;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading students:', err);
      }
    });
  }

  async deleteStudent(studentId: any) {
    const ok = await this.confirmDialog.confirm(
      'Are you sure you want to delete this student?',
      'Confirm Delete',
      'Delete',
      'Cancel'
    );
    if (!ok) return;

    this.studentService.deleteStudent(studentId).subscribe({
      next: () => {
        this.students = this.students.filter(s => s.studentId !== studentId);
        this.applyFilters();
        this.notify.success('Student deleted successfully!');
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Failed to delete student';
        this.notify.error('Error: ' + errorMsg);
        console.error('Error deleting student:', err);
      }
    });
  }

  // Search functionality
  onSearch(searchValue: any): void {
    this.searchTerm = (searchValue || '').toLowerCase();
    this.applyFilters();
  }

  // Class filter functionality
  onClassFilter(className: string): void {
    this.selectedClass = className;
    this.applyFilters();
  }

  // Apply all filters
  private applyFilters(): void {
    let filtered = [...this.students];

    // Filter by class
    if (this.selectedClass !== 'all') {
      filtered = filtered.filter(s => s.className === this.selectedClass);
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(this.searchTerm) ||
        s.email.toLowerCase().includes(this.searchTerm) ||
        s.rollNo.toLowerCase().includes(this.searchTerm) ||
        (s.studentId ? s.studentId.toString().includes(this.searchTerm) : false)
      );
    }

    this.filteredStudents = filtered;
    this.dataSource.data = this.filteredStudents;
  }
}