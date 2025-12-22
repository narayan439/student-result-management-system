import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { TeacherService } from '../../../core/services/teacher.service';
import { SubjectService } from '../../../core/services/subject.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Teacher } from '../../../core/models/teacher.model';
import { Subject } from '../../../core/models/subject.model';
import { Router } from '@angular/router';

// ... existing imports ...

@Component({
  selector: 'app-manage-teachers',
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.css']
})
export class ManageTeachersComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['name', 'email', 'phone', 'subjects', 'experience', 'actions'];
  dataSource = new MatTableDataSource<Teacher>([]);

  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  
  // Filter
  searchTerm = '';
  selectedSubject = 'all';
  allSubjects: string[] = [];
  
  // Loading state
  isLoading = false;

  constructor(
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.loadSubjects();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadTeachers(): void {
    this.isLoading = true;

    // Load from backend API
    this.teacherService.getAllTeachers().subscribe({
      next: (response: any) => {
        // Service already extracts the data array via map operator
        this.teachers = (Array.isArray(response) ? response : []) || [];
        
        // Process each teacher's subjects
        this.teachers = this.teachers.map(teacher => {
          return {
            ...teacher,
            // Ensure subjects is always an array of strings
            subjects: this.extractSubjectNames(teacher)
          };
        });
        
        console.log('Teachers loaded:', this.teachers);
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
        this.teachers = this.teacherService.getTeachersFromLocal();
        // Process local teachers too
        this.teachers = this.teachers.map(teacher => {
          return {
            ...teacher,
            subjects: this.extractSubjectNames(teacher)
          };
        });
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  // Helper method to extract subject names from teacher object
  private extractSubjectNames(teacher: any): string[] {
    let subjectsArray: string[] = [];
    
    if (teacher.subjects) {
      if (Array.isArray(teacher.subjects)) {
        // Handle array of subjects
        subjectsArray = teacher.subjects.map((s: any) => {
          if (typeof s === 'string') {
            return s;
          } else if (s && typeof s === 'object') {
            // Handle object with subjectName property
            return s.subjectName || s.name || s.subject || '';
          }
          return '';
        }).filter((s: string) => s.trim() !== '');
      } else if (typeof teacher.subjects === 'string') {
        // Handle comma-separated string
        subjectsArray = teacher.subjects.split(',').map((s: string) => s.trim()).filter((s: string) => s !== '');
      }
    } else if (teacher.subject) {
      // Handle single subject field
      if (typeof teacher.subject === 'string') {
        subjectsArray = [teacher.subject];
      }
    }
    
    return subjectsArray;
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (response: any) => {
        // Response is the full API response with { success, data: [...], message }
        const subjectsArray = response.data ? (Array.isArray(response.data) ? response.data : []) : [];
        console.log('Subjects loaded from API:', subjectsArray);
        // Filter only active subjects and extract subject names
        this.allSubjects = subjectsArray
          .filter((s: any) => s.isActive !== false)
          .map((s: any) => s.subjectName);
        console.log('All subjects after filter:', this.allSubjects);
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.allSubjects = [];
      }
    });
  }

  deleteTeacher(teacherId: string) {
    if (confirm("Are you sure you want to delete this teacher?")) {
      this.teacherService.deleteTeacher(teacherId).subscribe({
        next: (response: any) => {
          this.teachers = this.teachers.filter(t => t.teacherId !== teacherId);
          this.applyFilters();
          alert("✓ Teacher Deleted Successfully!");
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Failed to delete teacher';
          alert("✗ Error: " + errorMsg);
          console.error('Error deleting teacher:', err);
        }
      });
    }
  }

  editTeacher(teacher: Teacher): void {
    this.router.navigate(['/admin/manage-teachers/edit', teacher.teacherId], {
      state: { teacher }
    });
  }

  addTeacher(): void {
    this.router.navigate(['/admin/manage-teachers/add']);
  }

  // Search functionality
  onSearch(searchValue: any): void {
    this.searchTerm = (searchValue || '').toLowerCase();
    this.applyFilters();
  }

  // Subject filter functionality
  onSubjectFilter(subject: string): void {
    this.selectedSubject = subject;
    this.applyFilters();
  }

  // Apply all filters
  private applyFilters(): void {
    let filtered = [...this.teachers];

    // Filter by subject
    if (this.selectedSubject !== 'all') {
      filtered = filtered.filter(t => 
        t.subjects && t.subjects.some((s: string) => 
          s.toLowerCase() === this.selectedSubject.toLowerCase()
        )
      );
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(this.searchTerm) ||
        t.email.toLowerCase().includes(this.searchTerm) ||
        (t.subjects && t.subjects.some((s: string) => s.toLowerCase().includes(this.searchTerm)))
      );
    }

    this.filteredTeachers = filtered;
    this.dataSource.data = this.filteredTeachers;
  }

  // Helper methods for UI
  getUniqueSubjects(): string[] {
    return this.allSubjects;
  }

  getAverageExperience(): number {
    if (this.teachers.length === 0) return 0;
    const totalExp = this.teachers.reduce((sum, teacher) => sum + (teacher.experience || 0), 0);
    return Math.round(totalExp / this.teachers.length);
  }

  getAvatarColor(name: string): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  getSubjectColor(subject: string): string {
    const colorMap: {[key: string]: string} = {
      'Maths': '#4CAF50',
      'Mathematics': '#4CAF50',
      'Science': '#2196F3',
      'English': '#FF9800',
      'History': '#9C27B0',
      'Physics': '#F44336',
      'Chemistry': '#795548',
      'Computer Science': '#00BCD4',
      'Computer': '#00BCD4',
      'Geography': '#8BC34A',
      'Literature': '#E91E63',
      'Electronics': '#607D8B'
    };
    return colorMap[subject] || '#757575';
  }
}