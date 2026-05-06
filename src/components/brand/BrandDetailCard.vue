<template>
    <v-card rounded="lg">
        <v-card-title class="d-flex align-center justify-space-between">
            <div>
                <div class="text-h5">{{ brand.name }}</div>
                <div class="text-body-2 text-medium-emphasis">{{ brand.code }}</div>
            </div>

            <v-chip :color="brand.isActive ? 'success' : 'warning'" variant="tonal">
                {{ brand.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động' }}
            </v-chip>
        </v-card-title>

        <v-card-text>
            <v-row>
                <v-col cols="12" md="6">
                    <div class="text-caption text-medium-emphasis">Tên pháp nhân</div>
                    <div class="text-body-1">{{ brand.legalName || '--' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="text-caption text-medium-emphasis">Mã số thuế</div>
                    <div class="text-body-1">{{ brand.taxCode || '--' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="text-caption text-medium-emphasis">Tiền tệ</div>
                    <div class="text-body-1">{{ brand.currency || '--' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="text-caption text-medium-emphasis">Múi giờ</div>
                    <div class="text-body-1">{{ brand.timeZone || '--' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="text-caption text-medium-emphasis">Người tạo</div>
                    <div class="text-body-1">{{ brand.createdBy || '--' }}</div>
                </v-col>
                <v-col cols="12" md="6">
                    <div class="text-caption text-medium-emphasis">Người cập nhật</div>
                    <div class="text-body-1">{{ brand.updatedBy || '--' }}</div>
                </v-col>
            </v-row>
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import type { BrandModel } from '@/models/brand.model'

defineProps<{
    brand: BrandModel
}>()
</script>
