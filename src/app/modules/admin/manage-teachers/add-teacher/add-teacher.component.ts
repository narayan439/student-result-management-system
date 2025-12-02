import { Component } from '@angular/core';
import { AdminService } from '../../../../core/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-teacher',
  templateUrl: './add-teacher.component.html',
  styleUrls: ['./add-teacher.component.css']
})
export class AddTeacherComponent {

  teacher = {
    name: '',
    email: '',
    subject: '',
    dob: '',
    phone: '',
    qualification: '',
    experience: '',
    address: ''
  };

  subjects: string[] = ['Maths', 'Science', 'English', 'Computer', 'History', 'Physics', 'Chemistry', 'Biology', 'Geography', 'Economics'];

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  createTeacher() {
    if (this.validateTeacherData()) {
      this.adminService.addTeacher(this.teacher).subscribe({
        next: (res: any) => {
          alert('🎉 Teacher Added Successfully!');
          this.router.navigate(['/admin/manage-teachers']);
        },
        error: (err: any) => {
          console.error(err);
          alert('❌ Error: ' + (err.error?.message || 'Something went wrong!'));
        }
      });
    }
  }

  private validateTeacherData(): boolean {
    // Basic validation
    if (!this.teacher.name.trim()) {
      alert('Please enter teacher name');
      return false;
    }
    
    if (!this.teacher.email.trim()) {
      alert('Please enter email address');
      return false;
    }
    
    if (!this.isValidEmail(this.teacher.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    if (!this.teacher.subject) {
      alert('Please select subject');
      return false;
    }
    
    if (!this.teacher.dob) {
      alert('Please select date of birth');
      return false;
    }
    
    // Validate age (must be at least 21 years old)
    if (!this.isValidAge(this.teacher.dob)) {
      alert('Teacher must be at least 21 years old');
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidAge(dob: string): boolean {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 21;
  }
}