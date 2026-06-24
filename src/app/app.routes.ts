import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full',
  },
  {
    path: 'courses',
    loadChildren: () => import('./features/courses/routes/courses.routes'),
  },
  {
    path: '**',
    redirectTo: 'courses',
  },
];
