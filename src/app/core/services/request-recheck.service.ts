import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Recheck } from '../models/recheck.model';

/**
 * RequestRecheckService - Service for handling student recheck requests
 * Connected to backend API for CRUD operations
 */
@Injectable({
  providedIn: 'root'
})
export class RequestRecheckService {

  private baseUrl = 'https://srms-backend-production.up.railway.app/api/rechecks';
  private recheckSubject = new BehaviorSubject<Recheck[]>([]);
  private localKey = 'app_request_rechecks_v1';

  constructor(private http: HttpClient) {
    this.initializeData();
  }

  /**
   * Initialize data from backend
   */
  private initializeData(): void {
    // Try to load from backend
    this.getAllRecheckSync().subscribe({
      next: (rechecks) => {
        if (rechecks && rechecks.length > 0) {
          this.recheckSubject.next(rechecks);
        } else {
          this.recheckSubject.next([]);
        }
      },
      error: (err) => {
        console.log('Unable to load rechecks from backend');
        this.recheckSubject.next([]);
      }
    });
  }

  /**
   * Get all recheck requests from backend
   */
  getAllRechecks(): Observable<Recheck[]> {
    return this.http.get<any>(`${this.baseUrl}/all`)
      .pipe(
        map((response: any) => {
          const recheckArray = Array.isArray(response?.data) ? response.data : [];
          this.recheckSubject.next(recheckArray);
          this.saveToLocal(recheckArray);
          return recheckArray;
        }),
        catchError((error) => {
          console.error('Error loading rechecks from backend:', error);
          // Fallback to local storage
          const local = this.getRecheckFromLocal();
          this.recheckSubject.next(local);
          return of(local);
        })
      );
  }

  /**
   * Get all rechecks synchronously
   */
  getAllRecheckSync(): Observable<Recheck[]> {
    return this.getAllRechecks();
  }

  /**
   * Get recheck by ID from backend
   */
  getRecheckById(id: number): Observable<Recheck | undefined> {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
      .pipe(
        map((response: any) => response.data as Recheck),
        catchError((error) => {
          console.error('Error loading recheck:', error);
          const local = this.getRecheckFromLocal().find(r => r.recheckId === id);
          return of(local);
        })
      );
  }

  /**
   * Get recheck requests for a specific student by ID from backend
   */
  getRechecksByStudentId(studentId: number): Observable<Recheck[]> {
    return this.http.get<any>(`${this.baseUrl}/student/${studentId}`)
      .pipe(
        map((response: any) => {
          const recheckArray = Array.isArray(response?.data) ? response.data : [];
          return recheckArray;
        }),
        catchError((error) => {
          console.error('Error loading student rechecks:', error);
          const local = this.getRecheckFromLocal().filter(r => r.studentId === studentId);
          return of(local);
        })
      );
  }

  /**
   * Get recheck requests by student email
   */
  getRechecksByStudentEmail(email: string): Observable<Recheck[]> {
    return this.getAllRechecks()
      .pipe(
        map((rechecks) => rechecks.filter(r => r.studentEmail === email))
      );
  }

  /**
   * Get rechecks by status from backend
   */
  getRechecksByStatus(status: string): Observable<Recheck[]> {
    return this.http.get<any>(`${this.baseUrl}/status/${status}`)
      .pipe(
        map((response: any) => {
          const recheckArray = Array.isArray(response?.data) ? response.data : [];
          return recheckArray;
        }),
        catchError((error) => {
          console.error('Error loading rechecks by status:', error);
          const local = this.getRecheckFromLocal().filter(r => r.status === status);
          return of(local);
        })
      );
  }

