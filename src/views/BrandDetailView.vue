<template>
    <div class="d-flex flex-column ga-4">
        <div class="d-flex align-center justify-space-between">
            <div>
                <h1 class="text-h4">Chi tiết thương hiệu</h1>
                <p class="text-body-2 text-medium-emphasis">
                    Theo dõi thông tin thương hiệu và quản lý danh sách thành viên được gán.
                </p>
            </div>

            <div class="d-flex ga-2">
                <v-btn variant="outlined" prepend-icon="mdi-arrow-left" @click="goBack">
                    Quay lại
                </v-btn>
                <v-btn
                    color="primary"
                    prepend-icon="mdi-account-multiple-outline"
                    @click="openMembers"
                >
                    Thành viên
                </v-btn>
            </div>
        </div>

        <v-skeleton-loader v-if="loading" type="article" />

        <BrandDetailCard v-else-if="brand" :brand="brand" />

        <v-card v-else rounded="lg">
            <v-card-text
                class="d-flex flex-column align-center justify-center py-10 text-medium-emphasis"
            >
                <v-icon size="56" class="mb-3">mdi-domain-off</v-icon>
                <div class="text-h6">Không tìm thấy thương hiệu</div>
                <div class="text-body-2">
                    Bản ghi có thể đã bị xóa hoặc bạn không có quyền truy cập.
                </div>
            </v-card-text>
        </v-card>

        <BrandMembersDialog
            v-model="isMembersDialogOpen"
            :brand-name="brand?.name || 'Thương hiệu'"
            :members="members"
            :loading="membersLoading"
            :submitting="submitting"
            @assign-users="assignUsers"
            @remove-user="removeUser"
        />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BrandDetailCard from '@/components/brand/BrandDetailCard.vue'
import BrandMembersDialog from '@/components/brand/BrandMembersDialog.vue'
import { useBrand } from '@/composables/useBrand'
import { useConfirmDialog } from '@/composables/useConfirmDialog'
import { APP_ROUTES } from '@/core/constants/app-routes.constants'
import type { BrandMemberModel, BrandModel } from '@/models/brand.model'

const route = useRoute()
const router = useRouter()
const { confirm } = useConfirmDialog()
const { getBrand, getBrandMembers, assignUsersToBrand, removeUserFromBrand } = useBrand()

const brand = ref<BrandModel | null>(null)
const members = ref<BrandMemberModel[]>([])
const loading = ref(false)
const membersLoading = ref(false)
const submitting = ref(false)
const isMembersDialogOpen = ref(false)

const brandId = Number(route.params.id)

async function loadBrand() {
    loading.value = true

    try {
        brand.value = await getBrand(brandId)
    } finally {
        loading.value = false
    }
}

async function loadMembers() {
    membersLoading.value = true

    try {
        members.value = await getBrandMembers(brandId)
    } finally {
        membersLoading.value = false
    }
}

async function openMembers() {
    isMembersDialogOpen.value = true
    await loadMembers()
}

async function assignUsers(userIds: string[]) {
    submitting.value = true

    try {
        await assignUsersToBrand(brandId, { UserIds: userIds })
        await loadMembers()
    } finally {
        submitting.value = false
    }
}

async function removeUser(userId: string) {
    const accepted = await confirm({
        title: 'Gỡ thành viên',
        message: `Bạn có chắc muốn gỡ người dùng ${userId} khỏi thương hiệu này không?`,
    })

    if (!accepted) {
        return
    }

    await removeUserFromBrand(brandId, userId)
    await loadMembers()
}

function goBack() {
    void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME })
}

onMounted(() => {
    if (Number.isFinite(brandId)) {
        void loadBrand()
    }
})
</script>
