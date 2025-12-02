import { Component } from '@angular/core';
import { AdminService } from '../../../../core/services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css']
})
export class AddStudentComponent {

  student = {
    name: '',
    email: '',
    className: '',
    rollNo: '',
    dob: '',
    phone: '',
    address: ''
  };

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  createStudent() {
    if (this.validateStudentData()) {
      this.adminService.addStudent(this.student).subscribe({
        next: (res: any) => {
          alert("🎉 Student Added Successfully!");
          this.router.navigate(['/admin/manage-students']);
        },
        error: (err) => {
          alert("❌ Error: " + (err.error?.message || 'Something went wrong!'));
        }
      });
    }
  }

  private validateStudentData(): boolean {
    // Basic validation
    if (!this.student.name.trim()) {
      alert('Please enter student name');
      return false;
    }
    
    if (!this.student.email.trim()) {
      alert('Please enter email address');
      return false;
    }
    
    if (!this.isValidEmail(this.student.email)) {
      alert('Please enter a valid email address');
      return false;
    }
    
    if (!this.student.className) {
      alert('Please select class');
      return false;
    }
    
    if (!this.student.rollNo.trim()) {
      alert('Please enter roll number');
      return false;
    }
    
    if (!this.student.dob) {
      alert('Please select date of birth');
      return false;
    }
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}