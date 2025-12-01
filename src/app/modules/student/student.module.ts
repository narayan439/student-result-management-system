import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StudentRoutingModule } from './student-routing.module';

import { StudentDashboardComponent } from './student-dashboard.component';  // ✅ ADD THIS
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewMarksComponent } from './view-marks/view-marks.component';
import { RequestRecheckComponent } from './request-recheck/request-recheck.component';
import { TrackRecheckComponent } from './track-recheck/track-recheck.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewResultComponent } from './view-result/view-result.component';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';

import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [
    StudentDashboardComponent,  // ✅ REQUIRED
    DashboardComponent,
    ViewMarksComponent,
    RequestRecheckComponent,
    TrackRecheckComponent,
    ProfileComponent,
    ViewResultComponent
  ],
  imports: [
    CommonModule,
    RouterModule,              // routerLink, router-outlet
    StudentRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    QRCodeModule
  ]
})
export class StudentModule { }
