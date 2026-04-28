import { createRouter, createWebHistory } from 'vue-router'
import { APP_NAME } from '@/core/constants/app.constants'
import { routes } from './routes'
import { useAuthStore } from '@/stores/auth.store'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'

export const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, _from, savedPosition) {
        if (savedPosition) return savedPosition

        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
                top: 64,
            }
        }

        return { top: 0 }
    },
})

router.beforeEach((to) => {
    const authStore = useAuthStore()

    // Chưa initialized → để App.vue xử lý overlay + redirect sau khi check xong
    if (!authStore.isInitialized) {
        const pageTitle = to.meta.title as string | undefined
        document.title = pageTitle && pageTitle !== APP_NAME ? `${pageTitle} | ${APP_NAME}` : APP_NAME
        return
    }

    // Đã login → không cho vào trang không cần auth
    if (authStore.isLoggedIn && !to.meta.requiresAuth) {
        return { name: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME }
    }

    // Chưa login → không cho vào trang cần auth
    if (!authStore.isLoggedIn && to.meta.requiresAuth) {
        return { name: APP_ROUTES.AUTH.CHILDREN.LOGIN.NAME }
    }

    const pageTitle = to.meta.title as string | undefined
    document.title = pageTitle && pageTitle !== APP_NAME ? `${pageTitle} | ${APP_NAME}` : APP_NAME
})
