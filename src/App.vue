<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppConfirmDialog from '@/components/common/AppConfirmDialog.vue'
import AppLoadingOverlay from '@/components/common/AppLoadingOverlay.vue'
import ThemeProvider from '@/components/layout/ThemeProvider.vue'
</script>

<template>
  <ThemeProvider>
    <v-app class="bg-surface">
      <RouterView />
      <AppConfirmDialog />
      <AppLoadingOverlay />
    </v-app>
  </ThemeProvider>
</template>
