<script setup lang="ts">
import { useUiStore } from '@/stores/ui.store'

const ui = useUiStore()
</script>

<template>
  <v-overlay
    :model-value="ui.isGlobalLoading"
    class="align-center justify-center"
    persistent
  >
    <v-progress-circular color="primary" indeterminate size="56" width="4" />
  </v-overlay>
</template>
