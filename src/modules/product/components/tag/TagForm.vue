<template>
    <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="form.name"
                    label="Tên nhãn *"
                    :rules="[rules.required, rules.maxLength(100)]"
                />
            </v-col>
            <v-col cols="12" md="3">
                <v-text-field
                    v-model="form.colorHex"
                    label="Màu nền (Hex)"
                    placeholder="#FF6B35"
                    :rules="[hexRule]"
                >
                    <template #append-inner>
                        <div
                            v-if="form.colorHex"
                            class="rounded"
                            :style="{ background: form.colorHex, width: '20px', height: '20px', border: '1px solid rgba(0,0,0,0.2)' }"
                        />
                    </template>
                </v-text-field>
            </v-col>
            <v-col cols="12" md="3">
                <v-text-field
                    v-model="form.textColor"
                    label="Màu chữ (Hex)"
                    placeholder="#FFFFFF"
                    :rules="[hexRule]"
                >
                    <template #append-inner>
                        <div
                            v-if="form.textColor"
                            class="rounded"
                            :style="{ background: form.textColor, width: '20px', height: '20px', border: '1px solid rgba(0,0,0,0.2)' }"
                        />
                    </template>
                </v-text-field>
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
            <v-col cols="12" md="3">
                <v-text-field
                    v-model.number="form.displayOrder"
                    label="Thứ tự"
                    type="number"
                    min="0"
                />
            </v-col>
            <v-col cols="12" md="3" class="d-flex align-center">
                <v-switch v-model="form.isActive" label="Hiển thị" color="primary" base-color="grey" />
            </v-col>
        </v-row>

        <div class="d-flex justify-end gap-2 pt-4">
            <v-btn variant="text" @click="emit('cancel')">Hủy</v-btn>
            <v-btn type="submit" color="primary" :loading="isSubmitting">
                {{ isEditMode ? 'Cập nhật' : 'Tạo mới' }}
            </v-btn>
        </div>
    </v-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useFormValidation } from '@/composables/useFormValidation'
import type { TagFormModel } from '../models/form-models/tag.model'

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

async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (valid) emit('submit', form.value)
}
</script>
