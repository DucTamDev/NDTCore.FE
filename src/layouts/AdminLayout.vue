<template>
  <ThemeProvider :type="THEME_PROVIDER_TYPE.Admin">
    <v-layout>
      <AppBar @toggle-drawer="uiStore.toggleDrawer" @toggle-rail="uiStore.toggleRail" />

      <v-main class="d-flex flex-column">
        <NavigationDrawer v-model="drawer" :rail="rail" @update:rail="uiStore.setRail" />

        <v-container fluid class="d-flex flex-column flex-grow-1">
          <RouterView />
        </v-container>

        <div class="footer-blank py-8"></div>
        <!-- <AppFooter /> -->
      </v-main>
    </v-layout>
  </ThemeProvider>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
// import AppFooter from '@/components/common/AppFooter.vue'
import AppBar from '@/components/common/AppBar.vue'
import NavigationDrawer from '@/components/layout/NavigationDrawer.vue'
import ThemeProvider from '@/components/layout/ThemeProvider.vue'
import { useUiStore } from '@/stores/ui.store'
import { THEME_PROVIDER_TYPE } from '@/plugins/vuetify/theme'

const uiStore = useUiStore()
const { drawer, rail } = storeToRefs(uiStore)
</script>
