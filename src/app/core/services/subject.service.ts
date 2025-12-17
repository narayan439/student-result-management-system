import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Subject, SubjectResponse, SubjectListResponse } from '../models/subject.model';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private baseUrl = 'http://localhost:8080/api/subjects';
  private localKey = 'app_subjects_v1';

  private subjectsSubject = new BehaviorSubject<Subject[]>([]);
  public subjects$ = this.subjectsSubject.asObservable();

  private sampleSubjects: Subject[] = [
    { subjectId: 1, subjectName: 'Mathematics', subjectCode: 'MATH', isActive: true },
    { subjectId: 2, subjectName: 'Science', subjectCode: 'SCI', isActive: true },
    { subjectId: 3, subjectName: 'English', subjectCode: 'ENG', isActive: true },
    { subjectId: 4, subjectName: 'Physics', subjectCode: 'PHY', isActive: true },
    { subjectId: 5, subjectName: 'Chemistry', subjectCode: 'CHM', isActive: true },
    { subjectId: 6, subjectName: 'Biology', subjectCode: 'BIO', isActive: true },
    { subjectId: 7, subjectName: 'History', subjectCode: 'HIS', isActive: true },
    { subjectId: 8, subjectName: 'Geography', subjectCode: 'GEO', isActive: true },
    { subjectId: 9, subjectName: 'Computer Science', subjectCode: 'CS', isActive: true },
    { subjectId: 10, subjectName: 'Economics', subjectCode: 'ECO', isActive: true },
    { subjectId: 11, subjectName: 'Literature', subjectCode: 'LIT', isActive: true },
    { subjectId: 12, subjectName: 'Physical Education', subjectCode: 'PE', isActive: true },
    { subjectId: 13, subjectName: 'Civics', subjectCode: 'CIV', isActive: true },
    { subjectId: 14, subjectName: 'Art & Design', subjectCode: 'ART', isActive: true },
    { subjectId: 15, subjectName: 'Music', subjectCode: 'MUS', isActive: true }
  ];

  constructor(private http: HttpClient) {
    // Clear old data and initialize with fresh sample subjects
    this.saveToLocal(this.sampleSubjects);
    this.subjectsSubject.next(this.sampleSubjects);
  }

  getAllSubjects(): Observable<Subject[]> {
    const local = this.getSubjectsFromLocal();
    
    // Always return local data (which is initialized with all 15 sample subjects)
    this.subjectsSubject.next(local);

    // Try to fetch from API, but use local as fallback
    return this.http.get<SubjectListResponse>(this.baseUrl).pipe(
      map(response => {
        if (response && response.data && response.data.length > 0) {
          return response.data;
        }
        return local;
      }),
      tap(subjects => {
        if (subjects && subjects.length > 0) {
          this.subjectsSubject.next(subjects);
          this.saveToLocal(subjects);
        }
      }),
      catchError(err => {
        console.warn('Subjects API error, using local data', err);
        return of(local);
      })
    );
  }

  addSubject(subject: Subject): Observable<Subject> {
    return this.http.post<SubjectResponse>(this.baseUrl, subject).pipe(
      map(response => {
        if (response && response.data) {
          return response.data;
        }
        return subject;
      }),
      tap(addedSubject => {
        const current = this.getSubjectsFromLocal();
        if (!addedSubject.subjectId) {
          addedSubject.subjectId = this.getNextSubjectId();
        }
        current.push(addedSubject);
        this.saveToLocal(current);
        this.subjectsSubject.next(current);
      }),
      catchError(err => {
        console.warn('Add subject failed, saving locally', err);
        const current = this.getSubjectsFromLocal();
        const newSubject = { 
          ...subject, 
          subjectId: this.getNextSubjectId() 
        } as Subject;
        current.push(newSubject);
        this.saveToLocal(current);
        this.subjectsSubject.next(current);
        return of(newSubject);
      })
    );
  }

  deleteSubject(subjectId: number): Observable<any> {
    const url = `${this.baseUrl}/${subjectId}`;
    return this.http.delete<any>(url).pipe(
      tap(() => {
        const current = this.getSubjectsFromLocal().filter(s => s.subjectId !== subjectId);
        this.saveToLocal(current);
        this.subjectsSubject.next(current);
      }),
      catchError(err => {
        console.warn('Delete subject failed, deleting locally', err);
        const current = this.getSubjectsFromLocal().filter(s => s.subjectId !== subjectId);
        this.saveToLocal(current);
        this.subjectsSubject.next(current);
        return of({ success: true });
      })
    );
  }

  private getSubjectsFromLocal(): Subject[] {
    try {
      const raw = localStorage.getItem(this.localKey);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read subjects from local storage', e);
      return this.sampleSubjects;
    }
  }

  private saveToLocal(subjects: Subject[]) {
    try {
      localStorage.setItem(this.localKey, JSON.stringify(subjects));
    } catch (e) {
      console.error('Failed to save subjects to local storage', e);
    }
  }

  private getNextSubjectId(): number {
    const current = this.getSubjectsFromLocal();
    const maxId = current.reduce((max, s) => Math.max(max, s.subjectId || 0), 0);
    return maxId + 1;
  }
}