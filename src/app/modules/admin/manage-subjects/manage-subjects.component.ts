import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SubjectService } from '../../../core/services/subject.service';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-manage-subjects',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.css']
})
export class ManageSubjectsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['code', 'name', 'actions'];

  subjects: Subject[] = [];
  dataSource: MatTableDataSource<Subject> = new MatTableDataSource();
  newSubjectCode = '';
  newSubjectName = '';

  constructor(private subjectService: SubjectService) {}

  ngOnInit(): void {
    this.loadSubjects();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects: Subject[]) => {
        this.subjects = subjects;
        this.dataSource.data = subjects;
        console.log('Loaded subjects:', subjects.length);
      },
      error: (err: any) => {
        console.error('Error loading subjects:', err);
      }
    });
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

    if (this.subjects.some(s => s.subjectCode === code)) {
      alert('Subject code already exists!');
      return;
    }

    if (this.subjects.some(s => s.subjectName === name)) {
      alert('Subject name already exists!');
      return;
    }

    const newSubject: Subject = {
      subjectCode: code,
      subjectName: name,
      isActive: true
    };

    this.subjectService.addSubject(newSubject).subscribe({
      next: () => {
        alert('✅ Subject added successfully!');
        this.newSubjectCode = '';
        this.newSubjectName = '';
        this.loadSubjects();
      },
      error: (err: any) => {
        console.error('Error adding subject:', err);
        alert('❌ Error adding subject');
      }
    });
  }

  deleteSubject(subject: Subject): void {
    if (confirm(`Delete subject ${subject.subjectName} (${subject.subjectCode})?`)) {
      if (subject.subjectId) {
        this.subjectService.deleteSubject(subject.subjectId).subscribe({
          next: () => {
            alert('✅ Subject deleted successfully!');
            this.loadSubjects();
          },
          error: (err: any) => {
            console.error('Error deleting subject:', err);
            alert('❌ Error deleting subject');
          }
        });
      }
    }
  }

  onPageChange(event: any): void {
    // Paginator change event handled automatically by MatTableDataSource
  }
}