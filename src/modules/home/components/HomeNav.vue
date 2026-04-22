<template>
  <v-app-bar :elevation="scrolled ? 4 : 0" color="surface">
    <v-container class="d-flex align-center ga-4">
      <v-app-bar-title>
        <span class="text-h6 font-weight-bold text-primary">Soli Tea</span>
      </v-app-bar-title>

      <div class="d-none d-sm-flex align-center ga-2">
        <v-btn v-for="link in NAV_LINKS" :key="link.id" variant="text" :href="link.href">
          {{ link.label }}
        </v-btn>
      </div>

      <v-spacer />

      <v-btn color="primary" variant="outlined" class="d-none d-sm-flex">0985 978 456</v-btn>

      <v-app-bar-nav-icon class="d-flex d-sm-none" @click="drawer = !drawer" />
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list>
      <v-list-item
        v-for="link in NAV_LINKS"
        :key="link.id"
        :href="link.href"
        :title="link.label"
        @click="drawer = false"
      />
      <v-divider class="my-2" />
      <v-list-item>
        <v-btn color="primary" variant="flat" block>0985 978 456</v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useHomeScroll } from '../composables/useHomeScroll'

const { scrolled } = useHomeScroll()
const drawer = ref(false)

const NAV_LINKS = [
  { id: 'about',     href: '#ve-chung-toi', label: 'Về chúng tôi' },
  { id: 'menu',      href: '#menu',         label: 'Menu'         },
  { id: 'franchise', href: '#nhuong-quyen', label: 'Nhượng quyền' },
  { id: 'contact',   href: '#lien-he',      label: 'Liên hệ'      },
]
</script>
