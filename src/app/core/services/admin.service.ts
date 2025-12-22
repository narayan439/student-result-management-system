import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl: string;
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.baseUrl = `${this.configService.getApiUrl()}/admin`;
    this.apiUrl = `${this.configService.getApiBaseUrl()}/admin`;
  }

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
