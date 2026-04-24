<template>
  <ThemeProvider>
    <v-app class="bg-surface">
      <RouterView />
    </v-app>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ThemeProvider from './ThemeProvider.vue'
</script>
