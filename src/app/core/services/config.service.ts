import { Injectable } from '@angular/core';

/**
 * Configuration Service
 * Provides centralized access to application configuration and API endpoints
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  // Backend API Configuration
  private apiBaseUrl = 'https://srms-backend-production.up.railway.app';
  private apiUrl = 'https://srms-backend-production.up.railway.app/api';

  constructor() {
    this.initializeConfig();
  }

  /**
   * Initialize configuration from environment variables or defaults
   */
  private initializeConfig(): void {
    // Try to get from window object or environment variables
    const backendUrl = this.getConfigValue('BACKEND_URL', 'https://srms-backend-production.up.railway.app/api');
    const apiBase = this.getConfigValue('API_BASE_URL', 'https://srms-backend-production.up.railway.app');
    
    this.apiUrl = backendUrl;
    this.apiBaseUrl = apiBase;
    
    console.log('✓ Configuration initialized');
    console.log('API Base URL:', this.apiBaseUrl);
    console.log('API URL:', this.apiUrl);
  }

  /**
   * Get configuration value from various sources
   */
  private getConfigValue(key: string, defaultValue: string): string {
    // Try window object first (for injected configs)
    if (typeof window !== 'undefined' && (window as any)[key]) {
      return (window as any)[key];
    }
    
    // Try localStorage (for saved configs)
    const stored = localStorage.getItem(`app_config_${key}`);
    if (stored) {
      return stored;
    }
    
    // Return default
    return defaultValue;
  }

  /**
   * Get API Base URL
   */
  getApiBaseUrl(): string {
    return this.apiBaseUrl;
  }

  /**
   * Get full API URL
   */
  getApiUrl(): string {
    return this.apiUrl;
  }

  /**
   * Get complete endpoint URL
   */
  getEndpoint(endpoint: string): string {
    return `${this.apiUrl}${endpoint}`;
  }

  /**
   * Update API configuration at runtime
   */
  setApiUrl(url: string): void {
    this.apiUrl = url;
    localStorage.setItem('app_config_BACKEND_URL', url);
    console.log('✓ API URL updated:', url);
  }

  /**
   * Update API Base URL at runtime
   */
  setApiBaseUrl(url: string): void {
    this.apiBaseUrl = url;
    localStorage.setItem('app_config_API_BASE_URL', url);
    console.log('✓ API Base URL updated:', url);
  }

  /**
   * Get all configuration
   */
  getConfig(): {
    apiBaseUrl: string;
    apiUrl: string;
    endpoints: {
      auth: string;
      students: string;
      marks: string;
      subjects: string;
      teachers: string;
      classes: string;
      rechecks: string;
      admin: string;
    };
  } {
    return {
      apiBaseUrl: this.apiBaseUrl,
      apiUrl: this.apiUrl,
      endpoints: {
        auth: this.getEndpoint('/auth'),
        students: this.getEndpoint('/students'),
        marks: this.getEndpoint('/marks'),
        subjects: this.getEndpoint('/subjects'),
        teachers: this.getEndpoint('/teachers'),
        classes: this.getEndpoint('/classes'),
        rechecks: this.getEndpoint('/rechecks'),
        admin: this.getEndpoint('/admin')
      }
    };
  }
}
