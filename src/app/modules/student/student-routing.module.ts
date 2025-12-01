import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentDashboardComponent } from './student-dashboard.component';
import { ViewMarksComponent } from './view-marks/view-marks.component';
import { RequestRecheckComponent } from './request-recheck/request-recheck.component';
import { TrackRecheckComponent } from './track-recheck/track-recheck.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewResultComponent } from './view-result/view-result.component';

const routes: Routes = [
  {
    path: '',
    component: StudentDashboardComponent,   // Navbar + router-outlet 
    children: [
      { path: '', component: ViewMarksComponent },  // Default page
      { path: 'view-marks', component: ViewMarksComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'request-recheck', component: RequestRecheckComponent },
      { path: 'track-recheck', component: TrackRecheckComponent },
      { path: 'view-result/:rollNo/:dob', component: ViewResultComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
