import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../core/services/student.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { SubjectService } from '../../../core/services/subject.service';
import { ClassesService, SchoolClass } from '../../../core/services/classes.service';
import { Student } from '../../../core/models/student.model';
import { Teacher } from '../../../core/models/teacher.model';
import { Subject } from '../../../core/models/subject.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // Statistics
  totalStudents = 0;
  totalTeachers = 0;
  totalSubjects = 0;
  totalClasses = 0;
  activeStudents = 0;
  activeTeachers = 0;

  // Data arrays
  students: Student[] = [];
  teachers: Teacher[] = [];
  classes: SchoolClass[] = [];
  allSubjects: Subject[] = [];

  // Recent activity
  recentStudents: Student[] = [];
  recentTeachers: Teacher[] = [];

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private classesService: ClassesService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load students with timeout to ensure services are initialized
    setTimeout(() => {
      console.log('Loading students...');
      this.studentService.getAllStudents().subscribe({
        next: (students: any) => {
          console.log('Students received:', students);
          this.students = (Array.isArray(students) ? students : []) || [];
          this.totalStudents = this.students.length;
          this.activeStudents = this.students.filter(s => s.isActive !== false).length;
          this.recentStudents = this.students.slice(-5).reverse();
          console.log('✓ Students loaded:', this.totalStudents);
        },
        error: (err: any) => {
          console.error('✗ Error loading students:', err);
          this.students = [];
          this.totalStudents = 0;
          this.activeStudents = 0;
        }
      });

      // Load teachers
      console.log('Loading teachers...');
      this.teacherService.getAllTeachers().subscribe({
        next: (teachers: any) => {
          console.log('Teachers received:', teachers);
          this.teachers = (Array.isArray(teachers) ? teachers : []) || [];
          this.totalTeachers = this.teachers.length;
          this.activeTeachers = this.teachers.filter(t => t.isActive !== false).length;
          this.recentTeachers = this.teachers.slice(-5).reverse();
          console.log('✓ Teachers loaded:', this.totalTeachers);
        },
        error: (err: any) => {
          console.error('✗ Error loading teachers:', err);
          this.teachers = [];
          this.totalTeachers = 0;
          this.activeTeachers = 0;
        }
      });

      // Load subjects
      console.log('Loading subjects...');
      this.subjectService.getAllSubjects().subscribe({
        next: (subjects: any) => {
          console.log('Subjects received:', subjects);
          this.allSubjects = (Array.isArray(subjects) ? subjects : []) || [];
          this.totalSubjects = this.allSubjects.length;
          console.log('✓ Subjects loaded:', this.totalSubjects);
        },
        error: (err: any) => {
          console.error('✗ Error loading subjects:', err);
          this.allSubjects = [];
          this.totalSubjects = 0;
        }
      });

      // Load classes
      console.log('Loading classes...');
      this.classesService.getClasses().subscribe({
        next: (classes: any) => {
          console.log('Classes received:', classes);
          this.classes = (Array.isArray(classes) ? classes : []) || [];
          this.totalClasses = this.classes.length;
          console.log('✓ Classes loaded:', this.totalClasses);
        },
        error: (err: any) => {
          console.error('✗ Error loading classes:', err);
          this.classes = [];
          this.totalClasses = 0;
        }
      });
    }, 500);
  }

  // Helper methods for UI
  getStudentsByClass(className: string): number {
    return this.students.filter(s => s.className === className).length;
  }

  getTeachersBySubject(subject: string): number {
    return this.teachers.filter(t => t.subjects?.includes(subject)).length;
  }

  // Get unique class numbers (1-10) to show in dashboard
  getUniqueClassNumbers(): number[] {
    const uniqueClasses = new Set<number>();
    for (let i = 1; i <= 10; i++) {
      uniqueClasses.add(i);
    }
    return Array.from(uniqueClasses).sort((a, b) => a - b);
  }

  // Get student count for a specific class number across all sections
  getStudentsInClass(classNumber: number): number {
    return this.students.filter(s => s.className.includes(`Class ${classNumber}`)).length;
  }
}