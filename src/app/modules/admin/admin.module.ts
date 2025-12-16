import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { AddStudentComponent } from './manage-students/add-student/add-student.component';
import { EditStudentComponent } from './manage-students/edit-student/edit-student.component';
import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { AddTeacherComponent } from './manage-teachers/add-teacher/add-teacher.component';
import { EditTeacherComponent } from './manage-teachers/edit-teacher/edit-teacher.component';
import { ManageSubjectsComponent } from './manage-subjects/manage-subjects.component';
import { ManageRechecksComponent } from './manage-rechecks/manage-rechecks.component';
import { ManageClassesComponent } from './manage-classes/manage-classes.component';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';


@NgModule({
  declarations: [
    DashboardComponent,
    ManageStudentsComponent,
    AddStudentComponent,
    EditStudentComponent,
    ManageTeachersComponent,
    AddTeacherComponent,
    EditTeacherComponent,
    ManageSubjectsComponent,
    ManageClassesComponent,
    ManageRechecksComponent,
    AdminComponent
  ],
  imports: [
    
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTableModule,
    MatCardModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatSlideToggleModule,
    MatChipsModule
  ]
})
export class AdminModule { }
