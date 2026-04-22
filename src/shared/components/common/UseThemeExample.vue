<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="surface" elevation="1">
      <v-app-bar-title>Theme System</v-app-bar-title>

      <v-spacer />

      <!-- Theme Selector -->
      <ThemeSelector />
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container>
        <v-row>
          <!-- Theme Info Card -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Current Theme</v-card-title>
              <v-card-text>
                <div class="d-flex flex-column gap-3">
                  <div>
                    <div class="text-caption text-medium-emphasis">Mode</div>
                    <div class="text-h6">{{ theme.themeMode.value }}</div>
                  </div>

                  <div>
                    <div class="text-caption text-medium-emphasis">Active Theme</div>
                    <div class="text-h6">{{ theme.activeTheme.value }}</div>
                  </div>

                  <div>
                    <div class="text-caption text-medium-emphasis">Is Dark</div>
                    <div class="text-h6">{{ theme.isDark.value }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Theme Controls Card -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Theme Controls</v-card-title>
              <v-card-text>
                <div class="d-flex flex-column gap-2">
                  <v-btn color="primary" variant="tonal" block @click="theme.setLight()">
                    <v-icon start>mdi-white-balance-sunny</v-icon>
                    Set Light
                  </v-btn>

                  <v-btn color="primary" variant="tonal" block @click="theme.setDark()">
                    <v-icon start>mdi-moon-waning-crescent</v-icon>
                    Set Dark
                  </v-btn>

                  <v-btn color="primary" variant="tonal" block @click="theme.setSystem()">
                    <v-icon start>mdi-brightness-auto</v-icon>
                    Set System
                  </v-btn>

                  <v-btn color="secondary" variant="tonal" block @click="theme.toggleTheme()">
                    <v-icon start>mdi-theme-light-dark</v-icon>
                    Toggle Theme
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Color Examples -->
          <v-col cols="12">
            <v-card>
              <v-card-title>Semantic Colors</v-card-title>
              <v-card-text>
                <div class="d-flex flex-wrap gap-2">
                  <v-chip
                    v-for="(colorScale, name) in semanticColors"
                    :key="name"
                    :color="colorScale"
                    :text="name"
                    size="large"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Spacing Examples -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Spacing Scale</v-card-title>
              <v-card-text>
                <div class="d-flex flex-column gap-2">
                  <div
                    v-for="(value, key) in spacingExamples"
                    :key="key"
                    class="d-flex align-center gap-2"
                  >
                    <div class="text-caption" style="width: 60px">{{ key }}</div>
                    <div class="bg-primary" :style="{ width: value, height: '24px' }" />
                    <div class="text-caption text-medium-emphasis">{{ value }}</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Typography Examples -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Typography Presets</v-card-title>
              <v-card-text>
                <div class="d-flex flex-column gap-2">
                  <div
                    v-for="preset in typographyPresets"
                    :key="preset.name"
                    :style="{
                      fontSize: preset.style.fontSize,
                      fontWeight: preset.style.fontWeight,
                      lineHeight: preset.style.lineHeight,
                    }"
                  >
                    {{ preset.name }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/shared/composables/useTheme'
import ThemeSelector from '@/shared/components/common/ThemeSelector.vue'

const theme = useTheme()
const colors = theme.utils.getSemanticColor
const spacing = theme.utils.getSpacing
const typography = theme.utils.getTypographyPreset

const semanticColors = computed(() => ({
  primary: colors('primary', 500),
  secondary: colors('secondary', 500),
  success: colors('success', 500),
  warning: colors('warning', 500),
  error: colors('error', 500),
  info: colors('info', 500),
}))

const spacingExamples = computed(() => ({
  '0': spacing(0),
  '1': spacing(1),
  '2': spacing(2),
  '4': spacing(4),
  '8': spacing(8),
  '16': spacing(16),
}))

const typographyPresets = computed(() => [
  { name: 'Display', style: typography('display') },
  { name: 'Heading 1', style: typography('h1') },
  { name: 'Heading 2', style: typography('h2') },
  { name: 'Body', style: typography('body') },
  { name: 'Caption', style: typography('caption') },
])
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}
</style>
