import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../../core/guards/unsaved-changes.guard';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../pages/course-list/course-list.component').then((m) => m.CourseListComponent),
  },
  {
    path: 'add',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('../pages/course-form/course-form.component').then((m) => m.CourseFormComponent),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('../pages/course-details/course-details.component').then(
        (m) => m.CourseDetailsComponent
      ),
  },
  {
    path: 'edit/:id',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () =>
      import('../pages/course-form/course-form.component').then((m) => m.CourseFormComponent),
  },
];
export default COURSES_ROUTES;
