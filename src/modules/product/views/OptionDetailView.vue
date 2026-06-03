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
                            <div class="text-h6 font-weight-bold text-high-emphasis">{{ option.data.value.name }}</div>
                            <div class="text-body-2 text-medium-emphasis">
                                Giá: {{ option.data.value.defaultPrice?.toLocaleString() ?? '0' }} ₫
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
                            :entity="option.data.value"
                            :form="editForm"
                            :errors="formErrors"
                            :is-dirty="isDirty"
                            :submitting="submitting"
                            :group-options="groupOptions"
                            @update:form="onFormUpdate"
                            @save="saveChanges"
                            @discard="onDiscard"
                            @back="onBack"
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

        <!-- Confirm bỏ thay đổi -->
        <AppConfirmDialog
            v-model="confirmOpen"
            title="Bỏ thay đổi?"
            message="Bạn có thay đổi chưa được lưu. Nếu tiếp tục, các thay đổi sẽ bị mất."
            confirm-label="Bỏ thay đổi"
            @confirm="onConfirmUnsaved"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, toRaw } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { AppBreadcrumb, AppEmptyState, AppConfirmDialog } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { optionService } from '../services/option.service'
import { useOption } from '../composables/useOption'
import { useOptionGroupStore } from '../stores/option-group.store'
import { toForm, toPayload, emptyForm } from '../adapters/option.adapter'
import OptionOverviewTab from '../components/option/OptionOverviewTab.vue'
import OptionStoreOverridesTab from '../components/option/OptionStoreOverridesTab.vue'
import type { OptionFormModel } from '../models/form-models/option.model'

const route = useRoute()
const router = useRouter()
const { updateOption } = useOption()
const groupStore = useOptionGroupStore()

const optionId = Number(route.params['id'])
const activeTab = ref('overview')
const submitting = ref(false)
const editForm = reactive<OptionFormModel>(emptyForm())
const snapshot = ref<OptionFormModel | null>(null)
const formErrors = reactive<Partial<Record<keyof OptionFormModel, string>>>({})
const confirmOpen = ref(false)
const pendingNavAction = ref<'back' | 'discard' | null>(null)

if (isNaN(optionId)) void router.replace({ name: APP_ROUTES.PRODUCT.OPTIONS.NAME })

const option = useAsyncState(() => optionService.getByIdAsync(optionId))

const groupOptions = computed(() =>
    groupStore.items.map((g) => ({ id: g.id, name: g.name })),
)

const TRACKED_FIELDS: ReadonlyArray<keyof OptionFormModel> = [
    'name', 'defaultPrice', 'displayOrder', 'isActive',
] as const

const isDirty = computed(() => {
    if (!snapshot.value) return false
    return TRACKED_FIELDS.some(f => editForm[f] !== snapshot.value![f])
})

function syncFormFromEntity() {
    if (!option.data.value) return
    Object.assign(editForm, toForm(option.data.value))
    snapshot.value = structuredClone(toRaw(editForm))
}

function onFormUpdate(field: keyof OptionFormModel, value: unknown) {
    ;(editForm as Record<string, unknown>)[field] = value
    if (field === 'name' && typeof value === 'string' && value.trim())
        delete formErrors.name
}

function discardChanges() {
    syncFormFromEntity()
    delete formErrors.name
}

function onBack() {
    if (isDirty.value) { pendingNavAction.value = 'back'; confirmOpen.value = true }
    else void router.push({ name: APP_ROUTES.PRODUCT.OPTIONS.NAME })
}

function onDiscard() {
    if (isDirty.value) { pendingNavAction.value = 'discard'; confirmOpen.value = true }
    else discardChanges()
}

function onConfirmUnsaved() {
    confirmOpen.value = false
    if (pendingNavAction.value === 'back') void router.push({ name: APP_ROUTES.PRODUCT.OPTIONS.NAME })
    else if (pendingNavAction.value === 'discard') discardChanges()
    pendingNavAction.value = null
}

async function saveChanges() {
    if (!editForm.name?.trim()) {
        formErrors.name = 'Tên option là bắt buộc'
        return
    }
    delete formErrors.name
    submitting.value = true
    try {
        const ok = await updateOption(optionId, toPayload(editForm))
        if (ok) {
            await option.execute()
            syncFormFromEntity()
        }
    } finally {
        submitting.value = false
    }
}

onMounted(async () => {
    if (isNaN(optionId)) return
    await option.execute()
    syncFormFromEntity()
    await groupStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
})
</script>
