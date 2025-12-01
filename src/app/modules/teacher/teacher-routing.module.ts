import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddMarksComponent } from './add-marks/add-marks.component';
import { RecheckRequestsComponent } from './recheck-requests/recheck-requests.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateMarksComponent } from './update-marks/update-marks.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,   // NOW ACTS AS MAIN LAYOUT
    children: [
      { path: '', component: AddMarksComponent }, // default page
      { path: 'add-marks', component: AddMarksComponent },
      { path: 'recheck-requests', component: RecheckRequestsComponent },
      { path: 'update-marks/:rollNo', component: UpdateMarksComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
