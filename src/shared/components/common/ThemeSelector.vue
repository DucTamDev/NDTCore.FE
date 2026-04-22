<template>
  <v-menu>
    <template v-slot:activator="{ props: menuProps }">
      <v-btn
        v-bind="menuProps"
        :icon="currentIcon"
        :variant="variant"
        :size="size"
        :color="color"
        class="theme-selector"
      >
        <v-icon>{{ currentIcon }}</v-icon>
      </v-btn>
    </template>

    <v-list :density="density">
      <v-list-item
        v-for="option in themeOptions"
        :key="option.mode"
        :value="option.mode"
        :active="themeMode === option.mode"
        @click="handleSelect(option.mode)"
      >
        <template v-slot:prepend>
          <v-icon :icon="option.icon" />
        </template>

        <v-list-item-title>{{ option.label }}</v-list-item-title>

        <template v-slot:append v-if="themeMode === option.mode">
          <v-icon icon="mdi-check" color="primary" size="small" />
        </template>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useTheme, type ThemeMode } from '@/shared/composables/useTheme'

interface ThemeOption {
  mode: ThemeMode
  label: string
  icon: string
}

interface Props {
  variant?: 'flat' | 'text' | 'elevated' | 'tonal' | 'outlined' | 'plain'
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  color?: string
  density?: 'default' | 'comfortable' | 'compact'
  showTooltip?: boolean
  tooltipLocation?: 'top' | 'bottom' | 'left' | 'right'
}

withDefaults(defineProps<Props>(), {
  variant: 'text',
  size: 'default',
  color: undefined,
  density: 'default',
  showTooltip: true,
  tooltipLocation: 'bottom',
})

interface Emits {
  (e: 'change', mode: ThemeMode): void
}

const emit = defineEmits<Emits>()

const { themeMode, setTheme } = useTheme()

const themeOptions: ThemeOption[] = [
  {
    mode: 'light',
    label: 'Light',
    icon: 'mdi-white-balance-sunny',
  },
  {
    mode: 'dark',
    label: 'Dark',
    icon: 'mdi-moon-waning-crescent',
  },
  {
    mode: 'system',
    label: 'System',
    icon: 'mdi-brightness-auto',
  },
]

const currentOption: ComputedRef<ThemeOption | undefined> = computed(() => {
  return themeOptions.find((opt) => opt.mode === themeMode.value) || themeOptions[0]!
})

const currentIcon = computed(() => currentOption.value!.icon)

const handleSelect = (mode: ThemeMode) => {
  setTheme(mode)
  emit('change', mode)
}
</script>

<style scoped>
.theme-selector {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-selector:hover {
  transform: rotate(15deg);
}
</style>
