import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddMarksComponent } from './add-marks/add-marks.component';
import { UpdateMarksComponent } from './update-marks/update-marks.component';
import { RecheckRequestsComponent } from './recheck-requests/recheck-requests.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'add-marks', component: AddMarksComponent },
  { path: 'update-marks', component: UpdateMarksComponent },
  { path: 'recheck-requests', component: RecheckRequestsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TeacherRoutingModule { }
