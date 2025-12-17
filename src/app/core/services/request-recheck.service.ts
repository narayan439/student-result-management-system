import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Recheck } from '../models/recheck.model';

/**
 * RequestRecheckService - Specialized service for handling student recheck requests
 * with comprehensive CRUD operations and data persistence
 */
@Injectable({
  providedIn: 'root'
})
export class RequestRecheckService {

  private recheckSubject = new BehaviorSubject<Recheck[]>([]);
  private localKey = 'app_request_rechecks_v1';
  
  private sampleRechecks: Recheck[] = [
    {
      recheckId: 1,
      studentId: 1,
      studentEmail: 'arjun.kumar1@student.com',
      rollNo: '1A01',
      studentName: 'Arjun Kumar',
      subject: 'Mathematics',
      reason: 'Question 5 calculation seems wrong. The answer key shows 25 but my calculation is correct.',
      status: 'pending',
      marksObtained: 85,
      maxMarks: 100,
      requestDate: new Date().toISOString()
    },
    {
      recheckId: 2,
      studentId: 2,
      studentEmail: 'priya.singh2@student.com',
      rollNo: '1A02',
      studentName: 'Priya Singh',
      subject: 'Science',
      reason: 'Want to review answer key for section B',
      status: 'completed',
      marksObtained: 95,
      maxMarks: 100,
      requestDate: new Date().toISOString()
    }
  ];

  constructor() {
    this.initializeData();
  }

  /**
   * Initialize data from localStorage or use sample data
   */
  private initializeData(): void {
    const local = this.getRecheckFromLocal();
    if (local && local.length) {
      this.recheckSubject.next(local);
    } else {
      this.recheckSubject.next(this.sampleRechecks);
      this.saveToLocal(this.sampleRechecks);
    }
  }

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
   * Get recheck by ID
   */
  getRecheckById(id: number): Observable<Recheck | undefined> {
    const recheck = this.getAllRecheckSync().find(r => r.recheckId === id);
    return of(recheck);
  }

  /**
   * Get recheck requests for a specific student by ID
   */
  getRechecksByStudentId(studentId: number): Observable<Recheck[]> {
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
   * Get rechecks by status
   */
  getRechecksByStatus(status: string): Observable<Recheck[]> {
    const rechecks = this.getRecheckFromLocal().filter(r => r.status === status);
    return of(rechecks);
  }

  /**
   * Add new recheck request
   */
  addRecheck(recheck: Recheck): Observable<Recheck> {
    const currentRechecks = this.getRecheckFromLocal();
    const maxId = Math.max(...currentRechecks.map(r => r.recheckId || 0), 0);
    
    const newRecheck: Recheck = {
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
    const updated = currentRechecks.map(r => 
      r.recheckId === recheck.recheckId ? recheck : r
    );
    
    this.saveToLocal(updated);
    this.recheckSubject.next(updated);
    
    console.log('✓ Recheck request updated:', recheck);
    return of(recheck);
  }

  /**
   * Update recheck status
   */
  updateRecheckStatus(recheckId: number, status: string): Observable<Recheck | undefined> {
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
    
    console.log(`✓ Recheck ${recheckId} status updated to: ${status}`);
    return of(updated);
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
      completed: rechecks.filter(r => r.status === 'completed').length,
      approved: rechecks.filter(r => r.status === 'approved').length,
      rejected: rechecks.filter(r => r.status === 'rejected').length
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
    completedRechecks: number;
    approvedRechecks: number;
    rejectedRechecks: number;
  } {
    const allRechecks = this.getRecheckFromLocal();
    return {
      totalRechecks: allRechecks.length,
      pendingRechecks: allRechecks.filter(r => r.status === 'pending').length,
      completedRechecks: allRechecks.filter(r => r.status === 'completed').length,
      approvedRechecks: allRechecks.filter(r => r.status === 'approved').length,
      rejectedRechecks: allRechecks.filter(r => r.status === 'rejected').length
    };
  }

  /**
   * Reset all rechecks to sample data
   */
  resetToSampleData(): void {
    this.saveToLocal(this.sampleRechecks);
    this.recheckSubject.next(this.sampleRechecks);
    console.log('✓ Rechecks reset to sample data');
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
        this.saveToLocal(this.sampleRechecks);
        return this.sampleRechecks;
      }
      const parsed = JSON.parse(raw) as Recheck[];
      return parsed.length > 0 ? parsed : this.sampleRechecks;
    } catch (e) {
      console.error('Failed to read rechecks from local storage', e);
      return this.sampleRechecks;
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
