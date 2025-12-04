import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { StudentRoutingModule } from './student-routing.module';

// Material Modules
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips'; // Added for chips in view-marks
import { MatPaginatorModule } from '@angular/material/paginator'; // Optional for tables
import { MatSortModule } from '@angular/material/sort'; // Optional for tables

// External Modules
import { QRCodeModule } from 'angularx-qrcode';

// Student Components
import { StudentDashboardComponent } from './student-dashboard.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ViewMarksComponent } from './view-marks/view-marks.component';
import { RequestRecheckComponent } from './request-recheck/request-recheck.component';
import { TrackRecheckComponent } from './track-recheck/track-recheck.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewResultComponent } from './view-result/view-result.component';

@NgModule({
  declarations: [
    StudentDashboardComponent,
    DashboardComponent,
    ViewMarksComponent,
    RequestRecheckComponent,
    TrackRecheckComponent,
    ProfileComponent,
    ViewResultComponent
  ],
  imports: [
    // Angular Modules
    CommonModule,
    RouterModule,
    FormsModule,
    
    // Routing
    StudentRoutingModule,
    
    // Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule, // For chips in view-marks
    MatPaginatorModule, // Optional: if you need pagination
    MatSortModule, // Optional: if you need table sorting
    
    // External Modules
    QRCodeModule
  ],
  exports: [
    // If you need to export any components to other modules
    StudentDashboardComponent
  ]
})
export class StudentModule { }