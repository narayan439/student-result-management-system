import { Component } from '@angular/core';

export interface Subject {
  subjectId?: number;
  subjectCode: string;
  subjectName: string;
  isActive?: boolean;
}

@Component({
  selector: 'app-manage-subjects',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.css']
})
export class ManageSubjectsComponent {

  displayedColumns: string[] = ['code', 'name', 'actions'];

  subjects: Subject[] = [
    { subjectId: 1, subjectCode: 'MTH', subjectName: 'Maths', isActive: true },
    { subjectId: 2, subjectCode: 'SCI', subjectName: 'Science', isActive: true },
    { subjectId: 3, subjectCode: 'ENG', subjectName: 'English', isActive: true },
    { subjectId: 4, subjectCode: 'HIS', subjectName: 'History', isActive: true }
  ];

  newSubjectCode = '';
  newSubjectName = '';

  addSubject() {
    const code = this.newSubjectCode.trim().toUpperCase();
    const name = this.newSubjectName.trim();

    if (!code) {
      alert('Please enter subject code');
      return;
    }

    if (!name) {
      alert('Please enter subject name');
      return;
    }

    if (this.subjects.some(s => s.subjectCode === code)) {
      alert('Subject code already exists!');
      return;
    }

    if (this.subjects.some(s => s.subjectName === name)) {
      alert('Subject name already exists!');
      return;
    }

    const newSubject: Subject = {
      subjectId: Math.max(...this.subjects.map(s => s.subjectId || 0)) + 1,
      subjectCode: code,
      subjectName: name,
      isActive: true
    };

    this.subjects.push(newSubject);
    this.newSubjectCode = '';
    this.newSubjectName = '';
  }

  deleteSubject(subject: Subject) {
    if (confirm(`Delete subject ${subject.subjectName} (${subject.subjectCode})?`)) {
      this.subjects = this.subjects.filter(s => s.subjectId !== subject.subjectId);
    }
  }
}
