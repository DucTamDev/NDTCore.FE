<template>
  <ThemeProvider>
    <v-app class="bg-surface">
      <RouterView />
      <AppConfirmDialog />
      <AppLoadingOverlay />
    </v-app>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import AppLoadingOverlay from '@/components/common/AppLoadingOverlay.vue'
import ThemeProvider from '@/components/layout/ThemeProvider.vue'
import { onMounted } from 'vue'
import { useUiStore } from './stores/ui.store'
import { useAuthStore } from './stores/auth.store'

const auth = useAuthStore()
const ui = useUiStore()

/**
 * Logic khởi tạo ứng dụng
 * Chúng ta bọc auth.initialize() vào ui.withLoading để hiển thị
 * màn hình chờ (Splash Screen) trong khi kiểm tra token và lấy profile.
 */
onMounted(async () => {
  try {
    // Chỉ chạy initialize nếu chưa được router xử lý trước đó
    if (!auth.isInitialized) {
      await ui.withLoading(async () => {
        await auth.initialize()
      })
    }
  } catch (error) {
    console.error('App initialization failed:', error)
  }
})
</script>
