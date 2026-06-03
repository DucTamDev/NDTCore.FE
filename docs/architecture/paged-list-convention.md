# Convention: Paged List Page

> **Phiên bản:** 1.2 — Tháng 6/2026
> **Áp dụng:** Mọi entity có trang danh sách phân trang trong NDTCore.FE
> **Cơ sở:** Phân tích 5 List View + 5 List Component (Category, Tag, OptionGroup, Option, Product)

---

## 1. Nguyên tắc thiết kế

### 1.1 Tách biệt trách nhiệm

| Layer | File | Trách nhiệm |
|-------|------|-------------|
| **Container** | `XxxsView.vue` | Fetch data, quản lý state phân trang/filter/dialog, điều hướng router |
| **Presenter** | `XxxList.vue` | Render bảng + phân trang thuần — nhận state qua props, emit event ngược lên |
| **Constants** | `xxx-list.constants.ts` | Định nghĩa columns, row actions, status config, emit keys |

### 1.2 Tách constants ra file riêng

Không hardcode columns, actions, hay status config trực tiếp trong component. Mọi giá trị tĩnh đều ở `xxx-list.constants.ts`.

### 1.3 Confirm-before-delete

`onConfirmDelete` đóng dialog và clear `confirmItem` **trước khi** gọi API — tránh race condition khi người dùng thao tác lại trong lúc chờ response.

---

## 2. Cấu trúc file

```
modules/
└── {domain}/
    ├── views/
    │   └── XxxsView.vue            ← Container
    ├── components/
    │   └── XxxList.vue             ← Presenter
    └── constants/
        └── xxx-list.constants.ts   ← Columns, actions, config
```

**Bảng tên:**

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Container view | `{Entities}View.vue` | `ProductsView.vue` |
| List component | `{Entity}List.vue` | `ProductList.vue` |
| Constants | `{entity}-list.constants.ts` | `product-list.constants.ts` |

---

## 3. Layout

```
┌─────────────────────────────────────────────────────┐
│  AppPageHeader                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │  AppBreadcrumb                              │    │
│  │  title / subtitle          [Thêm mới btn]  │    │
│  └─────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────┤
│  FILTER BAR (chỉ khi có filter)                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  v-row > v-col: text-search / selects        │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  XxxList                                            │
│  ┌──────────────────────────────────────────────┐   │
│  │  AppDataTable (columns, rows, empty state)   │   │
│  │  AppPagination                               │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  AppDialog (create form)                            │
│  AppConfirmDialog (xác nhận xoá)                    │
└─────────────────────────────────────────────────────┘
```

---

## 4. Các thành phần

### 4.1 AppPageHeader

```vue
<AppPageHeader title="Tên entity" subtitle="Mô tả quản lý">
  <template #breadcrumb>
    <AppBreadcrumb
      :items="[
        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
        { title: 'Module Label' },
        { title: 'Tên entity', disabled: true },
      ]"
    />
  </template>
  <v-btn color="primary" prepend-icon="mdi-plus" @click="openCreateDialog">
    Thêm entity
  </v-btn>
</AppPageHeader>
```

### 4.2 Filter bar

Chỉ thêm khi có ≥ 1 filter. Dùng pattern `:model-value` + `@update:model-value` — không dùng `v-model` kết hợp với `@update:model-value` cùng lúc (tránh hybrid).

**Filter chỉ cập nhật ref — không tự gọi API.** Chỉ nút "Tìm kiếm" mới fetch.

Layout 3 cột: inputs bên trái, buttons căn phải. Dropdown dùng option "Tất cả" (value `null`) thay cho `clearable`.

