<template>
  <v-navigation-drawer v-model="model" :rail="rail" @update:rail="emit('update:rail', $event)">
    <v-list nav>
      <v-list-item
        v-for="item in menuConfig"
        :key="item.to"
        :prepend-icon="item.icon"
        :title="item.title"
        :to="{ name: item.to }"
        :active="route.path === item.to"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { menuConfig } from '@/core/constants/menu-config.constants'

const route = useRoute()
const model = defineModel<boolean>({ required: true })

defineProps<{
  rail: boolean
}>()

const emit = defineEmits<{
  'update:rail': [value: boolean]
}>()
</script>
