<template>
    <v-form ref="formRef" @submit.prevent="onSubmit">
        <v-row>
            <!-- Section 1: Tên -->
            <v-col cols="12">
                <v-text-field
                    v-model="form.name"
                    label="Tên sản phẩm *"
                    :rules="[rules.required, rules.maxLength(300)]"
                    variant="solo-filled"
                    flat
                    @input="autoSlug"
                />
            </v-col>
            <v-col cols="12"><v-divider class="my-4" /></v-col>

            <!-- Section 2: Định danh -->
            <v-col cols="6">
                <v-text-field
                    v-model="form.sku"
                    label="SKU *"
                    :rules="[rules.required, rules.maxLength(100)]"
                    :readonly="isEditMode"
                    :hint="isEditMode ? 'SKU không thể thay đổi sau khi tạo' : ''"
                    persistent-hint
                    variant="solo-filled"
                    flat
                />
            </v-col>
            <v-col cols="6">
                <v-select
                    v-model="form.categoryId"
                    :items="categoryOptions"
                    item-title="name"
                    item-value="id"
                    label="Danh mục"
                    clearable
                    variant="solo-filled"
                    flat
                />
            </v-col>
            <v-col cols="6">
                <v-text-field
                    v-model="form.slug"
                    label="Slug"
                    :rules="[slugRule]"
                    hint="viết thường, dấu gạch ngang"
                    persistent-hint
                    variant="solo-filled"
                    flat
                />
            </v-col>
            <v-col cols="6">
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
            <v-col cols="12"><v-divider class="my-4" /></v-col>

            <!-- Section 3: Giá -->
            <v-col cols="6">
                <AppCurrencyField
                    v-model="form.regularPrice"
                    label="Giá bán *"
                    :required="true"
                    variant="solo-filled"
                    flat
                />
            </v-col>
            <v-col cols="6">
                <AppCurrencyField
                    v-model="form.costPrice"
                    label="Giá vốn"
                    :nullable="true"
                    variant="solo-filled"
                    flat
                />
            </v-col>
            <v-col cols="12"><v-divider class="my-4" /></v-col>

            <!-- Section 4: Trạng thái -->
            <v-col cols="12">
                <v-switch
                    v-model="form.isActive"
                    label="Hiển thị"
                    color="primary"
                    base-color="grey"
                    hide-details
                />
            </v-col>
            <v-col cols="12"><v-divider class="my-4" /></v-col>

            <!-- Section 5: Mô tả -->
            <v-col cols="12">
                <v-textarea
                    v-model="form.shortDescription"
                    label="Mô tả ngắn"
                    rows="2"
                    no-resize
                    :rules="[rules.maxLength(500)]"
                    variant="solo-filled"
                    flat
                />
            </v-col>
            <v-col cols="12">
                <v-textarea
                    v-model="form.description"
                    label="Mô tả chi tiết"
                    rows="3"
                    no-resize
                    :rules="[rules.maxLength(2000)]"
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
import { AppCurrencyField } from '@/components/ui'
import type { ProductFormModel } from '../../models/form-models/product.model'

interface CategoryOption {
    id: number
    name: string
}

interface Props {
    modelValue: ProductFormModel
    isSubmitting: boolean
    categoryOptions: CategoryOption[]
    editId?: number | null
}

const props = withDefaults(defineProps<Props>(), { editId: null })

const emit = defineEmits<{
    'update:modelValue': [value: ProductFormModel]
    submit: [form: ProductFormModel]
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

