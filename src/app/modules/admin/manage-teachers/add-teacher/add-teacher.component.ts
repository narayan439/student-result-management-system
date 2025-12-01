import { Component } from '@angular/core';
import { AdminService } from '../../../../core/services/admin.service';

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
    dob: ''
  };

  // you can use this for dropdown
  subjects: string[] = ['Maths', 'Science', 'English', 'Computer', 'History'];

  constructor(private adminService: AdminService) {}

  createTeacher() {
    this.adminService.addTeacher(this.teacher).subscribe({
      next: (res: any) => {
        alert('🎉 Teacher Added Successfully!');
        // optional: reset form
        this.teacher = {
          name: '',
          email: '',
          subject: '',
          dob: ''
        };
      },
      error: (err: any) => {
        console.error(err);
        alert('❌ Something went wrong!');
      }
    });
  }
}
