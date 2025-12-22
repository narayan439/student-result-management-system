import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface SchoolClass {
  classId: number;
  className: string;
  classNumber: number;
  maxCapacity: number;
  isActive: boolean;
  subjects?: string[]; // List of subject IDs or names
  subjectList?: string; // Comma-separated subject list
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClassesService {
  private baseUrl = 'http://localhost:8080/api/classes';
  private classesSubject = new BehaviorSubject<SchoolClass[]>([]);
  classes$ = this.classesSubject.asObservable();

  constructor(private http: HttpClient) {
  }

  /**
   * Load all classes from backend
   */
  loadClasses(): void {
    this.getAllClasses().subscribe({
      next: (response: any) => {
        const classes = Array.isArray(response.data) ? response.data : [];
        this.classesSubject.next(classes);
      },
      error: (err) => {
        console.error('Error loading classes:', err);
        this.classesSubject.next([]);
      }
    });
  }

  /**
   * Get all classes
   */
  getAllClasses(): Observable<any> {
    console.log('Fetching classes from:', this.baseUrl);
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      tap((response: any) => {
        console.log('Classes response:', response);
        const classes = Array.isArray(response.data) ? response.data : [];
        this.classesSubject.next(classes);
      })
    );
  }

  /**
   * Get all active classes
   */
  getAllActiveClasses(): Observable<any> {
    return this.http.get(`${this.baseUrl}/active`);
  }

  /**
   * Get class by ID
   */
  getClassById(classId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${classId}`);
  }

  /**
   * Get class by name
   */
  getClassByName(className: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/name/${className}`);
  }

  /**
   * Get class by number
   */
  getClassByNumber(classNumber: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/number/${classNumber}`);
  }

  /**
   * Create new class
   */
  createClass(schoolClass: SchoolClass): Observable<any> {
    return this.http.post(`${this.baseUrl}`, schoolClass).pipe(
      tap(() => this.loadClasses())
    );
  }

  /**
   * Update class
   */
  updateClass(classId: number, schoolClass: SchoolClass): Observable<any> {
    return this.http.put(`${this.baseUrl}/${classId}`, schoolClass).pipe(
      tap(() => this.loadClasses())
    );
  }

  /**
   * Delete class (soft delete)
   */
  deleteClass(classId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${classId}`).pipe(
      tap(() => this.loadClasses())
    );
  }

  /**
   * Delete class permanently (hard delete)
   */
  deleteClassPermanently(classId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${classId}/permanent`).pipe(
      tap(() => this.loadClasses())
    );
  }

  /**
   * Get classes synchronously from BehaviorSubject
   */
  getAllClassesSync(): SchoolClass[] {
    return this.classesSubject.getValue();
  }

  /**
   * Get classes observable
   */
  getClasses(): Observable<SchoolClass[]> {
    return this.classes$;
  }

  /**
   * Get classes as array
   */
  getClassesArray(): SchoolClass[] {
    return this.classesSubject.value;
  }

  /**
   * Set all classes
   */
  setClasses(classes: SchoolClass[]): void {
    this.classesSubject.next(classes);
  }
}


