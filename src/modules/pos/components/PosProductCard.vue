<template>
  <v-card
    :disabled="!product.IsAvailable"
    :ripple="product.IsAvailable"
    variant="flat"
    elevation="2"
    rounded="lg"
    class="d-flex flex-row flex-sm-column product-card"
    style="cursor: pointer; user-select: none;"
    @click="product.IsAvailable && $emit('pick', product)"
  >
    <!-- Image -->
    <div class="img-wrap flex-shrink-0">
      <v-img :src="product.ImageUrl ?? undefined" class="h-100" cover>
        <template #placeholder>
          <div class="d-flex align-center justify-center h-100 bg-surface-variant">
            <v-icon icon="mdi-image-outline" size="32" color="medium-emphasis" />
          </div>
        </template>

        <template #default>
          <div
            v-if="!product.IsAvailable"
            class="d-flex align-center justify-center h-100"
            style="background: rgba(0,0,0,.45);"
          >
            <v-chip size="x-small" color="error">Hết hàng</v-chip>
          </div>
        </template>
      </v-img>
    </div>

    <!-- Info -->
    <v-card-text class="d-flex flex-column justify-space-between pa-2 flex-grow-1 min-w-0">
      <div>
        <div class="text-body-2 font-weight-medium text-truncate">{{ product.Name }}</div>
        <div v-if="product.Tags.length" class="d-flex flex-wrap ga-1 mt-1">
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
      </div>
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

<style scoped>
.product-card {
  height: 96px;
}

.img-wrap {
  width: 96px;
  height: 96px;
}

@media (min-width: 600px) {
  .product-card {
    height: auto;
    flex-direction: column;
  }

  .img-wrap {
    width: 100%;
    height: 120px;
  }
}
</style>