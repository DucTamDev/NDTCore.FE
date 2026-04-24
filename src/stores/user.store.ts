import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/models/auth.models'
import { userService } from '@/services/user.service'

export const useUserStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const loading = ref(false)

  async function fetchUsers() {
    loading.value = true
    try {
      items.value = await userService.getUsers()
    } finally {
      loading.value = false
    }
  }

  return {
    items,
    loading,
    fetchUsers,
  }
})
