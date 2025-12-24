import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StudentService } from './student.service';
import { TeacherService } from './teacher.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly ADMIN_EMAIL = 'admin@gmail.com';
  private readonly PASSWORD = '123456';
  private apiAuthUrl: string;

  constructor(
    private studentService: StudentService,
    private teacherService: TeacherService,
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.apiAuthUrl = `${this.configService.getApiUrl()}/auth`;
  }

  /**
   * Authenticate user with email and password
   * @param email User email
   * @param password User password
   * @returns User role (ADMIN, TEACHER, STUDENT) or empty string if invalid
   */
  async fakeLogin(email: string, password: string): Promise<string> {
    console.log('🔐 Starting authentication for:', email);
    
    // Try generic login first (checks User table for admin and Teacher table for teachers)
    try {
      console.log('🔄 Step 1: Trying generic /login endpoint...');
      const response: any = await this.http.post(`${this.apiAuthUrl}/login`, {
        email,
        password
      }).toPromise();
      
      console.log('📨 Response from /login:', response);
      
      // Check if response has success flag and data object
      if (response?.success === true && response?.data) {
        const userData = response.data;
        const userRole = userData.role;
        
        console.log(`✅ Generic login successful!`);
        console.log(`   Role: ${userRole}, Name: ${userData.name}`);
        console.log(`   Redirect: ${userData.redirectPath}`);
        
        // Save session
        this.saveUserSession(email, userRole);
        
        return userRole || '';
      }
      
      console.log('⚠️ Generic login response not successful:', response);
    } catch (error: any) {
      const errorMsg = error?.error?.message || error?.message || 'Unknown error';
      console.log('❌ Generic /login failed:', errorMsg);
      console.log('   Trying next endpoint...');
    }

    // Try dedicated teacher login endpoint (optimized for teacher authentication)
    try {
      console.log('🔄 Step 2: Trying dedicated /teachers-login endpoint...');
      const response: any = await this.http.post(`${this.apiAuthUrl}/teachers-login`, {
        email,
        password
      }).toPromise();
      
      console.log('📨 Response from /teachers-login:', response);
      
      if (response?.success === true && response?.data) {
        const userData = response.data;
        const userRole = userData.role;
        
        console.log(`✅ Teacher login successful!`);
        console.log(`   Role: ${userRole}, Name: ${userData.name}`);
        console.log(`   Redirect: ${userData.redirectPath}`);
        
        // Save session
        this.saveUserSession(email, userRole);
        
        return userRole || '';
      }
      
      console.log('⚠️ Teacher login response not successful:', response);
    } catch (error: any) {
      const errorMsg = error?.error?.message || error?.message || 'Unknown error';
      console.log('❌ /teachers-login failed:', errorMsg);
      console.log('   Trying student login...');
    }

    // Try student login endpoint (DOB-based authentication)
    try {
      console.log('🔄 Step 3: Trying /student-login endpoint...');
      
      // First, refresh students data from backend to ensure latest data
      console.log('   Refreshing student data...');
      const refreshedStudents = await this.studentService.refreshStudents().toPromise();
      console.log(`   ✅ Refreshed ${refreshedStudents?.length} students`);

      // Now try backend student login endpoint
      const response: any = await this.http.post(`${this.apiAuthUrl}/student-login`, {
        email,
        password
      }).toPromise();
      
      console.log('📨 Response from /student-login:', response);
      
      if (response?.success === true && response?.data) {
        console.log(`✅ Student login successful!`);
        this.saveUserSession(email, 'STUDENT');
        return 'STUDENT';
      }
      
      console.log('⚠️ Student login response not successful');
    } catch (error: any) {
      const errorMsg = error?.error?.message || error?.message || 'Unknown error';
      console.log('❌ /student-login failed:', errorMsg);
      console.log('   Trying local student data fallback...');
    }

    // Fallback to in-memory student list for development
    try {
      console.log('🔄 Step 4: Trying local student data (fallback)...');
      const students = this.studentService.getAllStudentsSync();
      console.log(`   Found ${students?.length || 0} local students`);
      
      const student = students?.find((s: any) => s.email === email);
      
      if (student) {
        const expectedPassword = this.generatePasswordFromDOB(student.dob);
        console.log(`   Student found: ${student.name}`);
        console.log(`   DOB: ${student.dob}`);
        console.log(`   Expected password (8 digits): ${expectedPassword}`);
        console.log(`   Submitted password: ${password}`);
        
        if (password === expectedPassword) {
          console.log(`✅ Local student login successful!`);
          this.saveUserSession(email, 'STUDENT');
          return 'STUDENT';
        } else {
          console.log(`❌ Password mismatch for local student`);
        }
      } else {
        console.log(`❌ Student not found in local data`);
      }
    } catch (error) {
      console.log('❌ Local student data fallback failed:', error);
    }
    
    console.log('❌ All authentication methods failed');
    return '';
  }


  private generatePasswordFromDOB(dob: string): string {
    if (!dob) {
      return '';
    }
    
    // Remove all non-digit characters
    const dobDigits = dob.replace(/\D/g, '');
    
    // Take first 8 digits (DDMMYYYY or YYYYMMDD)
    return dobDigits.substring(0, 8);
  }

  /**
   * Store user session info in localStorage
   */
  saveUserSession(email: string, role: string): void {
    const sessionData = {
      email,
      role,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(sessionData));
    console.log('✓ Session saved:', sessionData);
  }

  /**
   * Get current user session
   */
  getCurrentUser(): any {
    try {
      const user = localStorage.getItem('currentUser');
      if (user) {
        const userData = JSON.parse(user);
        console.log('✓ Session retrieved from localStorage:', userData);
        return userData;
      }
      console.log('ℹ No session in localStorage');
      return null;
    } catch (error) {
      console.error('❌ Error parsing stored user data:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const isAuth = !!user;
    console.log('isAuthenticated:', isAuth, user);
    return isAuth;
  }

  /**
   * Get current user role
   */
  getUserRole(): string {
    const user = this.getCurrentUser();
    return user?.role || '';
  }

  /**
   * Logout user and prevent back navigation
   */
  logout(): void {
    console.log('🔓 Logging out user...');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('teacherToken');
    localStorage.clear();
    
    // Prevent back button from accessing protected routes
    // Replace current history entry so user can't use back button
    window.history.replaceState(null, '', window.location.href);
    
    console.log('✓ Session cleared and history reset');
  }

  /**
   * Change password for authenticated user
   * @param currentPassword Current password for verification
   * @param newPassword New password
   */
  changePassword(currentPassword: string, newPassword: string) {
    console.log('🔐 Attempting to change password...');
    const currentUser = this.getCurrentUser();
    return this.http.post(`${this.apiAuthUrl}/change-password`, {
      email: currentUser?.email,
      currentPassword,
      newPassword
    });
  }
}
