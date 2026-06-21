<template>
  <div class="order-item py-2">
    <!-- Tier 1: Image + content -->
    <div class="d-flex align-start ga-2">
      <!-- Product image -->
      <div class="item-img flex-shrink-0">
        <v-img
          v-if="item.imageUrl"
          :src="item.imageUrl"
          width="44"
          height="44"
          cover
          rounded="lg"
          class="bg-surface-variant"
        />
        <div
          v-else
          class="item-img-placeholder d-flex align-center justify-center rounded-lg bg-surface-variant"
        >
          <v-icon icon="mdi-food" size="18" class="text-medium-emphasis" />
        </div>
      </div>

      <!-- Name + options -->
      <div class="flex-grow-1 min-w-0">
        <div class="d-flex align-start justify-space-between ga-1">
          <span class="text-body-2 font-weight-semibold item-name">{{ item.productName }}</span>
          <v-btn
            variant="tonal"
            color="primary"
            icon="mdi-pencil"
            size="small"
            density="comfortable"
            class="flex-shrink-0 edit-btn"
            @click="emit('edit', item.uid)"
          />
        </div>

        <!-- Grouped options -->
        <div v-for="group in groupedOptions" :key="group.groupId" class="mt-1 flex-wrap ga-1">
          <span class="text-caption text-medium-emphasis font-weight-bold group-label">
            {{ group.groupName}}:
          </span>
          <span class="text-caption text-medium-emphasis opt-row">
            {{ group.options.map(o => o.optionName).join(', ') }}
          </span>
        </div>
      </div>
    </div>

    <!-- Tier 2: Note block -->
    <div v-if="item.note" class="note-block d-flex align-start ga-2 mt-2 rounded-lg px-3 py-2">
      <span class="note-icon">📝</span>
      <em class="text-caption flex-grow-1">{{ item.note }}</em>
    </div>

    <!-- Tier 3: Price + Qty control -->
    <div class="d-flex align-center justify-space-between mt-2">
      <span class="font-weight-semibold text-primary" style="font-size: 13px">
        {{ lineTotal.toLocaleString('vi-VN') }}₫
      </span>

      <div class="qty-pill d-flex align-center">
        <button
          class="qty-btn d-flex align-center justify-center"
          @click="item.quantity <= 1 ? cartStore.removeItem(item.uid) : cartStore.updateQuantity(item.uid, item.quantity - 1)"
        >
          <v-icon
            :icon="item.quantity <= 1 ? 'mdi-trash-can-outline' : 'mdi-minus'"
            :color="item.quantity <= 1 ? 'error' : undefined"
            size="12"
          />
        </button>
        <span class="qty-num text-body-2 font-weight-bold">{{ item.quantity }}</span>
        <button
          class="qty-btn d-flex align-center justify-center"
          @click="cartStore.updateQuantity(item.uid, item.quantity + 1)"
        >
          <v-icon icon="mdi-plus" size="12" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePosCartStore } from '../stores/pos-cart.store'
import type { PosCartItem, PosCartOption } from '../models/types/pos-cart.types'

interface GroupedOption {
    groupId: number
    groupName: string
    options: PosCartOption[]
}

const props = defineProps<{ item: PosCartItem }>()

const emit = defineEmits<{
    edit: [uid: string]
}>()

const cartStore = usePosCartStore()

const lineTotal = computed(() => {
    const optSum = props.item.selectedOptions.reduce((s, o) => s + o.resolvedPrice, 0)
    return (props.item.resolvedPrice + optSum) * props.item.quantity
})

const groupedOptions = computed<GroupedOption[]>(() => {
    const map = new Map<number, GroupedOption>()
    for (const opt of props.item.selectedOptions) {
        if (!map.has(opt.groupId)) {
            map.set(opt.groupId, { groupId: opt.groupId, groupName: opt.groupName, options: [] })
        }
        map.get(opt.groupId)!.options.push(opt)
    }
    return Array.from(map.values())
})
</script>

<style scoped>
.item-img,
.item-img-placeholder {
    width: 36px;
    height: 36px;
}

.item-name {
    font-size: 13px;
    line-height: 1.3;
}

.group-label {
    font-size: 9px;
    letter-spacing: 0.04em;
}

.opt-row {
    gap: 4px;
    font-size: 10px;
    line-height: 1.4;
}

.opt-bar {
    width: 2px;
    height: 12px;
    border-radius: 1px;
    background: currentColor;
    opacity: 0.3;
    flex-shrink: 0;
}

.opt-price {
    opacity: 0.7;
}

.note-block {
    background: rgb(var(--v-theme-primary), 0.06);
}

.note-block em {
    font-size: 11px;
}

.note-icon {
    font-size: 13px;
    line-height: 1.5;
    flex-shrink: 0;
}

.edit-btn {
    margin-top: -2px;
}

/* Quantity pill */
.qty-pill {
    background: rgba(0, 0, 0, 0.07);
    border-radius: 999px;
    padding: 3px;
    gap: 4px;
}

.qty-btn {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: white;
    border: none;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    transition: background 0.15s;
}

.qty-btn:hover {
    background: #f5f5f5;
}

.qty-num {
    min-width: 20px;
    text-align: center;
}
</style>
