<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useUiStore } from '@/stores/ui.store'

const uiStore = useUiStore()
const { confirmDialog } = storeToRefs(uiStore)

function onConfirm() {
  uiStore.resolveConfirmDialog(true)
}

function onCancel() {
  uiStore.resolveConfirmDialog(false)
}
</script>

<template>
  <v-dialog :model-value="confirmDialog.show" max-width="420" persistent>
    <v-card rounded="xl">
      <v-card-title class="text-h6">{{ confirmDialog.title }}</v-card-title>
      <v-card-text class="text-body-2 text-medium-emphasis">
        {{ confirmDialog.message }}
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="onCancel">
          {{ confirmDialog.cancelText }}
        </v-btn>
        <v-btn :color="confirmDialog.confirmColor" variant="flat" @click="onConfirm">
          {{ confirmDialog.confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