```vue
<v-card rounded="lg" variant="outlined">
  <v-card-text class="pa-3">
    <v-row dense align="center">
      <!-- Text search: chỉ cập nhật ref, Enter để search ngay -->
      <v-col cols="12" md="4">
        <v-text-field
          :model-value="filterKeyword"
          label="Tìm kiếm"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          hide-details
          clearable
          @update:model-value="(v) => { filterKeyword = v }"
          @keyup.enter="onSearchClick"
        />
      </v-col>
      <!-- Select filter: chỉ cập nhật ref, không gọi API -->
      <v-col cols="12" md="4">
        <v-autocomplete
          :model-value="filterXxxId"
          :items="xxxOptionsWithAll"
          item-value="id"
          item-title="name"
          label="Lọc theo Xxx"
          density="compact"
          hide-details
          @update:model-value="(v) => { filterXxxId = v }"
        />
      </v-col>
      <!-- Action buttons: căn phải -->
      <v-col cols="12" md="4" class="d-flex justify-end ga-2">
        <v-btn
          v-if="hasActiveFilters"
          variant="text"
          size="small"
          prepend-icon="mdi-filter-remove-outline"
          @click="clearFilters"
        >
          Xóa lọc
        </v-btn>
        <v-btn
          color="primary"
          variant="tonal"
          size="small"
          prepend-icon="mdi-magnify"
          @click="onSearchClick"
        >
          Tìm kiếm
        </v-btn>
      </v-col>
    </v-row>
  </v-card-text>
</v-card>
```

**"Tất cả" option cho dropdown:**

```typescript
const xxxOptionsWithAll = computed((): { id: number | null; name: string }[] => [
  { id: null, name: 'Tất cả' },
  ...xxxStore.items.map((x) => ({ id: x.id, name: x.name })),
])
```

`xxxOptions` (không có "Tất cả") vẫn dùng riêng cho form create nếu cần lookup.

**Khi nào dùng `v-autocomplete` vs `v-select` trong filter:**

| Trường hợp | Component |
| --------- | --------- |
| Options tải từ API / store (dynamic) | `v-autocomplete` |
| Options cố định ít lựa chọn (≤ 8, enum) | `v-select` |

### 4.3 XxxList — cách dùng trong View

```vue
<XxxList
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
```

### 4.4 Create dialog

```vue
<AppDialog v-model="dialogOpen" title="Thêm xxx" :hide-actions="true" max-width="700px">
  <XxxForm
    v-model="formModel"
    :is-submitting="isSubmitting"
    :edit-id="null"
    @submit="onFormSubmit"
    @cancel="dialogOpen = false"
  />
</AppDialog>
```

### 4.5 Confirm delete dialog

```vue
<AppConfirmDialog
  v-model="confirmOpen"
  title="Xoá xxx"
  :message="`Bạn có chắc muốn xoá '${confirmItem?.name}'? Hành động này không thể hoàn tác.`"
  confirm-label="Xác nhận xoá"
  confirm-variant="danger"
  @confirm="onConfirmDelete"
/>
```

---

## 5. State trong Container (XxxsView)

### 5.1 Khai báo state

```typescript
const DEFAULT_PAGE_SIZE = 20   // không dùng magic number inline

// Pagination
const page = ref(1)
const pageSize = ref(DEFAULT_PAGE_SIZE)

// totalPages: ưu tiên dùng giá trị API trả về nếu có.
// Chỉ tự compute khi API không trả về TotalPages.
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

// Filters — chỉ khai báo filter nào thực sự dùng
const filterKeyword = ref<string | null>(null)
const filterXxxId = ref<number | null>(null)

// Create dialog
const dialogOpen = ref(false)
const formModel = ref(emptyForm())

// Delete confirm
const confirmOpen = ref(false)
const confirmItem = ref<XxxViewModel | null>(null)
```

> **totalPages từ API:** Nếu `loadXxxs` trả về `totalPages` trong response, expose nó qua composable và dùng trực tiếp thay vì computed trên.

### 5.2 Composable và store

```typescript
const { items, total, isLoading, isSubmitting, loadXxxs, createXxx, deleteXxx } = useXxx()

// Store chỉ dùng khi form/filter cần lookup options
const xxxStore = useXxxStore()
const xxxOptions = computed(() => xxxStore.items.map((x) => ({ id: x.id, name: x.name })))
```

---

## 6. Functions trong Container

### 6.1 fetchData

