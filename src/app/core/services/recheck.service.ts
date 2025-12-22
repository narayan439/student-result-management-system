import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Recheck } from '../models/recheck.model';

@Injectable({
  providedIn: 'root'
})
export class RecheckService {

  private recheckSubject = new BehaviorSubject<Recheck[]>([]);
  private localKey = 'app_rechecks_v1';
  
  private sampleRechecks: Recheck[] = [];
  
  
  

  /**
   * Get all recheck requests
   */
  getAllRechecks(): Observable<Recheck[]> {
    return of(this.recheckSubject.value || this.getRecheckFromLocal());
  }

  /**
   * Get all rechecks synchronously
   */
  getAllRecheckSync(): Recheck[] {
    return this.recheckSubject.value || this.getRecheckFromLocal();
  }

  /**
   * Get recheck requests for a specific student
   */
  getRechecksByStudent(studentId: number): Observable<Recheck[]> {
    const rechecks = this.getRecheckFromLocal().filter(r => r.studentId === studentId);
    return of(rechecks);
  }

  /**
   * Get recheck requests by student email
   */
  getRechecksByStudentEmail(email: string): Observable<Recheck[]> {
    const rechecks = this.getRecheckFromLocal().filter(r => r.studentEmail === email);
    return of(rechecks);
  }

  /**
   * Add new recheck request
   */
  addRecheck(recheck: Recheck): Observable<Recheck> {
    const currentRechecks = this.getRecheckFromLocal();
    const maxId = Math.max(...currentRechecks.map(r => r.recheckId || 0), 0);
    const newRecheck = {
      ...recheck,
      recheckId: maxId + 1,
      requestDate: new Date().toISOString(),
      status: 'pending' as const
    };
    const updated = [...currentRechecks, newRecheck];
    this.saveToLocal(updated);
    this.recheckSubject.next(updated);
    console.log('✓ Recheck request added:', newRecheck);
    return of(newRecheck);
  }

  /**
   * Update recheck request
   */
  updateRecheck(recheck: Recheck): Observable<Recheck> {
    const currentRechecks = this.getRecheckFromLocal();
    const updated = currentRechecks.map(r => r.recheckId === recheck.recheckId ? recheck : r);
    this.saveToLocal(updated);
    this.recheckSubject.next(updated);
    console.log('✓ Recheck request updated:', recheck);
    return of(recheck);
  }

  /**
   * Delete recheck request
   */
  deleteRecheck(recheckId: number): Observable<boolean> {
    const currentRechecks = this.getRecheckFromLocal();
    const updated = currentRechecks.filter(r => r.recheckId !== recheckId);
    this.saveToLocal(updated);
    this.recheckSubject.next(updated);
    console.log('✓ Recheck request deleted:', recheckId);
    return of(true);
  }

  /**
   * Get status summary for a student
   */
  getStatusSummary(studentEmail: string): { pending: number; completed: number; approved: number; rejected: number } {
    const rechecks = this.getRecheckFromLocal().filter(r => r.studentEmail === studentEmail);
    return {
      pending: rechecks.filter(r => r.status === 'pending').length,
      completed: rechecks.filter(r => r.status === 'approved' || r.status === 'rejected').length,
      approved: rechecks.filter(r => r.status === 'approved').length,
      rejected: rechecks.filter(r => r.status === 'rejected').length
    };
  }

  private getRecheckFromLocal(): Recheck[] {
    try {
      const raw = localStorage.getItem(this.localKey);
      if (!raw) {
        this.saveToLocal(this.sampleRechecks);
        return this.sampleRechecks;
      }
      const parsed = JSON.parse(raw) as Recheck[];
      return parsed;
    } catch (e) {
      console.error('Failed to read rechecks from local storage', e);
      return [];
    }
  }

  private saveToLocal(rechecks: Recheck[]) {
    try {
      localStorage.setItem(this.localKey, JSON.stringify(rechecks));
    } catch (e) {
      console.error('Failed to save rechecks to local storage', e);
    }
  }
}
