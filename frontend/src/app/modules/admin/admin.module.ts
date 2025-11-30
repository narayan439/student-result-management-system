import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';


import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { ManageSubjectsComponent } from './manage-subjects/manage-subjects.component';
import { ManageRechecksComponent } from './manage-rechecks/manage-rechecks.component';
import { AddStudentComponent } from './manage-students/add-student/add-student.component';
import { AddTeacherComponent } from './manage-teachers/add-teacher/add-teacher.component';


@NgModule({
  declarations: [
    DashboardComponent,
    ManageStudentsComponent,
    ManageTeachersComponent,
    ManageSubjectsComponent,
    ManageRechecksComponent,
    AddStudentComponent,
    AddTeacherComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class AdminModule { }
