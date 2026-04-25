import type { RouteRecordRaw } from 'vue-router'
import BlankLayout from '@/layouts/BlankLayout.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import { APP_ROUTES } from '@/constants/routes'

export const publicRoutes: RouteRecordRaw[] = [
  {
    path: APP_ROUTES.HOME.PATH,
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: APP_ROUTES.HOME.NAME,
        component: () => import('@/views/HomeView.vue'),
        meta: {
          title: 'Home',
          requiresAuth: false,
        },
      },
    ],
  },
  {
    path: APP_ROUTES.NOT_FOUND.PATH,
    component: BlankLayout,
    children: [
      {
        path: '',
        name: APP_ROUTES.NOT_FOUND.NAME,
        component: () => import('@/views/NotFoundView.vue'),
        meta: {
          title: '404 Not Found',
          requiresAuth: false,
        },
      },
    ],
  },
]
