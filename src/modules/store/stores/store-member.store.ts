import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreMemberViewModel } from '@/modules/store/models/view-models/store-member.view-model'

export const useStoreMemberStore = defineStore('store-member', () => {
    const members = ref<StoreMemberViewModel[]>([])
    const listLoading = ref(false)
    const error = ref<string | null>(null)

    return { members, listLoading, error }
})
