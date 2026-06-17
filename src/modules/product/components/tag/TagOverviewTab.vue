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
                                        label="Tên nhãn *"
                                        variant="solo-filled"
                                        flat
                                        :error-messages="props.errors.name ? [props.errors.name] : []"
                                        @update:model-value="emit('update:form', 'name', $event)"
                                    />
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field
                                        :model-value="props.form.colorHex"
                                        label="Màu nền (ColorHex)"
                                        variant="solo-filled"
                                        flat
                                        persistent-hint
                                        clearable
                                        persistent-clear
                                        :rules="[hexRule]"
                                        @update:model-value="emit('update:form', 'colorHex', $event ?? '')"
                                    >
                                        <template #append-inner>
                                            <v-menu
                                                v-model="bgMenuOpen"
                                                :close-on-content-click="false"
                                                location="bottom end"
                                            >
                                                <template #activator="{ props: menuProps }">
                                                    <div
                                                        v-bind="menuProps"
                                                        class="color-swatch"
                                                        :style="props.form.colorHex ? { backgroundColor: props.form.colorHex } : {}"
                                                    />
                                                </template>
                                                <v-color-picker
                                                    v-model="bgPickerModel"
                                                    mode="hexa"
                                                    hide-inputs
                                                    show-swatches
                                                    swatches-max-height="120"
                                                />
                                            </v-menu>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12" md="6">
                                    <v-text-field
                                        :model-value="props.form.textColor"
                                        label="Màu chữ (TextColor)"
                                        variant="solo-filled"
                                        flat
                                        persistent-hint
                                        clearable
                                        persistent-clear
                                        :rules="[hexRule]"
                                        @update:model-value="emit('update:form', 'textColor', $event ?? '')"
                                    >
                                        <template #append-inner>
                                            <v-menu
                                                v-model="textMenuOpen"
                                                :close-on-content-click="false"
                                                location="bottom end"
                                            >
                                                <template #activator="{ props: menuProps }">
                                                    <div
                                                        v-bind="menuProps"
                                                        class="color-swatch"
                                                        :style="props.form.textColor ? { backgroundColor: props.form.textColor } : {}"
                                                    />
                                                </template>
                                                <v-color-picker
                                                    v-model="textPickerModel"
                                                    mode="hexa"
                                                    hide-inputs
                                                    show-swatches
                                                    swatches-max-height="120"
                                                />
                                            </v-menu>
                                        </template>
                                    </v-text-field>
                                </v-col>

                                <v-col cols="12">
                                    <div class="text-caption text-medium-emphasis mb-2 ml-1">Xem trước</div>
                                    <v-chip
                                        :style="{
                                            backgroundColor: props.form.colorHex || undefined,
                                            color: props.form.textColor || undefined,
                                        }"
                                        size="default"
                                    >
                                        {{ props.form.name || 'Tên nhãn' }}
                                    </v-chip>
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
import { ref, computed } from 'vue'
import { AppAuditHistory } from '@/components/ui'
import { formatProductDate } from '../../utils/product.utils'
import type { TagViewModel } from '../../models/view-models/tag.view-model'
import type { TagFormModel } from '../../models/form-models/tag.model'

const props = defineProps<{
    entity: TagViewModel
    form: TagFormModel
    errors: Partial<Record<keyof TagFormModel, string>>
    isDirty: boolean
    submitting: boolean
}>()

const emit = defineEmits<{
    'update:form': [field: keyof TagFormModel, value: unknown]
    save: []
    discard: []
    back: []
}>()

const hexRule = (v: string) =>
    !v || /^#[0-9A-Fa-f]{6}$/.test(v) || 'Phải là mã hex hợp lệ (#RRGGBB)'

const bgMenuOpen = ref(false)
const textMenuOpen = ref(false)

// v-color-picker (mode hexa) trả về dạng "#RRGGBBAA" -> cắt về 6 ký tự để khớp rule + dữ liệu lưu
const bgPickerModel = computed({
    get: () => props.form.colorHex || '#E0E0E0FF',
    set: (val: string) => emit('update:form', 'colorHex', val.slice(0, 7).toUpperCase()),
})

const textPickerModel = computed({
    get: () => props.form.textColor || '#000000FF',
    set: (val: string) => emit('update:form', 'textColor', val.slice(0, 7).toUpperCase()),
})
</script>

<style scoped>
.info-card {
    border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    transition: border-color 0.2s ease;
}
.info-card--dirty {
    border-color: rgb(var(--v-theme-primary));
}

.color-swatch {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    background-image:
        linear-gradient(45deg, rgba(0, 0, 0, 0.06) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(0, 0, 0, 0.06) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.06) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.06) 75%);
    background-size: 8px 8px;
    background-position: 0 0, 0 4px, 4px -4px, -4px 0;
    box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.7),
        0 0 0 2px rgba(0, 0, 0, 0.15);
}
</style>
