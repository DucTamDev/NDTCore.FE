import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { userService } from '@/modules/user/services/user.service'
import { createLogger } from '@/core/logger/logger'

import type { UserProfileDto } from '@/modules/user/models/dtos/_index'

const log = createLogger('user-store')

export const useUserStore = defineStore('user', () => {
    const profile = ref<UserProfileDto | null>(null)
    const loading = ref(false)
    const error = ref<string | null>(null)

    // ─────────────────────────────
    // GETTERS
    // ─────────────────────────────

    const isLoaded = computed(() => profile.value !== null)

    const fullName = computed(() => profile.value?.FullName ?? '')
    const avatar = computed(() => profile.value?.AvatarUrl ?? null)

    const initials = computed(() => {
        const parts = fullName.value.split(' ').filter(Boolean)
        return parts.length >= 2
            ? `${parts[0][0]}${parts.at(-1)![0]}`.toUpperCase()
            : (parts[0]?.[0] ?? '?').toUpperCase()
    })

    // ─────────────────────────────
    // FETCH PROFILE
    // ─────────────────────────────

    async function fetchProfile(): Promise<void> {
        if (isLoaded.value) return // đã có rồi thì không gọi lại

        loading.value = true
        error.value = null

        try {
            log.info('Fetching user profile')

            profile.value = await userService.getProfileAsync()

            log.info('Profile loaded', profile.value)
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Fetch profile failed', { error: error.value })

            throw err
        } finally {
            loading.value = false
        }
    }

    // ─────────────────────────────
    // RESET
    // ─────────────────────────────

    function reset(): void {
        profile.value = null
        loading.value = false
        error.value = null
        log.info('User reset')
    }

    return {
        // state
        profile,
        loading,
        error,
        // getters
        isLoaded,
        fullName,
        avatar,
        initials,
        // actions
        fetchProfile,
        reset,
    }
})
