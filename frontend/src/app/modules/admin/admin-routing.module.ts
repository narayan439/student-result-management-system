import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { AddStudentComponent } from './manage-students/add-student/add-student.component';
import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { AddTeacherComponent } from './manage-teachers/add-teacher/add-teacher.component';
import { ManageRechecksComponent } from './manage-rechecks/manage-rechecks.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'manage-students', component: ManageStudentsComponent },
  { path: 'manage-students/add', component: AddStudentComponent },
  { path: 'manage-teachers', component: ManageTeachersComponent },
  { path: 'manage-teachers/add', component: AddTeacherComponent },
  { path: 'manage-rechecks', component: ManageRechecksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
