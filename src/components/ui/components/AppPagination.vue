<template>
  <div
    class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3 pa-3 flex-wrap"
  >
    <div class="d-flex align-center ga-3">
      <span class="text-body-2 text-medium-emphasis text-no-wrap">
        {{
          totalItems > 0 ? `Hiển thị ${rangeStart}–${rangeEnd} / ${totalItems}` : 'Không có dữ liệu'
        }}
      </span>
      <v-select
        :model-value="pageSize"
        :items="pageSizeItems"
        style="min-width: 120px; max-width: 140px"
        @update:model-value="emit(APP_PAGINATION_EMIT.UPDATE_PAGE_SIZE, $event)"
      />
    </div>

    <v-pagination
      :model-value="pageNumber"
      :length="totalPages"
      :total-visible="5"
      @update:model-value="emit(APP_PAGINATION_EMIT.UPDATE_PAGE_NUMBER, $event)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { APP_PAGINATION_EMIT } from '../constants/emit-keys'
import type { AppPaginationEmits } from '../types/emit.types'

const props = defineProps<{
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItems: number
  pageSizeOptions?: number[]
}>()

const emit = defineEmits<AppPaginationEmits>()

const DEFAULT_OPTIONS = [10, 20, 50, 100]

const pageSizeItems = computed(() =>
  (props.pageSizeOptions ?? DEFAULT_OPTIONS).map((n) => ({
    title: `${n} / trang`,
    value: n,
  })),
)

const rangeStart = computed(() =>
  props.totalItems === 0 ? 0 : (props.pageNumber - 1) * props.pageSize + 1,
)
const rangeEnd = computed(() => Math.min(props.pageNumber * props.pageSize, props.totalItems))
</script>
