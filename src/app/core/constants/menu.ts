import {MenuItem} from "../models/menu.model";

export class Menu{
  public static pages: MenuItem[] = [
    {
      group: 'Mon stage',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/home.svg',
          label: "Vue d'ensemble",
          route: '/dashboard/vue',
        },
        {
          icon: '/assets/icons/heroicons/outline/calendar-days.svg',
          label: 'Échéances',
          route: '/dashboard/echeance',
        },
        {
          icon: '/assets/icons/heroicons/outline/book-open.svg',
          label: 'Journal de bord',
          route: '/dashboard/journal',
        },
      ],
    },
    {
      group: 'Informations',
      separator: false,
      items: [
        {
          icon: '/assets/icons/heroicons/outline/building-office.svg',
          label: 'Entreprise',
          route: '/dashboard/entreprise',
        },
        {
          icon: '/assets/icons/heroicons/outline/user-circle.svg',
          label: 'Profil',
          route: '/dashboard/profile',
        },
      ],
    },
  ];
}
