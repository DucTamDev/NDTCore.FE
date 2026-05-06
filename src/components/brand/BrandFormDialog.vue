<template>
    <v-dialog
        :model-value="modelValue"
        max-width="720"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <v-card rounded="lg">
            <v-card-title class="d-flex align-center justify-space-between">
                <span class="text-h6">{{ title }}</span>
                <v-btn icon="mdi-close" variant="text" @click="emit('update:modelValue', false)" />
            </v-card-title>

            <v-card-text>
                <v-form ref="formRef" @submit.prevent="onSubmit">
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="form.Name"
                                label="Tên thương hiệu"
                                :rules="nameRules"
                                variant="outlined"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="form.LegalName"
                                label="Tên pháp nhân"
                                variant="outlined"
                            />
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field
                                v-model="form.TaxCode"
                                label="Mã số thuế"
                                variant="outlined"
                            />
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field
                                v-model="form.Currency"
                                label="Tiền tệ"
                                placeholder="VND"
                                variant="outlined"
                            />
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field
                                v-model="form.TimeZone"
                                label="Múi giờ"
                                placeholder="Asia/Bangkok"
                                variant="outlined"
                            />
                        </v-col>
                    </v-row>
                </v-form>
            </v-card-text>

            <v-card-actions class="justify-end">
                <v-btn variant="text" @click="emit('update:modelValue', false)">Hủy</v-btn>
                <v-btn color="primary" :loading="submitting" @click="onSubmit">Lưu</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { CreateBrandRequest, UpdateBrandRequest } from '@/core/api/dtos/brand.dtos'
import type { BrandModel } from '@/models/brand.model'

interface Props {
    modelValue: boolean
    title: string
    brand?: BrandModel | null
    submitting?: boolean
}

type BrandUpsertPayload = CreateBrandRequest & UpdateBrandRequest

const props = withDefaults(defineProps<Props>(), {
    brand: null,
    submitting: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [payload: BrandUpsertPayload]
}>()

const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
const nameRules = [(value: string) => !!value || 'Tên thương hiệu là bắt buộc']

const form = reactive<BrandUpsertPayload>({
    Name: '',
    LegalName: '',
    TaxCode: '',
    Currency: 'VND',
    TimeZone: 'Asia/Bangkok',
})

function fillForm(brand: BrandModel | null) {
    form.Name = brand?.name ?? ''
    form.LegalName = brand?.legalName ?? ''
    form.TaxCode = brand?.taxCode ?? ''
    form.Currency = brand?.currency ?? 'VND'
    form.TimeZone = brand?.timeZone ?? 'Asia/Bangkok'
}

watch(
    () => [props.brand, props.modelValue] as const,
    ([brand, isOpen]) => {
        if (isOpen) {
            fillForm(brand)
        }
    },
    { immediate: true },
)

async function onSubmit() {
    const result = await formRef.value?.validate()

    if (!result?.valid) {
        return
    }

    emit('submit', {
        Name: form.Name.trim(),
        LegalName: form.LegalName?.trim() || null,
        TaxCode: form.TaxCode?.trim() || null,
        Currency: form.Currency?.trim() || null,
        TimeZone: form.TimeZone?.trim() || null,
    })
}
</script>
