<template>
  <ThemeProvider :type="THEME_PROVIDER_TYPE.Admin">
    <v-layout>
      <v-main>
        <RouterView />
      </v-main>
    </v-layout>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from '@/components/layout/ThemeProvider.vue'
import { THEME_PROVIDER_TYPE } from '@/plugins/vuetify/theme'
</script>