  /**
   * Add new recheck request to backend
   */
  addRecheck(recheck: Recheck): Observable<Recheck> {
    console.log('🔄 RequestRecheckService: Adding new recheck...');
    console.log('📋 Recheck data to send:', recheck);

    // Validate recheck data before sending
    if (!recheck.studentId || recheck.studentId <= 0) {
      console.error('❌ Invalid studentId:', recheck.studentId);
      return throwError(() => new Error('Invalid student ID'));
    }

    if (!recheck.subject || recheck.subject.trim().length === 0) {
      console.error('❌ Invalid subject:', recheck.subject);
      return throwError(() => new Error('Subject is required'));
    }

    if (!recheck.reason || recheck.reason.trim().length < 10) {
      console.error('❌ Invalid reason:', recheck.reason);
      return throwError(() => new Error('Reason must be at least 10 characters'));
    }

    if (!recheck.studentEmail || recheck.studentEmail.trim().length === 0) {
      console.error('❌ Invalid studentEmail:', recheck.studentEmail);
      return throwError(() => new Error('Student email is required'));
    }

    const requestBody = {
      studentId: recheck.studentId,
      marksId: recheck.marksId || 0,
      studentEmail: recheck.studentEmail,
      studentName: recheck.studentName || '',
      rollNo: recheck.rollNo || '',
      subject: recheck.subject,
      reason: recheck.reason,
      marksObtained: recheck.marksObtained || 0,
      maxMarks: recheck.maxMarks || 100,
      status: recheck.status?.toUpperCase() || 'PENDING',
      requestDate: recheck.requestDate || new Date().toISOString(),
      adminNotes: recheck.adminNotes || ''
    };

    console.log('📤 Sending validated request to backend:', requestBody);

    return this.http.post<any>(`${this.baseUrl}/request`, requestBody)
      .pipe(
        tap((response: any) => {
          console.log('✅ Backend response received:', response);
          
          const newRecheck = response.data as Recheck;
          console.log('✓ New recheck created with ID:', newRecheck.recheckId);
          
          // Update local state
          const currentRechecks = this.recheckSubject.value;
          this.recheckSubject.next([...currentRechecks, newRecheck]);
          this.saveToLocal([...currentRechecks, newRecheck]);
          
          console.log('✅ Recheck request added to local state');
          console.log('✓ Recheck request added:', newRecheck);
        }),
        map((response: any) => {
          console.log('📥 Mapping response to Recheck object');
          return response.data as Recheck;
        }),
        catchError((error) => {
          console.error('❌ HTTP Error adding recheck:', error);
          console.log('Error status:', error.status);
          console.log('Error statusText:', error.statusText);
          console.log('Error message:', error.message);
          console.log('Error response body:', error.error);
          
          // Check specific error cases
          if (error.status === 400) {
            console.error('❌ Bad Request - Invalid data format');
            return throwError(() => error);
          }
          
          if (error.status === 409) {
            console.error('❌ Conflict - Duplicate recheck request');
            return throwError(() => error);
          }
          
          // Fallback to local storage if backend is unavailable
          console.warn('⚠️ Backend failed, using local fallback...');
          const currentRechecks = this.getRecheckFromLocal();
          const maxId = Math.max(...currentRechecks.map(r => r.recheckId || 0), 0);
          
          const newRecheck: Recheck = {
            ...recheck,
            recheckId: maxId + 1,
            requestDate: new Date().toISOString(),
            status: 'PENDING'
          };

          const updated = [...currentRechecks, newRecheck];
          this.saveToLocal(updated);
          this.recheckSubject.next(updated);
          
          console.log('✓ Fallback: Recheck saved to local storage with ID:', newRecheck.recheckId);
          return of(newRecheck);
        })
      );
  }

  /**
   * Update recheck request in backend
   */
  updateRecheck(recheck: Recheck): Observable<Recheck> {
    return this.http.put<any>(`${this.baseUrl}/${recheck.recheckId}`, recheck)
      .pipe(
        tap((response: any) => {
          const updatedRecheck = response.data as Recheck;
          const currentRechecks = this.recheckSubject.value;
          const updated = currentRechecks.map(r => 
            r.recheckId === recheck.recheckId ? updatedRecheck : r
          );
          this.recheckSubject.next(updated);
          this.saveToLocal(updated);
          console.log('✓ Recheck request updated:', updatedRecheck);
        }),
        map((response: any) => response.data as Recheck),
        catchError((error) => {
          console.error('Error updating recheck:', error);
          // Fallback to local storage
          const currentRechecks = this.getRecheckFromLocal();
          const updated = currentRechecks.map(r => 
            r.recheckId === recheck.recheckId ? recheck : r
          );
          this.saveToLocal(updated);
          this.recheckSubject.next(updated);
          
          return of(recheck);
        })
      );
  }

  /**
   * Update recheck status in backend
   */
  updateRecheckStatus(recheckId: number, status: string): Observable<Recheck | undefined> {
    return this.http.put<any>(`${this.baseUrl}/${recheckId}/status?status=${status}`, {})
      .pipe(
        tap((response: any) => {
          const updatedRecheck = response.data as Recheck;
          const currentRechecks = this.recheckSubject.value;
          const updated = currentRechecks.map(r => 
            r.recheckId === recheckId ? updatedRecheck : r
          );
          this.recheckSubject.next(updated);
          this.saveToLocal(updated);
          console.log(`✓ Recheck ${recheckId} status updated to: ${status}`);
        }),
        map((response: any) => response.data as Recheck),
        catchError((error) => {
          console.error('Error updating recheck status:', error);
          // Fallback to local storage
          const currentRechecks = this.getRecheckFromLocal();
          const recheck = currentRechecks.find(r => r.recheckId === recheckId);
          
          if (!recheck) {
            return of(undefined);
          }

          const updated = {
            ...recheck,
            status: status as any
          };

          const all = currentRechecks.map(r => 
            r.recheckId === recheckId ? updated : r
          );
          
          this.saveToLocal(all);
          this.recheckSubject.next(all);
          
          return of(updated);
        })
      );
  }

