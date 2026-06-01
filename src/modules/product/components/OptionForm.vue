<template>
    <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-row>
            <v-col cols="12" md="8">
                <v-text-field
                    v-model="form.name"
                    label="Tên option *"
                    :rules="[rules.required, rules.maxLength(200)]"
                />
            </v-col>
            <v-col cols="12" md="4">
                <v-text-field
                    v-model.number="form.defaultPrice"
                    label="Giá mặc định"
                    type="number"
                    min="0"
                    :rules="[(v: number) => v >= 0 || 'Giá không được âm']"
                />
            </v-col>
            <v-col cols="12">
                <v-textarea
                    v-model="form.description"
                    label="Mô tả"
                    rows="3"
                    :rules="[rules.maxLength(1000)]"
                />
            </v-col>
            <v-col cols="12">
                <v-text-field
                    v-model="form.imageUrl"
                    label="URL hình ảnh"
                    :rules="[rules.maxLength(500)]"
                />
            </v-col>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model.number="form.displayOrder"
                    label="Thứ tự hiển thị"
                    type="number"
                    min="0"
                />
            </v-col>
            <v-col cols="12" md="6" class="d-flex align-center">
                <v-switch v-model="form.isActive" label="Hiển thị" color="primary" />
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
import type { OptionFormModel } from '../models/form-models/option.model'

interface Props {
    modelValue: OptionFormModel
    isSubmitting: boolean
    editId?: number | null
}

const props = withDefaults(defineProps<Props>(), { editId: null })

const emit = defineEmits<{
    'update:modelValue': [value: OptionFormModel]
    submit: [form: OptionFormModel]
    cancel: []
}>()

const form = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const isEditMode = computed(() => props.editId !== null)
const formRef = ref()
const { rules } = useFormValidation()

async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (valid) emit('submit', form.value)
}
</script>
