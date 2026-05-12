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
            {
                path: '/example',
                name: 'example',
                component: () => import('@/views/examples/UI.Example.vue'),
                meta: {
                    title: 'Example',
                    requiresAuth: false,
                },
            },
            {
                path: '/example/ui4',
                name: 'example-ui4',
                component: () => import('@/views/examples/UI4.Example.vue'),
                meta: {
                    title: 'UI4 Brand List Example',
                    requiresAuth: false,
                },
            },
        ],
    },
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
    {
        path: APP_ROUTES.ADMIN.BASE.PATH,
        component: () => import('@/layouts/AdminLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME,
                component: () => import('@/views/dashboards/DashboardView.vue'),
                meta: {
                    title: 'Dashboard',
                    breadcrumbs: [{ title: 'Dashboard', disabled: true }],
                    requiresAuth: true,
                },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.USERS.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.USERS.NAME,
                component: () => import('@/views/dashboards/users/UsersView.vue'),
                meta: {
                    title: 'Users',
                    breadcrumbs: [
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Users', disabled: true },
                    ],
                },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.BRANDS.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME,
                component: () => import('@/modules/brand/views/BrandsView.vue'),
                meta: {
                    title: 'Thương hiệu',
                    breadcrumbs: [
                        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                        { title: 'Thương hiệu', disabled: true },
                    ],
                },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.BRAND_DETAIL.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.BRAND_DETAIL.NAME,
                component: () => import('@/modules/brand/views/BrandDetailView.vue'),
                meta: {
                    title: 'Chi tiết thương hiệu',
                },
            },
            {
                path: 'products',
                name: 'admin:products',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'product-categories',
                name: 'admin:product-categories',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'stores',
                name: 'admin:stores',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'sales',
                name: 'admin:sales',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'orders',
                name: 'admin:orders',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'reports/revenue',
                name: 'admin:reports-revenue',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'reports/shift',
                name: 'admin:reports-shift',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
            {
                path: 'reports/top-products',
                name: 'admin:reports-top-products',
                component: () => import('@/components/common/ComingSoonView.vue'),
            },
        ],
    },
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
