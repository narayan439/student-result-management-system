import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-marks',
  templateUrl: './update-marks.component.html',
  styleUrls: ['./update-marks.component.css']
})
export class UpdateMarksComponent {
   rollNo = '';
  updatedMarks = 0;

  constructor(private route: ActivatedRoute) {
    this.rollNo = this.route.snapshot.params['rollNo'];
  }

  save() {
    alert(`Updated marks saved for Roll No ${this.rollNo}`);
  }

}
