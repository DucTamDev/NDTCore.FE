<template>
    <v-card rounded="lg">
        <AppDataTable
            :items="items"
            :columns="OPTION_LIST_COLUMNS"
            :loading="loading"
            item-key="id"
            @row-click="(item) => emit(OPTION_LIST_EMIT.ROW_ACTION, OPTION_ROW_ACTION.DETAIL, item)"
        >
            <template #[`item.price`]="{ item }">
                <span class="text-body-2">
                    {{ item.price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) ?? '0 ₫' }}
                </span>
            </template>

            <template #[`item.isActive`]="{ item }">
                <AppStatusChip
                    :config="OPTION_STATUS_CONFIG[item.isActive ? 'active' : 'inactive']"
                />
            </template>

            <template #[`item.actions`]="{ item }">
                <AppRowActions
                    :actions="OPTION_ROW_ACTIONS"
                    :item="item"
                    @action="(key) => emit(OPTION_LIST_EMIT.ROW_ACTION, key, item)"
                />
            </template>

            <template #empty>
                <AppEmptyState
                    icon="mdi-checkbox-multiple-marked-outline"
                    title="Chưa có option"
                    description="Thêm option vào nhóm để cấu hình lựa chọn cho sản phẩm."
                />
            </template>
        </AppDataTable>

        <v-divider />

        <AppPagination
            :page-number="pageNumber"
            :page-size="pageSize"
            :total-pages="totalPages"
            :total-items="totalItems"
            @update:page-number="emit(OPTION_LIST_EMIT.PAGE_CHANGE, $event)"
            @update:page-size="emit(OPTION_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
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
    OPTION_LIST_EMIT,
    OPTION_LIST_COLUMNS,
    OPTION_ROW_ACTION,
    OPTION_ROW_ACTIONS,
    OPTION_STATUS_CONFIG,
    type OptionListEmits,
} from '../../constants/option-list.constants'
import type { OptionViewModel } from '../../models/view-models/option.view-model'

defineProps<{
    items: OptionViewModel[]
    loading: boolean
    pageNumber: number
    pageSize: number
    totalPages: number
    totalItems: number
}>()

const emit = defineEmits<OptionListEmits>()
</script>
