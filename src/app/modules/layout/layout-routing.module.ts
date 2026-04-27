import { Routes } from '@angular/router';
import { Layout } from './layout';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: Layout,
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