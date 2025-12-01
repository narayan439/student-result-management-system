import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.css']
})
export class ViewResultComponent implements OnInit {

  result: any = {};
  qrData: string = '';


  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
  let roll = this.route.snapshot.paramMap.get('rollNo');
  let dob = this.route.snapshot.paramMap.get('dob');

  this.qrData = `ROLL:${roll},DOB:${dob},RESULT:VERIFIED`;

  this.result = {
    name: "Rahul Kumar",
    rollNo: roll,
    dob: dob,
    className: "10th",
    marks: [
      { subject: "Math", score: 78 },
      { subject: "Science", score: 81 },
      { subject: "English", score: 74 },
      { subject: "Hindi", score: 88 }
    ],
    total: 321,
    percentage: (321 / 400 * 100).toFixed(2),
    status: "PASS"
  };
}

goToLoginForRecheck() {
  this.router.navigate(['/login'], {
    queryParams: { role: 'student', recheck: 'true' }
  });
}



  downloadPDF() {
    const DATA: any = document.querySelector('.result-container');
    html2canvas(DATA).then(canvas => {

      let fileWidth = 208; // A4 width
      let fileHeight = (canvas.height * fileWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, fileWidth, fileHeight);

      pdf.save('marksheet.pdf');
    });
  }
}
