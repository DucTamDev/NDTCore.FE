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
import { HomeNav, HomeHero, HomeAbout, HomeMenu, HomeFranchise, HomeFaq, HomeContact, HomeFooter } from '@/modules/home'
</script>
