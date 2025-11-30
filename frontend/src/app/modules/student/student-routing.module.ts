import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewMarksComponent } from './view-marks/view-marks.component';
import { RequestRecheckComponent } from './request-recheck/request-recheck.component';
import { TrackRecheckComponent } from './track-recheck/track-recheck.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'view-marks', component: ViewMarksComponent },
  { path: 'request-recheck', component: RequestRecheckComponent },
  { path: 'track-recheck', component: TrackRecheckComponent },
  { path: 'profile', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