  /**
   * Delete recheck request from backend
   */
  deleteRecheck(recheckId: number): Observable<boolean> {
    return this.http.delete<any>(`${this.baseUrl}/${recheckId}`)
      .pipe(
        tap(() => {
          const currentRechecks = this.recheckSubject.value;
          const updated = currentRechecks.filter(r => r.recheckId !== recheckId);
          this.recheckSubject.next(updated);
          this.saveToLocal(updated);
          console.log('✓ Recheck request deleted:', recheckId);
        }),
        map(() => true),
        catchError((error) => {
          console.error('Error deleting recheck:', error);
          // Fallback to local storage
          const currentRechecks = this.getRecheckFromLocal();
          const updated = currentRechecks.filter(r => r.recheckId !== recheckId);
          this.saveToLocal(updated);
          this.recheckSubject.next(updated);
          
          return of(true);
        })
      );
  }

  /**
   * Get status summary for a student
   */
  getStatusSummary(studentEmail: string): { pending: number; approved: number; rejected: number } {
    const rechecks = this.getRecheckFromLocal().filter(r => r.studentEmail === studentEmail);
    return {
      pending: rechecks.filter(r => r.status === 'pending' || r.status === 'PENDING').length,
      approved: rechecks.filter(r => r.status === 'approved' || r.status === 'APPROVED').length,
      rejected: rechecks.filter(r => r.status === 'rejected' || r.status === 'REJECTED').length
    };
  }

  /**
   * Get total recheck count by student
   */
  getTotalRechecksByStudent(studentEmail: string): number {
    return this.getRecheckFromLocal().filter(r => r.studentEmail === studentEmail).length;
  }

  /**
   * Check if student can request recheck (fee check, time limit, etc.)
   */
  canRequestRecheck(studentEmail: string): { allowed: boolean; reason?: string } {
    const rechecks = this.getRecheckFromLocal().filter(r => r.studentEmail === studentEmail);
    
    // Check if student has more than 5 pending rechecks
    const pendingCount = rechecks.filter(r => r.status === 'pending').length;
    if (pendingCount >= 5) {
      return { allowed: false, reason: 'Maximum pending rechecks (5) reached' };
    }

    return { allowed: true };
  }

  /**
   * Get all recheck statistics
   */
  getStatistics(): {
    totalRechecks: number;
    pendingRechecks: number;
    approvedRechecks: number;
    rejectedRechecks: number;
  } {
    const allRechecks = this.getRecheckFromLocal();
    return {
      totalRechecks: allRechecks.length,
      pendingRechecks: allRechecks.filter(r => r.status === 'pending' || r.status === 'PENDING').length,
      approvedRechecks: allRechecks.filter(r => r.status === 'approved' || r.status === 'APPROVED').length,
      rejectedRechecks: allRechecks.filter(r => r.status === 'rejected' || r.status === 'REJECTED').length
    };
  }

  /**
   * Reset all rechecks to empty
   */
  resetToSampleData(): void {
    this.recheckSubject.next([]);
    console.log('✓ Rechecks reset');
  }

  /**
   * Export rechecks as JSON
   */
  exportAsJSON(): string {
    return JSON.stringify(this.getRecheckFromLocal(), null, 2);
  }

  /**
   * Private helper: Get rechecks from localStorage
   */
  private getRecheckFromLocal(): Recheck[] {
    try {
      const raw = localStorage.getItem(this.localKey);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw) as Recheck[];
      return parsed.length > 0 ? parsed : [];
    } catch (e) {
      console.error('Failed to read rechecks from local storage', e);
      return [];
    }
  }

  /**
   * Private helper: Save rechecks to localStorage
   */
  private saveToLocal(rechecks: Recheck[]): void {
    try {
      localStorage.setItem(this.localKey, JSON.stringify(rechecks));
    } catch (e) {
      console.error('Failed to save rechecks to local storage', e);
    }
  }
}
