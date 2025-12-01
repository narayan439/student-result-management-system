import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';

@Component({
  selector: 'app-edit-teacher',
  templateUrl: './edit-teacher.component.html',
  styleUrls: ['./edit-teacher.component.css']
})
export class EditTeacherComponent implements OnInit {

  teacherId: any;

  teacher: any = {
    name: '',
    email: '',
    subject: '',
    dob: ''
  };

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.teacherId = this.route.snapshot.paramMap.get('id');

    // TODO: load from backend later
    this.teacher = {
      name: 'Rahul Sen',
      email: 'rahul@school.com',
      subject: 'Maths',
      dob: '1985-06-12'
    };
  }

  updateTeacher() {
    alert('Teacher Updated Successfully!');
  }

}
