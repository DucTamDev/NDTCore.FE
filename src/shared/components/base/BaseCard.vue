<template>
  <v-card :class="['rounded-md', paddingClass]" v-bind="$attrs">
    <v-card-title v-if="$slots.title || title" class="px-6 pt-6 pb-4">
      <slot name="title">{{ title }}</slot>
    </v-card-title>

    <v-card-text class="px-6 py-0">
      <slot />
    </v-card-text>

    <v-card-actions v-if="$slots.actions" class="px-6 pb-6 pt-4">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
})

const paddingClass = computed(() => {
  const paddingMap = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
  }
  return paddingMap[props.padding]
})
</script>
