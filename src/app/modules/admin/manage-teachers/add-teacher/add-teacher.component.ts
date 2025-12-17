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
    dob: '',
    phone: '',
    experience: 0,
    isActive: true
  };

  availableSubjects: string[] = [];
  subjectObjects: Subject[] = [];

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
      next: (subjects: Subject[]) => {
        this.subjectObjects = subjects;
        this.availableSubjects = subjects.map(s => s.subjectName);
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
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
    
    if (!this.teacher.dob) {
      alert('Please select date of birth');
      return false;
    }
    
    if (!this.isValidAge(this.teacher.dob)) {
      alert('Teacher must be at least 21 years old');
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidAge(dob: string): boolean {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 21;
  }
}