import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Student, StudentResponse, StudentListResponse } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'http://localhost:8080/api/students';
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  // Sample students data
  private sampleStudents: Student[] = [
    {
      studentId: 1,
      name: 'Arjun Kumar',
      email: 'arjun@example.com',
      className: 'Class 1 - A',
      rollNo: '001',
      dob: '2010-05-15',
      phone: '9876543210',
      address: 'New Delhi',
      isActive: true
    },
    {
      studentId: 2,
      name: 'Priya Singh',
      email: 'priya@example.com',
      className: 'Class 2 - B',
      rollNo: '001',
      dob: '2009-08-22',
      phone: '9876543211',
      address: 'Mumbai',
      isActive: true
    }
  ];

  constructor(private http: HttpClient) {
    this.studentsSubject.next(this.sampleStudents);
  }

  /**
   * Get all students
   */
  getAllStudents(): Observable<Student[]> {
    return this.http.get<StudentListResponse>(`${this.baseUrl}/all`)
      .pipe(
        map(response => response.data || []),
        tap(students => this.studentsSubject.next(students)),
        catchError(this.handleError)
      );
  }

  /**
   * Get students from local data (for offline support)
   */
  getStudentsFromLocal(): Student[] {
    return this.studentsSubject.value;
  }

  /**
   * Get single student by ID
   */
  getStudentById(studentId: number): Observable<Student> {
    return this.http.get<StudentResponse>(`${this.baseUrl}/${studentId}`)
      .pipe(
        map(response => response.data as Student),
        catchError(this.handleError)
      );
  }

  /**
   * Add/Create new student
   */
  addStudent(student: Student): Observable<StudentResponse> {
    // Validate student data
    const validationError = this.validateStudent(student);
    if (validationError) {
      return throwError(() => ({
        success: false,
        message: validationError,
        errors: [validationError]
      }));
    }

    return this.http.post<StudentResponse>(`${this.baseUrl}/add`, student)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            // Add to local data
            const currentStudents = this.studentsSubject.value;
            this.studentsSubject.next([...currentStudents, response.data]);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Save student (create or update)
   */
  saveStudent(student: Student): Observable<StudentResponse> {
    if (student.studentId) {
      return this.updateStudent(student);
    } else {
      return this.addStudent(student);
    }
  }

  /**
   * Update student information
   */
  updateStudent(student: Student): Observable<StudentResponse> {
    if (!student.studentId) {
      return throwError(() => ({
        success: false,
        message: 'Student ID is required for update',
        errors: ['Student ID is required']
      }));
    }

    // Validate student data
    const validationError = this.validateStudent(student);
    if (validationError) {
      return throwError(() => ({
        success: false,
        message: validationError,
        errors: [validationError]
      }));
    }

    return this.http.put<StudentResponse>(`${this.baseUrl}/${student.studentId}`, student)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            // Update in local data
            const currentStudents = this.studentsSubject.value;
            const updatedStudents = currentStudents.map(s =>
              s.studentId === student.studentId ? response.data as Student : s
            );
            this.studentsSubject.next(updatedStudents);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Delete student
   */
  deleteStudent(studentId: number): Observable<StudentResponse> {
    return this.http.delete<StudentResponse>(`${this.baseUrl}/${studentId}`)
      .pipe(
        tap(response => {
          if (response.success) {
            // Remove from local data
            const currentStudents = this.studentsSubject.value;
            const filteredStudents = currentStudents.filter(s => s.studentId !== studentId);
            this.studentsSubject.next(filteredStudents);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Search students by name
   */
  searchStudents(name: string): Observable<Student[]> {
    return this.http.get<StudentListResponse>(`${this.baseUrl}/search?name=${name}`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  /**
   * Get students by class
   */
  getStudentsByClass(className: string): Observable<Student[]> {
    return this.http.get<StudentListResponse>(`${this.baseUrl}/class/${className}`)
      .pipe(
        map(response => response.data || []),
        catchError(this.handleError)
      );
  }

  /**
   * Validate student data
   */
  private validateStudent(student: Student): string | null {
    if (!student.name || !student.name.trim()) {
      return 'Student name is required';
    }

    if (!student.email || !student.email.trim()) {
      return 'Email address is required';
    }

    if (!this.isValidEmail(student.email)) {
      return 'Invalid email format';
    }

    if (!student.className || !student.className.trim()) {
      return 'Class name is required';
    }

    if (!student.rollNo || !student.rollNo.trim()) {
      return 'Roll number is required';
    }

    if (!student.dob) {
      return 'Date of birth is required';
    }

    // Check if email already exists (for new students)
    if (!student.studentId) {
      const existingStudent = this.studentsSubject.value.find(s => s.email === student.email);
      if (existingStudent) {
        return 'Email already exists';
      }
    }

    // Check if roll number already exists for the same class
    const existingStudent = this.studentsSubject.value.find(
      s => s.rollNo === student.rollNo && 
      s.className === student.className &&
      s.studentId !== student.studentId
    );
    if (existingStudent) {
      return `Roll number ${student.rollNo} already exists in ${student.className}`;
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
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.statusText || 'Server error';
    }

    console.error('StudentService Error:', errorMessage);
    return throwError(() => ({
      success: false,
      message: errorMessage,
      errors: [errorMessage]
    }));
  }

  /**
   * Get total student count
   */
  getTotalStudentCount(): number {
    return this.studentsSubject.value.length;
  }

  /**
   * Get student count by class
   */
  getStudentCountByClass(className: string): number {
    return this.studentsSubject.value.filter(s => s.className === className).length;
  }

  /**
   * Clear all students (for testing)
   */
  clearStudents(): void {
    this.studentsSubject.next([]);
  }

  /**
   * Reset to sample data (for testing)
   */
  resetToSampleData(): void {
    this.studentsSubject.next([...this.sampleStudents]);
  }
}
