<template>
  <ThemeProvider :type="THEME_PROVIDER_TYPE.Admin">
    <v-layout>
      <AppBar @toggle-drawer="uiStore.toggleNavDrawer" @toggle-rail="uiStore.toggleNavRail" />

      <NavigationDrawer v-model="navDrawer" v-model:rail="navRail" />

      <v-main class="d-flex flex-column">
        <v-container fluid class="d-flex flex-column flex-grow-1">
          <RouterView />
        </v-container>

        <div class="footer-blank py-8" />
      </v-main>
    </v-layout>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppBar from '@/components/common/AppBar.vue'
import NavigationDrawer from '@/components/layout/NavigationDrawer.vue'
import ThemeProvider from '@/components/layout/ThemeProvider.vue'
import { useUIStore } from '@/core/stores/ui.store'
import { THEME_PROVIDER_TYPE } from '@/plugins/vuetify/theme'

const uiStore = useUIStore()
const { navDrawer, navRail } = storeToRefs(uiStore)
</script>
