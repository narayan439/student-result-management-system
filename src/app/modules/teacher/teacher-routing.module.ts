import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherGuard } from '../../core/guards/teacher.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddMarksComponent } from './add-marks/add-marks.component';
import { RecheckRequestsComponent } from './recheck-requests/recheck-requests.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdateMarksComponent } from './update-marks/update-marks.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [TeacherGuard],
    children: [
      { path: '', component: AddMarksComponent },
      { path: 'add-marks', component: AddMarksComponent },
      { path: 'update-marks', component: UpdateMarksComponent },
      { path: 'update-marks/:rollNo', component: UpdateMarksComponent },
      { path: 'recheck-requests', component: RecheckRequestsComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
