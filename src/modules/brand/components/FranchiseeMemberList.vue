<template>
  <v-card-text class="pa-5">
    <AppEmptyState
      icon="mdi-account-group-outline"
      title="Tính năng đang phát triển"
      description="Quản lý thành viên nhà nhượng quyền sẽ sớm được hỗ trợ."
    />
  </v-card-text>
</template>

<script setup lang="ts">
import { AppEmptyState } from '@/components/ui'

defineProps<{
  franchiseeId: number
}>()
</script>
