<template>
    <div class="pa-4 d-flex flex-column ga-4">
        <div class="d-flex justify-end">
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openAdd">
                Thêm cửa hàng
            </v-btn>
        </div>

        <AppDataTable
            :items="(items as Record<string, unknown>[])"
            :columns="STORE_OVERRIDE_LIST_COLUMNS"
            :loading="isLoading"
            item-key="StoreId"
        >
            <template #[`item.IsAvailable`]="{ item }">
                <template v-if="item['IsAvailable'] != null">
                    <v-icon
                        :color="item['IsAvailable'] ? 'success' : 'error'"
                        :icon="item['IsAvailable'] ? 'mdi-check-circle' : 'mdi-close-circle'"
                    />
                </template>
                <span v-else class="text-medium-emphasis text-caption">—</span>
            </template>

            <template #[`item.OverridePrice`]="{ item }">
                <span v-if="item['OverridePrice'] != null">
                    {{ Number(item['OverridePrice']).toLocaleString('vi-VN') }} ₫
                </span>
                <span v-else class="text-medium-emphasis text-caption">—</span>
            </template>

            <template #[`item.actions`]="{ item }">
                <AppRowActions
                    :actions="STORE_OVERRIDE_ROW_ACTIONS"
                    :item="item"
                    @action="(key) => onRowAction(key, item)"
                />
            </template>

            <template #empty>
                <AppEmptyState
                    icon="mdi-store-off-outline"
                    title="Chưa có override cửa hàng"
                    description="Nhấn 'Thêm cửa hàng' để cấu hình override cho cửa hàng."
                />
            </template>
        </AppDataTable>

        <v-divider />

        <AppPagination
            :page-number="pageNumber"
            :page-size="pageSize"
            :total-pages="totalPages"
            :total-items="totalItems"
            @update:page-number="onPageChange"
            @update:page-size="onPageSizeChange"
        />

        <!-- Add / Edit dialog -->
        <AppDialog
            v-model="dialogOpen"
            :title="editingRow ? 'Chỉnh sửa cửa hàng' : 'Thêm cửa hàng'"
            size="sm"
            :loading="isSubmitting"
            confirm-label="Lưu"
            @confirm="onSave"
        >
            <div class="d-flex flex-column ga-4 pt-1">
                <v-autocomplete
                    v-model="form.storeId"
                    :items="storeOptions"
                    item-value="id"
                    item-title="label"
                    label="Cửa hàng"
                    :disabled="!!editingRow"
                    :loading="storeStore.listLoading"
                    :rules="[(v: number | null) => !!v || 'Vui lòng chọn cửa hàng']"
                    density="compact"
                    variant="outlined"
                    no-data-text="Không tìm thấy cửa hàng"
                    clearable
                />
                <v-switch
                    v-model="form.isAvailable"
                    label="Khả dụng"
                    color="primary"
                    hide-details
                    inset
                />
                <AppCurrencyField
                    v-model="form.price"
                    label="Giá override (để trống nếu không cần)"
                    :nullable="true"
                />
            </div>
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmOpen"
            title="Xóa override"
            :message="`Xóa tất cả override cho Store ID ${confirmStoreId}?`"
            confirm-label="Xóa"
            confirm-variant="danger"
            @confirm="onConfirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
    AppDataTable, AppPagination, AppRowActions,
    AppDialog, AppConfirmDialog, AppCurrencyField, AppEmptyState,
} from '@/components/ui'
import {
    STORE_OVERRIDE_LIST_COLUMNS,
    STORE_OVERRIDE_ROW_ACTION,
    STORE_OVERRIDE_ROW_ACTIONS,
} from '../../constants/store-overrides.constants'
import { useOptionStoreOverridesPaged } from '../../composables/useStoreOverrides'
import { useStoreStore } from '@/modules/store/stores/store.store'
import type { StoreOverrideItemDto } from '../../models/dtos/store-overrides.dto'

const props = defineProps<{ optionId: number }>()

const {
    isLoading, isSubmitting, items,
    pageNumber, pageSize, totalPages, totalItems,
    loadPaged, upsertAvailability, upsertPrice, removePrice, removeStoreRow,
} = useOptionStoreOverridesPaged(props.optionId)

const storeStore = useStoreStore()

const storeOptions = computed(() => {
    const assignedIds = new Set(items.value.map((s) => s.StoreId))
    return storeStore.stores
        .filter((s) => !assignedIds.has(s.id) || s.id === editingRow.value?.StoreId)
        .map((s) => ({ id: s.id, label: s.name }))
})

const dialogOpen     = ref(false)
const confirmOpen    = ref(false)
const confirmStoreId = ref(0)
const editingRow     = ref<StoreOverrideItemDto | null>(null)
const originalPrice  = ref<number | null>(null)

const form = reactive({
    storeId:     null as number | null,
    isAvailable: true,
    price:       null as number | null,
})

function openAdd() {
    editingRow.value    = null
    originalPrice.value = null
    Object.assign(form, { storeId: null, isAvailable: true, price: null })
    dialogOpen.value = true
}

function openEdit(row: StoreOverrideItemDto) {
    editingRow.value    = row
    originalPrice.value = row.OverridePrice
    Object.assign(form, {
        storeId:     row.StoreId,
        isAvailable: row.IsAvailable ?? true,
        price:       row.OverridePrice,
    })
    dialogOpen.value = true
}

function onRowAction(key: string, row: Record<string, unknown>) {
    const storeRow = row as unknown as StoreOverrideItemDto
    if (key === STORE_OVERRIDE_ROW_ACTION.EDIT)   openEdit(storeRow)
    if (key === STORE_OVERRIDE_ROW_ACTION.DELETE) {
        confirmStoreId.value = storeRow.StoreId
        confirmOpen.value    = true
    }
}

async function onSave() {
    const { storeId, isAvailable, price } = form
    if (!storeId) return

    const okAvail = await upsertAvailability(storeId, isAvailable)
    if (!okAvail) return

    if (price != null) {
        await upsertPrice(storeId, price)
    } else if (editingRow.value && originalPrice.value != null) {
        try {
            await removePrice(storeId)
        } catch { /* ignore 404 */ }
    }

    dialogOpen.value = false
    await loadPaged()
}

async function onConfirmDelete() {
    await removeStoreRow(confirmStoreId.value)
    await loadPaged()
}

async function onPageChange(page: number) {
    pageNumber.value = page
    await loadPaged()
}

async function onPageSizeChange(size: number) {
    pageSize.value   = size
    pageNumber.value = 1
    await loadPaged()
}

onMounted(async () => {
    await storeStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
    await loadPaged()
})
</script>
