<template>
    <div class="d-flex flex-column ga-5">
        <template v-if="group.loading.value">
            <v-skeleton-loader type="heading" />
            <v-skeleton-loader type="card" height="120" />
            <v-skeleton-loader type="card" />
        </template>

        <template v-else-if="group.data.value">
            <!-- Hero header -->
            <v-card variant="tonal" color="primary" rounded="lg" flat>
                <v-card-text class="pa-5">
                    <AppBreadcrumb
                        :items="[
                            { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                            { title: 'Nhóm option', to: { name: APP_ROUTES.PRODUCT.OPTION_GROUPS.NAME } },
                            { title: group.data.value.name, disabled: true },
                        ]"
                    />
                    <div class="d-flex align-center ga-3 mt-3">
                        <v-sheet
                            rounded="lg"
                            width="52"
                            height="52"
                            class="d-flex align-center justify-center flex-shrink-0"
                        >
                            <v-icon icon="mdi-tune-variant" size="28" color="primary" />
                        </v-sheet>
                        <div>
                            <div class="text-h6 font-weight-bold text-high-emphasis">
                                {{ group.data.value.name }}
                            </div>
                            <div class="text-body-2 text-medium-emphasis mt-1">
                                {{ uiTypeLabel }}
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
                    <v-tab value="options" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-checkbox-multiple-marked-outline" size="18" />
                        Options
                    </v-tab>
                    <v-tab value="products" class="text-none" rounded="lg">
                        <v-icon start icon="mdi-package-variant-closed" size="18" />
                        Sản phẩm
                    </v-tab>
                </v-tabs>

                <v-divider />

                <v-window v-model="activeTab">
                    <v-window-item value="overview">
                        <OptionGroupOverviewTab
                            :group="group.data.value"
                            :form="editForm"
                            :errors="formErrors"
                            :is-dirty="isDirty"
                            :submitting="submitting"
                            @update:form="onFormUpdate"
                            @save="saveChanges"
                            @discard="discardChanges"
                        />
                    </v-window-item>

                    <v-window-item value="options">
                        <div class="pa-4">
                            <v-progress-linear v-if="optionsLoading" indeterminate color="primary" class="mb-3" />
                            <OptionList
                                :items="optionItems"
                                :loading="optionsLoading"
                                :page-number="optionPage"
                                :page-size="optionPageSize"
                                :total-pages="optionTotalPages"
                                :total-items="optionTotal"
                                @page-change="onOptionPageChange"
                                @page-size-change="onOptionPageSizeChange"
                                @row-action="onOptionAction"
                            />
                        </div>
                    </v-window-item>

                    <v-window-item value="products">
                        <div class="pa-4">
                            <AppEmptyState
                                icon="mdi-package-variant-closed"
                                title="Sản phẩm"
                                description="Tính năng lọc sản phẩm theo nhóm option chưa được hỗ trợ."
                            />
                        </div>
                    </v-window-item>
                </v-window>
            </v-card>
        </template>

        <AppEmptyState
            v-else-if="!group.loading.value"
            icon="mdi-tune-off"
            title="Không tìm thấy nhóm option"
            description="Nhóm option này không tồn tại hoặc đã bị xóa."
        >
            <template #actions>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-arrow-left"
                    :to="{ name: APP_ROUTES.PRODUCT.OPTION_GROUPS.NAME }"
                >
                    Quay lại danh sách
                </v-btn>
            </template>
        </AppEmptyState>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppBreadcrumb, AppEmptyState } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { optionGroupService } from '../services/option-group.service'
import { useOptionGroup } from '../composables/useOptionGroup'
import { useOption } from '../composables/useOption'
import { createEmptyOptionGroupForm } from '../models/form-models/option-group.model'
import type { OptionGroupFormModel } from '../models/form-models/option-group.model'
import type { UpdateOptionGroupRequest } from '../models/dtos/option-group.dto'
import type { OptionViewModel } from '../models/view-models/option.view-model'
import OptionList from '../components/OptionList.vue'
import OptionGroupOverviewTab from '../components/OptionGroupOverviewTab.vue'

const route = useRoute()
const router = useRouter()
const groupId = Number(route.params['id'])
if (isNaN(groupId)) void router.replace({ name: APP_ROUTES.PRODUCT.OPTION_GROUPS.NAME })
const activeTab = ref('overview')

const group = useAsyncState(() => optionGroupService.getByIdAsync(groupId))
const { updateOptionGroup } = useOptionGroup()

const uiTypeLabel = computed(() => {
    const t = group.data.value?.uiType
    if (t === 'SingleSelect') return 'Chọn một'
    if (t === 'MultiSelect') return 'Chọn nhiều'
    return t ?? '—'
})

// Inline edit form
const editForm = reactive<OptionGroupFormModel>(createEmptyOptionGroupForm())
const snapshot = ref<OptionGroupFormModel | null>(null)

function syncFormFromGroup() {
    if (!group.data.value) return
    const g = group.data.value
    editForm.name = g.name
    editForm.uiType = g.uiType
    editForm.description = g.description ?? ''
    editForm.displayOrder = g.displayOrder
    editForm.isActive = g.isActive
    snapshot.value = { ...editForm }
}

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return (
        editForm.name !== snapshot.value.name ||
        editForm.uiType !== snapshot.value.uiType ||
        editForm.description !== snapshot.value.description ||
        editForm.displayOrder !== snapshot.value.displayOrder ||
        editForm.isActive !== snapshot.value.isActive
    )
})

const formErrors = reactive<Partial<Record<keyof OptionGroupFormModel, string>>>({})

function onFormUpdate(field: keyof OptionGroupFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
    if (field === 'name' && typeof value === 'string' && value.trim()) {
        delete formErrors.name
    }
}

const submitting = ref(false)

function discardChanges() {
    syncFormFromGroup()
    delete formErrors.name
}

async function saveChanges() {
    if (!editForm.name?.trim()) {
        formErrors.name = 'Tên nhóm là bắt buộc'
        return
    }
    delete formErrors.name

    submitting.value = true
    try {
        const payload: UpdateOptionGroupRequest = {
            Name: editForm.name.trim(),
            UiType: editForm.uiType,
            Description: editForm.description || null,
            DisplayOrder: editForm.displayOrder,
            IsActive: editForm.isActive,
        }
        const ok = await updateOptionGroup(groupId, payload)
        if (ok) {
            await group.execute()
            syncFormFromGroup()
        }
    } finally {
        submitting.value = false
    }
}

// Options tab
const {
    items: optionItems,
    total: optionTotal,
    isLoading: optionsLoading,
    loadOptions,
} = useOption()

const optionPage = ref(1)
const optionPageSize = ref(20)
const optionTotalPages = computed(() => Math.max(1, Math.ceil(optionTotal.value / optionPageSize.value)))

async function fetchOptions() {
    await loadOptions({ PageNumber: optionPage.value, PageSize: optionPageSize.value, GroupId: groupId })
}

function onOptionPageChange(p: number) {
    optionPage.value = p
    void fetchOptions()
}

function onOptionPageSizeChange(s: number) {
    optionPageSize.value = s
    optionPage.value = 1
    void fetchOptions()
}

function onOptionAction(key: string, item: OptionViewModel) {
    if (key === 'detail') {
        void router.push({ name: APP_ROUTES.PRODUCT.OPTION_DETAIL.NAME, params: { id: item.id } })
    }
}

onMounted(async () => {
    await group.execute()
    syncFormFromGroup()
    await fetchOptions()
})
</script>
