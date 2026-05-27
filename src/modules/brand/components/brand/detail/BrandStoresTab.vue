<template>
  <div class="pa-8 d-flex justify-center">
    <AppEmptyState
      icon="mdi-store-outline"
      title="Chưa có cửa hàng"
      description="Tính năng quản lý cửa hàng đang được phát triển."
    />
  </div>
</template>

<script setup lang="ts">
import { AppEmptyState } from '@/components/ui'

defineProps<{ brandId: number }>()
</script>
