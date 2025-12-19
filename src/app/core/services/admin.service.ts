import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = 'http://localhost:8080/api/admin';
  private apiUrl = 'http://localhost:8080/admin';

  constructor(private http: HttpClient) {}

  // Dashboard Statistics
  getDashboardStatistics(): Observable<any> {
    return this.http.get(`${this.baseUrl}/dashboard/statistics`);
  }

  // System Overview
  getSystemOverview(): Observable<any> {
    return this.http.get(`${this.baseUrl}/system/overview`);
  }

  // Activity Logs
  getActivityLogs(limit: number = 10): Observable<any> {
    return this.http.get(`${this.baseUrl}/activity/logs?limit=${limit}`);
  }

  // Legacy endpoints for backward compatibility
  addStudent(data: any) {
    return this.http.post(`${this.apiUrl}/add-student`, data);
  }

  addTeacher(data: any) {
    return this.http.post(`${this.apiUrl}/add-teacher`, data);
  }
}
