import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../../../../core/services/teacher.service';
import { SubjectService } from '../../../../core/services/subject.service';
import { Teacher } from '../../../../core/models/teacher.model';
import { Subject } from '../../../../core/models/subject.model';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css']
})
export class EditTeacherComponent implements OnInit {

  teacherEmail: string = '';
  
  availableSubjects: string[] = [];
  subjectObjects: Subject[] = [];

  teacher: Teacher = {
    name: '',
    email: '',
    subjects: [],
    phone: '',
    experience: 0,
    isActive: true
  };

  originalTeacher: Teacher | null = null;
  isLoading = true;
  isSaving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private teacherService: TeacherService,
    private subjectService: SubjectService
  ) {}

  ngOnInit(): void {
    this.teacherEmail = this.route.snapshot.paramMap.get('email') || '';
    this.loadSubjects();
    if (this.teacherEmail) {
      this.loadTeacher();
    }
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (response: any) => {
        const subjectsArray = response.data ? (Array.isArray(response.data) ? response.data : []) : [];
        // Filter only active subjects
        this.subjectObjects = subjectsArray.filter((s: any) => s.isActive !== false);
        this.availableSubjects = this.subjectObjects.map((s: any) => s.subjectName);
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.availableSubjects = [];
      }
    });
  }

  toggleSubject(subject: string): void {
    if (this.teacher.subjects.includes(subject)) {
      this.teacher.subjects = this.teacher.subjects.filter(s => s !== subject);
    } else {
      this.teacher.subjects.push(subject);
    }
  }

  isSubjectSelected(subject: string): boolean {
    return this.teacher.subjects.includes(subject);
  }

  loadTeacher(): void {
    this.isLoading = true;
    this.teacherService.getAllTeachers().subscribe({
      next: (response: any) => {
        // Service already extracts the data array via map operator
        const teachersArray: Teacher[] = (Array.isArray(response) ? response : []) || [];
        console.log('Teachers loaded:', teachersArray.length);
        console.log('Looking for email:', this.teacherEmail);
        
        const found = teachersArray.find((t: Teacher) => t.email === this.teacherEmail);
        if (found) {
          // Convert subjects string to array if needed
          const subjectsArray = Array.isArray(found.subjects) ? found.subjects : 
                               (typeof found.subjects === 'string' ? (found.subjects as string).split(',').map((s: string) => s.trim()) : []);
          
          this.teacher = {
            ...found,
            subjects: subjectsArray
          };
          this.originalTeacher = JSON.parse(JSON.stringify(this.teacher));
          this.isLoading = false;
          console.log('Teacher found:', this.teacher);
        } else {
          console.warn('Teacher not found in list');
          alert('Teacher not found');
          this.router.navigate(['/admin/manage-teachers']);
        }
      },
      error: (err) => {
        console.error('Error loading teachers:', err);
        // Try to load from local storage as fallback
        const localTeachers = this.teacherService.getTeachersFromLocal();
        const found = localTeachers.find((t: Teacher) => t.email === this.teacherEmail);
        if (found) {
          // Convert subjects string to array if needed
          const subjectsArray = Array.isArray(found.subjects) ? found.subjects : 
                               (typeof found.subjects === 'string' ? (found.subjects as string).split(',').map((s: string) => s.trim()) : []);
          
          this.teacher = {
            ...found,
            subjects: subjectsArray
          };
          this.originalTeacher = JSON.parse(JSON.stringify(this.teacher));
          this.isLoading = false;
          console.log('Teacher found from local storage:', this.teacher);
        } else {
          alert('Error loading teacher data');
          this.router.navigate(['/admin/manage-teachers']);
        }
      }
    });
  }

  updateTeacher() {
    if (this.validateTeacherData()) {
      this.isSaving = true;
      this.teacherService.updateTeacher(this.teacher.teacherId!, this.teacher).subscribe({
        next: (res: any) => {
          alert('🎉 Teacher Updated Successfully!');
          this.router.navigate(['/admin/manage-teachers']);
        },
        error: (err: any) => {
          this.isSaving = false;
          console.error(err);
          alert('❌ Error: ' + (err.error?.message || 'Failed to update teacher'));
        }
      });
    }
  }

  resetForm() {
    if (confirm('Are you sure you want to reset all changes?')) {
      this.teacher = JSON.parse(JSON.stringify(this.originalTeacher));
    }
  }

  private validateTeacherData(): boolean {
    if (!this.teacher.name.trim()) {
      alert('Please enter teacher name');
      return false;
    }
    
    if (!this.teacher.email.trim()) {
      alert('Please enter email address');
      return false;
    }
    
    if (!this.isValidEmail(this.teacher.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    if (!this.teacher.subjects || this.teacher.subjects.length === 0) {
      alert('Please select at least one subject');
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}