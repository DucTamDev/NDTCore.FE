// src/composables/useAuth.ts
import { useAuthStore } from '@/stores/auth.store'
import { useToastNotification } from './useToastNotification'
import { useRouter } from 'vue-router'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import type { LoginRequest } from '@/core/api/dtos/auth.dtos'

export function useAuth() {
    const authStore = useAuthStore()
    const toast = useToastNotification()
    const router = useRouter()

    async function login(payload: LoginRequest) {
        await authStore.login(payload)
        await router.push({ name: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME })
    }

    async function logout() {
        authStore.reset()
        await router.push({ name: APP_ROUTES.AUTH.CHILDREN.LOGIN.NAME })
    }

    return { login, logout }
}
