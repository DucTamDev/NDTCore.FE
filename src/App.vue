<template>
  <AppProvider>
    <RouterView />
  </AppProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppProvider from './app/providers/AppProvider.vue'
</script>

<style scoped lang="scss">
// Add any global app styles here
</style>
