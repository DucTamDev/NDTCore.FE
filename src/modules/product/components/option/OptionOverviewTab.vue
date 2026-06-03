<template>
    <div>
        <!-- Toolbar -->
        <div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
            <v-btn
                variant="text"
                rounded="lg"
                size="small"
                prepend-icon="mdi-arrow-left"
                @click="emit('back')"
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
                        @click="emit('discard')"
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

        <div class="pa-4">
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
                                    <v-icon icon="mdi-information-outline" size="16" color="primary" />
                                </v-sheet>
                            </template>
                            <v-list-item-title class="font-weight-semibold">Thông tin cơ bản</v-list-item-title>
                        </v-list-item>
                        <v-divider />
                        <div class="pa-4 d-flex flex-column ga-4">
                            <v-text-field
                                :model-value="props.form.name"
                                label="Tên option *"
                                :error-messages="props.errors.name ? [props.errors.name] : []"
                                density="comfortable"
                                variant="outlined"
                                color="primary"
                                @update:model-value="emit('update:form', 'name', $event)"
                            />
                            <v-autocomplete
                                :model-value="props.form.groupId"
                                :items="props.groupOptions"
                                item-value="id"
                                item-title="name"
                                label="Nhóm"
                                density="comfortable"
                                variant="outlined"
                                color="primary"
                                readonly
                            />
                            <v-text-field
                                :model-value="props.form.defaultPrice"
                                label="Giá mặc định"
                                type="number"
                                prepend-inner-icon="mdi-currency-usd"
                                density="comfortable"
                                variant="outlined"
                                color="primary"
                                @update:model-value="(v) => { const n = Number(v); if (!isNaN(n)) emit('update:form', 'defaultPrice', n) }"
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
                                type="number"
                                density="comfortable"
                                variant="outlined"
                                color="primary"
                                @update:model-value="(v) => { const n = Number(v); if (!isNaN(n)) emit('update:form', 'displayOrder', n) }"
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
                    <AppAuditHistory
                        :created-at="props.entity.createdAt"
                        :created-by="props.entity.createdBy"
                        :updated-at="props.entity.updatedAt"
                        :updated-by="props.entity.updatedBy"
                        :format-date="formatProductDate"
                    />
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script setup lang="ts">
import { AppAuditHistory } from '@/components/ui'
import { formatProductDate } from '../../utils/product.utils'
import type { OptionViewModel } from '../../models/view-models/option.view-model'
import type { OptionFormModel } from '../../models/form-models/option.model'

const props = defineProps<{
    entity: OptionViewModel
    form: OptionFormModel
    errors: Partial<Record<keyof OptionFormModel, string>>
    isDirty: boolean
    submitting: boolean
    groupOptions: { id: number; name: string }[]
}>()

const emit = defineEmits<{
    'update:form': [field: keyof OptionFormModel, value: unknown]
    save: []
    discard: []
    back: []
}>()
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
