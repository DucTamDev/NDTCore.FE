import type { MenuItem } from '@/models/menu.models'
import { APP_ROUTES } from '@/constants/routes'

export const menuConfig: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'mdi-view-dashboard',
    to: APP_ROUTES.DASHBOARD.HOME.PATH,
  },
  {
    title: 'Users',
    icon: 'mdi-account-group',
    to: APP_ROUTES.USERS.LIST.PATH,
    permissions: ['users'],
  },
]
