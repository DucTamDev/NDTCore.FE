import type { RouteRecordRaw } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { APP_ROUTES } from '@/constants/routes'

export const authRoutes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: APP_ROUTES.AUTH.LOGIN.NAME,
        component: () => import('@/views/LoginView.vue'),
        meta: {
          title: 'Đăng nhập',
          requiresAuth: false,
        },
      },
      {
        path: 'register',
        name: APP_ROUTES.AUTH.REGISTER.NAME,
        component: () => import('@/views/RegisterView.vue'),
        meta: {
          title: 'Đăng ký',
          requiresAuth: false,
        },
      },
    ],
  },
]
