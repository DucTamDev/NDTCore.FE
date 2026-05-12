<script setup lang="ts">

// import { storeToRefs } from 'pinia'
// import { useAuthStore } from '@/stores/auth.store'

// const authStore = useAuthStore()
// const { user } = storeToRefs(authStore)
</script>

<template>
  <div>
    <h1 class="text-h4 mb-4">Dashboard</h1>
    <v-row>
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Welcome back!</div>
            <div class="text-body-2">{{  'Guest' }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
