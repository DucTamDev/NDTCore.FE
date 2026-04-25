import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store'
import { useToast } from './useToast'

export function useUser() {
  const userStore = useUserStore()
  const { items, total, loadingState } = storeToRefs(userStore)
  const toast = useToast()

  const isLoading = computed(() => loadingState.value === 'loading')

  async function fetchUsers() {
    try {
      await userStore.fetchUsers()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Khong the tai danh sach nguoi dung.')
      throw error
    }
  }

  return {
    users: items,
    total,
    isLoading,
    fetchUsers,
  }
}
