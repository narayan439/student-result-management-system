import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';

import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { AddStudentComponent } from './manage-students/add-student/add-student.component';
import { EditStudentComponent } from './manage-students/edit-student/edit-student.component';

import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { AddTeacherComponent } from './manage-teachers/add-teacher/add-teacher.component';
import { EditTeacherComponent } from './manage-teachers/edit-teacher/edit-teacher.component';

import { ManageSubjectsComponent } from './manage-subjects/manage-subjects.component';

import { ManageRechecksComponent } from './manage-rechecks/manage-rechecks.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent },

      { path: 'manage-students', component: ManageStudentsComponent },
      { path: 'manage-students/add', component: AddStudentComponent },
      { path: 'manage-students/edit/:rollNo', component: EditStudentComponent },

      { path: 'manage-teachers', component: ManageTeachersComponent },
      { path: 'manage-teachers/add', component: AddTeacherComponent },
      { path: 'manage-teachers/edit/:email', component: EditTeacherComponent },

      { path: 'manage-subjects', component: ManageSubjectsComponent },

      { path: 'manage-rechecks', component: ManageRechecksComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
