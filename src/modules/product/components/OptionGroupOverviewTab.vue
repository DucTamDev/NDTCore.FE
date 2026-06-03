<template>
    <div>
        <!-- Tab toolbar -->
        <div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
            <!-- Quay lại -->
            <v-btn
                variant="text"
                rounded="lg"
                size="small"
                prepend-icon="mdi-arrow-left"
                @click="handleBack"
            >
                Quay lại
            </v-btn>

            <!-- Save / Discard -->
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

        <!-- Content -->
        <div class="pa-5">
            <v-row>
                <!-- Thông tin cơ bản -->
                <v-col cols="12" md="6">
                    <v-card
                        elevation="0"
                        rounded="lg"
                        height="100%"
                        :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
                    >
                        <v-list-item class="bg-surface-variant py-3">
                            <template #prepend>
                                <v-sheet
                                    rounded="md"
                                    width="32"
                                    height="32"
                                    class="d-flex align-center justify-center mr-1"
                                >
                                    <v-icon icon="mdi-card-account-details-outline" size="16" color="primary" />
                                </v-sheet>
                            </template>
                            <v-list-item-title class="font-weight-semibold">Thông tin cơ bản</v-list-item-title>
                        </v-list-item>

                        <v-divider />

                        <div class="pa-4 d-flex flex-column ga-4">
                            <v-text-field
                                :model-value="props.form.name"
                                label="Tên nhóm *"
                                variant="outlined"
                                color="primary"
                                density="comfortable"
                                prepend-inner-icon="mdi-tune-variant"
                                :error-messages="props.errors.name ? [props.errors.name] : []"
                                @update:model-value="emit('update:form', 'name', $event)"
                            />

                            <div>
                                <div class="text-caption text-medium-emphasis mb-2 ml-1">Loại UI</div>
                                <v-btn-toggle
                                    :model-value="props.form.uiType"
                                    density="comfortable"
                                    rounded="lg"
                                    mandatory
                                    class="w-100"
                                    @update:model-value="emit('update:form', 'uiType', $event)"
                                >
                                    <v-btn
                                        value="SingleSelect"
                                        :color="props.form.uiType === 'SingleSelect' ? 'primary' : undefined"
                                        variant="outlined"
                                        class="text-none flex-1-1"
                                        prepend-icon="mdi-radiobox-marked"
                                    >
                                        Chọn một
                                    </v-btn>
                                    <v-btn
                                        value="MultiSelect"
                                        :color="props.form.uiType === 'MultiSelect' ? 'primary' : undefined"
                                        variant="outlined"
                                        class="text-none flex-1-1"
                                        prepend-icon="mdi-checkbox-marked-outline"
                                    >
                                        Chọn nhiều
                                    </v-btn>
                                </v-btn-toggle>
                            </div>

                            <v-textarea
                                :model-value="props.form.description"
                                label="Mô tả"
                                variant="outlined"
                                color="primary"
                                density="comfortable"
                                prepend-inner-icon="mdi-text"
                                :rows="3"
                                clearable
                                @update:model-value="emit('update:form', 'description', $event ?? '')"
                            />
                        </div>
                    </v-card>
                </v-col>

                <!-- Cài đặt -->
                <v-col cols="12" md="6">
                    <v-card
                        elevation="0"
                        rounded="lg"
                        height="100%"
                        :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
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

                        <div class="pa-4 d-flex flex-column ga-4">
                            <v-text-field
                                :model-value="props.form.displayOrder"
                                label="Thứ tự hiển thị"
                                variant="outlined"
                                color="primary"
                                density="comfortable"
                                prepend-inner-icon="mdi-sort-numeric-ascending"
                                type="number"
                                @update:model-value="emit('update:form', 'displayOrder', Number($event))"
                            />

                            <div>
                                <div class="text-caption text-medium-emphasis mb-2 ml-1">Trạng thái</div>
                                <v-btn-toggle
                                    :model-value="props.form.isActive ? 'active' : 'inactive'"
                                    density="comfortable"
                                    rounded="lg"
                                    mandatory
                                    class="w-100"
                                    @update:model-value="emit('update:form', 'isActive', $event === 'active')"
                                >
                                    <v-btn
                                        value="active"
                                        :color="props.form.isActive ? 'primary' : undefined"
                                        variant="outlined"
                                        class="text-none flex-1-1"
                                        prepend-icon="mdi-check-circle-outline"
                                    >
                                        Hoạt động
                                    </v-btn>
                                    <v-btn
                                        value="inactive"
                                        :color="!props.form.isActive ? 'error' : undefined"
                                        variant="outlined"
                                        class="text-none flex-1-1"
                                        prepend-icon="mdi-close-circle-outline"
                                    >
                                        Ẩn
                                    </v-btn>
                                </v-btn-toggle>
                            </div>
                        </div>
                    </v-card>
                </v-col>

                <!-- Lịch sử -->
                <v-col cols="12">
                    <v-card elevation="0" rounded="lg" class="info-card">
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
                                            {{ formatProductDate(props.group.createdAt) }}
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
                                            {{ props.group.createdBy || '---' }}
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
                                            {{ formatProductDate(props.group.updatedAt) }}
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
                                            {{ props.group.updatedBy || '---' }}
                                        </v-list-item-subtitle>
                                    </v-list-item>
                                </v-list>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
        </div>

        <!-- Confirm dialog for Back and Discard -->
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
import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'
import type { OptionGroupFormModel } from '../models/form-models/option-group.model'
import { formatProductDate } from '../utils/product.utils'

const props = defineProps<{
    group: OptionGroupViewModel
    form: OptionGroupFormModel
    errors: Partial<Record<keyof OptionGroupFormModel, string>>
    isDirty: boolean
    submitting: boolean
}>()

const emit = defineEmits<{
    'update:form': [field: keyof OptionGroupFormModel, value: unknown]
    save: []
    discard: []
}>()

const router = useRouter()

// Confirm dialog (shared for Back and Discard)
type PendingAction = 'back' | 'discard'

const isConfirmOpen = ref(false)
const pendingAction = ref<PendingAction | null>(null)

function openConfirm(action: PendingAction) {
    pendingAction.value = action
    isConfirmOpen.value = true
}

function onConfirm() {
    isConfirmOpen.value = false
    if (pendingAction.value === 'back') {
        void router.push({ name: APP_ROUTES.PRODUCT.OPTION_GROUPS.NAME })
    } else if (pendingAction.value === 'discard') {
        emit('discard')
    }
    pendingAction.value = null
}

function onCancel() {
    isConfirmOpen.value = false
    pendingAction.value = null
}

function handleBack() {
    if (props.isDirty) {
        openConfirm('back')
    } else {
        void router.push({ name: APP_ROUTES.PRODUCT.OPTION_GROUPS.NAME })
    }
}

function handleDiscard() {
    openConfirm('discard')
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
