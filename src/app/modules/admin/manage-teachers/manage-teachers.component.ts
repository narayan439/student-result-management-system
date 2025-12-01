import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-manage-teachers',
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.css']
})
export class ManageTeachersComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'subject', 'dob', 'actions'];

  teachers = [
    { name: 'Rahul Sen', email: 'rahul@school.com', subject: 'Maths', dob: '1985-06-12' },
    { name: 'Ananya Patra', email: 'ananya@school.com', subject: 'Science', dob: '1989-11-25' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // TODO: Load teacher list from backend later
  }

  deleteTeacher(id: any) {
  if (confirm("Are you sure you want to delete this teacher?")) {

    // TODO: backend call soon
    this.teachers = this.teachers.filter(t => t.email !== id);

    alert("Teacher Deleted Successfully!");
  }
}

}
