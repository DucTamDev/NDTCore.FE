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
        try {
            await authStore.login(payload)

            toast.success('Đăng nhập thành công')

            router.push({ name: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME })
        } catch {
            toast.error('Tên đăng nhập hoặc mật khẩu không đúng')
        }
    }

    return { login }
}
