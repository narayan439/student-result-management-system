import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewMarksComponent } from './view-marks/view-marks.component';
import { RequestRecheckComponent } from './request-recheck/request-recheck.component';
import { TrackRecheckComponent } from './track-recheck/track-recheck.component';
import { ProfileComponent } from './profile/profile.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ViewMarksComponent,
    RequestRecheckComponent,
    TrackRecheckComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
