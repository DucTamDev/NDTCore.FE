<template>
  <v-footer app color="surface" border="t">
    <div class="w-full d-flex align-center justify-space-between px-6 py-4">
      <div class="text-body-2 text-medium-emphasis">
        &copy; {{ currentYear }} {{ appName }}. All rights reserved.
      </div>

      <div class="d-flex align-center ga-4">
        <a
          v-for="link in footerLinks"
          :key="link.title"
          :href="link.href"
          target="_blank"
          class="text-body-2 footer-link"
        >
          {{ link.title }}
        </a>

        <div class="text-body-2 text-disabled">v{{ appVersion }}</div>
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

<style scoped>
.footer-link {
  text-decoration: none;
  color: var(--color-text-link);
  transition: color var(--transition-duration-fast) var(--transition-easing-ease-out);
}

.footer-link:hover {
  color: var(--color-text-link-hover);
}
</style>
