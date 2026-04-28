<template>
  <ThemeProvider>
    <v-layout>
      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from '@/components/layout/ThemeProvider.vue'
</script>
