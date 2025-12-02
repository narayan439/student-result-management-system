import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-manage-teachers',
  templateUrl: './manage-teachers.component.html',
  styleUrls: ['./manage-teachers.component.css']
})
export class ManageTeachersComponent implements OnInit {

  displayedColumns: string[] = ['name', 'subject', 'email', 'dob', 'actions'];

  teachers = [
    { 
      name: 'Rahul Sen', 
      email: 'rahul@school.com', 
      subject: 'Maths', 
      dob: '1985-06-12',
      phone: '+91 9876543210',
      experience: 15
    },
    { 
      name: 'Ananya Patra', 
      email: 'ananya@school.com', 
      subject: 'Science', 
      dob: '1989-11-25',
      phone: '+91 9876543211',
      experience: 10
    },
    { 
      name: 'Sanjay Kumar', 
      email: 'sanjay@school.com', 
      subject: 'English', 
      dob: '1980-03-15',
      phone: '+91 9876543212',
      experience: 20
    },
    { 
      name: 'Priya Sharma', 
      email: 'priya@school.com', 
      subject: 'History', 
      dob: '1990-08-30',
      phone: '+91 9876543213',
      experience: 8
    },
    { 
      name: 'Amit Singh', 
      email: 'amit@school.com', 
      subject: 'Physics', 
      dob: '1987-12-05',
      phone: '+91 9876543214',
      experience: 12
    }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    // TODO: Load teacher list from backend later
  }

  deleteTeacher(email: string) {
    if (confirm("Are you sure you want to delete this teacher?")) {
      // TODO: backend call soon
      this.teachers = this.teachers.filter(t => t.email !== email);
      alert("Teacher Deleted Successfully!");
    }
  }

  // Helper methods for UI
  getUniqueSubjects(): string[] {
    const subjects = this.teachers.map(t => t.subject);
    return [...new Set(subjects)];
  }

  getAverageExperience(): number {
    const totalExp = this.teachers.reduce((sum, teacher) => sum + (teacher.experience || 0), 0);
    return Math.round(totalExp / this.teachers.length);
  }

  getAvatarColor(name: string): string {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  getSubjectColor(subject: string): string {
    const colorMap: {[key: string]: string} = {
      'Maths': '#4CAF50',
      'Science': '#2196F3',
      'English': '#FF9800',
      'History': '#9C27B0',
      'Physics': '#F44336',
      'Chemistry': '#795548',
      'Biology': '#4CAF50',
      'Computer': '#607D8B'
    };
    return colorMap[subject] || '#9E9E9E';
  }

  getTeacherPhone(email: string): string {
    const teacher = this.teachers.find(t => t.email === email);
    return teacher?.phone || '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}