```typescript
async function fetchData() {
  await loadXxxs({
    PageNumber: page.value,
    PageSize: pageSize.value,
    Keyword: filterKeyword.value || undefined,
    XxxId: filterXxxId.value || undefined,
  })
}
```

### 6.2 Pagination

```typescript
function onPageChange(p: number) {
  page.value = p
  void fetchData()
}

function onPageSizeChange(s: number) {
  pageSize.value = s
  page.value = 1
  void fetchData()
}
```

### 6.3 Filter — chỉ cập nhật ref, không fetch

Filter chỉ cập nhật ref khi người dùng thay đổi. **Không gọi `fetchData` ở đây.**

```typescript
// Không có onFilterChange hay onKeywordChange.
// Template tự cập nhật ref inline:
// @update:model-value="(v) => { filterKeyword = v }"
// @update:model-value="(v) => { filterXxxId = v }"
```

### 6.4 Search button — trigger fetch

Nút "Tìm kiếm" là điểm duy nhất gọi API từ filter. Enter trên keyword field cũng gọi `onSearchClick`.

```typescript
function onSearchClick() {
  page.value = 1
  void fetchData()
}

function clearFilters() {
  filterKeyword.value = null
  filterXxxId.value = null
  page.value = 1
  void fetchData()
}

const hasActiveFilters = computed(() =>
  !!(filterKeyword.value?.trim()) || filterXxxId.value !== null,
)
```

### 6.5 Row action

```typescript
function onRowAction(key: string, item: XxxViewModel) {
  if (key === XXX_ROW_ACTION.DETAIL) {
    void router.push({ name: APP_ROUTES.MODULE.XXX_DETAIL.NAME, params: { id: item.id } })
  } else if (key === XXX_ROW_ACTION.DELETE) {
    confirmItem.value = item
    confirmOpen.value = true
  }
}
```

### 6.6 Create

```typescript
function openCreateDialog() {
  formModel.value = emptyForm()
  dialogOpen.value = true
}

async function onFormSubmit(form: typeof formModel.value) {
  const result = await createXxx(toCreatePayload(form))
  if (result) {
    dialogOpen.value = false
    void fetchData()
  }
}
```

### 6.7 Delete — đóng dialog TRƯỚC khi await API

```typescript
async function onConfirmDelete() {
  const item = confirmItem.value
  confirmOpen.value = false     // đóng dialog ngay
  confirmItem.value = null      // clear item ngay
  if (!item) return
  const ok = await deleteXxx(item.id)
  if (ok) void fetchData()
}
```

### 6.8 Error state

`useXxx()` composable expose `error` ref. View binding:

```vue
<v-alert
  v-if="error"
  type="error"
  variant="tonal"
  density="compact"
  :text="error"
  class="mb-2"
/>
```

> Convention không yêu cầu try/catch trong View — error handling là trách nhiệm của composable. View chỉ hiển thị `error` nếu composable expose nó.

---

## 7. XxxList component

### 7.1 Props & Emits

```typescript
defineProps<{
  items: XxxViewModel[]
  loading: boolean
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItems: number
}>()

const emit = defineEmits<XxxListEmits>()
```

### 7.2 Template chuẩn

```vue
<template>
  <v-card rounded="lg">
    <AppDataTable
      :items="props.items"
      :columns="XXX_LIST_COLUMNS"
      :loading="props.loading"
      item-key="id"
      @row-click="(item) => emit(XXX_LIST_EMIT.ROW_ACTION, XXX_ROW_ACTION.DETAIL, item)"
    >
      <!-- Custom column slots -->
      <template #[`item.fieldName`]="{ item }">
        <!-- render tùy chỉnh -->
      </template>

      <!-- isActive — luôn có -->
      <template #[`item.isActive`]="{ item }">
        <AppStatusChip
          :config="XXX_STATUS_CONFIG[item.isActive ? 'active' : 'inactive']"
        />
      </template>

      <!-- actions — luôn có -->
      <template #[`item.actions`]="{ item }">
        <AppRowActions
          :actions="XXX_ROW_ACTIONS"
          :item="item"
          @action="(key) => emit(XXX_LIST_EMIT.ROW_ACTION, key, item)"
        />
      </template>

      <!-- empty state -->
      <template #empty>
        <AppEmptyState
          icon="mdi-ENTITY_ICON"
          title="Chưa có xxx nào"
          description="Bắt đầu bằng cách thêm xxx đầu tiên."
        />
      </template>
    </AppDataTable>

    <v-divider />

    <AppPagination
      :page-number="props.pageNumber"
      :page-size="props.pageSize"
      :total-pages="props.totalPages"
      :total-items="props.totalItems"
      @update:page-number="emit(XXX_LIST_EMIT.PAGE_CHANGE, $event)"
      @update:page-size="emit(XXX_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
    />
  </v-card>
</template>
```

