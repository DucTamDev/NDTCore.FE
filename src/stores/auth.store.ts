// src/stores/auth.store.ts
import { identityClient } from '@/core/api/clients/identity.client'
import type { LoginRequest, LoginResponse } from '@/core/api/dtos/auth.dtos'
import type { UserProfileResponse } from '@/core/api/dtos/user.dtos'
import { createLogger } from '@/core/logger/logger'
import { tokenStorageService } from '@/core/storage/token-storage.service'
import type { AuthTokenModel } from '@/models/auth.model'
import { AxiosError } from 'axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const log = createLogger('auth-store')

// Module-level → reset mỗi lần F5, không bị persist
let initPromise: Promise<void> | null = null

export const useAuthStore = defineStore('auth', () => {
    const user = ref<UserProfileResponse | null>(null)
    const isInitialized = ref(false)

    const isLoggedIn = computed(() => !!user.value)

    // ─────────────────────────────────────────────
    // INITIALIZE
    // ─────────────────────────────────────────────

    function initialize(): Promise<void> {
        if (initPromise) return initPromise

        initPromise = (async () => {
            try {
                const token = tokenStorageService.get()

                if (!token) {
                    log.info('No token found')
                    return
                }

                log.info('Token found, fetching user profile')

                const response = await identityClient.getMeAsync()
                user.value = response.Data ?? null

                log.info('User profile loaded', user.value)
            } catch (err) {
                const status = (err as AxiosError)?.response?.status
                log.warn('Initialize failed', { status })

                if (status === 401) {
                    tokenStorageService.clear()
                    user.value = null
                }
               
            } finally {
                isInitialized.value = true
            }
        })()

        return initPromise
    }

    // ─────────────────────────────────────────────
    // LOGIN
    // ─────────────────────────────────────────────

    async function login(payload: LoginRequest): Promise<void> {
        log.info('Login called')

        const response = await identityClient.loginAsync(payload)
        const data = response.Data

        log.info('Login response', response)

        if (
            !data?.AccessToken ||
            !data?.RefreshToken ||
            !data?.AccessTokenExpiration ||
            !data?.RefreshTokenExpiration
        ) {
            throw new Error('Invalid login response')
        }

        const authToken: AuthTokenModel = {
            accessToken: data.AccessToken,
            refreshToken: data.RefreshToken,
            accessTokenExpiration: data.AccessTokenExpiration,
            refreshTokenExpiration: data.RefreshTokenExpiration,
        }

        tokenStorageService.save(authToken)

        log.info('Token saved, fetching user profile')

        const meResponse = await identityClient.getMeAsync()
        user.value = meResponse.Data ?? null

        // Reset initPromise để initialize chạy lại nếu cần
        initPromise = Promise.resolve()
        isInitialized.value = true

        log.info('Login success', user.value)
    }

    // ─────────────────────────────────────────────
    // LOGOUT / RESET
    // ─────────────────────────────────────────────

    function reset(): void {
        user.value = null
        isInitialized.value = false
        initPromise = null
        tokenStorageService.clear()
        log.info('Auth reset')
    }

    return {
        user,
        isLoggedIn,
        isInitialized,
        initialize,
        login,
        reset,
    }
})
