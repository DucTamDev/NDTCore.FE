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

        <!-- Filter bar -->
        <v-card rounded="lg" variant="outlined">
            <v-card-text class="pa-3">
                <v-row dense>
                    <v-col cols="12" md="4">
                        <v-autocomplete
                            v-model="filterGroupId"
                            :items="groupOptions"
                            item-value="id"
                            item-title="name"
                            label="Lọc theo nhóm"
                            clearable
                            density="compact"
                            hide-details
                            @update:model-value="onFilterChange"
                        />
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <OptionList
            :items="items"
            :loading="isLoading"
            :page-number="page"
            :page-size="pageSize"
            :total-pages="totalPages"
            :total-items="total"
            @page-change="onPageChange"
            @page-size-change="onPageSizeChange"
            @row-action="onRowAction"
        />

        <AppDialog v-model="dialogOpen" title="Thêm option" :hide-actions="true" max-width="700px">
            <OptionForm
                v-model="formModel"
                :is-submitting="isSubmitting"
                :edit-id="null"
                :group-options="groupOptions"
                @submit="onFormSubmit"
                @cancel="dialogOpen = false"
            />
        </AppDialog>

        <AppConfirmDialog
            v-model="confirmOpen"
            title="Xoá option"
            :message="`Bạn có chắc muốn xoá option '${confirmItem?.name}'? Hành động này không thể hoàn tác.`"
            confirm-label="Xác nhận xoá"
            confirm-variant="danger"
            @confirm="onConfirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
    AppBreadcrumb,
    AppPageHeader,
    AppDialog,
    AppConfirmDialog,
} from '@/components/ui'
import OptionList from '../components/OptionList.vue'
import OptionForm from '../components/OptionForm.vue'
import { useOption } from '../composables/useOption'
import { useOptionGroupStore } from '../stores/option-group.store'
import { createEmptyOptionForm } from '../models/form-models/option.model'
import { OPTION_ROW_ACTION } from '../constants/option-list.constants'
import { APP_ROUTES } from '@/core/constants/_index'
import type { OptionViewModel } from '../models/view-models/option.view-model'
import type { CreateOptionRequest } from '../models/dtos/option.dto'

const router = useRouter()
const { items, total, isLoading, isSubmitting, loadOptions, createOption, deleteOption } = useOption()
const groupStore = useOptionGroupStore()
const groupOptions = computed(() => groupStore.items.map((g) => ({ id: g.id, name: g.name })))

const page = ref(1)
const pageSize = ref(20)
const filterGroupId = ref<number | null>(null)
const dialogOpen = ref(false)
const formModel = ref(createEmptyOptionForm())
const confirmOpen = ref(false)
const confirmItem = ref<OptionViewModel | null>(null)

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

async function fetchData() {
    await loadOptions({ PageNumber: page.value, PageSize: pageSize.value, GroupId: filterGroupId.value })
}

function onFilterChange() { page.value = 1; void fetchData() }

function onPageChange(p: number) { page.value = p; void fetchData() }

function onPageSizeChange(s: number) { pageSize.value = s; page.value = 1; void fetchData() }

function openCreateDialog() {
    formModel.value = createEmptyOptionForm(filterGroupId.value ?? undefined)
    dialogOpen.value = true
}

async function onFormSubmit(form: typeof formModel.value) {
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
    if (result) { dialogOpen.value = false; void fetchData() }
}

function onRowAction(key: string, item: OptionViewModel) {
    if (key === OPTION_ROW_ACTION.DETAIL) {
        void router.push({ name: APP_ROUTES.PRODUCT.OPTION_DETAIL.NAME, params: { id: item.id } })
    } else if (key === OPTION_ROW_ACTION.DELETE) {
        confirmItem.value = item
        confirmOpen.value = true
    }
}

async function onConfirmDelete() {
    const item = confirmItem.value
    confirmOpen.value = false
    confirmItem.value = null
    if (!item) return
    const ok = await deleteOption(item.id)
    if (ok) void fetchData()
}

onMounted(async () => {
    await groupStore.fetchPaged({ PageNumber: 1, PageSize: 200 })
    void fetchData()
})
</script>
