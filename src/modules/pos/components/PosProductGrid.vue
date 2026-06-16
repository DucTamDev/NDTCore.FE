<template>
  <div class="overflow-y-auto flex-grow-1 pa-3">
    <v-row v-if="catalogStore.isLoading" dense>
      <v-col v-for="n in 8" :key="n" cols="6" sm="4">
        <v-skeleton-loader type="card" height="180" />
      </v-col>
    </v-row>

    <div
      v-else-if="catalogStore.filteredProducts.length === 0"
      class="d-flex flex-column align-center justify-center ga-2 pa-8 text-medium-emphasis"
    >
      <v-icon icon="mdi-magnify-close" size="48" />
      <span>Không tìm thấy sản phẩm phù hợp</span>
    </div>

    <v-row v-else dense>
      <v-col
        v-for="product in catalogStore.filteredProducts"
        :key="product.Id"
        cols="6"
        sm="4"
      >
        <PosProductCard :product="product" @pick="$emit('pick', product)" />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { usePosCatalogStore } from '../stores/pos-catalog.store'
import PosProductCard from './PosProductCard.vue'
import type { PosProductDto } from '../models/dtos/pos-catalog.dto'

const catalogStore = usePosCatalogStore()
defineEmits<{ pick: [product: PosProductDto] }>()
</script>
