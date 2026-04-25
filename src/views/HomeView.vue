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
import HomeAbout from '@/components/home/HomeAbout.vue'
import HomeContact from '@/components/home/HomeContact.vue'
import HomeFaq from '@/components/home/HomeFaq.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeFranchise from '@/components/home/HomeFranchise.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeMenu from '@/components/home/HomeMenu.vue'
import HomeNav from '@/components/home/HomeNav.vue'
</script>
