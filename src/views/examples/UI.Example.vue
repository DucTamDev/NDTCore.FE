<script setup lang="ts">
import { ref } from 'vue'
import AppDataTable from '@/components/ui/AppDataTable.vue'
import AppDataIterator from '@/components/ui/AppDataIterator.vue'
import AppList from '@/components/ui/AppList.vue'
import type { TableHeader, TableOptions } from '@/components/ui/AppDataTable.vue'
import type { IteratorOptions } from '@/components/ui/AppDataIterator.vue'
import type { ListItem } from '@/components/ui/AppList.vue'

// ─────────────────────────────────────────────
// AppDataTable
// ─────────────────────────────────────────────

interface NhanVien {
  id: number
  hoTen: string
  email: string
  phongBan: string
  trangThai: TrangThai
  [key: string]: unknown
}

const tableHeaders: TableHeader[] = [
  { key: 'id', title: 'ID', width: 60, hideBelow: 'md' },
  { key: 'hoTen', title: 'Họ tên', sortable: true },
  { key: 'email', title: 'Email', sortable: true, hideBelow: 'sm' },
  { key: 'phongBan', title: 'Phòng ban', hideBelow: 'md' },
  { key: 'trangThai', title: 'Trạng thái', align: 'center' },
  { key: 'actions', title: '', align: 'end', sortable: false },
]

const danhSachNhanVien = ref<NhanVien[]>([
  { id: 1, hoTen: 'Nguyễn Văn An', email: 'an@cty.vn', phongBan: 'Kỹ thuật', trangThai: 'active' },
  { id: 2, hoTen: 'Trần Thị Bình', email: 'binh@cty.vn', phongBan: 'Kế toán', trangThai: 'active' },
  {
    id: 3,
    hoTen: 'Lê Minh Cường',
    email: 'cuong@cty.vn',
    phongBan: 'Kinh doanh',
    trangThai: 'inactive',
  },
  {
    id: 4,
    hoTen: 'Phạm Thị Dung',
    email: 'dung@cty.vn',
    phongBan: 'Kỹ thuật',
    trangThai: 'active',
  },
  { id: 5, hoTen: 'Hoàng Văn Em', email: 'em@cty.vn', phongBan: 'Nhân sự', trangThai: 'inactive' },
])

const selectedRows = ref<NhanVien[]>([])
const tableLoading = ref(false)

const trangThaiConfig = {
  active: { color: 'success', label: 'Hoạt động' },
  inactive: { color: 'default', label: 'Vô hiệu' },
} as const

type TrangThai = keyof typeof trangThaiConfig

function onTableOptions(options: TableOptions) {
  console.log('[AppDataTable] options:', options)
  // Gọi API server-side tại đây nếu serverSide = true
}

function onRowClick(_: MouseEvent, row: { item: NhanVien }) {
  console.log('[AppDataTable] row clicked:', row.item)
}

function xoaNhanVien(id: number) {
  danhSachNhanVien.value = danhSachNhanVien.value.filter((nv) => nv.id !== id)
}

// ─────────────────────────────────────────────
// AppDataIterator
// ─────────────────────────────────────────────

interface SanPham {
  id: number
  ten: string
  gia: number
  danhMuc: string
  anhUrl: string
  [key: string]: unknown
}

const danhSachSanPham = ref<SanPham[]>([
  {
    id: 1,
    ten: 'Bàn phím cơ Keychron K2',
    gia: 1_890_000,
    danhMuc: 'Phụ kiện',
    anhUrl: 'https://picsum.photos/seed/kb/300/200',
  },
  {
    id: 2,
    ten: 'Màn hình LG 27" 4K',
    gia: 8_500_000,
    danhMuc: 'Màn hình',
    anhUrl: 'https://picsum.photos/seed/mn/300/200',
  },
  {
    id: 3,
    ten: 'Chuột Logitech MX Master 3',
    gia: 2_200_000,
    danhMuc: 'Phụ kiện',
    anhUrl: 'https://picsum.photos/seed/ms/300/200',
  },
  {
    id: 4,
    ten: 'Tai nghe Sony WH-1000XM5',
    gia: 6_900_000,
    danhMuc: 'Âm thanh',
    anhUrl: 'https://picsum.photos/seed/hp/300/200',
  },
  {
    id: 5,
    ten: 'Hub USB-C Anker 7-in-1',
    gia: 950_000,
    danhMuc: 'Phụ kiện',
    anhUrl: 'https://picsum.photos/seed/hub/300/200',
  },
  {
    id: 6,
    ten: 'Đèn màn hình BenQ ScreenBar',
    gia: 1_650_000,
    danhMuc: 'Ánh sáng',
    anhUrl: 'https://picsum.photos/seed/lt/300/200',
  },
])

function onIteratorOptions(options: IteratorOptions) {
  console.log('[AppDataIterator] options:', options)
}

function formatGia(gia: number) {
  return gia.toLocaleString('vi-VN') + ' ₫'
}

// ─────────────────────────────────────────────
// AppList
// ─────────────────────────────────────────────

