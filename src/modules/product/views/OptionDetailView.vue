<template>
    <div class="d-flex flex-column ga-5">
        <!-- Skeleton loader -->
        <template v-if="option.loading.value">
            <v-skeleton-loader type="heading" />
            <v-skeleton-loader type="card" height="120" />
            <v-skeleton-loader type="card" />
        </template>

        <template v-else-if="option.data.value">
            <!-- Hero header -->
            <v-card variant="tonal" color="primary" rounded="lg" flat>
                <v-card-text class="pa-5">
                    <AppBreadcrumb
                        :items="[
                            { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                            { title: 'Options', to: { name: APP_ROUTES.PRODUCT.OPTIONS.NAME } },
                            { title: option.data.value.name, disabled: true },
                        ]"
                    />
                    <div class="d-flex align-center ga-3 mt-3">
                        <v-sheet
                            rounded="lg"
                            width="52"
                            height="52"
                            class="d-flex align-center justify-center flex-shrink-0"
                        >
                            <v-icon icon="mdi-checkbox-marked-outline" size="28" color="primary" />
                        </v-sheet>
                        <div>
                            <div class="text-h6 font-weight-bold">{{ option.data.value.name }}</div>
                            <div class="text-body-2 text-medium-emphasis">
                                Giá: {{ option.data.value.defaultPrice?.toLocaleString() ?? '0' }}
                            </div>
                        </div>
                    </div>
                </v-card-text>
            </v-card>

            <!-- Tabs -->
            <v-card rounded="lg" elevation="1">
                <v-tabs v-model="activeTab" color="primary" class="px-2">
                    <v-tab value="overview" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-information-outline" size="18" />
                        Tổng quan
                    </v-tab>
                    <v-tab value="stores" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-store-outline" size="18" />
                        Cửa hàng
                    </v-tab>
                </v-tabs>
                <v-divider />
                <v-window v-model="activeTab">
                    <v-window-item value="overview">
                        <OptionOverviewTab
                            :option="option.data.value"
                            :form="editForm"
                            :errors="formErrors"
                            :is-dirty="isDirty"
                            :submitting="submitting"
                            :group-options="groupOptions"
                            @update:form="onFormUpdate"
                            @save="saveChanges"
                            @discard="discardChanges"
                        />
                    </v-window-item>
                    <v-window-item value="stores">
                        <OptionStoreOverridesTab :option-id="optionId" />
                    </v-window-item>
                </v-window>
            </v-card>
        </template>

        <!-- Not found -->
        <AppEmptyState
            v-else-if="!option.loading.value"
            icon="mdi-checkbox-blank-off-outline"
            title="Không tìm thấy option"
            description="Option này không tồn tại hoặc đã bị xóa."
        >
            <template #actions>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-arrow-left"
                    :to="{ name: APP_ROUTES.PRODUCT.OPTIONS.NAME }"
                >
                    Quay lại danh sách
                </v-btn>
            </template>
        </AppEmptyState>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppBreadcrumb, AppEmptyState } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { optionService } from '../services/option.service'
import { useOption } from '../composables/useOption'
import { useOptionGroupStore } from '../stores/option-group.store'
import { createEmptyOptionForm } from '../models/form-models/option.model'
import OptionOverviewTab from '../components/OptionOverviewTab.vue'
import OptionStoreOverridesTab from '../components/OptionStoreOverridesTab.vue'
import type { OptionFormModel } from '../models/form-models/option.model'
import type { UpdateOptionRequest } from '../models/dtos/option.dto'

// composables

const route = useRoute()
const router = useRouter()
const { updateOption } = useOption()
const groupStore = useOptionGroupStore()

// refs / reactive

const optionId = Number(route.params['id'])
const activeTab = ref('overview')
const submitting = ref(false)
const editForm = reactive<OptionFormModel>(createEmptyOptionForm())
const snapshot = ref<OptionFormModel | null>(null)
const formErrors = reactive<Partial<Record<keyof OptionFormModel, string>>>({})

// NaN guard
if (isNaN(optionId)) void router.replace({ name: APP_ROUTES.PRODUCT.OPTIONS.NAME })

// async state (useAsyncState executes lazily; onMounted guards execution)
const option = useAsyncState(() => optionService.getByIdAsync(optionId))

// computed

const groupOptions = computed(() =>
    groupStore.items.map((g) => ({ id: g.id, name: g.name })),
)

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return (
        editForm.name !== snapshot.value.name ||
        editForm.defaultPrice !== snapshot.value.defaultPrice ||
        editForm.displayOrder !== snapshot.value.displayOrder ||
        editForm.isActive !== snapshot.value.isActive
    )
})

// methods

function syncFormFromOption() {
    if (!option.data.value) return
    const o = option.data.value
    editForm.groupId = o.groupId
    editForm.name = o.name
    editForm.defaultPrice = o.defaultPrice
    editForm.description = o.description ?? ''
    editForm.imageUrl = o.imageUrl ?? ''
    editForm.displayOrder = o.displayOrder
    editForm.isActive = o.isActive
    snapshot.value = { ...editForm }
}

function onFormUpdate(field: keyof OptionFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
    if (field === 'name' && typeof value === 'string' && value.trim()) {
        delete formErrors.name
    }
}

function discardChanges() {
    syncFormFromOption()
    delete formErrors.name
}

async function saveChanges() {
    if (!editForm.name?.trim()) {
        formErrors.name = 'Tên option là bắt buộc'
        return
    }
    delete formErrors.name
    submitting.value = true
    try {
        const payload: UpdateOptionRequest = {
            Name: editForm.name.trim(),
            DefaultPrice: editForm.defaultPrice,
            Description: editForm.description || null,
            ImageUrl: editForm.imageUrl || null,
            DisplayOrder: editForm.displayOrder,
            IsActive: editForm.isActive,
        }
        const ok = await updateOption(optionId, payload)
        if (ok) {
            await option.execute()
            syncFormFromOption()
        }
    } finally {
        submitting.value = false
    }
}

// lifecycle

onMounted(async () => {
    if (isNaN(optionId)) return
    await option.execute()
    syncFormFromOption()
    await groupStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
})
</script>
