<template>
  <v-btn
    :variant="variant"
    :color="color"
    :size="size"
    :loading="loading"
    :disabled="disabled"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
  color?: string
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large'
  loading?: boolean
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  size: 'default',
  loading: false,
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>
