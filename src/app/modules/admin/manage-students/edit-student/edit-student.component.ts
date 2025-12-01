import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  studentId: any;

  student: any = {
    name: '',
    email: '',
    className: '',
    rollNo: '',
    dob: ''
  };

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id');

    // TODO: load from backend
    // this.adminService.getStudentById(this.studentId).subscribe(...)

    // TEMP dummy data
    this.student = {
      name: 'Narayan',
      email: 'narayan@student.com',
      className: '10',
      rollNo: '23',
      dob: '2005-02-20'
    };
  }

  updateStudent() {
    // TODO: send update request to backend
    // this.adminService.updateStudent(this.studentId, this.student)

    alert('Student Updated Successfully!');
  }

}
