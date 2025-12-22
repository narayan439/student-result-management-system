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
      phone: '+91 9876543210',
      experience: 15,
      isActive: true
    },
    {
      teacherId: '2',
      name: 'Ananya Patra',
      email: 'ananya@school.com',
      subjects: ['Science', 'Chemistry'],
      phone: '+91 9876543211',
      experience: 10,
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
        map((response: any) => response.data || []),
        tap((teachers: Teacher[]) => this.teachersSubject.next(teachers)),
        catchError((err: any) => {
          console.warn('API call failed, returning sample data');
          this.teachersSubject.next(this.sampleTeachers);
          return of(this.sampleTeachers);
        })
      );
  }

  /**
   * Get all teachers synchronously (for authentication)
   */
  getAllTeachersSync(): Teacher[] {
    return this.teachersSubject.value || this.sampleTeachers;
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
        map((response: any) => response.data as Teacher),
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

    // Convert subjects array to comma-separated string for backend
    const teacherData = {
      ...teacher,
      subjects: Array.isArray(teacher.subjects) ? teacher.subjects.join(',') : teacher.subjects
    };

    return this.http.post<TeacherResponse>(`${this.baseUrl}/add`, teacherData)
      .pipe(
        tap((response: any) => {
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
  updateTeacher(teacherId: string, teacher: Teacher): Observable<TeacherResponse> {
    const validationError = this.validateTeacher(teacher);
    if (validationError) {
      return throwError(() => ({
        success: false,
        message: validationError,
        errors: [validationError]
      }));
    }

    // Convert subjects array to comma-separated string for backend
    const teacherData = {
      ...teacher,
      subjects: Array.isArray(teacher.subjects) ? teacher.subjects.join(',') : teacher.subjects
    };

    return this.http.put<TeacherResponse>(`${this.baseUrl}/${teacherId}`, teacherData)
      .pipe(
        tap((response: any) => {
          if (response.success && response.data) {
            const currentTeachers = this.teachersSubject.value;
            const updatedTeachers = currentTeachers.map(t =>
              t.teacherId === teacherId ? response.data as Teacher : t
            );
            this.teachersSubject.next(updatedTeachers);
          }
        }),
        catchError((error: any) => {
          // Fallback to local storage
          const currentTeachers = this.teachersSubject.value;
          const updatedTeachers = currentTeachers.map(t =>
            t.teacherId === teacherId ? teacher : t
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
  deleteTeacher(teacherId: string): Observable<TeacherResponse> {
    return this.http.delete<TeacherResponse>(`${this.baseUrl}/${teacherId}`)
      .pipe(
        tap((response: any) => {
          if (response.success) {
            const currentTeachers = this.teachersSubject.value;
            const filteredTeachers = currentTeachers.filter(t => t.teacherId !== teacherId);
            this.teachersSubject.next(filteredTeachers);
          }
        }),
        catchError((error: any) => {
          // Fallback to local storage
          const currentTeachers = this.teachersSubject.value;
          const filteredTeachers = currentTeachers.filter(t => t.teacherId !== teacherId);
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
