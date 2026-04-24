<template>
  <v-app>
    <v-app-bar color="surface" elevation="1">
      <v-app-bar-title>Theme System</v-app-bar-title>
      <v-spacer />
      <ThemeSelector />
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <!-- Theme Info Card -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title>Current Theme</v-card-title>
              <v-card-text>
                <div class="d-flex flex-column ga-3">
                  <div>
                    <div class="text-caption text-medium-emphasis">Mode</div>
                    <div class="text-h6">{{ ctx.theme.value }}</div>
                  </div>
                  <div>
                    <div class="text-caption text-medium-emphasis">Resolved Theme</div>
                    <div class="text-h6">{{ ctx.resolvedTheme.value }}</div>
                  </div>
                  <div>
                    <div class="text-caption text-medium-emphasis">Is Dark</div>
                    <div class="text-h6">{{ ctx.isDark.value }}</div>
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
                <div class="d-flex flex-column ga-2">
                  <v-btn color="primary" variant="tonal" block @click="ctx.setTheme('light')">
                    <v-icon start>mdi-white-balance-sunny</v-icon>
                    Light
                  </v-btn>
                  <v-btn color="primary" variant="tonal" block @click="ctx.setTheme('dark')">
                    <v-icon start>mdi-moon-waning-crescent</v-icon>
                    Dark
                  </v-btn>
                  <v-btn color="primary" variant="tonal" block @click="ctx.setTheme('soli-light')">
                    <v-icon start>mdi-brightness-5</v-icon>
                    Soli Light
                  </v-btn>
                  <v-btn color="primary" variant="tonal" block @click="ctx.setTheme('soli-dark')">
                    <v-icon start>mdi-brightness-3</v-icon>
                    Soli Dark
                  </v-btn>
                  <v-btn color="secondary" variant="tonal" block @click="ctx.setTheme('system')">
                    <v-icon start>mdi-brightness-auto</v-icon>
                    System
                  </v-btn>
                  <v-btn color="secondary" variant="tonal" block @click="ctx.toggleTheme()">
                    <v-icon start>mdi-theme-light-dark</v-icon>
                    Toggle
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
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="(color, key) in semanticColors"
                    :key="key"
                    :color="color"
                    :text="key"
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
                <div class="d-flex flex-column ga-2">
                  <div
                    v-for="(value, key) in spacingScale"
                    :key="key"
                    class="d-flex align-center ga-2"
                  >
                    <div class="text-caption spacing-label">{{ key }}</div>
                    <div class="bg-primary spacing-bar" :style="{ width: value }" />
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
                <div class="d-flex flex-column ga-3">
                  <div class="text-h3">Display</div>
                  <div class="text-h4">Heading 1</div>
                  <div class="text-h5">Heading 2</div>
                  <div class="text-h6">Heading 3</div>
                  <div class="text-body-1">Body</div>
                  <div class="text-body-2">Body 2</div>
                  <div class="text-caption">Caption</div>
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
import { useTheme } from '@/plugins/vuetify/theme'
import ThemeSelector from '@/components/common/ThemeSelector.vue'

const ctx = useTheme()

const semanticColors = {
  primary:   'primary',
  secondary: 'secondary',
  success:   'success',
  warning:   'warning',
  error:     'error',
  info:      'info',
} as const

const spacingScale = {
  '1':  '0.25rem',
  '2':  '0.5rem',
  '4':  '1rem',
  '8':  '2rem',
  '16': '4rem',
} as const
</script>

<style scoped>
.spacing-label {
  width: 60px;
}

.spacing-bar {
  height: var(--spacing-6);
}
</style>
