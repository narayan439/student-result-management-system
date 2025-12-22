import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SubjectService } from '../../../core/services/subject.service';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-manage-subjects',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.css']
})
export class ManageSubjectsComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['code', 'name', 'actions'];

  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  dataSource: MatTableDataSource<Subject> = new MatTableDataSource();
  newSubjectCode = '';
  newSubjectName = '';
  
  // Loading state
  isLoading = false;
  searchTerm = '';
  showDeletedSubjects = false;  // Toggle to show/hide deleted subjects

  constructor(private subjectService: SubjectService) {}

  get activeSubjectsCount(): number {
    return this.subjects.filter(s => s.isActive !== false).length;
  }

  ngOnInit(): void {
    this.loadSubjects();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  loadSubjects(): void {
    this.isLoading = true;

    this.subjectService.getAllSubjects().subscribe({
      next: (response: any) => {
        console.log('Subject response:', response);
        const subjectsArray = Array.isArray(response.data) ? response.data : [];
        this.subjects = subjectsArray;
        this.applyFilters();
        this.isLoading = false;
        console.log('Loaded subjects:', subjectsArray.length);
      },
      error: (err: any) => {
        console.error('Error loading subjects:', err);
        this.subjects = [];
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.subjects];

    // Filter by active/inactive status based on toggle
    if (!this.showDeletedSubjects) {
      filtered = filtered.filter(s => s.isActive !== false);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s =>
        s.code.toLowerCase().includes(term) ||
        s.subjectName.toLowerCase().includes(term)
      );
    }

    this.filteredSubjects = filtered;
    this.dataSource.data = this.filteredSubjects;
  }

  onSearch(searchValue: any): void {
    this.searchTerm = (searchValue || '').toLowerCase();
    this.applyFilters();
  }

  toggleShowDeletedSubjects(): void {
    this.showDeletedSubjects = !this.showDeletedSubjects;
    this.applyFilters();
  }

  addSubject(): void {
    const code = this.newSubjectCode.trim().toUpperCase();
    const name = this.newSubjectName.trim();

    if (!code) {
      alert('Please enter subject code');
      return;
    }

    if (!name) {
      alert('Please enter subject name');
      return;
    }

    // Only check for duplicates among ACTIVE subjects
    if (this.subjects.some(s => s.code === code && s.isActive !== false)) {
      alert('Subject code already exists!');
      return;
    }

    if (this.subjects.some(s => s.subjectName === name && s.isActive !== false)) {
      alert('Subject name already exists!');
      return;
    }

    // Check if this is a reactivation of a deleted subject
    const deletedSubject = this.subjects.find(s => s.code === code && s.isActive === false);
    if (deletedSubject) {
      const reactivate = confirm(`Subject "${code}" was previously deleted. Do you want to reactivate it instead?`);
      if (reactivate) {
        this.reactivateSubject(deletedSubject);
        return;
      }
    }

    const newSubject: Subject = {
      code: code,
      subjectName: name,
      isActive: true
    };

    console.log('Adding subject:', newSubject);
    
    this.subjectService.addSubject(newSubject).subscribe({
      next: (response: any) => {
        console.log('Subject added response:', response);
        alert('✅ Subject added successfully!');
        this.newSubjectCode = '';
        this.newSubjectName = '';
        this.loadSubjects();
      },
      error: (err: any) => {
        console.error('Error adding subject:', err);
        const errorMsg = err.error?.message || err.message || 'Failed to add subject';
        alert('❌ Error: ' + errorMsg);
      }
    });
  }

  deleteSubject(subject: Subject): void {
    if (confirm(`Delete subject ${subject.subjectName} (${subject.code})?`)) {
      if (subject.subjectId) {
        console.log('Deleting subject with ID:', subject.subjectId);
        this.subjectService.deleteSubject(subject.subjectId).subscribe({
          next: (response: any) => {
            console.log('Subject deleted response:', response);
            alert('✅ Subject deleted successfully!');
            this.loadSubjects();
          },
          error: (err: any) => {
            console.error('Error deleting subject:', err);
            const errorMsg = err.error?.message || err.message || 'Failed to delete subject';
            alert('❌ Error: ' + errorMsg);
          }
        });
      } else {
        alert('❌ Subject ID not found');
      }
    }
  }

  reactivateSubject(subject: Subject): void {
    if (!subject.subjectId) {
      alert('❌ Subject ID not found');
      return;
    }

    const updatedSubject: Subject = {
      ...subject,
      isActive: true
    };

    console.log('Reactivating subject:', subject.subjectId);
    this.subjectService.updateSubject(subject.subjectId, updatedSubject).subscribe({
      next: (response: any) => {
        console.log('Subject reactivated response:', response);
        alert('✅ Subject reactivated successfully!');
        this.newSubjectCode = '';
        this.newSubjectName = '';
        this.loadSubjects();
      },
      error: (err: any) => {
        console.error('Error reactivating subject:', err);
        const errorMsg = err.error?.message || err.message || 'Failed to reactivate subject';
        alert('❌ Error: ' + errorMsg);
      }
    });
  }

  onPageChange(event: any): void {
    // Paginator change event handled automatically by MatTableDataSource
  }
}