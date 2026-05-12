<template>
  <div class="d-flex flex-column ga-4">
    <div>
      <h1 class="text-h4">Users</h1>
      <p class="text-body-2 text-medium-emphasis">
        Danh sách tài khoản đang hoạt động trong hệ thống.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useUser } from '@/composables/useUser'

const { users: items, isLoading: loading, fetchUsers } = useUser()

onMounted(() => {
  void fetchUsers()
})
</script>
