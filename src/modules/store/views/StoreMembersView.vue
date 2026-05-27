<template>
  <div class="d-flex flex-column ga-4">
    <AppPageHeader
      title="Thành viên cửa hàng"
      subtitle="Quản lý thành viên thuộc các cửa hàng"
    >
      <template #breadcrumb>
        <AppBreadcrumb
          :items="[
            { title: 'Dashboard', to: '/admin' },
            { title: 'Thành viên cửa hàng', disabled: true },
          ]"
        />
      </template>
    </AppPageHeader>

    <StoreMemberList />
  </div>
</template>

<script setup lang="ts">
import { AppBreadcrumb, AppPageHeader } from '@/components/ui'
import StoreMemberList from '@/modules/store/components/StoreMemberList.vue'
</script>
