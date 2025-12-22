import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../core/services/student.service';
import { TeacherService } from '../../../core/services/teacher.service';
import { SubjectService } from '../../../core/services/subject.service';
import { ClassesService, SchoolClass } from '../../../core/services/classes.service';
import { RequestRecheckService } from '../../../core/services/request-recheck.service';

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
  students: any[] = [];
  teachers: any[] = [];
  classes: any[] = [];
  allSubjects: any[] = [];

  // Recent activity
  recentStudents: any[] = [];
  recentTeachers: any[] = [];
  recentRechecks: any[] = [];

  // Class colors for distribution
  classColors = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #ff9a9e, #fad0c4)',
    'linear-gradient(135deg, #a18cd1, #fbc2eb)',
    'linear-gradient(135deg, #fad0c4, #ffd1ff)',
    'linear-gradient(135deg, #ffecd2, #fcb69f)',
    'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
    'linear-gradient(135deg, #d4fc79, #96e6a1)'
  ];

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private classesService: ClassesService,
    private recheckService: RequestRecheckService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load students
    this.studentService.getAllStudents().subscribe({
      next: (students: any) => {
        this.students = Array.isArray(students) ? students : [];
        this.totalStudents = this.students.length;
        this.activeStudents = this.students.filter(s => s.isActive !== false).length;
        this.recentStudents = this.students.slice(-5).reverse();
      },
      error: (err: any) => {
        console.error('Error loading students:', err);
        this.students = [];
        this.totalStudents = 0;
        this.activeStudents = 0;
      }
    });

    // Load teachers
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers: any) => {
        this.teachers = Array.isArray(teachers) ? teachers : [];
        this.totalTeachers = this.teachers.length;
        this.activeTeachers = this.teachers.filter(t => t.isActive !== false).length;
        this.recentTeachers = this.teachers.slice(-5).reverse();
      },
      error: (err: any) => {
        console.error('Error loading teachers:', err);
        this.teachers = [];
        this.totalTeachers = 0;
        this.activeTeachers = 0;
      }
    });

    // Load subjects
    this.subjectService.getAllSubjects().subscribe({
      next: (response: any) => {
        const subjectsArray = Array.isArray(response?.data) ? response.data : 
                             Array.isArray(response) ? response : [];
        this.allSubjects = subjectsArray || [];
        this.totalSubjects = this.allSubjects.length;
      },
      error: (err: any) => {
        console.error('Error loading subjects:', err);
        this.allSubjects = [];
        this.totalSubjects = 0;
      }
    });

    // Load classes
    this.classesService.getAllClasses().subscribe({
      next: (response: any) => {
        const classesArray = Array.isArray(response?.data) ? response.data : 
                            Array.isArray(response) ? response : [];
        this.classes = classesArray || [];
        this.totalClasses = this.classes.length;
      },
      error: (err: any) => {
        console.error('Error loading classes:', err);
        this.classes = [];
        this.totalClasses = 0;
      }
    });

    // Load recent rechecks
    this.recheckService.getAllRechecks().subscribe({
      next: (rechecks: any) => {
        const rechecksArray = Array.isArray(rechecks) ? rechecks : [];
        this.recentRechecks = rechecksArray.slice(-5).reverse();
      },
      error: (err: any) => {
        console.error('Error loading rechecks:', err);
        this.recentRechecks = [];
      }
    });
  }

  // Get unique class numbers (1-10)
  getUniqueClassNumbers(): number[] {
    const numbers = [];
    for (let i = 1; i <= 10; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  // Get student count for a specific class
  getStudentsInClass(classNumber: number): number {
    if (!this.students.length) return 0;
    
    // Exact match for class name
    const targetClassName = `Class ${classNumber}`;
    return this.students.filter(student => {
      return student.className === targetClassName;
    }).length;
  }

  // Get color for class distribution
  getClassColor(classNumber: number): string {
    return this.classColors[(classNumber - 1) % this.classColors.length];
  }

  // Get teachers by subject - improved version
  getTeachersBySubject(subjectName: string): number {
    if (!this.teachers.length || !subjectName) return 0;
    
    const searchTerm = subjectName.toLowerCase().trim();
    
    return this.teachers.filter(teacher => {
      // Check direct subject field
      if (teacher.subject) {
        if (typeof teacher.subject === 'string') {
          if (teacher.subject.toLowerCase().includes(searchTerm)) {
            return true;
          }
        }
      }
      
      // Check subjects array
      if (teacher.subjects) {
        if (Array.isArray(teacher.subjects)) {
          return teacher.subjects.some((s: any) => {
            if (typeof s === 'string') {
              return s.toLowerCase().includes(searchTerm);
            } else if (s && typeof s === 'object' && s.subjectName) {
              return s.subjectName.toLowerCase().includes(searchTerm);
            }
            return false;
          });
        } else if (typeof teacher.subjects === 'string') {
          return teacher.subjects.toLowerCase().includes(searchTerm);
        }
      }
      
      // Check for subjectName field in teacher object
      if (teacher.subjectName) {
        if (typeof teacher.subjectName === 'string') {
          return teacher.subjectName.toLowerCase().includes(searchTerm);
        }
      }
      
      return false;
    }).length;
  }

  // Get status color for recheck avatar
  getStatusColor(status: string): string {
    const normalizedStatus = (status || '').toUpperCase();
    if (normalizedStatus === 'PENDING') {
      return 'linear-gradient(135deg, #ff9800, #ff5722)';
    } else if (normalizedStatus === 'APPROVED') {
      return 'linear-gradient(135deg, #4caf50, #388e3c)';
    } else if (normalizedStatus === 'REJECTED') {
      return 'linear-gradient(135deg, #f44336, #d32f2f)';
    }
    return 'linear-gradient(135deg, #9e9e9e, #757575)';
  }
}