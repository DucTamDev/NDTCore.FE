<template>
    <div class="d-flex flex-column ga-4">
        <AppPageHeader
            title="Options"
            subtitle="Quản lý danh sách option cho sản phẩm"
        >
            <template #breadcrumb>
                <AppBreadcrumb
                    :items="[
                        { title: 'Dashboard', to: '/admin' },
                        { title: 'Sản phẩm' },
                        { title: 'Options', disabled: true },
                    ]"
                />
            </template>
            <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
                Thêm option
            </v-btn>
        </AppPageHeader>

        <OptionList
            :items="items"
            :loading="isLoading"
            :page-number="page"
            :page-size="pageSize"
            :total-pages="totalPages"
            :total-items="total"
            @create="openCreateDialog"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
            @row-action="onRowAction"
        />

        <AppDialog v-model="dialogOpen" :title="dialogTitle" max-width="700px">
            <OptionForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :edit-id="editId"
                @submit="onFormSubmit"
                @cancel="dialogOpen = false"
            />
        </AppDialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
    AppBreadcrumb,
    AppPageHeader,
    AppDialog,
} from '@/components/ui'
import OptionList from '../components/OptionList.vue'
import OptionForm from '../components/OptionForm.vue'
import { useOption } from '../composables/useOption'
import { createEmptyOptionForm } from '../models/form-models/option.model'
import { OPTION_ROW_ACTION } from '../constants/option-list.constants'
import type { OptionViewModel } from '../models/view-models/option.view-model'
import type { CreateOptionRequest, UpdateOptionRequest } from '../models/dtos/option.dto'

const { items, total, isLoading, isSubmitting, loadOptions, createOption, updateOption, deleteOption } = useOption()

const page = ref(1)
const pageSize = ref(20)
const dialogOpen = ref(false)
const editId = ref<number | null>(null)
const formModel = ref(createEmptyOptionForm())

const dialogTitle = computed(() => (editId.value ? 'Sửa option' : 'Thêm option'))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

async function fetchData() {
    await loadOptions({ PageNumber: page.value, PageSize: pageSize.value })
}

function onPageChange(p: number) {
    page.value = p
    fetchData()
}

function onPageSizeChange(s: number) {
    pageSize.value = s
    page.value = 1
    fetchData()
}

function openCreateDialog() {
    editId.value = null
    formModel.value = createEmptyOptionForm()
    dialogOpen.value = true
}

function openEditDialog(item: OptionViewModel) {
    editId.value = item.id
    formModel.value = {
        groupId: item.groupId,
        name: item.name,
        defaultPrice: item.defaultPrice,
        description: item.description ?? '',
        imageUrl: item.imageUrl ?? '',
        displayOrder: item.displayOrder,
        isActive: item.isActive,
    }
    dialogOpen.value = true
}

async function onRowAction(key: string, item: OptionViewModel) {
    if (key === OPTION_ROW_ACTION.EDIT) {
        openEditDialog(item)
    } else if (key === OPTION_ROW_ACTION.DELETE) {
        const ok = await deleteOption(item.id)
        if (ok) fetchData()
    }
}

async function onFormSubmit(form: typeof formModel.value) {
    if (editId.value) {
        const payload: UpdateOptionRequest = {
            Name: form.name,
            DefaultPrice: form.defaultPrice,
            Description: form.description || null,
            ImageUrl: form.imageUrl || null,
            DisplayOrder: form.displayOrder,
            IsActive: form.isActive,
        }
        const ok = await updateOption(editId.value, payload)
        if (ok) { dialogOpen.value = false; fetchData() }
    } else {
        if (form.groupId === null) return
        const payload: CreateOptionRequest = {
            GroupId: form.groupId,
            Name: form.name,
            DefaultPrice: form.defaultPrice,
            Description: form.description || null,
            ImageUrl: form.imageUrl || null,
            DisplayOrder: form.displayOrder,
            IsActive: form.isActive,
        }
        const result = await createOption(payload)
        if (result) { dialogOpen.value = false; fetchData() }
    }
}

onMounted(fetchData)
</script>
