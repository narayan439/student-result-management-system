import { Component } from '@angular/core';

@Component({
  selector: 'app-add-marks',
  templateUrl: './add-marks.component.html',
  styleUrls: ['./add-marks.component.css']
})
export class AddMarksComponent {

  marks = {
  rollNo: '',
  subject: '',
  score: null
};

subjects = ['Maths', 'Science', 'English', 'History', 'Geography'];

submitMarks() {
  alert(`Marks added for Roll No: ${this.marks.rollNo}`);
  this.marks = { rollNo: '', subject: '', score: null };
}


}
