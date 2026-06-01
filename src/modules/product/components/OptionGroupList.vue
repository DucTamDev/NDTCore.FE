<template>
    <v-card rounded="lg">
        <AppDataTable
            :items="items"
            :columns="OPTION_GROUP_LIST_COLUMNS"
            :loading="loading"
            item-key="id"
            @row-click="(item) => emit(OPTION_GROUP_LIST_EMIT.ROW_SELECT, item)"
        >
            <template #[`item.uiType`]="{ item }">
                <v-chip
                    :color="item.uiType === 'SingleSelect' ? 'primary' : 'secondary'"
                    variant="tonal"
                    size="small"
                >
                    {{ UI_TYPE_LABELS[item.uiType] ?? item.uiType }}
                </v-chip>
            </template>

            <template #[`item.isActive`]="{ item }">
                <AppStatusChip
                    :config="OPTION_GROUP_STATUS_CONFIG[item.isActive ? 'active' : 'inactive']"
                />
            </template>

            <template #[`item.actions`]="{ item }">
                <AppRowActions
                    :actions="OPTION_GROUP_ROW_ACTIONS"
                    :item="item"
                    @action="(key) => emit(OPTION_GROUP_LIST_EMIT.ROW_ACTION, key, item)"
                />
            </template>

            <template #empty>
                <AppEmptyState
                    icon="mdi-tune-variant"
                    title="Chưa có nhóm option"
                    description="Tạo nhóm option đầu tiên để cấu hình lựa chọn cho sản phẩm."
                >
                    <template #actions>
                        <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(OPTION_GROUP_LIST_EMIT.CREATE)">
                            Thêm nhóm
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
            @update:page-number="emit(OPTION_GROUP_LIST_EMIT.PAGE_CHANGE, $event)"
            @update:page-size="emit(OPTION_GROUP_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
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
    OPTION_GROUP_LIST_EMIT,
    OPTION_GROUP_LIST_COLUMNS,
    OPTION_GROUP_ROW_ACTIONS,
    OPTION_GROUP_STATUS_CONFIG,
    UI_TYPE_LABELS,
    type OptionGroupListEmits,
} from '../constants/option-group-list.constants'
import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'

defineProps<{
    items: OptionGroupViewModel[]
    loading: boolean
    pageNumber: number
    pageSize: number
    totalPages: number
    totalItems: number
}>()

const emit = defineEmits<OptionGroupListEmits>()
</script>
