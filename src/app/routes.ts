import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { authGuard } from '@/core/guards/auth.guard'

import AdminLayout from '@/shared/components/layouts/AdminLayout.vue'
import AuthLayout from '@/shared/components/layouts/AuthLayout.vue'
import BlankLayout from '@/shared/components/layouts/BlankLayout.vue'
import DefaultLayout from '@/shared/components/layouts/DefaultLayout.vue'

import { authRoutes } from '@/modules/auth/routes'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: DefaultLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/views/HomeView.vue'),
                meta: {
                    title: 'Home',
                    breadcrumb: [{ text: 'Home', disabled: true }],
                },
            },
        ],
    },
    {
        path: '/admin',
        component: AdminLayout,
        beforeEnter: authGuard,
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import('@/views/DashboardView.vue'),
                meta: {
                    title: 'Dashboard',
                    breadcrumb: [{ text: 'Dashboard', disabled: true }],
                },
            },
        ],
    },
    {
        path: '/auth',
        children: [
            {
                path: '',
                component: BlankLayout,
                children: [
                    {
                        path: '',
                        name: 'auth-root-not-found',
                        component: () => import('@/views/NotFoundView.vue'),
                        meta: { title: '404 Not Found' },
                    },
                ],
            },
            {
                path: '',
                component: AuthLayout,
                children: authRoutes,
            },
        ],
    },
    {
        path: '/:pathMatch(.*)*',
        component: BlankLayout,
        children: [
            {
                path: '',
                name: 'not-found',
                component: () => import('@/views/NotFoundView.vue'),
                meta: { title: '404 Not Found' },
            },
        ],
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// Navigation
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title || 'NDTCore Pro'} | NDTCore Pro`
    next()
})

export default router
