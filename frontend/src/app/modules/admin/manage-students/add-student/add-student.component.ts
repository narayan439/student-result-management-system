import { Component } from '@angular/core';
import { AdminService } from '../../../../core/services/admin.service';

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
    dob: ''
  };

  constructor(private adminService: AdminService) {}

  createStudent() {
    this.adminService.addStudent(this.student).subscribe({
      next: (res: any) => {
        alert("🎉 Student Added Successfully!");
      },
      error: (err) => {
        alert("❌ Something went wrong!");
      }
    });
  }
}
