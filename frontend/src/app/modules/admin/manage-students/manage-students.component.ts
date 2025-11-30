import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-manage-students',
  templateUrl: './manage-students.component.html',
  styleUrls: ['./manage-students.component.css']
})
export class ManageStudentsComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'className', 'rollNo', 'actions'];

  students = [
    {
      name: 'Narayan',
      email: 'narayan@student.com',
      className: '10',
      rollNo: '23'
    },
    {
      name: 'Rakesh',
      email: 'rakesh@student.com',
      className: '9',
      rollNo: '19'
    }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // Later use backend API:
    // this.adminService.getAllStudents().subscribe(res => this.students = res);
  }

}
