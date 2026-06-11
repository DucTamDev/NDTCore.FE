<template>
  <div class="d-flex flex-column h-100">
    <div class="pa-3 pb-0">
      <v-text-field
        v-model="catalogStore.keyword"
        placeholder="Tìm theo tên hoặc SKU..."
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="outlined"
        hide-details
        clearable
      />
    </div>

    <PosCategoryBar v-if="!catalogStore.keyword.trim()" class="pt-2" />

    <PosProductGrid @pick="$emit('pick', $event)" />
  </div>
</template>

<script setup lang="ts">
import { usePosCatalogStore } from '../stores/pos-catalog.store'
import PosCategoryBar from './PosCategoryBar.vue'
import PosProductGrid from './PosProductGrid.vue'
import type { PosProductDto } from '../models/dtos/pos-catalog.dto'

const catalogStore = usePosCatalogStore()
defineEmits<{ pick: [product: PosProductDto] }>()
</script>
