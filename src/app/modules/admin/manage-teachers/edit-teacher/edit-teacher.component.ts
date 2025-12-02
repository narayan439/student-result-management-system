import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css']
})
export class EditTeacherComponent implements OnInit {

  teacherId: string = '';
  
  subjects: string[] = ['Maths', 'Science', 'English', 'Computer', 'History', 'Physics', 'Chemistry', 'Biology', 'Geography', 'Economics'];

  teacher: any = {
    name: '',
    email: '',
    subject: '',
    dob: '',
    phone: '',
    qualification: '',
    experience: '',
    address: '',
    joiningDate: '',
    notes: ''
  };

  originalTeacher: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.teacherId = this.route.snapshot.paramMap.get('id') || '';
    
    // TODO: Load teacher data from backend
    // For now, use mock data
    this.originalTeacher = {
      name: 'Rahul Sen',
      email: 'rahul@school.com',
      subject: 'Maths',
      dob: '1985-06-12',
      phone: '+91 9876543210',
      qualification: 'M.Tech',
      experience: 15,
      address: '123 Teacher Street, Kolkata, West Bengal',
      joiningDate: '2010-06-01',
      notes: 'Excellent mathematics teacher with strong analytical skills'
    };
    
    this.teacher = { ...this.originalTeacher };
  }

  updateTeacher() {
    if (this.validateTeacherData()) {
      // TODO: Call backend API to update teacher
      // If AdminService does not declare updateTeacher, cast to any or implement the method in the service.
      (this.adminService as any).updateTeacher(this.teacherId, this.teacher).subscribe({
        next: (res: any) => {
          alert('🎉 Teacher Updated Successfully!');
          this.router.navigate(['/admin/manage-teachers']);
        },
        error: (err: any) => {
          console.error(err);
          alert('❌ Error: ' + (err.error?.message || 'Something went wrong!'));
        }
      });
    }
  }

  resetForm() {
    if (confirm('Are you sure you want to reset all changes?')) {
      this.teacher = { ...this.originalTeacher };
    }
  }

  sendCredentials() {
    if (confirm('Send login credentials to ' + this.teacher.email + '?')) {
      // TODO: Implement send credentials functionality
      alert('Login credentials sent to ' + this.teacher.email);
    }
  }

  changePassword() {
    const newPassword = prompt('Enter new password for ' + this.teacher.name + ':');
    if (newPassword && newPassword.length >= 6) {
      // TODO: Implement password change functionality
      alert('Password has been reset successfully');
    } else if (newPassword) {
      alert('Password must be at least 6 characters long');
    }
  }

  deactivateTeacher() {
    if (confirm('Are you sure you want to deactivate ' + this.teacher.name + '\'s account?')) {
      // TODO: Implement deactivate functionality
      alert('Teacher account has been deactivated');
    }
  }

  private validateTeacherData(): boolean {
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
    
    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}