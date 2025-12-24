import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, map, retry, timeout } from 'rxjs/operators';
import { Mark, MarkResponse, MarkListResponse } from '../models/marks.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class MarksService {
  private baseUrl: string;
  private marksSubject = new BehaviorSubject<Mark[]>([]);
  public marks$ = this.marksSubject.asObservable();

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = `${this.configService.getApiUrl()}/marks`;
    console.log('✓ MarksService initialized');
    this.loadAllMarks();
  }

  /**
   * Load all marks from backend
   */
  private loadAllMarks(): void {
    this.getAllMarks().subscribe({
      next: (response: any) => {
        console.log('✓ All marks loaded from backend successfully');
        this.marksSubject.next(response.data || []);
      },
      error: (err) => {
        console.warn('⚠️  Error loading all marks from backend:', err.status);
      }
    });
  }

  /**
   * Get all marks
   */
  getAllMarks(): Observable<any> {
    console.log('📥 Loading ALL marks from backend...');
    return this.http.get(`${this.baseUrl}/all`).pipe(
      timeout(5000), // 5 second timeout
      retry(2), // Retry twice on failure
      tap((response: any) => {
        console.log('✓ Backend returned marks:', response);
        this.marksSubject.next(response.data || []);
      }),
      catchError((error) => {
        console.warn('⚠️  Failed to load all marks from backend');
        return of({ 
          success: false, 
          data: [], 
          message: 'Backend unavailable',
          source: 'backend-error' 
        });
      })
    );
  }

  /**
   * Get marks by student ID
   * Priority: 1) Backend cache, 2) Direct API call, 3) All marks endpoint
   */
  getMarksByStudentId(studentId: number): Observable<any> {
    console.log(`\n📥 Request: Get marks for student ID ${studentId}`);
    
    // First, check if we already have all marks from backend
    const backendMarks = this.marksSubject.getValue();
    if (backendMarks && backendMarks.length > 0) {
      const studentMarks = backendMarks.filter((m: any) => m.studentId === studentId);
      if (studentMarks.length > 0) {
        console.log(`✅ BACKEND DATA FOUND: ${studentMarks.length} marks for student ${studentId}`);
        return of({ 
          success: true, 
          data: studentMarks, 
          source: 'backend-cache',
          message: 'Data loaded from backend cache'
        });
      } else {
        console.log(`ℹ️  Backend cache loaded but no marks for student ${studentId}`);
        // Return empty data - NOT an error
        return of({ 
          success: true, 
          data: [], 
          source: 'backend-cache-empty',
          message: 'No marks found for this student'
        });
      }
    }
    
    console.log(`ℹ️  Backend cache not yet loaded`);
    
    // Try to get from specific endpoint
    console.log(`🔄 Attempting direct API call to /api/marks/student/${studentId}...`);
    return this.http.get(`${this.baseUrl}/student/${studentId}`).pipe(
      timeout(5000),
      retry(2),
      map((response: any) => {
        console.log(`✅ BACKEND API RESPONSE for student ${studentId}:`, response);
        
        // Handle case where backend returns 200 but no data
        if (!response || !response.data) {
          return { 
            success: false, 
            data: [], 
            source: 'backend-no-data',
            message: 'No marks data returned from backend'
          };
        }
        
        // Store in cache for future use
        if (response.data && Array.isArray(response.data)) {
          const allMarks = [...(this.marksSubject.getValue() || []), ...response.data];
          this.marksSubject.next(allMarks);
        }
        
        return { 
          success: true, 
          ...response, 
          source: 'backend-direct' 
        };
      }),
      catchError((error) => {
        console.warn(`❌ Direct API failed (${error.status}): ${error.statusText}`);
        
        // Check if it's a 404 (not found) - this is NOT an error, just no data
        if (error.status === 404) {
          console.log(`ℹ️  Student ${studentId} not found in backend - no marks exist yet`);
          return of({ 
            success: true, 
            data: [], 
            source: 'backend-404',
            message: 'Student marks not found (404) - marks may not be entered yet'
          });
        }
        
        // For other errors, try loading ALL marks and filter
        console.log(`🔄 Attempting /api/marks/all endpoint...`);
        return this.getAllMarks().pipe(
          map((response: any) => {
            if (response?.success === false) {
              // If getAllMarks also failed, return empty
              console.log(`❌ /all endpoint failed`);
              return { 
                success: true, 
                data: [], 
                source: 'backend-error',
                message: 'Backend unavailable'
              };
            }
            
            if (response?.data && Array.isArray(response.data)) {
              const filtered = response.data.filter((m: any) => m.studentId === studentId);
              if (filtered.length === 0) {
                console.log(`ℹ️  No marks found in /all endpoint for student ${studentId}`);
                return { 
                  success: true, 
                  data: [], 
                  source: 'backend-all-empty',
                  message: 'No marks found for this student'
                };
              }
              console.log(`✅ Got ${filtered.length} marks from /all endpoint for student ${studentId}`);
              return { 
                success: true, 
                data: filtered, 
                source: 'backend-all-endpoint',
                message: 'Data loaded from all marks endpoint'
              };
            }
            
            console.warn(`⚠️  /all endpoint returned invalid data format`);
            return { 
              success: true, 
              data: [], 
              source: 'backend-error',
              message: 'Invalid data format from backend'
            };
          }),
          catchError((allError) => {
            console.warn(`❌ /all endpoint also failed`);
            return of({ 
              success: true, 
              data: [], 
              source: 'backend-error',
              message: 'Backend unavailable'
            });
          })
        );
      })
    );
  }

  /**
   * Get marks by subject ID
   */
  getMarksBySubjectId(subjectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/subject/${subjectId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Get marks by student and subject
   */
  getMarksByStudentAndSubject(studentId: number, subjectId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/student/${studentId}/subject/${subjectId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Create marks for a student
   */
  createStudentMarks(
    studentId: number,
    subjectId: number,
    marksObtained: number,
    maxMarks: number = 100,
    term: string = 'Term 1',
    year: number = new Date().getFullYear()
  ): Observable<any> {
    const marksData = {
      studentId,
      subjectId,
      marksObtained,
      maxMarks,
      term,
      year,
      isRecheckRequested: false
    };
    return this.http.post(`${this.baseUrl}`, marksData).pipe(
      tap(() => this.loadAllMarks()),
      catchError(this.handleError)
    );
  }

  /**
   * Create marks (public method for external use)
   */
  createMarks(marks: any): Observable<any> {
    console.log('📤 Sending marks to backend:', marks);
    return this.http.post(`${this.baseUrl}`, marks).pipe(
      tap((response: any) => {
        console.log('✓ Backend response:', response);
        this.loadAllMarks();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update marks
   */
  updateMarks(markId: number, marks: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${markId}`, marks).pipe(
      tap(() => this.loadAllMarks()),
      catchError(this.handleError)
    );
  }

  /**
   * Delete marks
   */
  deleteMarks(markId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${markId}`).pipe(
      tap(() => this.loadAllMarks()),
      catchError(this.handleError)
    );
  }

  /**
   * Get all marks synchronously
   */
  getAllMarksSync(): Mark[] {
    return this.marksSubject.getValue();
  }

  /**
   * Check if backend marks are available
   */
  isBackendMarksAvailable(): boolean {
    const marks = this.marksSubject.getValue();
    return marks && marks.length > 0;
  }

  /**
   * Get all backend marks that were loaded
   */
  getLoadedBackendMarks(): any[] {
    return this.marksSubject.getValue() || [];
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse) {
    console.error('❌ HTTP Error occurred:', {
      status: error.status,
      statusText: error.statusText,
      message: error.error?.message || error.message,
      error: error.error
    });
    
    let errorMessage = 'Error: ';
    
    if (error.status === 400) {
      errorMessage += error.error?.message || 'Invalid data format';
    } else if (error.status === 404) {
      errorMessage += 'Resource not found';
    } else if (error.status === 500) {
      errorMessage += 'Server error - ' + (error.error?.message || 'Please contact support');
    } else if (error.status === 0) {
      errorMessage += 'Cannot connect to server. Please check your connection.';
    } else {
      errorMessage += error.error?.message || error.message || 'Unknown error';
    }
    
    return throwError(() => new Error(errorMessage));
  }
}