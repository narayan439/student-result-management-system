import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../../core/services/teacher.service';
import { SubjectService } from '../../../../core/services/subject.service';
import { Router } from '@angular/router';
import { Teacher } from '../../../../core/models/teacher.model';
import { Subject } from '../../../../core/models/subject.model';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent implements OnInit {

  teacher: Teacher = {
    name: '',
    email: '',
    subjects: [],
    phone: '',
    experience: 0,
    isActive: true
  };

  availableSubjects: string[] = [];
  subjectObjects: Subject[] = [];
  generatedPassword: string = '';

  constructor(
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSubjects();
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

  /**
   * Generate password preview as user enters name and phone
   * Format: First 3 letters of name (UPPERCASE) + Last 4 digits of phone
   */
  generatePasswordPreview(): void {
    if (this.teacher.name && this.teacher.phone) {
      const namePart = this.teacher.name.substring(0, 3).toUpperCase();
      const phonePart = this.teacher.phone.replace(/\D/g, '').slice(-4);
      this.generatedPassword = namePart + phonePart;
    } else {
      this.generatedPassword = '';
    }
  }

  /**
   * Copy password to clipboard
   */
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Password copied to clipboard!');
    }).catch(() => {
      alert('❌ Failed to copy password');
    });
  }

  createTeacher() {
    if (this.validateTeacherData()) {
      this.teacherService.addTeacher(this.teacher).subscribe({
        next: (res: any) => {
          alert('🎉 Teacher Added Successfully!');
          this.router.navigate(['/admin/manage-teachers']);
        },
        error: (err: any) => {
          console.error(err);
          alert('❌ Error: ' + (err.error?.message || 'Failed to add teacher'));
        }
      });
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