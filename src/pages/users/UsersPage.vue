<template>
  <div class="d-flex flex-column ga-4">
    <div>
      <h1 class="text-h4">Users</h1>
      <p class="text-body-2 text-medium-emphasis">
        Danh sách tài khoản đang hoạt động trong hệ thống.
      </p>
    </div>

    <DataTable
      :headers="headers"
      :items="items"
      :loading="loading"
      :show-pagination="false"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import DataTable from '@/components/common/DataTable.vue'
import type { DataTableHeader } from '@/components/common/types'
import { useUserStore } from '@/stores/user.store'

const headers: DataTableHeader[] = [
  { key: 'name', title: 'Name' },
  { key: 'email', title: 'Email' },
  { key: 'role', title: 'Role' },
]

const userStore = useUserStore()
const { items, loading } = storeToRefs(userStore)

onMounted(() => {
  userStore.fetchUsers()
})
</script>
