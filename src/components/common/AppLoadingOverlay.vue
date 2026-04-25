<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted } from 'vue'
import { LoadingService } from '@/infrastructure/http/loading.service'
import { useUiStore } from '@/stores/ui.store'

const uiStore = useUiStore()
const { isGlobalLoading } = storeToRefs(uiStore)

const loadingService = LoadingService.getInstance()
let unsubscribe: (() => void) | null = null

onMounted(() => {
  unsubscribe = loadingService.subscribe((loading) => {
    uiStore.setGlobalLoading(loading)
  })
})

onUnmounted(() => {
  unsubscribe?.()
})
</script>

<template>
  <v-overlay
    :model-value="isGlobalLoading"
    class="align-center justify-center"
    contained
    persistent
  >
    <v-progress-circular color="primary" indeterminate size="56" width="4" />
  </v-overlay>
</template>