---

## 8. Constants (`xxx-list.constants.ts`)

### 8.1 Cấu trúc đầy đủ

```typescript
import type { TableColumn, StatusConfig, RowAction } from '@/components/ui'
import type { XxxViewModel } from '../models/view-models/xxx.view-model'

// ── Emit keys ──────────────────────────────────────────────────
export const XXX_LIST_EMIT = {
  PAGE_CHANGE: 'page-change',
  PAGE_SIZE_CHANGE: 'page-size-change',
  ROW_ACTION: 'row-action',
} as const

export type XxxListEmits = {
  (event: typeof XXX_LIST_EMIT.PAGE_CHANGE, page: number): void
  (event: typeof XXX_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
  (event: typeof XXX_LIST_EMIT.ROW_ACTION, key: string, item: XxxViewModel): void
}

// ── Row actions ────────────────────────────────────────────────
export const XXX_ROW_ACTION = {
  DETAIL: 'detail',
  DELETE: 'delete',
} as const

export const XXX_ROW_ACTIONS: RowAction<XxxViewModel>[] = [
  {
    key: XXX_ROW_ACTION.DETAIL,
    label: 'Xem chi tiết',
    icon: 'mdi-eye-outline',
    color: 'default',
  },
  {
    key: XXX_ROW_ACTION.DELETE,
    label: 'Xoá',
    icon: 'mdi-delete-outline',
    color: 'error',
  },
]

// ── Columns ────────────────────────────────────────────────────
export const XXX_LIST_COLUMNS: TableColumn[] = [
  { key: 'id',       title: 'ID',         width: '70px' },
  { key: 'name',     title: 'Tên xxx',    minWidth: '160px' },
  // entity-specific columns
  { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
  { key: 'actions',  title: '',           width: '100px', align: 'end' },
]

// ── Status config ──────────────────────────────────────────────
export const XXX_STATUS_CONFIG: Record<'active' | 'inactive', StatusConfig> = {
  active: {
    label: 'Hiển thị',
    color: 'success',
    icon: 'mdi-check-circle-outline',
    variant: 'tonal',
  },
  inactive: {
    label: 'Ẩn',
    color: 'default',
    icon: 'mdi-minus-circle-outline',
    variant: 'tonal',
  },
}
```

### 8.2 Quy tắc columns

| Cột | key | width / minWidth | align |
|-----|-----|-----------------|-------|
| ID | `id` | `70px` | left (mặc định) |
| Tên chính | `name` | `minWidth: '160px'` | left |
| Cột phụ (text) | domain field | `minWidth: '120px'` | left |
| Trạng thái | `isActive` | `130px` | `center` |
| Actions | `actions` | `100px` | `end` |

Cột ẩn trên mobile: thêm `hideBelow: 'sm'` hoặc `hideBelow: 'md'` cho các cột ít quan trọng.

---

## 9. Quy tắc đặt tên

### 9.1 State trong View

