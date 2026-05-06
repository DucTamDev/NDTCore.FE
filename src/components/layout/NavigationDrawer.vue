<template>
  <v-navigation-drawer v-model="model" :rail="rail" @update:rail="emit('update:rail', $event)">
    <NavigationMenu :rail="rail" />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import NavigationMenu from './NavigationMenu.vue'

const model = defineModel<boolean>({ required: true })

defineProps<{ rail: boolean }>()

const emit = defineEmits<{
  'update:rail': [value: boolean]
}>()
</script>
