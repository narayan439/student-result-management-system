import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {

  student = {
    name: 'Narayan Sharma',
    email: 'narayan.sharma@student.dps.edu',
    rollNo: '20230023',
    className: '10th A',
    dob: '15-03-2005',
    admissionNo: 'DPS2020-0456',
    fatherName: 'Rajesh Sharma',
    motherName: 'Priya Sharma',
    address: '123, Green Park, New Delhi - 110016',
    phone: '+91 9876543210',
    bloodGroup: 'O+',
    attendance: '92%',
    lastUpdated: '2023-12-01'
  };

  isEditing = false;
  editData = { ...this.student };

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.editData = { ...this.student };
    }
  }

  saveProfile() {
    this.student = { ...this.editData };
    this.isEditing = false;
    // In real app, you would call API here
    alert('Profile updated successfully!');
  }

  cancelEdit() {
    this.isEditing = false;
  }
}