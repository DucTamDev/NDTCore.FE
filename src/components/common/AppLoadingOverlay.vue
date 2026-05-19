<script setup lang="ts">
import { useUIStore } from '@/core/stores/ui.store'

const uiStore = useUIStore()
</script>

<template>
  <v-overlay :model-value="uiStore.isAppLoading" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" indeterminate size="56" width="4" />
  </v-overlay>
</template>
