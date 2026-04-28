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
import HomeAbout from '@/components/home/HomeAbout.vue'
import HomeContact from '@/components/home/HomeContact.vue'
import HomeFaq from '@/components/home/HomeFaq.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import HomeFranchise from '@/components/home/HomeFranchise.vue'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeMenu from '@/components/home/HomeMenu.vue'
import HomeNav from '@/components/home/HomeNav.vue'
</script>
