import { Component } from '@angular/core';

@Component({
  selector: 'app-teacher-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  teacher = {
    name: 'Abhinav Kumar',
    email: 'teacher@example.com',
    subject: 'Mathematics',
    dob: '1990-01-15',
    experience: 6,
    phone: '9876543210',
    address: 'Bhubaneswar, Odisha'
  };

}
