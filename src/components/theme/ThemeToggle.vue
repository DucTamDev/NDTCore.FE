<template>
  <v-btn
    :icon="currentIcon"
    :variant="variant"
    :size="size"
    :color="color"
    @click="toggleTheme"
    class="theme-toggle"
  >
    <v-icon>{{ currentIcon }}</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/plugins/vuetify/theme'

interface Props {
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  color?: string
  showTooltip?: boolean
  tooltipLocation?: 'top' | 'bottom' | 'left' | 'right'
  lightIcon?: string
  darkIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'text',
  size: 'default',
  color: undefined,
  showTooltip: true,
  tooltipLocation: 'bottom',
  lightIcon: 'mdi-white-balance-sunny',
  darkIcon: 'mdi-moon-waning-crescent',
})

const { isDark, toggleTheme } = useTheme()

const currentIcon = computed(() => (isDark.value ? props.darkIcon : props.lightIcon))
</script>

<style scoped>
.theme-toggle {
  transition: transform var(--transition-duration-slow) var(--transition-easing-ease-in-out);
}

.theme-toggle:hover {
  transform: rotate(20deg);
}

.theme-toggle:active {
  transform: rotate(-20deg) scale(0.95);
}
</style>
