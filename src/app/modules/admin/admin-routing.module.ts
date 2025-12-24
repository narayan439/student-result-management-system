import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../core/guards/admin.guard';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminComponent } from './admin.component';
import { AdminProfileComponent } from './profile/admin-profile.component';

import { ManageStudentsComponent } from './manage-students/manage-students.component';
import { AddStudentComponent } from './manage-students/add-student/add-student.component';
import { EditStudentComponent } from './manage-students/edit-student/edit-student.component';

import { ManageTeachersComponent } from './manage-teachers/manage-teachers.component';
import { AddTeacherComponent } from './manage-teachers/add-teacher/add-teacher.component';
import { EditTeacherComponent } from './manage-teachers/edit-teacher/edit-teacher.component';

import { ManageSubjectsComponent } from './manage-subjects/manage-subjects.component';
import { ManageClassesComponent } from './manage-classes/manage-classes.component';

import { ManageRechecksComponent } from './manage-rechecks/manage-rechecks.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', component: DashboardComponent },

      { 
        path: 'manage-students', 
        component: ManageStudentsComponent,
        canActivate: [AdminGuard]
      },
      { 
        path: 'manage-students/add', 
        component: AddStudentComponent,
        canActivate: [AdminGuard]
      },
      { 
        path: 'manage-students/edit/:id', 
        component: EditStudentComponent,
        canActivate: [AdminGuard]
      },

      { 
        path: 'manage-teachers', 
        component: ManageTeachersComponent,
        canActivate: [AdminGuard]
      },
      { 
        path: 'manage-teachers/add', 
        component: AddTeacherComponent,
        canActivate: [AdminGuard]
      },
      { 
        path: 'manage-teachers/edit/:email', 
        component: EditTeacherComponent,
        canActivate: [AdminGuard]
      },

      { 
        path: 'manage-subjects', 
        component: ManageSubjectsComponent,
        canActivate: [AdminGuard]
      },
      { 
        path: 'manage-classes', 
        component: ManageClassesComponent,
        canActivate: [AdminGuard]
      },

      { 
        path: 'manage-rechecks', 
        component: ManageRechecksComponent,
        canActivate: [AdminGuard]
      },

      { 
        path: 'profile', 
        component: AdminProfileComponent,
        canActivate: [AdminGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
