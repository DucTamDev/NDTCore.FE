<template>
    <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-row>
            <v-col cols="12">
                <v-text-field
                    v-model="form.name"
                    label="Tên nhãn *"
                    :rules="[rules.required, rules.maxLength(100)]"
                    variant="solo-filled"
                    flat
                />
            </v-col>
            <v-col cols="12">
                <v-text-field
                    v-model="form.colorHex"
                    label="Màu nền (Hex)"
                    placeholder="#FF6B35"
                    :rules="[hexRule]"
                    variant="solo-filled"
                    flat
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
                                    class="rounded color-swatch"
                                    :style="{ background: form.colorHex || '#E0E0E0' }"
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
            <v-col cols="12">
                <v-text-field
                    v-model="form.textColor"
                    label="Màu chữ (Hex)"
                    placeholder="#FFFFFF"
                    :rules="[hexRule]"
                    variant="solo-filled"
                    flat
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
                                    class="rounded color-swatch"
                                    :style="{ background: form.textColor || '#000000' }"
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
            <v-col cols="12" md="6">
                <v-number-input
                    v-model.number="form.displayOrder"
                    control-variant="stacked"
                    label="Thứ tự"
                    :min="0"
                    variant="solo-filled"
                    density="comfortable"
                    flat
                />
            </v-col>
            <v-col cols="12" md="6" class="d-flex align-center">
                <v-switch v-model="form.isActive" label="Hiển thị" color="primary" base-color="grey" hide-details />
            </v-col>
            <v-col cols="12">
                <div class="d-flex align-center ga-3 mt-1">
                    <span class="text-body-2 text-medium-emphasis">Preview:</span>
                    <v-chip
                        :style="{
                            backgroundColor: form.colorHex || '#E0E0E0',
                            color: form.textColor || '#000000',
                        }"
                        size="small"
                    >
                        {{ form.name || 'Tên nhãn' }}
                    </v-chip>
                </div>
            </v-col>
        </v-row>

        <div class="d-flex justify-end gap-2 pt-4">
            <v-btn variant="text" @click="emit('cancel')">Hủy</v-btn>
            <v-btn type="submit" color="primary">
                {{ isEditMode ? 'Cập nhật' : 'Tạo mới' }}
            </v-btn>
        </div>
    </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'
import type { TagFormModel } from '../../models/form-models/tag.model'

interface Props {
    modelValue: TagFormModel
    isSubmitting: boolean
    editId?: number | null
}

const props = withDefaults(defineProps<Props>(), { editId: null })

const emit = defineEmits<{
    'update:modelValue': [value: TagFormModel]
    submit: [form: TagFormModel]
    cancel: []
}>()

const form = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const isEditMode = computed(() => props.editId !== null)
const formRef = ref()
const { rules } = useFormValidation()

const hexRule = (v: string) =>
    !v || /^#[0-9A-Fa-f]{6}$/.test(v) || 'Phải là mã hex hợp lệ (#RRGGBB)'

const bgMenuOpen = ref(false)
const textMenuOpen = ref(false)

// v-color-picker (mode hexa) trả về dạng "#RRGGBBAA" -> cắt về 6 ký tự để khớp rule + dữ liệu lưu
const bgPickerModel = computed({
    get: () => form.value.colorHex || '#E0E0E0FF',
    set: (val: string) => {
        form.value = { ...form.value, colorHex: val.slice(0, 7).toUpperCase() }
    },
})

const textPickerModel = computed({
    get: () => form.value.textColor || '#000000FF',
    set: (val: string) => {
        form.value = { ...form.value, textColor: val.slice(0, 7).toUpperCase() }
    },
})

async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (valid) emit('submit', form.value)
}
</script>

<style scoped>
.color-swatch {
    width: 32px;
    height: 32px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    cursor: pointer;
}
</style>