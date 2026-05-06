<template>
    <div class="d-flex flex-column ga-4">
        <div>
            <h1 class="text-h4">Quản lý thương hiệu</h1>
            <p class="text-body-2 text-medium-emphasis">
                Quản lý danh sách thương hiệu, trạng thái hoạt động và thành viên được gán.
            </p>
        </div>

        <BrandTable
            :items="brands"
            :loading="loading"
            :current-page="pageNumber"
            :total-items="totalCount"
            :items-per-page="pageSize"
            :keyword="keyword"
            :status-filter="statusFilter"
            @create="openCreateDialog"
            @refresh="loadBrands"
            @view="goToDetail"
            @edit="openEditDialog"
            @delete="confirmDelete"
            @members="openMembersDialog"
            @toggle-status="toggleStatus"
            @update:page="handlePageChange"
            @update:keyword="handleKeywordChange"
            @update:status-filter="handleStatusFilterChange"
        />

        <BrandFormDialog
            v-model="isFormDialogOpen"
            :title="selectedBrand ? 'Cập nhật thương hiệu' : 'Tạo thương hiệu'"
            :brand="selectedBrand"
            :submitting="submitting"
            @submit="saveBrand"
        />

        <BrandMembersDialog
            v-model="isMembersDialogOpen"
            :brand-name="selectedBrand?.name || 'Thương hiệu'"
            :members="brandMembers"
            :loading="membersLoading"
            :submitting="submitting"
            @assign-users="assignUsers"
            @remove-user="removeUser"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import BrandFormDialog from '@/components/brand/BrandFormDialog.vue'
import BrandMembersDialog from '@/components/brand/BrandMembersDialog.vue'
import BrandTable from '@/components/brand/BrandTable.vue'
import { useBrand } from '@/composables/useBrand'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import { DEFAULT_PAGINATION } from '@/core/constants/app.constants'
import type { CreateBrandRequest, UpdateBrandRequest } from '@/core/api/dtos/brand.dtos'
import type { BrandMemberModel, BrandModel } from '@/models/brand.model'

const router = useRouter()
const { confirm } = useConfirmDialog()
const {
    getPagedBrands,
    createBrand,
    updateBrand,
    updateBrandStatus,
    getBrandMembers,
    assignUsersToBrand,
    removeUserFromBrand,
    deleteBrand,
} = useBrand()

const brands = ref<BrandModel[]>([])
const brandMembers = ref<BrandMemberModel[]>([])
const selectedBrand = ref<BrandModel | null>(null)
const loading = ref(false)
const membersLoading = ref(false)
const submitting = ref(false)
const isFormDialogOpen = ref(false)
const isMembersDialogOpen = ref(false)
const pageNumber = ref(DEFAULT_PAGINATION.PAGE)
const pageSize = ref(DEFAULT_PAGINATION.LIMIT)
const totalCount = ref(0)
const keyword = ref('')
const statusFilter = ref<boolean | null>(null)

async function loadBrands() {
    loading.value = true

    try {
        const result = await getPagedBrands({
            PageNumber: pageNumber.value,
            PageSize: pageSize.value,
            Keyword: keyword.value || null,
            IsActive: statusFilter.value,
        })

        brands.value = result.items
        totalCount.value = result.totalCount
    } finally {
        loading.value = false
    }
}

function openCreateDialog() {
    selectedBrand.value = null
    isFormDialogOpen.value = true
}

function openEditDialog(brand: BrandModel) {
    selectedBrand.value = brand
    isFormDialogOpen.value = true
}

async function saveBrand(payload: CreateBrandRequest | UpdateBrandRequest) {
    submitting.value = true

    try {
        if (selectedBrand.value) {
            await updateBrand(selectedBrand.value.id, payload)
        } else {
            await createBrand(payload)
        }

        isFormDialogOpen.value = false
        selectedBrand.value = null
        await loadBrands()
    } finally {
        submitting.value = false
    }
}

async function confirmDelete(brand: BrandModel) {
    const accepted = await confirm({
        title: 'Xóa thương hiệu',
        message: `Bạn có chắc muốn xóa thương hiệu "${brand.name}" không?`,
    })

    if (!accepted) {
        return
    }

    await deleteBrand(brand.id)
    await loadBrands()
}

async function toggleStatus(brand: BrandModel) {
    await updateBrandStatus(brand.id, !brand.isActive)
    await loadBrands()
}

async function openMembersDialog(brand: BrandModel) {
    selectedBrand.value = brand
    isMembersDialogOpen.value = true
    await loadMembers(brand.id)
}

async function loadMembers(brandId: number) {
    membersLoading.value = true

    try {
        brandMembers.value = await getBrandMembers(brandId)
    } finally {
        membersLoading.value = false
    }
}

async function assignUsers(userIds: string[]) {
    if (!selectedBrand.value) {
        return
    }

    submitting.value = true

    try {
        await assignUsersToBrand(selectedBrand.value.id, { UserIds: userIds })
        await loadMembers(selectedBrand.value.id)
    } finally {
        submitting.value = false
    }
}

async function removeUser(userId: string) {
    if (!selectedBrand.value) {
        return
    }

    const accepted = await confirm({
        title: 'Gỡ thành viên',
        message: `Bạn có chắc muốn gỡ người dùng ${userId} khỏi thương hiệu này không?`,
    })

    if (!accepted) {
        return
    }

    await removeUserFromBrand(selectedBrand.value.id, userId)
    await loadMembers(selectedBrand.value.id)
}

function handlePageChange(page: number) {
    pageNumber.value = page
    void loadBrands()
}

function handleKeywordChange(value: string) {
    keyword.value = value
    pageNumber.value = 1
    void loadBrands()
}

function handleStatusFilterChange(value: boolean | null) {
    statusFilter.value = value
    pageNumber.value = 1
    void loadBrands()
}

function goToDetail(brand: BrandModel) {
    void router.push({
        name: APP_ROUTES.ADMIN.CHILDREN.BRAND_DETAIL.NAME,
        params: { id: brand.id },
    })
}

onMounted(() => {
    void loadBrands()
})
</script>
