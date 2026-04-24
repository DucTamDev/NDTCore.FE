<script setup lang="ts">
import { storeToRefs } from 'pinia'
import AppFooter from '@/components/common/AppFooter.vue'
import AppBar from '@/components/layout/AppBar.vue'
import NavigationDrawer from '@/components/layout/NavigationDrawer.vue'
import { useUiStore } from '@/stores/ui.store'

const uiStore = useUiStore()
const { drawer, rail } = storeToRefs(uiStore)
</script>

<template>
  <v-layout>
    <AppBar @toggle-drawer="uiStore.toggleDrawer" @toggle-rail="uiStore.toggleRail" />

    <NavigationDrawer v-model="drawer" :rail="rail" @update:rail="uiStore.setRail" />

    <v-main class="d-flex flex-column">
      <v-container fluid class="flex-1-1">
        <RouterView />
      </v-container>

      <AppFooter />
    </v-main>
  </v-layout>
</template>
