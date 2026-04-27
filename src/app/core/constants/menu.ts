
import {MenuItem} from "../models/menu.model";

export class Menu{
  public static pages: MenuItem[] = [
    {
      group: 'Base',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Dashboard',
          route: '/dashboard',
          children: [
            { label: 'Vue d\'ensemble', route: '/dashboard/vue' },
          ],
        },
        {
          icon: '/assets/icons/heroicons/outline/lock-closed.svg',
          label: 'Auth',
          route: '/auth',
          children: [
            { label: 'Sign in', route: '/auth/sign-in' },
            { label: 'Sign up', route: '/auth/sign-up' },
            { label: 'Forgot Password', route: '/auth/forgot-password' },
            { label: 'New Password', route: '/auth/new-password' },
          ],
        },
      ],
    },
    {
      group: 'Echéances',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Echéances',
          route: 'dashboard/echeance',
        }
      ],
    },
    {
      group: 'Journal',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Journal de Bord',
          route: 'dashboard/journal',
        }
      ],
    },
    {
      group: 'Entreprise',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Entreprise',
          route: 'dashboard/entreprise',
        }
      ],
    },
    {
      group: 'Profile',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/chart-pie.svg',
          label: 'Profile',
          route: 'dashboard/profile',
        }
      ],
    },
   
  ];
}
