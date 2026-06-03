<template>
    <div class="pa-4 d-flex flex-column ga-4">
        <div class="d-flex align-center justify-space-between">
            <span class="text-subtitle-2 text-medium-emphasis">Cấu hình option</span>
            <v-btn size="small" color="primary" prepend-icon="mdi-plus" @click="openDialog(null)">
                Thêm / cập nhật
            </v-btn>
        </div>

        <v-progress-linear :indeterminate="isLoading" color="primary" :style="{ opacity: isLoading ? 1 : 0, transition: 'opacity 0.15s ease' }" />

        <v-table v-if="optionConfigs.length" density="compact">
            <thead>
                <tr>
                    <th>Option</th>
                    <th class="text-end">Giá tùy chỉnh</th>
                    <th class="text-center">Mặc định</th>
                    <th class="text-center">Ẩn</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="cfg in optionConfigs" :key="cfg.OptionId">
                    <td>{{ cfg.OptionName }}</td>
                    <td class="text-end">
                        {{ cfg.CustomPrice != null ? cfg.CustomPrice.toLocaleString() : '—' }}
                    </td>
                    <td class="text-center">
                        <v-icon
                            :color="cfg.IsDefault ? 'success' : 'grey'"
                            :icon="cfg.IsDefault ? 'mdi-check' : 'mdi-minus'"
                        />
                    </td>
                    <td class="text-center">
                        <v-icon
                            :color="cfg.IsHidden ? 'error' : 'grey'"
                            :icon="cfg.IsHidden ? 'mdi-eye-off' : 'mdi-eye'"
                        />
                    </td>
                    <td class="text-end">
                        <v-btn
                            size="x-small"
                            icon="mdi-pencil-outline"
                            variant="text"
                            color="primary"
                            @click="openDialog(cfg)"
                        />
                        <v-btn
                            size="x-small"
                            icon="mdi-delete-outline"
                            variant="text"
                            color="error"
                            @click="() => { confirmCfgOptionId = cfg.OptionId; confirmCfgOpen = true }"
                        />
                    </td>
                </tr>
            </tbody>
        </v-table>
        <v-alert v-else-if="!isLoading" type="info" variant="tonal" density="compact">
            Chưa có cấu hình option nào.
        </v-alert>

        <AppConfirmDialog
            v-model="confirmCfgOpen"
            title="Xoá cấu hình option"
            message="Bạn có chắc muốn xoá cấu hình option này?"
            confirm-label="Xác nhận xoá"
            confirm-variant="danger"
            @confirm="onConfirmRemove"
        />

        <AppDialog v-model="showDialog" title="Cấu hình option" :hide-actions="true" max-width="500px">
            <div class="pa-2 d-flex flex-column ga-3">
                <v-autocomplete
                    v-model="form.OptionId"
                    :items="allOptions"
                    item-value="id"
                    item-title="name"
                    label="Option *"
                    :disabled="!!editCfg"
                />
                <AppCurrencyField
                    v-model="form.CustomPrice"
                    label="Giá tùy chỉnh"
                    :nullable="true"
                    hint="Để trống = dùng giá mặc định"
                />
                <v-row>
                    <v-col cols="6">
                        <v-switch v-model="form.IsDefault" label="Mặc định" color="primary" base-color="grey" />
                    </v-col>
                    <v-col cols="6">
                        <v-switch v-model="form.IsHidden" label="Ẩn" color="error" base-color="grey" />
                    </v-col>
                </v-row>
                <div class="d-flex justify-end ga-2">
                    <v-btn variant="text" @click="showDialog = false">Hủy</v-btn>
                    <v-btn color="primary" :loading="isSubmitting" @click="onUpsert">Lưu</v-btn>
                </div>
            </div>
        </AppDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { AppDialog, AppConfirmDialog, AppCurrencyField } from '@/components/ui'
import { useProductRelations } from '../../composables/useProductRelations'
import { useOptionStore } from '../../stores/option.store'
import type { ProductOptionConfigDto } from '../../models/dtos/product-relations.dto'

const props = defineProps<{ productId: number }>()

const {
    isLoading,
    isSubmitting,
    optionConfigs,
    loadOptionConfigs,
    upsertOptionConfig,
    removeOptionConfig,
} = useProductRelations(props.productId)

const optionStore = useOptionStore()
const allOptions = ref<{ id: number; name: string }[]>([])
const showDialog = ref(false)
const editCfg = ref<ProductOptionConfigDto | null>(null)
const confirmCfgOpen = ref(false)
const confirmCfgOptionId = ref<number | null>(null)
const form = reactive<{ OptionId: number; CustomPrice: number | null; IsDefault: boolean; IsHidden: boolean }>({
    OptionId: 0,
    CustomPrice: null,
    IsDefault: false,
    IsHidden: false,
})

function openDialog(cfg: ProductOptionConfigDto | null) {
    editCfg.value = cfg
    if (cfg) {
        Object.assign(form, {
            OptionId: cfg.OptionId,
            CustomPrice: cfg.CustomPrice,
            IsDefault: cfg.IsDefault,
            IsHidden: cfg.IsHidden,
        })
    } else {
        Object.assign(form, { OptionId: 0, CustomPrice: null, IsDefault: false, IsHidden: false })
    }
    showDialog.value = true
}

async function onUpsert() {
    const ok = await upsertOptionConfig({
        OptionId: form.OptionId,
        CustomPrice: form.CustomPrice,
        IsDefault: form.IsDefault,
        IsHidden: form.IsHidden,
    })
    if (ok) { showDialog.value = false; await loadOptionConfigs() }
}

async function onConfirmRemove() {
    if (confirmCfgOptionId.value == null) return
    const ok = await removeOptionConfig(confirmCfgOptionId.value)
    if (ok) await loadOptionConfigs()
    confirmCfgOptionId.value = null
}

onMounted(async () => {
    await optionStore.fetchPaged({ PageNumber: 1, PageSize: 500 })
    allOptions.value = optionStore.items.map((o) => ({ id: o.id, name: o.name }))
    await loadOptionConfigs()
})
</script>
