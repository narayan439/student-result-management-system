import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  student = {
    name: 'Narayan',
    email: 'narayan@student.com',
    rollNo: '23',
    className: '10',
    dob: '2005-02-20'
  };

}
