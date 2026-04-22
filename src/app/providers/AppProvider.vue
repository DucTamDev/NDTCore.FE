<template>
  <ThemeProvider>
    <v-app>
      <slot />
    </v-app>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from './ThemeProvider.vue'
</script>
