import { Routes } from '@angular/router';
import { Layout } from './layout';
import { authGuard } from '../../core/guards/auth/auth.guard';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: Layout,
    // canActivateChild : revérifié à chaque navigation dans le tableau de bord
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../dashboard/dashboard-routing.module')
            .then(m => m.DASHBOARD_ROUTES)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];