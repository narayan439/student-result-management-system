import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddMarksComponent } from './add-marks/add-marks.component';
import { UpdateMarksComponent } from './update-marks/update-marks.component';
import { RecheckRequestsComponent } from './recheck-requests/recheck-requests.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AddMarksComponent,
    UpdateMarksComponent,
    RecheckRequestsComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule
  ]
})
export class TeacherModule { }
