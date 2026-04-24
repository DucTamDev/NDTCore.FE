<template>
  <v-layout>
    <HomeNav />
    <v-main>
      <HomeHero />
      <HomeAbout />
      <HomeMenu />
      <HomeFranchise />
      <HomeFaq />
      <HomeContact />
      <HomeFooter />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import HomeAbout from './components/HomeAbout.vue'
import HomeContact from './components/HomeContact.vue'
import HomeFaq from './components/HomeFaq.vue'
import HomeFooter from './components/HomeFooter.vue'
import HomeFranchise from './components/HomeFranchise.vue'
import HomeHero from './components/HomeHero.vue'
import HomeMenu from './components/HomeMenu.vue'
import HomeNav from './components/HomeNav.vue'
</script>
