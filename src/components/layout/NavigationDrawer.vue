<template>
  <v-navigation-drawer v-model="model" :rail="rail">
    <NavigationMenu :rail="rail" />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import NavigationMenu from './NavigationMenu.vue'

const model = defineModel<boolean>({ required: true })
const rail  = defineModel<boolean>('rail', { required: true })
</script>