import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/constants/app.constants'
import { authGuard } from './guards/auth.guard'

export const routes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.HOME,
    component: () => import('@/layouts/DefaultLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.HOME,
        component: () => import('@/views/HomeView.vue'),
        meta: { title: 'Home', requiresAuth: false },
      },
    ],
  },
  {
    path: ROUTE_PATHS.AUTH,
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: { requiresAuth: false },
    children: [
      {
        path: 'login',
        name: ROUTE_NAMES.LOGIN,
        component: () => import('@/views/LoginView.vue'),
        meta: { title: 'Dang nhap', requiresAuth: false },
      },
      {
        path: 'register',
        name: ROUTE_NAMES.REGISTER,
        component: () => import('@/views/RegisterView.vue'),
        meta: { title: 'Dang ky', requiresAuth: false },
      },
    ],
  },
  {
    path: ROUTE_PATHS.DASHBOARD,
    component: () => import('@/layouts/AdminLayout.vue'),
    beforeEnter: authGuard,
    children: [
      {
        path: '',
        name: ROUTE_NAMES.DASHBOARD,
        component: () => import('@/views/DashboardView.vue'),
        meta: {
          title: 'Dashboard',
          breadcrumb: [{ title: 'Dashboard', disabled: true }],
        },
      },
      {
        path: 'users',
        name: ROUTE_NAMES.USERS,
        component: () => import('@/views/UsersView.vue'),
        meta: {
          title: 'Users',
          permissions: [{ resource: 'users', action: 'read' }],
          breadcrumb: [
            { title: 'Dashboard', to: ROUTE_PATHS.DASHBOARD },
            { title: 'Users', disabled: true },
          ],
        },
      },
    ],
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    component: () => import('@/layouts/BlankLayout.vue'),
    children: [
      {
        path: '',
        name: ROUTE_NAMES.NOT_FOUND,
        component: () => import('@/views/NotFoundView.vue'),
        meta: { title: '404 Not Found', requiresAuth: false },
      },
    ],
  },
]
