import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Student, StudentResponse, StudentListResponse } from '../models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseUrl = 'http://localhost:8080/api/students';
  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  // Cache variables
  private lastRefreshTime: number = 0;
  private refreshCacheTime: number = 5000; // 5 seconds cache

  constructor(private http: HttpClient) {
  }

  /**
   * Get all students
   */
  getAllStudents(): Observable<Student[]> {
    return this.http.get<StudentListResponse>(`${this.baseUrl}/all`)
      .pipe(
        map(response => response.data || []),
        tap(students => this.studentsSubject.next(students)),
        catchError(err => {
          console.warn('API call failed');
          this.studentsSubject.next([]);
          return of([]);
        })
      );
  }

  /**
   * Get all students synchronously (for authentication)
   */
  getAllStudentsSync(): Student[] {
    return this.studentsSubject.value || [];
  }

  /**
   * Refresh students data from backend
   * Used to ensure fresh data for login and admin operations
   * Includes cache to prevent duplicate queries within 5 seconds
   */
  refreshStudents(): Observable<Student[]> {
    const now = Date.now();
    
    // Check if we've refreshed recently (within 5 seconds)
    if (now - this.lastRefreshTime < this.refreshCacheTime) {
      console.log('⚡ Using cached student data (refreshed recently)');
      return of(this.studentsSubject.value);
    }
    
    console.log('🔄 Refreshing students data from backend...');
    this.lastRefreshTime = now;
    
    return this.http.get<StudentListResponse>(`${this.baseUrl}/all`)
      .pipe(
        map(response => {
          const students = response.data || [];
          console.log(`✅ Loaded ${students.length} students from backend`);
          this.studentsSubject.next(students);
          return students;
        }),
        catchError(err => {
          console.error('❌ Failed to refresh from backend, using cached data:', err);
          const currentStudents = this.studentsSubject.value;
          return of(currentStudents);
        })
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
   * Get student by roll number
   */
  getStudentByRollNo(rollNo: string): Observable<Student> {
    return this.http.get<StudentResponse>(`${this.baseUrl}/rollNo/${rollNo}`)
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

    // Try to post to backend, fallback to local storage
    return this.http.post<StudentResponse>(`${this.baseUrl}/add`, student)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            // Add to local data
            const currentStudents = this.studentsSubject.value;
            this.studentsSubject.next([...currentStudents, response.data]);
          }
        }),
        catchError((error) => {
          // If backend fails, add to local storage instead
          const currentStudents = this.studentsSubject.value;
          const nextId = currentStudents.length > 0 
            ? Math.max(...currentStudents.map(s => s.studentId || 0)) + 1 
            : 1;
          
          const newStudent: Student = {
            ...student,
            studentId: nextId
          };
          
          this.studentsSubject.next([...currentStudents, newStudent]);
          
          return new Observable<StudentResponse>(observer => {
            observer.next({
              success: true,
              message: 'Student added successfully (Local)',
              data: newStudent,
              errors: []
            });
            observer.complete();
          });
        })
      );
  }

  /**
   * Save student (create or update)
   */
  saveStudent(student: Student): Observable<StudentResponse> {
    if (student.studentId) {
      return this.updateStudent(student.studentId, student);
    } else {
      return this.addStudent(student);
    }
  }

  /**
   * Update student information by ID
   */
  updateStudent(studentId: number, student: Student): Observable<StudentResponse> {
    if (!studentId && studentId !== 0) {
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

    return this.http.put<StudentResponse>(`${this.baseUrl}/${studentId}`, student)
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            // Update in local data
            const currentStudents = this.studentsSubject.value;
            const updatedStudents = currentStudents.map(s =>
              s.studentId === studentId ? response.data as Student : s
            );
            this.studentsSubject.next(updatedStudents);
          }
        }),
        catchError((error) => {
          // If backend fails, update in local storage instead
          const currentStudents = this.studentsSubject.value;
          const updatedStudents = currentStudents.map(s =>
            s.studentId === studentId ? { ...student, studentId } : s
          );
          this.studentsSubject.next(updatedStudents);
          
          return new Observable<StudentResponse>(observer => {
            observer.next({
              success: true,
              message: 'Student updated successfully (Local)',
              data: { ...student, studentId },
              errors: []
            });
            observer.complete();
          });
        })
      );
  }

  /**
   * Delete student by ID
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
        catchError((error) => {
          // If backend fails, delete from local storage instead
          const currentStudents = this.studentsSubject.value;
          const filteredStudents = currentStudents.filter(s => s.studentId !== studentId);
          this.studentsSubject.next(filteredStudents);
          
          return new Observable<StudentResponse>(observer => {
            observer.next({
              success: true,
              message: 'Student deleted successfully (Local)',
              errors: []
            });
            observer.complete();
          });
        })
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

    // Check if email already exists (excluding current student)
    const existingStudent = this.studentsSubject.value.find(
      s => s.email === student.email && s.studentId !== student.studentId
    );
    if (existingStudent) {
      return 'Email already exists';
    }

    // Check if roll number already exists for the same class
    const existingRollNo = this.studentsSubject.value.find(
      s => s.rollNo === student.rollNo && 
      s.className === student.className &&
      s.studentId !== student.studentId
    );
    if (existingRollNo) {
      return `Roll number ${student.rollNo} is already assigned to another student in ${student.className}. Roll numbers must be unique per class.`;
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
   * Get next available roll number for a class
   * Roll number format: classNumberSectionSequential (e.g., 10A01, 10A02)
   * Roll numbers must be unique per class
   */
  getNextRollNumberForClass(className: string): string {
    const classStudents = this.studentsSubject.value.filter(s => s.className === className);
    
    // Extract class number and section from className (e.g., "Class 10 - A" -> 10, A)
    const classMatch = className.match(/Class\s(\d+)\s-\s([A-E])/);
    if (!classMatch) {
      return '01';
    }

    const classNumber = classMatch[1];
    const section = classMatch[2];

    if (classStudents.length === 0) {
      return `${classNumber}${section}01`;
    }

    // Get the highest sequential number in the class
    const sequentialNumbers = classStudents
      .map(s => {
        const match = s.rollNo.match(new RegExp(`^${classNumber}${section}(\\d+)$`));
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(num => num > 0)
      .sort((a, b) => a - b);

    const nextSeq = sequentialNumbers.length > 0 ? sequentialNumbers[sequentialNumbers.length - 1] + 1 : 1;
    return `${classNumber}${section}${String(nextSeq).padStart(2, '0')}`;
  }

  /**
   * Get all roll numbers for a specific class
   */
  getRollNumbersInClass(className: string): string[] {
    return this.studentsSubject.value
      .filter(s => s.className === className)
      .map(s => s.rollNo)
      .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }

  /**
   * Check if roll number exists in a class
   */
  isRollNumberExistsInClass(className: string, rollNo: string, excludeStudentId?: number): boolean {
    return this.studentsSubject.value.some(s =>
      s.className === className &&
      s.rollNo === rollNo &&
      s.studentId !== excludeStudentId
    );
  }

  /**
   * Clear all students (for testing)
   */
  clearStudents(): void {
    this.studentsSubject.next([]);
  }

  /**
   * Reset to empty data
   */
  resetToSampleData(): void {
    this.studentsSubject.next([]);
  }
}
