import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { AdminGuard } from './core/guards/admin.guard';
import { StudentGuard } from './core/guards/student.guard';
import { TeacherGuard } from './core/guards/teacher.guard';

const routes: Routes = [

  { path: '', component: WelcomeComponent },

  {
    path: 'login',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)
  },

  {
    path: 'student',
    canActivate: [StudentGuard],
    loadChildren: () => import('./modules/student/student.module').then(m => m.StudentModule)
  },

  {
    path: 'teacher',
    canActivate: [TeacherGuard],
    loadChildren: () => import('./modules/teacher/teacher.module').then(m => m.TeacherModule)
  },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
