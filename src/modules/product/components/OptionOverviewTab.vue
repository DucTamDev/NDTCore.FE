<template>
    <div>
        <!-- Toolbar -->
        <div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
            <v-btn
                variant="text"
                rounded="lg"
                size="small"
                prepend-icon="mdi-arrow-left"
                @click="handleBack"
            >
                Quay lại
            </v-btn>
            <div class="d-flex align-center ga-2">
                <v-slide-x-reverse-transition>
                    <v-btn
                        v-if="props.isDirty"
                        variant="text"
                        rounded="lg"
                        size="small"
                        :disabled="props.submitting"
                        @click="handleDiscard"
                    >
                        Hủy thay đổi
                    </v-btn>
                </v-slide-x-reverse-transition>
                <v-btn
                    color="primary"
                    variant="flat"
                    rounded="lg"
                    size="small"
                    prepend-icon="mdi-content-save-outline"
                    :loading="props.submitting"
                    :disabled="!props.isDirty"
                    @click="emit('save')"
                >
                    Lưu thay đổi
                </v-btn>
            </div>
        </div>

        <v-divider />

        <div class="pa-4 d-flex flex-column ga-4">
            <!-- Thông tin cơ bản -->
            <v-card
                rounded="lg"
                variant="outlined"
                class="info-card"
                :class="{ 'info-card--dirty': props.isDirty }"
            >
                <v-list-item class="bg-surface-variant py-3">
                    <template #prepend>
                        <v-sheet
                            rounded="md"
                            width="32"
                            height="32"
                            class="d-flex align-center justify-center mr-1"
                        >
                            <v-icon icon="mdi-information-outline" size="16" color="primary" />
                        </v-sheet>
                    </template>
                    <v-list-item-title class="font-weight-semibold">Thông tin cơ bản</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-card-text class="pa-4">
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-text-field
                                :model-value="props.form.name"
                                label="Tên option"
                                :error-messages="props.errors.name"
                                density="compact"
                                variant="outlined"
                                required
                                @update:model-value="(v) => emit('update:form', 'name', v)"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-autocomplete
                                :model-value="props.form.groupId"
                                :items="props.groupOptions"
                                item-value="id"
                                item-title="name"
                                label="Nhóm"
                                density="compact"
                                variant="outlined"
                                readonly
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                :model-value="props.form.defaultPrice"
                                label="Giá mặc định"
                                type="number"
                                prepend-inner-icon="mdi-currency-usd"
                                density="compact"
                                variant="outlined"
                                @update:model-value="(v) => { const n = Number(v); if (!isNaN(n)) emit('update:form', 'defaultPrice', n) }"
                            />
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <!-- Cài đặt -->
            <v-card
                rounded="lg"
                variant="outlined"
                class="info-card"
                :class="{ 'info-card--dirty': props.isDirty }"
            >
                <v-list-item class="bg-surface-variant py-3">
                    <template #prepend>
                        <v-sheet
                            rounded="md"
                            width="32"
                            height="32"
                            class="d-flex align-center justify-center mr-1"
                        >
                            <v-icon icon="mdi-cog-outline" size="16" color="primary" />
                        </v-sheet>
                    </template>
                    <v-list-item-title class="font-weight-semibold">Cài đặt</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-card-text class="pa-4">
                    <v-row dense>
                        <v-col cols="12" md="6">
                            <v-text-field
                                :model-value="props.form.displayOrder"
                                label="Thứ tự hiển thị"
                                type="number"
                                density="compact"
                                variant="outlined"
                                @update:model-value="(v) => { const n = Number(v); if (!isNaN(n)) emit('update:form', 'displayOrder', n) }"
                            />
                        </v-col>
                        <v-col cols="12" md="6" class="d-flex align-center">
                            <div class="d-flex flex-column ga-1">
                                <span class="text-body-2 text-medium-emphasis">Trạng thái</span>
                                <v-btn-toggle
                                    :model-value="props.form.isActive"
                                    mandatory
                                    density="compact"
                                    variant="outlined"
                                    color="primary"
                                    @update:model-value="(v) => emit('update:form', 'isActive', v)"
                                >
                                    <v-btn :value="true" size="small">Hoạt động</v-btn>
                                    <v-btn :value="false" size="small">Ẩn</v-btn>
                                </v-btn-toggle>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>

            <!-- Lịch sử -->
            <v-card rounded="lg" variant="outlined">
                <v-list-item class="bg-surface-variant py-3">
                    <template #prepend>
                        <v-sheet
                            rounded="md"
                            width="32"
                            height="32"
                            class="d-flex align-center justify-center mr-1"
                        >
                            <v-icon icon="mdi-history" size="16" color="primary" />
                        </v-sheet>
                    </template>
                    <v-list-item-title class="font-weight-semibold">Lịch sử</v-list-item-title>
                </v-list-item>
                <v-divider />
                <v-row no-gutters>
                    <v-col cols="12" sm="6">
                        <v-list lines="two" density="comfortable">
                            <v-list-item min-height="60">
                                <template #prepend>
                                    <v-icon icon="mdi-clock-plus-outline" size="18" class="mr-1 opacity-40" />
                                </template>
                                <v-list-item-title class="mb-1">Tạo lúc</v-list-item-title>
                                <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                                    {{ formatProductDate(props.option.createdAt) }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-divider vertical />
                    <v-col cols="12" sm="6">
                        <v-list lines="two" density="comfortable">
                            <v-list-item min-height="60">
                                <template #prepend>
                                    <v-icon icon="mdi-account-plus-outline" size="18" class="mr-1 opacity-40" />
                                </template>
                                <v-list-item-title class="mb-1">Tạo bởi</v-list-item-title>
                                <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                                    {{ props.option.createdBy ?? '---' }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-divider />
                    <v-col cols="12" sm="6">
                        <v-list lines="two" density="comfortable">
                            <v-list-item min-height="60">
                                <template #prepend>
                                    <v-icon icon="mdi-clock-edit-outline" size="18" class="mr-1 opacity-40" />
                                </template>
                                <v-list-item-title class="mb-1">Cập nhật lúc</v-list-item-title>
                                <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                                    {{ formatProductDate(props.option.updatedAt) }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-divider vertical />
                    <v-col cols="12" sm="6">
                        <v-list lines="two" density="comfortable">
                            <v-list-item min-height="60">
                                <template #prepend>
                                    <v-icon icon="mdi-account-edit-outline" size="18" class="mr-1 opacity-40" />
                                </template>
                                <v-list-item-title class="mb-1">Cập nhật bởi</v-list-item-title>
                                <v-list-item-subtitle class="font-weight-medium text-high-emphasis">
                                    {{ props.option.updatedBy ?? '---' }}
                                </v-list-item-subtitle>
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-card>
        </div>

        <!-- Confirm discard dialog -->
        <AppDialog
            v-model="isConfirmOpen"
            title="Bỏ thay đổi?"
            size="sm"
            confirm-label="Bỏ thay đổi"
            cancel-label="Ở lại"
            @confirm="onConfirm"
            @cancel="onCancel"
        >
            Bạn có thay đổi chưa được lưu. Nếu tiếp tục, các thay đổi sẽ bị mất.
        </AppDialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppDialog } from '@/components/ui'
import { APP_ROUTES } from '@/core/constants/_index'
import { formatProductDate } from '../utils/product.utils'
import type { OptionViewModel } from '../models/view-models/option.view-model'
import type { OptionFormModel } from '../models/form-models/option.model'

// props

interface Props {
    option: OptionViewModel
    form: OptionFormModel
    errors: Partial<Record<keyof OptionFormModel, string>>
    isDirty: boolean
    submitting: boolean
    groupOptions: { id: number; name: string }[]
}

const props = defineProps<Props>()

// emits

const emit = defineEmits<{
    'update:form': [field: keyof OptionFormModel, value: unknown]
    save: []
    discard: []
}>()

// composables

const router = useRouter()

// refs

const isConfirmOpen = ref(false)
const pendingNavigation = ref(false)

// methods

function handleBack() {
    if (props.isDirty) {
        pendingNavigation.value = true
        isConfirmOpen.value = true
    } else {
        void router.push({ name: APP_ROUTES.PRODUCT.OPTIONS.NAME })
    }
}

function handleDiscard() {
    if (props.isDirty) {
        isConfirmOpen.value = true
    }
}

function onConfirm() {
    isConfirmOpen.value = false
    if (pendingNavigation.value) {
        pendingNavigation.value = false
        void router.push({ name: APP_ROUTES.PRODUCT.OPTIONS.NAME })
    } else {
        emit('discard')
    }
}

function onCancel() {
    isConfirmOpen.value = false
    pendingNavigation.value = false
}
</script>

<style scoped>
.info-card {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    transition: border-color 0.2s ease;
}
.info-card--dirty {
    border-color: rgb(var(--v-theme-primary));
}
</style>
