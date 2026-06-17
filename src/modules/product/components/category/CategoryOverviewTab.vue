<template>
    <div>
        <!-- Toolbar -->
        <div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
            <v-btn
                variant="text"
                rounded="lg"
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

        <div class="pa-5">
            <v-row>
                <!-- Thông tin cơ bản -->
                <v-col cols="12">
                    <v-card
                        elevation="0"
                        rounded="lg"
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

                        <div class="pa-4">
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field
                                        :model-value="props.form.name"
                                        label="Tên danh mục *"
                                        variant="solo-filled"
                                        flat
                                        :error-messages="props.errors.name ? [props.errors.name] : []"
                                        @update:model-value="emit('update:form', 'name', $event)"
                                    />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field
                                        :model-value="props.form.slug"
                                        label="Slug"
                                        variant="solo-filled"
                                        flat
                                        clearable
                                        @update:model-value="emit('update:form', 'slug', $event ?? '')"
                                    />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-autocomplete
                                        :model-value="props.form.parentId"
                                        :items="filteredParentOptions"
                                        item-value="id"
                                        item-title="name"
                                        label="Danh mục cha"
                                        variant="solo-filled"
                                        flat
                                        clearable
                                        @update:model-value="emit('update:form', 'parentId', $event ?? null)"
                                    />
                                </v-col>

                            </v-row>
                        </div>
                    </v-card>
                </v-col>

                <!-- Cài đặt -->
                <v-col cols="12">
                    <v-card
                        elevation="0"
                        rounded="lg"
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

                        <div class="pa-4">
                            <v-row>
                                <v-col cols="12" md="6" class="d-flex align-center">
                                    <v-switch
                                        :model-value="props.form.isActive"
                                        label="Hiển thị"
                                        color="primary"
                                        base-color="grey"
                                        hide-details
                                        inset
                                        @update:model-value="emit('update:form', 'isActive', $event)"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-number-input
                                        :model-value="props.form.displayOrder"
                                        control-variant="stacked"
                                        label="Thứ tự hiển thị"
                                        :min="0"
                                        variant="solo-filled"
                                        flat
                                        density="comfortable"
                                        hide-details="auto"
                                        @update:model-value="(v) => emit('update:form', 'displayOrder', v ?? 0)"
                                    />
                                </v-col>
                            </v-row>
                        </div>
                    </v-card>
                </v-col>

                <!-- Mô tả -->
                <v-col cols="12">
                    <v-card
                        elevation="0"
                        rounded="lg"
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
                                    <v-icon icon="mdi-text-long" size="16" color="primary" />
                                </v-sheet>
                            </template>
                            <v-list-item-title class="font-weight-semibold">Mô tả</v-list-item-title>
                        </v-list-item>

                        <v-divider />

                        <div class="pa-4">
                            <v-textarea
                                :model-value="props.form.description"
                                label="Mô tả"
                                variant="solo-filled"
                                flat
                                :rows="3"
                                no-resize
                                clearable
                                @update:model-value="emit('update:form', 'description', $event ?? '')"
                            />
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
import { computed } from 'vue'
import { AppAuditHistory } from '@/components/ui'
import { formatProductDate } from '../../utils/product.utils'
import type { CategoryViewModel } from '../../models/view-models/category.view-model'
import type { CategoryFormModel } from '../../models/form-models/category.model'

const props = defineProps<{
    entity: CategoryViewModel
    form: CategoryFormModel
    errors: Partial<Record<keyof CategoryFormModel, string>>
    isDirty: boolean
    submitting: boolean
    parentOptions: { id: number; name: string }[]
}>()

const emit = defineEmits<{
    'update:form': [field: keyof CategoryFormModel, value: unknown]
    save: []
    discard: []
    back: []
}>()

const filteredParentOptions = computed(() =>
    props.parentOptions.filter((opt) => opt.id !== props.entity.id),
)
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
