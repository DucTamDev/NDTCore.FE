<template>
  <div class="d-flex align-start ga-2 py-2">
    <!-- Qty controls -->
    <div class="d-flex flex-column align-center ga-1" style="min-width: 72px;">
      <v-btn icon="mdi-plus" size="x-small" variant="tonal" @click="cartStore.updateQuantity(item.uid, item.quantity + 1)" />
      <span class="text-body-2 font-weight-semibold">{{ item.quantity }}</span>
      <v-btn
        :icon="item.quantity <= 1 ? 'mdi-trash-can-outline' : 'mdi-minus'"
        size="x-small"
        variant="tonal"
        :color="item.quantity <= 1 ? 'error' : undefined"
        @click="item.quantity <= 1 ? cartStore.removeItem(item.uid) : cartStore.updateQuantity(item.uid, item.quantity - 1)"
      />
    </div>

    <!-- Item detail -->
    <div class="flex-grow-1">
      <div class="text-body-2 font-weight-semibold">{{ item.productName }}</div>
      <div v-if="item.selectedOptions.length" class="text-caption text-medium-emphasis mt-0.5">
        {{ item.selectedOptions.map((o) => o.optionName).join(', ') }}
      </div>
      <div v-if="item.note" class="text-caption text-medium-emphasis font-italic">
        "{{ item.note }}"
      </div>
    </div>

    <!-- Line total -->
    <div class="text-body-2 font-weight-semibold text-right" style="min-width: 72px;">
      {{ lineTotal.toLocaleString('vi-VN') }}₫
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePosCartStore } from '../stores/pos-cart.store'
import type { PosCartItem } from '../models/types/pos-cart.types'

const props = defineProps<{ item: PosCartItem }>()

const cartStore = usePosCartStore()

const lineTotal = computed(() => {
    const optSum = props.item.selectedOptions.reduce((s, o) => s + o.resolvedPrice, 0)
    return (props.item.resolvedPrice + optSum) * props.item.quantity
})
</script>
