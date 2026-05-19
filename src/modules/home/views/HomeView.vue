<!-- HomeView.vue -->
<template>
  <div>
    <HomeNav />
    <div>
      <section id="hero"><HomeHero /></section>
      <section id="ve-chung-toi"><HomeAbout /></section>
      <section id="menu"><HomeMenu /></section>
      <section id="nhuong-quyen"><HomeFranchise /></section>
      <section id="faq"><HomeFaq /></section>
      <section id="lien-he"><HomeContact /></section>
      <HomeFooter />
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeAbout from '@/modules/home/components/HomeAbout.vue'
import HomeContact from '@/modules/home/components/HomeContact.vue'
import HomeFaq from '@/modules/home/components/HomeFaq.vue'
import HomeFooter from '@/modules/home/components/HomeFooter.vue'
import HomeFranchise from '@/modules/home/components/HomeFranchise.vue'
import HomeHero from '@/modules/home/components/HomeHero.vue'
import HomeMenu from '@/modules/home/components/HomeMenu.vue'
import HomeNav from '@/modules/home/components/HomeNav.vue'
</script>
