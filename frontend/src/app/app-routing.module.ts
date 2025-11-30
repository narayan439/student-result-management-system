import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  // Default route → redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth Module (Login)
  {
    path: 'login',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },

  // Admin Module
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then(m => m.AdminModule)
  },

  // Teacher Module
  {
    path: 'teacher',
    loadChildren: () =>
      import('./modules/teacher/teacher.module').then(m => m.TeacherModule)
  },

  // Student Module
  {
    path: 'student',
    loadChildren: () =>
      import('./modules/student/student.module').then(m => m.StudentModule)
  },

  // Wildcard route → if wrong URL
  { path: '**', redirectTo: 'login' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
