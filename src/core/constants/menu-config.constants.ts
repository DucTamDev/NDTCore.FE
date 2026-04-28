import type { MenuItem } from '@/models/menu.models'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import { USER_ROLES } from './app.constants'

export const menuConfig: MenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'mdi-view-dashboard',
        to: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME,
    },
    {
        title: 'Users',
        icon: 'mdi-account-group',
        to: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME,
        roles: [USER_ROLES.ORG_ADMIN],
        permissions: [],
    },
]
