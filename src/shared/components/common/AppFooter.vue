<template>
  <v-footer app class="bg-white border-t border-neutral-200">
    <div class="w-full flex items-center justify-between px-6 py-4">
      <div class="text-sm text-neutral-600">
        &copy; {{ currentYear }} {{ appName }}. All rights reserved.
      </div>

      <div class="flex items-center gap-4">
        <a
          v-for="link in footerLinks"
          :key="link.title"
          :href="link.href"
          target="_blank"
          class="text-sm text-neutral-600 hover:text-primary transition-colors"
        >
          {{ link.title }}
        </a>

        <div class="text-sm text-neutral-500">v{{ appVersion }}</div>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME || 'NDTCore'
const appVersion = import.meta.env.VITE_APP_VERSION || '1.0.0'
const currentYear = new Date().getFullYear()

const footerLinks = [
  { title: 'Privacy Policy', href: '/privacy' },
  { title: 'Terms of Service', href: '/terms' },
  { title: 'Help Center', href: '/help' },
]
</script>
