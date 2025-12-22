import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Subject, SubjectResponse, SubjectListResponse } from '../models/subject.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private baseUrl: string;

  private subjectsSubject = new BehaviorSubject<Subject[]>([]);
  public subjects$ = this.subjectsSubject.asObservable();

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = `${this.configService.getApiUrl()}/subjects`;
    // Don't auto-load in constructor to avoid timing issues
  }

  /**
   * Load all subjects from backend
   */
  loadSubjects(): void {
    this.getAllSubjects().subscribe({
      next: (response: any) => {
        const subjects = Array.isArray(response.data) ? response.data : [];
        this.subjectsSubject.next(subjects);
        console.log('Subjects loaded:', subjects);
      },
      error: (err) => {
        console.error('Error loading subjects:', err);
        this.subjectsSubject.next([]);
      }
    });
  }

  /**
   * Get all subjects from backend
   */
  getAllSubjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all`).pipe(
      tap((response: any) => {
        const subjects = Array.isArray(response.data) ? response.data : [];
        this.subjectsSubject.next(subjects);
      }),
      catchError(err => {
        console.error('Error fetching subjects:', err);
        return of({ data: [] });
      })
    );
  }

  /**
   * Get all active subjects
   */
  getAllActiveSubjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}/active`).pipe(
      tap((response: any) => {
        const subjects = Array.isArray(response.data) ? response.data : [];
        this.subjectsSubject.next(subjects);
      }),
      catchError(err => {
        console.error('Error fetching active subjects:', err);
        return of({ data: [] });
      })
    );
  }

  /**
   * Get subjects synchronously from BehaviorSubject
   */
  getSubjectsSync(): Subject[] {
    return this.subjectsSubject.getValue();
  }

  /**
   * Get subject by ID
   */
  getSubjectById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('Error fetching subject:', err);
        return of({ data: null });
      })
    );
  }

  /**
   * Get subjects for a specific class (by class name like 'Class 10', 'Class 11' or number)
   */
  getSubjectsByClass(className: string | number): Observable<any> {
    const classNameStr = typeof className === 'number' ? `Class ${className}` : className;
    return this.http.get(`${this.baseUrl}/class/${classNameStr}`).pipe(
      tap((response: any) => {
        console.log(`Subjects loaded for ${classNameStr}:`, response.data);
      }),
      catchError(err => {
        console.error('Error fetching subjects for class:', err);
        return of({ data: [] });
      })
    );
  }

  /**
   * Get subjects for a specific class (synchronously)
   */
  getSubjectsByClassSync(className: string | number): Subject[] {
    const classNameStr = typeof className === 'number' ? `Class ${className}` : className;
    const allSubjects = this.subjectsSubject.getValue();
    return allSubjects.filter(s => s.className === classNameStr);
  }

  /**
   * Add new subject
   */
  addSubject(subject: Subject): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, subject).pipe(
      tap(() => this.loadSubjects()),
      catchError(err => {
        console.error('Error adding subject:', err);
        return of({ success: false });
      })
    );
  }

  /**
   * Update subject
   */
  updateSubject(id: number, subject: Subject): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, subject).pipe(
      tap(() => this.loadSubjects()),
      catchError(err => {
        console.error('Error updating subject:', err);
        return of({ success: false });
      })
    );
  }

  /**
   * Delete subject (soft delete)
   */
  deleteSubject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => this.loadSubjects()),
      catchError(err => {
        console.error('Error deleting subject:', err);
        return of({ success: false });
      })
    );
  }

  /**
   * Delete subject permanently (hard delete)
   */
  deleteSubjectPermanently(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}/permanent`).pipe(
      tap(() => this.loadSubjects()),
      catchError(err => {
        console.error('Error deleting subject permanently:', err);
        return of({ success: false });
      })
    );
  }
}