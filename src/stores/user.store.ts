import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/auth.types'
import type { LoadingState } from '@/types/common.types'
import { userService } from '@/services/user.service'

export const useUserStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const total = ref(0)
  const loadingState = ref<LoadingState>('idle')

  async function fetchUsers() {
    loadingState.value = 'loading'
    try {
      items.value = await userService.getUsers()
      total.value = items.value.length
      loadingState.value = 'success'
    } catch (error) {
      loadingState.value = 'error'
      throw error
    } finally {
      if (loadingState.value === 'loading') {
        loadingState.value = 'idle'
      }
    }
  }

  return {
    items,
    total,
    loadingState,
    fetchUsers,
  }
})