| Đối tượng | Pattern | Ví dụ |
|-----------|---------|-------|
| Page size mặc định | `DEFAULT_PAGE_SIZE` | `const DEFAULT_PAGE_SIZE = 20` |
| Số trang hiện tại | `page` | `ref(1)` |
| Kích thước trang | `pageSize` | `ref(DEFAULT_PAGE_SIZE)` |
| Tổng số trang | `totalPages` | `computed(...)` hoặc từ API |
| Filter text | `filterKeyword` | `ref<string \| null>(null)` |
| Filter foreign key | `filter{Entity}Id` | `filterCategoryId` |
| Filter boolean | `filter{Field}` | `filterIsActive` |
| Dialog tạo mới | `dialogOpen` | `ref(false)` |
| Form tạo mới | `formModel` | `ref(emptyForm())` |
| Dialog confirm xoá | `confirmOpen` | `ref(false)` |
| Item sắp xoá | `confirmItem` | `ref<XxxViewModel \| null>(null)` |

### 9.2 Functions trong View

| Hành động | Pattern |
|-----------|---------|
| Tải dữ liệu | `fetchData` |
| Thay trang | `onPageChange` |
| Thay kích thước trang | `onPageSizeChange` |
| Nhấn Tìm kiếm / Enter | `onSearchClick` |
| Xóa tất cả filter | `clearFilters` |
| Xử lý row action | `onRowAction` |
| Mở dialog tạo mới | `openCreateDialog` |
| Submit form tạo | `onFormSubmit` |
| Xác nhận xoá | `onConfirmDelete` |

### 9.3 Constants keys

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Emit object | `{ENTITY}_LIST_EMIT` | `PRODUCT_LIST_EMIT` |
| Emit type | `{Entity}ListEmits` | `ProductListEmits` |
| Row action object | `{ENTITY}_ROW_ACTION` | `PRODUCT_ROW_ACTION` |
| Row actions array | `{ENTITY}_ROW_ACTIONS` | `PRODUCT_ROW_ACTIONS` |
| Columns array | `{ENTITY}_LIST_COLUMNS` | `PRODUCT_LIST_COLUMNS` |
| Status config | `{ENTITY}_STATUS_CONFIG` | `PRODUCT_STATUS_CONFIG` |

---

## 10. Checklist khi tạo List Page mới

**Constants (`xxx-list.constants.ts`):**
- [ ] `XXX_LIST_EMIT` và `XxxListEmits` type đầy đủ 3 event
- [ ] `XXX_ROW_ACTION` có `DETAIL` và `DELETE`
- [ ] `XXX_ROW_ACTIONS` array với icon + color chuẩn
- [ ] `XXX_LIST_COLUMNS` có `isActive` (center) và `actions` (end) ở cuối
- [ ] `XXX_STATUS_CONFIG` có `active` và `inactive`

**XxxList.vue:**
- [ ] Props: 6 trường chuẩn (items, loading, pageNumber, pageSize, totalPages, totalItems)
- [ ] Emits: 3 event từ `XxxListEmits`
- [ ] `@row-click` → emit `DETAIL`
- [ ] Slot `item.isActive` dùng `AppStatusChip`
- [ ] Slot `item.actions` dùng `AppRowActions`
- [ ] Slot `#empty` có `AppEmptyState`
- [ ] `AppPagination` ở cuối card

**XxxsView.vue:**

- [ ] `DEFAULT_PAGE_SIZE` là constant, không dùng magic number `20` inline
- [ ] Filter dùng `:model-value` + `@update:model-value` — không hybrid `v-model` + `@update`
- [ ] Filter chỉ cập nhật ref, **không** gọi `fetchData` khi thay đổi
- [ ] `onSearchClick` reset `page = 1` rồi `void fetchData()` — trigger duy nhất từ filter
- [ ] Keyword field có `@keyup.enter="onSearchClick"`
- [ ] Dropdown có option "Tất cả" (`id: null`) thay cho `clearable`
- [ ] `clearFilters` reset tất cả filter refs + reset `page = 1` + `void fetchData()`
- [ ] `hasActiveFilters` computed kiểm soát visibility nút "Xóa lọc"
- [ ] `void fetchData()` trong tất cả event handler (không `await` trong handler)
- [ ] `onPageSizeChange` reset `page = 1` trước khi fetch
- [ ] `onConfirmDelete` đóng dialog + clear item **trước** `await deleteXxx`
- [ ] `openCreateDialog` reset form về `emptyForm()` mỗi lần mở
- [ ] Error state binding nếu composable expose `error`
