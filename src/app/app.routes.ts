import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component')
  },
  {
    path: 'heroes',
    loadChildren: () => import('./heroes/routes'),
  },
  {
    path: 'crisis-center',
    loadChildren: () => import('./crisis-center/routes'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/routes'),
  },
  {
    path: 'compose',
    loadComponent: () =>
      import('./shared/components/compose-message/compose-message.component'),
    outlet: 'popup',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
