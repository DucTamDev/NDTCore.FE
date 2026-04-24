import type { RouteRecordRaw } from 'vue-router'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { APP_ROUTES } from '@/constants/routes'
import { authGuard } from '@/router/guards'

export const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        name: APP_ROUTES.DASHBOARD.HOME.NAME,
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
        meta: {
          title: 'Dashboard',
          breadcrumbs: [{ title: 'Dashboard', disabled: true }],
        },
      },
      {
        path: 'users',
        name: APP_ROUTES.USERS.LIST.NAME,
        component: () => import('@/pages/users/UsersPage.vue'),
        meta: {
          title: 'Users',
          permissions: [{ resource: 'users', action: 'read' }],
          breadcrumbs: [
            { title: 'Dashboard', to: APP_ROUTES.DASHBOARD.HOME.PATH },
            { title: 'Users', disabled: true },
          ],
        },
      },
    ],
  },
]
