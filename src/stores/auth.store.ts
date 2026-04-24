import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { AuthTokens, User } from '@/models/auth.models'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const tokens = ref<AuthTokens | null>(null)

  const isAuthenticated = computed(() => !!tokens.value?.accessToken)

  function setSession(nextUser: User, nextTokens: AuthTokens): void {
    user.value = nextUser
    tokens.value = nextTokens
  }

  function setUser(nextUser: User | null): void {
    user.value = nextUser
  }

  function clearSession(): void {
    user.value = null
    tokens.value = null
  }

  return {
    user,
    tokens,
    isAuthenticated,
    setSession,
    setUser,
    clearSession,
  }
})
