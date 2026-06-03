<template>
    <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-row>
            <v-col cols="12" md="8">
                <v-text-field
                    v-model="form.name"
                    label="Tên danh mục *"
                    :rules="[rules.required, rules.maxLength(200)]"
                    @input="autoSlug"
                />
            </v-col>
            <v-col cols="12" md="4">
                <v-text-field
                    v-model="form.slug"
                    label="Slug"
                    :rules="[slugRule]"
                    hint="viết thường, dấu gạch ngang"
                    persistent-hint
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
            <v-col cols="12" md="6">
                <v-select
                    v-model="form.parentId"
                    :items="parentOptions.filter((p) => p.id !== editId)"
                    item-title="name"
                    item-value="id"
                    label="Danh mục cha"
                    clearable
                />
            </v-col>
            <v-col cols="12" md="3">
                <v-text-field
                    v-model.number="form.displayOrder"
                    label="Thứ tự hiển thị"
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
import type { CategoryFormModel } from '../models/form-models/category.model'
import type { CategoryViewModel } from '../models/view-models/category.view-model'

interface Props {
    modelValue: CategoryFormModel
    isSubmitting: boolean
    parentOptions: Pick<CategoryViewModel, 'id' | 'name'>[]
    editId?: number | null
}

const props = withDefaults(defineProps<Props>(), { editId: null })

const emit = defineEmits<{
    'update:modelValue': [value: CategoryFormModel]
    submit: [form: CategoryFormModel]
    cancel: []
}>()

const form = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
})

const isEditMode = computed(() => props.editId !== null)
const formRef = ref()
const { rules } = useFormValidation()

const slugRule = (v: string) =>
    !v || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(v) || 'Slug chỉ gồm chữ thường, số và dấu gạch ngang'

function autoSlug() {
    if (!isEditMode.value) {
        form.value = {
            ...form.value,
            slug: form.value.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[̀-ͯ]/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, ''),
        }
    }
}

async function onSubmit() {
    const { valid } = await formRef.value?.validate()
    if (valid) emit('submit', form.value)
}
</script>
