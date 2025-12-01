import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-subjects',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.css']
})
export class ManageSubjectsComponent {

  displayedColumns: string[] = ['name', 'actions'];

  subjects: string[] = ['Maths', 'Science', 'English', 'History'];
  newSubject = '';

  addSubject() {
    const name = this.newSubject.trim();
    if (!name) {
      alert('Please enter subject name');
      return;
    }

    if (this.subjects.includes(name)) {
      alert('Subject already exists!');
      return;
    }

    this.subjects.push(name);
    this.newSubject = '';
  }

  deleteSubject(name: string) {
    if (confirm(`Delete subject ${name}?`)) {
      this.subjects = this.subjects.filter(s => s !== name);
    }
  }
}
