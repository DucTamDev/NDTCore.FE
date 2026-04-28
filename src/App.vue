<template>
  <v-app class="bg-surface">
    <RouterView />
    <AppConfirmDialog />
    <AppLoadingOverlay />
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import AppLoadingOverlay from '@/components/common/AppLoadingOverlay.vue'
import { onMounted } from 'vue'
import { useUiStore } from './stores/ui.store'
import { useAuthStore } from './stores/auth.store'
import { router } from './router'
import { APP_ROUTES } from './core/constants/app-routes.constants'

const auth = useAuthStore()
const ui = useUiStore()

onMounted(async () => {
  try {
    await ui.withLoading(async () => {
      await auth.initialize()
    })

    // Sau khi init xong, áp dụng redirect logic cho route hiện tại
    const route = router.currentRoute.value
    if (auth.isLoggedIn && !route.meta.requiresAuth) {
      router.replace({ name: APP_ROUTES.ADMIN.CHILDREN.DASHBOARD.NAME })
    } else if (!auth.isLoggedIn && route.meta.requiresAuth) {
      router.replace({ name: APP_ROUTES.AUTH.CHILDREN.LOGIN.NAME })
    }
  } catch (error) {
    console.error('App initialization failed:', error)
  }
})
</script>
