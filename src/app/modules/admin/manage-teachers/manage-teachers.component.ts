import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../core/services/teacher.service';
import { SubjectService } from '../../../core/services/subject.service';
import { MatTableDataSource } from '@angular/material/table';
import { Teacher } from '../../../core/models/teacher.model';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-manage-teachers',
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.css']
})
export class ManageTeachersComponent implements OnInit {

  displayedColumns: string[] = ['name', 'subjects', 'email', 'actions'];
  dataSource = new MatTableDataSource<Teacher>([]);

  teachers: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  
  // Filter
  searchTerm = '';
  selectedSubject = 'all';
  allSubjects: string[] = [];

  constructor(
    private teacherService: TeacherService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.loadSubjects();
  }

  loadTeachers(): void {
    // Get teachers from local data first
    this.teachers = this.teacherService.getTeachersFromLocal();
    this.applyFilters();

    // Try to load from backend
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers: Teacher[]) => {
        this.teachers = teachers;
        this.loadSubjects();
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
      }
    });
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects: Subject[]) => {
        this.allSubjects = subjects.map(s => s.subjectName);
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
      }
    });
  }

  deleteTeacher(email: string) {
    if (confirm("Are you sure you want to delete this teacher?")) {
      this.teacherService.deleteTeacher(email).subscribe({
        next: (response: any) => {
          this.teachers = this.teachers.filter(t => t.email !== email);
          this.applyFilters();
          alert("🎉 Teacher Deleted Successfully!");
        },
        error: (err) => {
          const errorMsg = err.error?.message || 'Failed to delete teacher';
          alert("❌ Error: " + errorMsg);
          console.error('Error deleting teacher:', err);
        }
      });
    }
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
      filtered = filtered.filter(t => t.subjects.includes(this.selectedSubject));
    }

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(this.searchTerm) ||
        t.email.toLowerCase().includes(this.searchTerm) ||
        t.subjects.some(s => s.toLowerCase().includes(this.searchTerm))
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
      'Science': '#2196F3',
      'English': '#FF9800',
      'History': '#9C27B0',
      'Physics': '#F44336',
      'Chemistry': '#795548',
      'Computer Science': '#00BCD4',
      'Geography': '#8BC34A',
      'Literature': '#E91E63',
      'Electronics': '#607D8B'
    };
    return colorMap[subject] || '#757575';
  }
}