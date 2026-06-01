<template>
    <v-card rounded="lg">
        <AppDataTable
            :items="items"
            :columns="PRODUCT_LIST_COLUMNS"
            :loading="loading"
            item-key="id"
            @row-click="(item) => emit(PRODUCT_LIST_EMIT.ROW_ACTION, PRODUCT_ROW_ACTION.EDIT, item)"
        >
            <template #[`item.sku`]="{ item }">
                <span class="text-caption text-medium-emphasis font-weight-medium">{{ item.sku }}</span>
            </template>

            <template #[`item.categoryName`]="{ item }">
                <span class="text-caption text-medium-emphasis">{{ item.categoryName ?? '—' }}</span>
            </template>

            <template #[`item.basePrice`]="{ item }">
                <span class="font-weight-medium">{{ formatCurrency(item.basePrice) }}</span>
            </template>

            <template #[`item.isActive`]="{ item }">
                <AppStatusChip
                    :config="PRODUCT_STATUS_CONFIG[item.isActive ? 'active' : 'inactive']"
                />
            </template>

            <template #[`item.isFeatured`]="{ item }">
                <v-chip
                    v-if="item.isFeatured"
                    color="warning"
                    size="small"
                    variant="tonal"
                    prepend-icon="mdi-star"
                >
                    Nổi bật
                </v-chip>
                <span v-else class="text-medium-emphasis text-caption">—</span>
            </template>

            <template #[`item.actions`]="{ item }">
                <AppRowActions
                    :actions="PRODUCT_ROW_ACTIONS"
                    :item="item"
                    @action="(key) => emit(PRODUCT_LIST_EMIT.ROW_ACTION, key, item)"
                />
            </template>

            <template #empty>
                <AppEmptyState
                    icon="mdi-package-variant-closed"
                    title="Chưa có sản phẩm"
                    description="Tạo sản phẩm đầu tiên để bắt đầu bán hàng."
                >
                    <template #actions>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(PRODUCT_LIST_EMIT.CREATE)">
                            Thêm sản phẩm
                        </v-btn>
                    </template>
                </AppEmptyState>
            </template>
        </AppDataTable>

        <v-divider />

        <AppPagination
            :page-number="pageNumber"
            :page-size="pageSize"
            :total-pages="totalPages"
            :total-items="totalItems"
            @update:page-number="emit(PRODUCT_LIST_EMIT.PAGE_CHANGE, $event)"
            @update:page-size="emit(PRODUCT_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
        />
    </v-card>
</template>

<script setup lang="ts">
import {
    AppDataTable,
    AppPagination,
    AppRowActions,
    AppStatusChip,
    AppEmptyState,
} from '@/components/ui'
import {
    PRODUCT_LIST_EMIT,
    PRODUCT_LIST_COLUMNS,
    PRODUCT_ROW_ACTION,
    PRODUCT_ROW_ACTIONS,
    PRODUCT_STATUS_CONFIG,
    type ProductListEmits,
} from '../constants/product-list.constants'
import type { ProductViewModel } from '../models/view-models/product.view-model'

defineProps<{
    items: ProductViewModel[]
    loading: boolean
    pageNumber: number
    pageSize: number
    totalPages: number
    totalItems: number
}>()

const emit = defineEmits<ProductListEmits>()

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
</script>
