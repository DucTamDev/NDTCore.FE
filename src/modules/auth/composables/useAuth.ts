import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { useToastNotification } from '@/composables/useToastNotification'
import { useRouter } from 'vue-router'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import type {
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
} from '@/modules/auth/models/dtos/_index'

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

    async function register(payload: RegisterRequest): Promise<RegisterResponse | null> {
        return await authStore.register(payload)
    }

    return { login, logout, register }
}
