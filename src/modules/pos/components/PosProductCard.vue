<template>
  <v-card
    :disabled="!product.IsAvailable"
    :ripple="product.IsAvailable"
    variant="flat"
    elevation="2"
    rounded="lg"
    class="d-flex flex-column"
    size = "md"
    style="cursor: pointer; user-select: none;"
    @click="product.IsAvailable && $emit('pick', product)"
  >
    <v-img :src="product.ImageUrl ?? undefined" height="120" cover>
      <template #placeholder>
        <div class="d-flex align-center justify-center h-100 bg-surface-variant">
          <v-icon icon="mdi-image-outline" size="40" color="medium-emphasis" />
        </div>
      </template>

      <template #default>
        <div
          v-if="!product.IsAvailable"
          class="d-flex align-center justify-center h-100"
          style="background: rgba(0,0,0,.45);"
        >
          <v-chip size="small" color="error">Hết hàng</v-chip>
        </div>
        <div v-if="product.Tags.length" class="pa-1 d-flex flex-wrap ga-1">
          <v-chip
            v-for="tag in product.Tags.slice(0, 2)"
            :key="tag.Id"
            size="x-small"
            :style="{
              backgroundColor: tag.ColorHex ?? undefined,
              color: tag.TextColor ?? undefined,
            }"
          >
            {{ tag.Name }}
          </v-chip>
        </div>
      </template>
    </v-img>

    <v-card-text class="pa-2 pt-1">
      <div class="text-body-2 font-weight-medium text-truncate">{{ product.Name }}</div>
      <div class="text-body-2 text-primary font-weight-semibold mt-1">
        {{ product.ResolvedPrice.toLocaleString('vi-VN') }}₫
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { PosProductDto } from '../models/dtos/pos-catalog.dto'

defineProps<{ product: PosProductDto }>()
defineEmits<{ pick: [product: PosProductDto] }>()
</script>
