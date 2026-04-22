<script setup lang="ts">
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const authStore = useAuthStore()
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">Dashboard</h1>

    <v-row>
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Welcome back!</div>
            <div class="text-body-2">{{ authStore.user?.name }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
