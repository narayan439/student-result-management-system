import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddMarksComponent } from './add-marks/add-marks.component';
import { UpdateMarksComponent } from './update-marks/update-marks.component';
import { RecheckRequestsComponent } from './recheck-requests/recheck-requests.component';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { ProfileComponent } from './profile/profile.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// MINIMAL NEW IMPORTS for RecheckRequestsComponent
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    DashboardComponent,
    AddMarksComponent,
    UpdateMarksComponent,
    RecheckRequestsComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    FormsModule,
    
    // Material Modules
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    
    // MINIMAL: Only essential modules for RecheckRequestsComponent
    MatPaginatorModule,  // Required for pagination
    MatChipsModule       // Required for chips (subject/status badges)
  ]
})
export class TeacherModule { }