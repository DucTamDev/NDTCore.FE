<template>
    <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-row>
            <v-col cols="12">
                <v-text-field
                    v-model="form.name"
                    label="Tên nhóm option *"
                    :rules="[rules.required, rules.maxLength(200)]"
                    variant="solo-filled"
                    flat
                />
            </v-col>
            <v-col cols="12" md="6">
                <v-select
                    v-model="form.uiType"
                    :items="uiTypeOptions"
                    item-title="label"
                    item-value="value"
                    label="Kiểu lựa chọn *"
                    :rules="[rules.required]"
                    variant="solo-filled"
                    flat
                />
            </v-col>
            <v-col cols="12" md="6">
                <v-number-input
                    v-model.number="form.displayOrder"
                    control-variant="stacked"
                    label="Thứ tự hiển thị"
                    :min="0"
                    variant="solo-filled"
                    density="comfortable"
                    flat
                />
            </v-col>
            <v-col cols="12" class="d-flex align-center">
                <v-switch v-model="form.isActive" label="Hiển thị" color="primary" base-color="grey" hide-details />
            </v-col>
            <v-col cols="12">
                <v-textarea
                    v-model="form.description"
                    label="Mô tả"
                    rows="3"
                    no-resize
                    :rules="[rules.maxLength(1000)]"
                    variant="solo-filled"
                    flat
                />
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
import type { OptionGroupFormModel } from '../../models/form-models/option-group.model'

interface Props {
    modelValue: OptionGroupFormModel
    isSubmitting: boolean
    editId?: number | null
}

const props = withDefaults(defineProps<Props>(), { editId: null })

const emit = defineEmits<{
    'update:modelValue': [value: OptionGroupFormModel]
    submit: [form: OptionGroupFormModel]
    cancel: []
}>()

const form = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const isEditMode = computed(() => props.editId !== null)
const formRef = ref()
const { rules } = useFormValidation()

const uiTypeOptions = [
    { label: 'Chọn một', value: 'SingleSelect' },
    { label: 'Chọn nhiều', value: 'MultiSelect' },
]

async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (valid) emit('submit', form.value)
}
</script>
