import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Teacher, TeacherResponse, TeacherListResponse } from '../models/teacher.model';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private baseUrl = 'http://localhost:8080/api/teachers';
  private teachersSubject = new BehaviorSubject<Teacher[]>([]);
  public teachers$ = this.teachersSubject.asObservable();

  // Sample teachers data
  private sampleTeachers: Teacher[] = [
    {
      teacherId: '1',
      name: 'Rahul Sen',
      email: 'rahul@school.com',
      subjects: ['Maths', 'Physics'],
      dob: '1985-06-12',
      phone: '+91 9876543210',
      experience: 15,
      isActive: true
    },
    {
      teacherId: '2',
      name: 'Ananya Patra',
      email: 'ananya@school.com',
      subjects: ['Science', 'Chemistry'],
      dob: '1989-11-25',
      phone: '+91 9876543211',
      experience: 10,
      isActive: true
    },
    {
      teacherId: '3',
      name: 'Sanjay Kumar',
      email: 'sanjay@school.com',
      subjects: ['English', 'Literature'],
      dob: '1980-03-15',
      phone: '+91 9876543212',
      experience: 20,
      isActive: true
    },
    {
      teacherId: '4',
      name: 'Priya Sharma',
      email: 'priya@school.com',
      subjects: ['History', 'Geography'],
      dob: '1990-08-30',
      phone: '+91 9876543213',
      experience: 8,
      isActive: true
    },
    {
      teacherId: '5',
      name: 'Amit Singh',
      email: 'amit@school.com',
      subjects: ['Physics', 'Electronics'],
      dob: '1987-12-05',
      phone: '+91 9876543214',
      experience: 12,
      isActive: true
    },
    {
      teacherId: '6',
      name: 'Divya Nair',
      email: 'divya@school.com',
      subjects: ['Maths', 'Computer Science'],
      dob: '1992-04-18',
      phone: '+91 9876543215',
      experience: 6,
      isActive: true
    },
    {
      teacherId: '7',
      name: 'Rajesh Verma',
      email: 'rajesh@school.com',
      subjects: ['Biology', 'Science'],
      dob: '1986-07-22',
      phone: '+91 9876543216',
      experience: 14,
      isActive: true
    },
    {
      teacherId: '8',
      name: 'Neha Gupta',
      email: 'neha@school.com',
      subjects: ['English', 'History'],
      dob: '1991-02-14',
      phone: '+91 9876543217',
      experience: 9,
      isActive: true
    },
    {
      teacherId: '9',
      name: 'Vikram Patel',
      email: 'vikram@school.com',
      subjects: ['Physics', 'Mathematics'],
      dob: '1984-09-08',
      phone: '+91 9876543218',
      experience: 18,
      isActive: true
    },
    {
      teacherId: '10',
      name: 'Shreya Roy',
      email: 'shreya@school.com',
      subjects: ['Chemistry', 'Science'],
      dob: '1993-05-19',
      phone: '+91 9876543219',
      experience: 5,
      isActive: true
    },
    {
      teacherId: '11',
      name: 'Arjun Dasgupta',
      email: 'arjun@school.com',
      subjects: ['Computer Science', 'Electronics'],
      dob: '1988-10-27',
      phone: '+91 9876543220',
      experience: 11,
      isActive: true
    },
    {
      teacherId: '12',
      name: 'Pooja Mishra',
      email: 'pooja@school.com',
      subjects: ['Geography', 'Economics'],
      dob: '1990-01-06',
      phone: '+91 9876543221',
      experience: 9,
      isActive: true
    },
    {
      teacherId: '13',
      name: 'Manoj Reddy',
      email: 'manoj@school.com',
      subjects: ['Maths', 'Economics'],
      dob: '1982-12-11',
      phone: '+91 9876543222',
      experience: 22,
      isActive: true
    },
    {
      teacherId: '14',
      name: 'Isha Chopra',
      email: 'isha@school.com',
      subjects: ['Literature', 'English'],
      dob: '1994-03-28',
      phone: '+91 9876543223',
      experience: 4,
      isActive: true
    },
    {
      teacherId: '15',
      name: 'Deepak Kumar',
      email: 'deepak@school.com',
      subjects: ['Physics', 'Chemistry'],
      dob: '1985-11-15',
      phone: '+91 9876543224',
      experience: 13,
      isActive: true
    },
    {
      teacherId: '16',
      name: 'Anjali Singh',
      email: 'anjali@school.com',
      subjects: ['Science', 'Biology'],
      dob: '1989-06-09',
      phone: '+91 9876543225',
      experience: 10,
      isActive: true
    },
    {
      teacherId: '17',
      name: 'Rohit Joshi',
      email: 'rohit@school.com',
      subjects: ['Computer Science', 'Maths'],
      dob: '1991-08-20',
      phone: '+91 9876543226',
      experience: 8,
      isActive: true
    },
    {
      teacherId: '18',
      name: 'Priyanka Iyer',
      email: 'priyanka@school.com',
      subjects: ['History', 'Literature'],
      dob: '1987-04-14',
      phone: '+91 9876543227',
      experience: 12,
      isActive: true
    },
    {
      teacherId: '19',
      name: 'Suresh Bhat',
      email: 'suresh@school.com',
      subjects: ['Geography', 'History'],
      dob: '1983-07-07',
      phone: '+91 9876543228',
      experience: 19,
      isActive: true
    },
    {
      teacherId: '20',
      name: 'Kavya Menon',
      email: 'kavya@school.com',
      subjects: ['Economics', 'English'],
      dob: '1992-09-23',
      phone: '+91 9876543229',
      experience: 7,
      isActive: true
    },
    {
      teacherId: '21',
      name: 'Aditya Negi',
      email: 'aditya@school.com',
      subjects: ['Maths', 'Electronics'],
      dob: '1986-02-16',
      phone: '+91 9876543230',
      experience: 14,
      isActive: true
    },
    {
      teacherId: '22',
      name: 'Ritika Desai',
      email: 'ritika@school.com',
      subjects: ['Chemistry', 'Biology'],
      dob: '1993-12-01',
      phone: '+91 9876543231',
      experience: 5,
      isActive: true
    },
    {
      teacherId: '23',
      name: 'Varun Kapoor',
      email: 'varun@school.com',
      subjects: ['Physics', 'Computer Science'],
      dob: '1988-05-10',
      phone: '+91 9876543232',
      experience: 11,
      isActive: true
    },
    {
      teacherId: '24',
      name: 'Nisha Rao',
      email: 'nisha@school.com',
      subjects: ['English', 'Geography'],
      dob: '1990-10-17',
      phone: '+91 9876543233',
      experience: 9,
      isActive: true
    },
    {
      teacherId: '25',
      name: 'Aryan Saxena',
      email: 'aryan@school.com',
      subjects: ['Science', 'Electronics'],
      dob: '1987-01-25',
      phone: '+91 9876543234',
      experience: 13,
      isActive: true
    },
    {
      teacherId: '26',
      name: 'Disha Kulkarni',
      email: 'disha@school.com',
      subjects: ['Literature', 'History'],
      dob: '1995-03-12',
      phone: '+91 9876543235',
      experience: 3,
      isActive: true
    }
  ];

  constructor(private http: HttpClient) {
    this.teachersSubject.next(this.sampleTeachers);
  }

  /**
   * Get all teachers
   */
  getAllTeachers(): Observable<Teacher[]> {
    return this.http.get<TeacherListResponse>(`${this.baseUrl}/all`)
      .pipe(
        map(response => response.data || []),
        tap(teachers => this.teachersSubject.next(teachers)),
        catchError(err => {
          console.warn('API call failed, returning sample data');
          this.teachersSubject.next(this.sampleTeachers);
          return of(this.sampleTeachers);
        })
      );
  }

  /**
   * Get teachers from local data (for offline support)
   */
  getTeachersFromLocal(): Teacher[] {
    return this.teachersSubject.value;
  }

  /**
   * Get single teacher by email
   */
  getTeacherByEmail(email: string): Observable<Teacher> {
    return this.http.get<TeacherResponse>(`${this.baseUrl}/${email}`)
      .pipe(
        map(response => response.data as Teacher),
        catchError(this.handleError)
      );
  }

  /**
   * Add new teacher
   */
  addTeacher(teacher: Teacher): Observable<TeacherResponse> {
    const validationError = this.validateTeacher(teacher);
    if (validationError) {
      return throwError(() => ({
        success: false,
        message: validationError,
        errors: [validationError]
      }));
    }

    return this.http.post<TeacherResponse>(`${this.baseUrl}/add`, teacher)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            const currentTeachers = this.teachersSubject.value;
            this.teachersSubject.next([...currentTeachers, response.data]);
          }
        }),
        catchError((error) => {
          // Fallback to local storage
          const currentTeachers = this.teachersSubject.value;
          const nextId = (currentTeachers.length + 1).toString();
          
          const newTeacher: Teacher = {
            ...teacher,
            teacherId: nextId
          };
          
          this.teachersSubject.next([...currentTeachers, newTeacher]);
          
          return new Observable<TeacherResponse>(observer => {
            observer.next({
              success: true,
              message: 'Teacher added successfully (Local)',
              data: newTeacher,
              errors: []
            });
            observer.complete();
          });
        })
      );
  }

  /**
   * Update teacher information
   */
  updateTeacher(email: string, teacher: Teacher): Observable<TeacherResponse> {
    const validationError = this.validateTeacher(teacher);
    if (validationError) {
      return throwError(() => ({
        success: false,
        message: validationError,
        errors: [validationError]
      }));
    }

    return this.http.put<TeacherResponse>(`${this.baseUrl}/${email}`, teacher)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            const currentTeachers = this.teachersSubject.value;
            const updatedTeachers = currentTeachers.map(t =>
              t.email === email ? response.data as Teacher : t
            );
            this.teachersSubject.next(updatedTeachers);
          }
        }),
        catchError((error) => {
          // Fallback to local storage
          const currentTeachers = this.teachersSubject.value;
          const updatedTeachers = currentTeachers.map(t =>
            t.email === email ? teacher : t
          );
          this.teachersSubject.next(updatedTeachers);
          
          return new Observable<TeacherResponse>(observer => {
            observer.next({
              success: true,
              message: 'Teacher updated successfully (Local)',
              data: teacher,
              errors: []
            });
            observer.complete();
          });
        })
      );
  }

  /**
   * Delete teacher
   */
  deleteTeacher(email: string): Observable<TeacherResponse> {
    return this.http.delete<TeacherResponse>(`${this.baseUrl}/${email}`)
      .pipe(
        tap(response => {
          if (response.success) {
            const currentTeachers = this.teachersSubject.value;
            const filteredTeachers = currentTeachers.filter(t => t.email !== email);
            this.teachersSubject.next(filteredTeachers);
          }
        }),
        catchError((error) => {
          // Fallback to local storage
          const currentTeachers = this.teachersSubject.value;
          const filteredTeachers = currentTeachers.filter(t => t.email !== email);
          this.teachersSubject.next(filteredTeachers);
          
          return new Observable<TeacherResponse>(observer => {
            observer.next({
              success: true,
              message: 'Teacher deleted successfully (Local)',
              errors: []
            });
            observer.complete();
          });
        })
      );
  }

  /**
   * Get teachers by subject
   */
  getTeachersBySubject(subject: string): Observable<Teacher[]> {
    const teachers = this.teachersSubject.value.filter(t =>
      t.subjects.includes(subject)
    );
    return new Observable(observer => {
      observer.next(teachers);
      observer.complete();
    });
  }

  /**
   * Get all unique subjects taught
   */
  getAllSubjects(): string[] {
    const subjectSet = new Set<string>();
    this.teachersSubject.value.forEach(teacher => {
      teacher.subjects.forEach(subject => subjectSet.add(subject));
    });
    return Array.from(subjectSet).sort();
  }

  /**
   * Validate teacher data
   */
  private validateTeacher(teacher: Teacher): string | null {
    if (!teacher.name || !teacher.name.trim()) {
      return 'Teacher name is required';
    }

    if (!teacher.email || !teacher.email.trim()) {
      return 'Email address is required';
    }

    if (!this.isValidEmail(teacher.email)) {
      return 'Invalid email format';
    }

    if (!teacher.subjects || teacher.subjects.length === 0) {
      return 'At least one subject is required';
    }

    if (!teacher.dob) {
      return 'Date of birth is required';
    }

    // Check if email already exists (excluding current teacher during update)
    const existingTeacher = this.teachersSubject.value.find(
      t => t.email === teacher.email && t.email !== teacher.email
    );
    if (existingTeacher) {
      return 'Email already exists';
    }

    return null;
  }

  /**
   * Email validation helper
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Error handling
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.error?.message || error.statusText || 'Server error';
    }

    console.error('TeacherService Error:', errorMessage);
    return throwError(() => ({
      success: false,
      message: errorMessage,
      errors: [errorMessage]
    }));
  }

  /**
   * Get total teacher count
   */
  getTotalTeacherCount(): number {
    return this.teachersSubject.value.length;
  }

  /**
   * Get teacher count by subject
   */
  getTeacherCountBySubject(subject: string): number {
    return this.teachersSubject.value.filter(t => t.subjects.includes(subject)).length;
  }

  /**
   * Clear all teachers (for testing)
   */
  clearTeachers(): void {
    this.teachersSubject.next([]);
  }

  /**
   * Reset to sample data (for testing)
   */
  resetToSampleData(): void {
    this.teachersSubject.next([...this.sampleTeachers]);
  }
}
