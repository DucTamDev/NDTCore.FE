<script setup lang="ts">
import { ref } from 'vue'
import AppBar from '@/shared/components/navigation/AppBar.vue'
import NavigationDrawer from '@/shared/components/navigation/NavigationDrawer.vue'
import AppFooter from '@/shared/components/common/AppFooter.vue'

const drawer = ref(true)
const rail = ref(false)

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const toggleRail = () => {
  rail.value = !rail.value
}
</script>

<template>
  <v-layout>
    <AppBar @toggle-drawer="toggleDrawer" @toggle-rail="toggleRail" />

    <NavigationDrawer v-model="drawer" :rail="rail" @update:rail="rail = $event" />

    <v-main class="flex flex-col flex-1">
      <v-container fluid class="flex-1">
        <RouterView />
      </v-container>

      <AppFooter />
    </v-main>
  </v-layout>
</template>

<style scoped lang="scss">
.v-main {
  min-height: 100vh;
}
</style>