const danhSachMenu = ref<ListItem[]>([
  {
    title: 'Tổng quan',
    subtitle: 'Xem báo cáo tổng hợp',
    icon: 'mdi-view-dashboard-outline',
    iconColor: 'primary',
  },
  {
    title: 'Đơn hàng',
    subtitle: '12 đơn chờ xử lý',
    icon: 'mdi-cart-outline',
    iconColor: 'warning',
    divider: true,
  },
  {
    title: 'Sản phẩm',
    subtitle: '248 sản phẩm đang bán',
    icon: 'mdi-package-variant-closed',
    iconColor: 'info',
  },
  {
    title: 'Khách hàng',
    subtitle: '1.204 khách hàng',
    icon: 'mdi-account-group-outline',
    iconColor: 'success',
  },
  {
    title: 'Báo cáo',
    subtitle: 'Phân tích doanh thu',
    icon: 'mdi-chart-bar',
    iconColor: 'secondary',
    divider: true,
  },
  {
    title: 'Cài đặt',
    subtitle: 'Tuỳ chỉnh hệ thống',
    icon: 'mdi-cog-outline',
    iconColor: 'grey',
    disabled: false,
  },
])

const selectedMenu = ref<ListItem | null>(null)
</script>

<template>
  <v-container class="py-6">
    <v-row>
      <!-- ═══════════════════════════════════════
           AppDataTable
      ═══════════════════════════════════════ -->
      <v-col cols="12">
        <p class="text-overline text-medium-emphasis mb-1">AppDataTable</p>
        <v-card rounded="lg" border flat>
          <AppDataTable
            v-model="selectedRows"
            :headers="tableHeaders"
            :items="danhSachNhanVien"
            :loading="tableLoading"
            show-select
            @update:options="onTableOptions"
            @click:row="onRowClick"
          >
            <!-- Toolbar actions -->
            <template #toolbar-actions>
              <v-chip v-if="selectedRows.length" color="primary" variant="tonal" size="small">
                Đã chọn {{ selectedRows.length }}
              </v-chip>
              <v-btn color="primary" prepend-icon="mdi-plus" size="small"> Thêm nhân viên </v-btn>
            </template>

            <!-- Cell: trạng thái -->
            <template #[`item.trangThai`]="{ item }">
              <v-chip :color="trangThaiConfig[item.trangThai]?.color" size="small" variant="tonal">
                {{ trangThaiConfig[item.trangThai].label }}
              </v-chip>
            </template>

            <!-- Cell: actions -->
            <template #[`item.actions`]="{ item }">
              <v-btn icon="mdi-pencil-outline" variant="text" size="small" density="compact" />
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="small"
                density="compact"
                color="error"
                @click.stop="xoaNhanVien(item.id)"
              />
            </template>
          </AppDataTable>
        </v-card>
      </v-col>

      <!-- ═══════════════════════════════════════
           AppDataIterator
      ═══════════════════════════════════════ -->
      <v-col cols="12">
        <p class="text-overline text-medium-emphasis mb-1">AppDataIterator</p>
        <v-card rounded="lg" border flat>
          <v-card-text>
            <AppDataIterator
              :items="danhSachSanPham"
              :cols="12"
              :sm-cols="6"
              :md-cols="4"
              :lg-cols="3"
              :items-per-page="6"
              @update:options="onIteratorOptions"
            >
              <!-- Toolbar actions -->
              <template #toolbar-actions>
                <v-btn variant="outlined" size="small" prepend-icon="mdi-filter-outline">
                  Lọc
                </v-btn>
              </template>

              <!-- Card slot -->
              <template #card="{ item }">
                <v-card border flat rounded="lg" hover>
                  <v-img :src="item.anhUrl" height="140" cover />
                  <v-card-item>
                    <v-card-title class="text-body-2">{{ item.ten }}</v-card-title>
                    <v-card-subtitle>
                      <v-chip size="x-small" variant="tonal" color="primary">
                        {{ item.danhMuc }}
                      </v-chip>
                    </v-card-subtitle>
                  </v-card-item>
                  <v-card-actions class="pt-0">
                    <span class="text-body-2 font-weight-medium text-primary ms-2">
                      {{ formatGia(item.gia) }}
                    </span>
                    <v-spacer />
                    <v-btn icon="mdi-cart-plus" variant="text" size="small" color="primary" />
                  </v-card-actions>
                </v-card>
              </template>

              <!-- List-item slot -->
              <template #list-item="{ item }">
                <v-list-item :title="item.ten" :subtitle="formatGia(item.gia)">
                  <template #prepend>
                    <v-avatar :image="item.anhUrl" size="44" rounded="lg" />
                  </template>
                  <template #append>
                    <v-chip size="x-small" variant="tonal" color="primary" class="mr-2">
                      {{ item.danhMuc }}
                    </v-chip>
                    <v-btn icon="mdi-cart-plus" variant="text" size="small" />
                  </template>
                </v-list-item>
              </template>
            </AppDataIterator>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- ═══════════════════════════════════════
           AppList
      ═══════════════════════════════════════ -->
      <v-col cols="12" md="5">
        <p class="text-overline text-medium-emphasis mb-1">AppList</p>
        <AppList
          v-model="selectedMenu"
          :items="danhSachMenu"
          lines="two"
          selectable
          rounded
          @click:item="(item) => console.log('[AppList] clicked:', item.title)"
        >
          <!-- Actions desktop -->
          <template #item-actions="{ item }">
            <v-btn icon="mdi-chevron-right" variant="text" size="small" density="compact" />
          </template>

          <!-- Actions mobile: gọn hơn -->
          <template #item-actions-mobile="{ item }">
            <v-icon size="18" color="grey">mdi-chevron-right</v-icon>
          </template>
        </AppList>

        <!-- Hiển thị item đang chọn -->
        <v-alert v-if="selectedMenu" type="info" variant="tonal" density="compact" class="mt-3">
          Đang xem: <strong>{{ selectedMenu.title }}</strong>
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>
