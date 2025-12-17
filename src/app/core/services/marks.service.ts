import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Mark, MarkResponse, MarkListResponse } from '../models/marks.model';

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  private baseUrl = 'http://localhost:8080/api/marks';
  private localKey = 'app_marks_v1';

  private marksSubject = new BehaviorSubject<Mark[]>([]);
  public marks$ = this.marksSubject.asObservable();

  // sample marks data
  private sampleMarks: Mark[] = [
    { marksId: 'M1', studentId: 'S1', subject: 'Maths', marksObtained: 78, maxMarks: 100, term: 'Term 1', year: 2024 },
    { marksId: 'M2', studentId: 'S1', subject: 'Science', marksObtained: 82, maxMarks: 100, term: 'Term 1', year: 2024 },
    { marksId: 'M3', studentId: 'S2', subject: 'Maths', marksObtained: 65, maxMarks: 100, term: 'Term 1', year: 2024 }
  ];

  constructor(private http: HttpClient) {
    // initialize marks from local storage or sample data
    const local = this.getMarksFromLocal();
    if (local && local.length) {
      this.marksSubject.next(local);
    } else {
      this.marksSubject.next(this.sampleMarks);
      this.saveToLocal(this.sampleMarks);
    }
  }

  // Get all marks (tries backend, falls back to local)
  getAllMarks(): Observable<Mark[]> {
    // return local copy immediately
    const local = this.getMarksFromLocal();
    this.marksSubject.next(local);

    // Try to get from backend
    return this.http.get<MarkListResponse>(this.baseUrl).pipe(
      tap(res => {
        if (res && res.data) {
          this.marksSubject.next(res.data);
          this.saveToLocal(res.data);
        }
      }),
      catchError(err => {
        // backend not available - return local
        console.warn('Marks API error, using local data', err);
        return of(local);
      }),
      // map to Mark[] in case backend returned MarkListResponse
      tap(() => {}),
      // map not used here because of varying return types; consumer should handle either array or MarkListResponse
    ) as unknown as Observable<Mark[]>;
  }

  // Add a marks record
  addMark(mark: Mark): Observable<Mark> {
    // Try backend
    return this.http.post<MarkResponse>(this.baseUrl, mark).pipe(
      tap(res => {
        if (res && res.data) {
          const current = this.getMarksFromLocal();
          current.push(res.data);
          this.marksSubject.next(current);
          this.saveToLocal(current);
        }
      }),
      catchError(err => {
        // fallback: add locally
        console.warn('Add mark failed, saving locally', err);
        const current = this.getMarksFromLocal();
        const newMark = { ...mark, marksId: this.getNextMarkId() } as Mark;
        current.push(newMark);
        this.saveToLocal(current);
        this.marksSubject.next(current);
        return of(newMark);
      }),
      // map to Mark
    ) as unknown as Observable<Mark>;
  }

  // Update a marks record
  updateMark(mark: Mark): Observable<Mark> {
    if (!mark.marksId) {
      return throwError(() => new Error('marksId is required'));
    }

    const url = `${this.baseUrl}/${mark.marksId}`;
    return this.http.put<MarkResponse>(url, mark).pipe(
      tap(res => {
        if (res && res.data) {
          const current = this.getMarksFromLocal();
          const idx = current.findIndex(m => m.marksId === res.data!.marksId);
          if (idx > -1) {
            current[idx] = res.data!;
            this.saveToLocal(current);
            this.marksSubject.next(current);
          }
        }
      }),
      catchError(err => {
        // fallback: update locally
        console.warn('Update mark failed, updating locally', err);
        const current = this.getMarksFromLocal();
        const idx = current.findIndex(m => m.marksId === mark.marksId);
        if (idx > -1) {
          current[idx] = mark;
          this.saveToLocal(current);
          this.marksSubject.next(current);
        }
        return of(mark);
      })
    ) as unknown as Observable<Mark>;
  }

  // Delete a marks record
  deleteMark(marksId: string): Observable<any> {
    const url = `${this.baseUrl}/${marksId}`;
    return this.http.delete<any>(url).pipe(
      tap(() => {
        const current = this.getMarksFromLocal().filter(m => m.marksId !== marksId);
        this.saveToLocal(current);
        this.marksSubject.next(current);
      }),
      catchError(err => {
        console.warn('Delete mark failed, deleting locally', err);
        const current = this.getMarksFromLocal().filter(m => m.marksId !== marksId);
        this.saveToLocal(current);
        this.marksSubject.next(current);
        return of({ success: true });
      })
    );
  }

  // Helper: get marks for a specific student
  getMarksByStudent(studentId: string): Mark[] {
    return this.getMarksFromLocal().filter(m => m.studentId === studentId);
  }

  // Helper: calculate average marks for a student
  getAverageForStudent(studentId: string): number {
    const marks = this.getMarksByStudent(studentId);
    if (!marks.length) return 0;
    const total = marks.reduce((s, m) => s + (m.marksObtained || 0), 0);
    return Math.round((total / marks.length) * 100) / 100;
  }

  // local storage helpers
  private getMarksFromLocal(): Mark[] {
    try {
      const raw = localStorage.getItem(this.localKey);
      if (!raw) return [];
      return JSON.parse(raw) as Mark[];
    } catch (e) {
      console.error('Failed to read marks from local storage', e);
      return [];
    }
  }

  private saveToLocal(marks: Mark[]) {
    try {
      localStorage.setItem(this.localKey, JSON.stringify(marks));
    } catch (e) {
      console.error('Failed to save marks to local storage', e);
    }
  }

  private getNextMarkId(): string {
    const current = this.getMarksFromLocal();
    const maxN = current.reduce((max, m) => {
      const num = parseInt((m.marksId || '').replace(/[^0-9]/g, ''), 10) || 0;
      return Math.max(max, num);
    }, 0);
    return `M${(maxN + 1)}`;
  }
}
