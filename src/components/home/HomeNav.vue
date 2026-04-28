<!-- HomeNav.vue -->
<template>
  <v-app-bar :elevation="scrolled ? 4 : 0" color="surface" scroll-behavior="elevate">
    <v-container class="d-flex align-center ga-4">
      <v-app-bar-title>
        <router-link to="/" class="text-decoration-none">
          <span class="text-h6 font-weight-bold text-primary">Soli Tea</span>
        </router-link>
      </v-app-bar-title>

      <div class="d-none d-sm-flex align-center ga-2">
        <v-btn v-for="link in NAV_LINKS" :key="link.id" variant="text" @click="scrollTo(link.hash)">
          {{ link.label }}
        </v-btn>
      </div>

      <v-spacer />

      <v-btn
        :to="{ name: APP_ROUTES.AUTH.CHILDREN.LOGIN.NAME }"
        color="primary"
        variant="outlined"
        class="d-none d-sm-flex"
      >
        Login
      </v-btn>

      <v-app-bar-nav-icon class="d-flex d-sm-none" @click="drawer = !drawer" />
    </v-container>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary location="right">
    <v-list>
      <v-list-item
        v-for="link in NAV_LINKS"
        :key="link.id"
        :title="link.label"
        @click="scrollTo(link.hash)"
      />
      <v-divider />
      <v-list-item>
        <v-btn
          :to="{ name: APP_ROUTES.AUTH.CHILDREN.LOGIN.NAME }"
          color="primary"
          variant="outlined"
          block
        >
          Login
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import { useHomeScroll } from '@/composables/useHomeScroll'

const { scrolled } = useHomeScroll()
const drawer = ref(false)
const router = useRouter()

const NAV_LINKS = [
  { id: 'about', hash: '#ve-chung-toi', label: 'Về chúng tôi' },
  { id: 'menu', hash: '#menu', label: 'Menu' },
  { id: 'franchise', hash: '#nhuong-quyen', label: 'Nhượng quyền' },
  { id: 'contact', hash: '#lien-he', label: 'Liên hệ' },
]

function scrollTo(hash: string) {
  drawer.value = false
  router.push({ path: '/', hash })
}
</script>
