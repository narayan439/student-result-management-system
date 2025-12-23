import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentDashboardComponent } from './student-dashboard.component';
import { ViewMarksComponent } from './view-marks/view-marks.component';
import { RequestRecheckComponent } from './request-recheck/request-recheck.component';
import { TrackRecheckComponent } from './track-recheck/track-recheck.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewResultComponent } from './view-result/view-result.component';
import { StudentGuard } from '../../core/guards/student.guard';

const routes: Routes = [
  // PUBLIC ROUTE - No guard required
  { path: 'view-result/:rollNo/:email', component: ViewResultComponent },

  // PROTECTED ROUTES - Requires student login
  {
    path: '',
    component: StudentDashboardComponent,   // Navbar + router-outlet 
    canActivate: [StudentGuard],
    children: [
      { path: '', component: ViewMarksComponent },  // Default page
      { path: 'view-marks', component: ViewMarksComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'request-recheck', component: RequestRecheckComponent },
      { path: 'track-recheck', component: TrackRecheckComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
