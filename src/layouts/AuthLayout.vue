<template>
  <ThemeProvider>
    <v-main class="d-flex align-center justify-center main--full bg-surface">
      <v-container fluid>
        <v-row justify="center" no-gutters>
          <v-col cols="12" sm="8" md="5" lg="4" xl="3">
            <div class="text-center mb-8">
              <router-link
                to="/"
                class="text-h4 font-weight-bold text-primary text-decoration-none"
              >
                Soli Tea
              </router-link>
            </div>

            <router-view />

            <div class="text-center mt-6">
              <v-btn
                variant="text"
                prepend-icon="mdi-arrow-left"
                to="/"
                class="text-none text-medium-emphasis"
              >
                Về trang chủ
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </ThemeProvider>
</template>

<script setup lang="ts">
import ThemeProvider from '@/components/layout/ThemeProvider.vue'
</script>

<style scoped>
.main--full {
  min-height: 100vh;
}
</style>
