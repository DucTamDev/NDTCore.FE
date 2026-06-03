<template>
  <v-app class="bg-surface">
    <RouterView v-if="appStore.isAppReady" />
    <AppLoadingOverlay />
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLoadingOverlay from '@/components/common/AppLoadingOverlay.vue'

import { useAppStore } from '@/core/stores/app.store'
const appStore = useAppStore()
</script>
