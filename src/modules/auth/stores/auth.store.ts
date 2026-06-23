import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AxiosError } from 'axios'

import { tokenStorageService } from '@/core/storage/token-storage.service'
import { createLogger } from '@/core/logger/logger'
import type { AuthTokenModel } from '@/core/models/auth.model'

import { authService } from '@/modules/auth/services/auth.service'
import type { LoginRequest, RegisterRequest, RegisterResponse } from '@/modules/auth/models/dtos/_index'

const log = createLogger('auth-store')

export const useAuthStore = defineStore('auth', () => {
    const isInitialized = ref(false)
    const isLoggedIn = ref(false)

    function setToken(data: any) {
        const authToken: AuthTokenModel = {
            accessToken: data?.AccessToken,
            refreshToken: data?.RefreshToken,
            accessTokenExpiration: data?.AccessTokenExpiration,
            refreshTokenExpiration: data?.RefreshTokenExpiration,
        }
        tokenStorageService.save(authToken)
    }

    function clearSession() {
        tokenStorageService.clear()
        isLoggedIn.value = false
    }

    function reset(): void {
        clearSession()
        isInitialized.value = false
        log.info('Auth reset')
    }

    async function initialize(): Promise<void> {
        if (isInitialized.value) return
        try {
            const token = tokenStorageService.get()
            if (!token) {
                log.info('No token found')
                return
            }
            isLoggedIn.value = true
            log.info('Session restored from token')
        } catch (err) {
            const status = (err as AxiosError)?.response?.status
            log.warn('Initialize failed', { status })
            clearSession()
        } finally {
            isInitialized.value = true
        }
    }

    async function login(payload: LoginRequest): Promise<void> {
        log.info('Login start')
        const data = await authService.loginAsync(payload)
        if (
            !data?.AccessToken ||
            !data?.RefreshToken ||
            !data?.AccessTokenExpiration ||
            !data?.RefreshTokenExpiration
        ) {
            throw new Error('Invalid login response')
        }

        setToken(data)

        isLoggedIn.value = true
        isInitialized.value = true

        log.info('Login success')
    }

    async function register(payload: RegisterRequest): Promise<RegisterResponse | null> {
        const data = await authService.registerAsync(payload)

        return data
    }

    function logout(): void {
        clearSession()
        isInitialized.value = false
        log.info('Logout')
    }

    return {
        isLoggedIn,
        isInitialized,
        reset,
        initialize,
        login,
        logout,
        register,
    }
})
