import type { RouteRecordRaw } from 'vue-router'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'

export const routes: RouteRecordRaw[] = [
    {
        path: APP_ROUTES.HOME.PATH,
        component: () => import('@/layouts/DefaultLayout.vue'),
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

    // ================= AUTH =================
    {
        path: APP_ROUTES.AUTH.BASE.PATH,
        component: () => import('@/layouts/AuthLayout.vue'),
        children: [
            {
                path: APP_ROUTES.AUTH.CHILDREN.LOGIN.PATH,
                name: APP_ROUTES.AUTH.CHILDREN.LOGIN.NAME,
                component: () => import('@/views/LoginView.vue'),
                meta: {
                    title: 'Đăng nhập',
                    requiresAuth: false,
                },
            },
            {
                path: APP_ROUTES.AUTH.CHILDREN.REGISTER.PATH,
                name: APP_ROUTES.AUTH.CHILDREN.REGISTER.NAME,
                component: () => import('@/views/RegisterView.vue'),
                meta: {
                    title: 'Đăng ký',
                    requiresAuth: false,
                },
            },
        ],
    },

    // ================= ADMIN =================
    {
        path: APP_ROUTES.ADMIN.BASE.PATH,
        component: () => import('@/layouts/AdminLayout.vue'),
        // beforeEnter: authGuard,
        meta: { requiresAuth: true },
        children: [
            {
                path: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME,
                component: () => import('@/views/DashboardView.vue'),
                meta: {
                    title: 'Dashboard',
                    breadcrumb: [{ title: 'Dashboard', disabled: true }],
                    requiresAuth: true,
                },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.USERS.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME,
                component: () => import('@/views/UsersView.vue'),
                meta: {
                    title: 'Users',
                    permissions: [{ resource: 'users', action: 'read' }],
                    breadcrumb: [
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Users', disabled: true },
                    ],
                },
            },
        ],
    },

    // ================= NOT FOUND =================
    {
        path: APP_ROUTES.NOT_FOUND.PATH,
        component: () => import('@/layouts/BlankLayout.vue'),
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
