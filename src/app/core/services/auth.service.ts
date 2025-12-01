import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  // Temporary fake login before backend is ready
  fakeLogin(email: string, password: string): string {

    if (email.includes('admin')) {
      return 'ADMIN';
    }
    if (email.includes('teacher')) {
      return 'TEACHER';
    }
    if (email.includes('student')) {
      return 'STUDENT';
    }

    return '';
  }

}
