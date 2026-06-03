# Convention: Detail Page

> **Phiên bản:** 1.0 — Tháng 6/2026
> **Áp dụng:** Mọi entity có trang chi tiết trong NDTCore.FE
> **Cơ sở:** Phân tích 8 DetailView + 8 OverviewTab (Brand, Franchisee, Store, Category, Tag, OptionGroup, Option, Product)

---

## 1. Nguyên tắc thiết kế

### 1.1 Tách biệt trách nhiệm

| Layer | File | Trách nhiệm |
|-------|------|-------------|
| **Container** | `XxxDetailView.vue` | Fetch data, quản lý form state, isDirty, submitting, validation, router navigation, confirm dialog |
| **Presenter** | `XxxOverviewTab.vue` | Render UI thuần — nhận state qua props, emit 4 event cố định |
| **Adapter** | `xxx.adapter.ts` | Mapping ViewModel ↔ FormModel ↔ Request payload |
| **Readonly tab** | `XxxSomethingTab.vue` | Hiển thị data liên quan, không có form, không có emit |

### 1.2 Pure Presenter

`XxxOverviewTab.vue` **không được**:
- Import `useRouter` — không tự navigate
- Import service, composable, store
- Chứa confirm dialog hay `pendingAction` state

`XxxOverviewTab.vue` **chỉ** emit 4 event:

```typescript
defineEmits<{
  'update:form': [field: keyof XxxFormModel, value: unknown]
  save: []
  discard: []   // user nhấn "Hủy thay đổi"
  back: []      // user nhấn "Quay lại"
}>()
```

Toàn bộ logic **confirm dialog** và **router.push** thuộc về `XxxDetailView.vue`.

### 1.3 Adapter Layer

Tách toàn bộ mapping ra file riêng, không bao giờ map tay trong View:

```
modules/{domain}/adapters/xxx.adapter.ts
```

```typescript
export function toForm(entity: XxxViewModel): XxxFormModel { ... }
export function toPayload(form: XxxFormModel): UpdateXxxRequest { ... }
export function emptyForm(): XxxFormModel { ... }
```

### 1.4 Inline Editing

- Sửa entity: trong Detail Page (tab Tổng quan), không dùng dialog
- Dialog chỉ dùng cho: tạo mới, xác nhận xóa, xác nhận bỏ thay đổi
- List View không có nút "Sửa" mở dialog

---

## 2. Cấu trúc file

### 2.1 Naming Convention

```
modules/
└── {domain}/
    ├── views/
    │   └── XxxDetailView.vue
    ├── components/
    │   ├── XxxOverviewTab.vue
    │   ├── XxxSomethingTab.vue      ← tab readonly
    │   └── XxxForm.vue              ← form cho dialog create
    └── adapters/
        └── xxx.adapter.ts
```

**Bảng tên:**

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Container view | `{Entity}DetailView.vue` | `ProductDetailView.vue` |
| Overview tab | `{Entity}OverviewTab.vue` | `ProductOverviewTab.vue` |
| Readonly tab | `{Entity}{Subject}Tab.vue` | `ProductTagsTab.vue` |
| Create form | `{Entity}Form.vue` | `ProductForm.vue` |
| Adapter | `{entity}.adapter.ts` | `product.adapter.ts` |

---

## 3. Layout

### 3.1 DetailView tổng thể

```
┌─────────────────────────────────────────────────────┐
│  SKELETON LOADER (v-if loading)                     │
├─────────────────────────────────────────────────────┤
│  HERO HEADER (v-else-if data)                       │
│  ┌─────────────────────────────────────────────┐    │
│  │  AppBreadcrumb                              │    │
│  │  [Icon 52px]  Name                          │    │
│  │               Secondary info                │    │
│  └─────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────┤
│  TABS CARD                                          │
│  ┌──────────────────────────────────────────────┐   │
│  │ [Tổng quan] [Tab 2] [Tab 3]                  │   │
│  ├──────────────────────────────────────────────┤   │
│  │  XxxOverviewTab / readonly tab               │   │
│  └──────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  AppConfirmDialog (confirm bỏ thay đổi)             │
│  NOT FOUND STATE (v-else)                           │
└─────────────────────────────────────────────────────┘
```

### 3.2 OverviewTab — layout variants

**Variant A — 1 card full width:**
```
cols="12"
┌──────────────────────────────────────────────────┐
│  Thông tin                                       │
│  field1 · field2 · isActive                      │
└──────────────────────────────────────────────────┘
cols="12"  ← AppAuditHistory
```

**Variant B — 2 card split (mặc định):**
```
cols="12" md="6"           cols="12" md="6"
┌──────────────────┐       ┌──────────────────┐
│  Thông tin cơ bản│       │  Cài đặt         │
│  (domain fields) │       │  displayOrder    │
│                  │       │  isActive        │
└──────────────────┘       └──────────────────┘
cols="12"  ← AppAuditHistory
```

**Variant C — 2 card bất đối xứng** (nhiều trường chính):
```
cols="12" md="8"                 cols="12" md="4"
┌────────────────────────┐       ┌──────────────┐
│  Thông tin cơ bản      │       │  Giá / Cài đặt│
│  (nhiều trường)        │       │  displayOrder│
│                        │       │  isActive    │
└────────────────────────┘       └──────────────┘
cols="12"  ← AppAuditHistory
```

> **Quy tắc:** `AppAuditHistory` luôn đặt cuối cùng ở `cols="12"`.

---

## 4. Các thành phần

### 4.1 Hero Header

```vue
<v-card variant="tonal" color="primary" rounded="lg" flat>
  <v-card-text class="pa-5">
    <AppBreadcrumb
      :items="[
        { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
        { title: 'List Label', to: { name: ROUTE_LIST } },
        { title: entity.data.value.name, disabled: true },
      ]"
    />
    <div class="d-flex align-center ga-3 mt-3">
      <v-sheet rounded="lg" width="52" height="52"
               class="d-flex align-center justify-center flex-shrink-0">
        <v-icon icon="mdi-ENTITY_ICON" size="28" color="primary" />
      </v-sheet>
      <div>
        <div class="text-h6 font-weight-bold text-high-emphasis">
          {{ entity.data.value.name }}
        </div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{ entity.data.value.subtitle }}
        </div>
      </div>
    </div>
  </v-card-text>
</v-card>
```

### 4.2 Toolbar (trong OverviewTab)

```vue
<div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
  <v-btn
    variant="text" rounded="lg" size="small"
    prepend-icon="mdi-arrow-left"
    @click="emit('back')"
  >
    Quay lại
  </v-btn>

  <div class="d-flex align-center ga-2">
    <v-slide-x-reverse-transition>
      <v-btn
        v-if="props.isDirty"
        variant="text" rounded="lg" size="small"
        :disabled="props.submitting"
        @click="emit('discard')"
      >
        Hủy thay đổi
      </v-btn>
    </v-slide-x-reverse-transition>

    <v-btn
      color="primary" variant="flat" rounded="lg" size="small"
      prepend-icon="mdi-content-save-outline"
      :loading="props.submitting"
      :disabled="!props.isDirty"
      @click="emit('save')"
    >
      Lưu thay đổi
    </v-btn>
  </div>
</div>
<v-divider />
```

### 4.3 Card chuẩn (info-card)

```vue
<v-card
  elevation="0" rounded="lg"
  :class="['info-card', props.isDirty ? 'info-card--dirty' : '']"
>
  <v-list-item class="bg-surface-variant py-3">
    <template #prepend>
      <v-sheet rounded="md" width="32" height="32"
               class="d-flex align-center justify-center mr-1">
        <v-icon icon="mdi-ICON" size="16" color="primary" />
      </v-sheet>
    </template>
    <v-list-item-title class="font-weight-semibold">Tiêu đề</v-list-item-title>
  </v-list-item>
  <v-divider />

  <div class="pa-4 d-flex flex-column ga-4">
    <!-- form fields -->
  </div>
</v-card>
```

```css
/* Scoped — bắt buộc trong mọi OverviewTab */
.info-card {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  transition: border-color 0.2s ease;
}
.info-card--dirty {
  border-color: rgb(var(--v-theme-primary));
}
```

### 4.4 AppAuditHistory (component tái sử dụng)

Đặt tại `src/components/ui/AppAuditHistory.vue`.

Props — `formatDate` được inject từ ngoài vào để component không phụ thuộc format của từng module:

```typescript
defineProps<{
  createdAt: string | null
  createdBy: string | null
  updatedAt: string | null
  updatedBy: string | null
  formatDate: (value: string | null | undefined) => string
}>()
```

Dùng trong OverviewTab:

```vue
<v-col cols="12">
  <AppAuditHistory
    :created-at="props.entity.createdAt"
    :created-by="props.entity.createdBy"
    :updated-at="props.entity.updatedAt"
    :updated-by="props.entity.updatedBy"
    :format-date="formatXxxDate"
  />
</v-col>
```

Template bên trong dùng 2×2 grid `v-row no-gutters` + `v-divider vertical` (xem mẫu trong `CategoryOverviewTab.vue`).

### 4.5 Confirm dialog — trong DetailView

```vue
<!-- XxxDetailView.vue -->
<AppConfirmDialog
  v-model="confirmOpen"
  title="Bỏ thay đổi?"
  confirm-label="Bỏ thay đổi"
  cancel-label="Ở lại"
  @confirm="onConfirmUnsaved"
>
  Bạn có thay đổi chưa được lưu. Nếu tiếp tục, các thay đổi sẽ bị mất.
</AppConfirmDialog>
```

```typescript
type PendingNavAction = 'back' | 'discard'
const confirmOpen = ref(false)
const pendingNavAction = ref<PendingNavAction | null>(null)

function onBack() {
  if (isDirty.value) { pendingNavAction.value = 'back'; confirmOpen.value = true }
  else void router.push({ name: ROUTE_LIST })
}
function onDiscard() {
  if (isDirty.value) { pendingNavAction.value = 'discard'; confirmOpen.value = true }
  else discardChanges()
}
function onConfirmUnsaved() {
  confirmOpen.value = false
  if (pendingNavAction.value === 'back') void router.push({ name: ROUTE_LIST })
  else if (pendingNavAction.value === 'discard') discardChanges()
  pendingNavAction.value = null
}
```

---

## 5. Props & Emits

### 5.1 OverviewTab — interface chuẩn

```typescript
defineProps<{
  entity: XxxViewModel
  form: XxxFormModel
  errors: Partial<Record<keyof XxxFormModel, string>>
  isDirty: boolean
  submitting: boolean
  // Chỉ thêm khi form có autocomplete lookup
  categoryOptions?: { id: number; name: string }[]
}>()

defineEmits<{
  'update:form': [field: keyof XxxFormModel, value: unknown]
  save: []
  discard: []
  back: []
}>()
```

**Cách dùng update:form:**
```vue
<!-- String -->
@update:model-value="emit('update:form', 'name', $event)"

<!-- Number — bắt buộc guard NaN -->
@update:model-value="(v) => { const n = Number(v); if (!isNaN(n)) emit('update:form', 'displayOrder', n) }"

<!-- Nullable number -->
@update:model-value="(v) => emit('update:form', 'costPrice', v != null ? Number(v) : null)"

<!-- Clearable string -->
@update:model-value="emit('update:form', 'slug', $event ?? '')"

<!-- Boolean toggle -->
@update:model-value="emit('update:form', 'isActive', $event === 'active')"
```

### 5.2 Readonly Tab

```typescript
defineProps<{
  entityId: number
}>()
// Không có emit
```

### 5.3 XxxViewModel — yêu cầu tối thiểu

```typescript
interface XxxViewModel extends Record<string, unknown> {
  id: number
  // domain fields...
  createdAt: string | null
  updatedAt: string | null
  createdBy: string | null
  updatedBy: string | null
}
```

---

## 6. isDirty Pattern trong DetailView

### 6.1 Khai báo state

```typescript
const editForm = reactive<XxxFormModel>(emptyForm())
const snapshot = ref<XxxFormModel | null>(null)
const formErrors = reactive<Partial<Record<keyof XxxFormModel, string>>>({})
const submitting = ref(false)
```

### 6.2 Sync từ entity

```typescript
function syncFormFromEntity() {
  if (!entity.data.value) return
  Object.assign(editForm, toForm(entity.data.value))        // adapter
  snapshot.value = structuredClone(toRaw(editForm))         // deep clone
}
```

### 6.3 isDirty — dùng TRACKED_FIELDS

```typescript
const TRACKED_FIELDS: ReadonlyArray<keyof XxxFormModel> = [
  'name', 'isActive', 'displayOrder',
  // KHÔNG include field readonly (vd: sku, id)
] as const

const isDirty = computed(() => {
  if (!snapshot.value) return false
  return TRACKED_FIELDS.some(f => editForm[f] !== snapshot.value![f])
})
```

### 6.4 Save / Discard / onFormUpdate

```typescript
function discardChanges() {
  syncFormFromEntity()
  delete formErrors.name   // delete — không gán undefined
}

async function saveChanges() {
  if (!editForm.name?.trim()) {
    formErrors.name = 'Tên là bắt buộc'
    return
  }
  delete formErrors.name
  submitting.value = true
  try {
    const ok = await updateXxx(entityId, toPayload(editForm))   // adapter
    if (ok) { await entity.execute(); syncFormFromEntity() }
  } finally { submitting.value = false }
}

function onFormUpdate(field: keyof XxxFormModel, value: unknown) {
  ;(editForm as Record<string, unknown>)[field] = value
  if (field === 'name' && typeof value === 'string' && value.trim())
    delete formErrors.name
}
```

### 6.5 NaN Guard

```typescript
const entityId = Number(route.params['id'])
if (isNaN(entityId)) void router.replace({ name: ROUTE_LIST })

onMounted(async () => {
  if (isNaN(entityId)) return
  await entity.execute()
  syncFormFromEntity()
})
```

---

## 7. Quy tắc đặt tên

### 7.1 Biến và ref trong DetailView

| Đối tượng | Pattern | Ví dụ |
|-----------|---------|-------|
| Async state entity | `entity` | `useAsyncState(...)` |
| Reactive form | `editForm` | `reactive<XxxFormModel>(emptyForm())` |
| Snapshot isDirty | `snapshot` | `ref<XxxFormModel \| null>(null)` |
| Form errors | `formErrors` | `reactive<Partial<...>>({})` |
| Submit loading | `submitting` | `ref(false)` |
| Tab active | `activeTab` | `ref('overview')` |
| Confirm dialog | `confirmOpen` | `ref(false)` |
| Pending nav action | `pendingNavAction` | `ref<'back' \| 'discard' \| null>(null)` |
| Tracked fields | `TRACKED_FIELDS` | `['name', 'isActive'] as const` |
| Item confirm xóa | `confirmItem` | `ref<XxxViewModel \| null>(null)` |

### 7.2 Functions trong DetailView

| Hành động | Pattern |
|-----------|---------|
| Sync form ← entity | `syncFormFromEntity` |
| Save | `saveChanges` |
| Discard (sau confirm) | `discardChanges` |
| Update 1 field | `onFormUpdate` |
| Xử lý @back từ tab | `onBack` |
| Xử lý @discard từ tab | `onDiscard` |
| Confirm bỏ thay đổi | `onConfirmUnsaved` |
| Fetch danh sách liên quan | `fetch{Subject}` |

### 7.3 Tab values

| Nội dung | Value |
|----------|-------|
| Form tổng quan | `"overview"` (không dùng `"info"`) |
| Danh sách liên quan | `"{entities}"` — ví dụ `"options"`, `"products"` |
| Override cửa hàng | `"stores"` |

---

## 8. Checklist khi tạo Detail Page mới

**Adapter (`xxx.adapter.ts`):**
- [ ] `toForm`, `toPayload`, `emptyForm` đã đầy đủ

**DetailView:**
- [ ] NaN guard trên `entityId` + guard trong `onMounted`
- [ ] `activeTab = ref('overview')`
- [ ] `syncFormFromEntity` dùng adapter + `structuredClone(toRaw(editForm))`
- [ ] `TRACKED_FIELDS` khai báo tường minh, không include readonly fields
- [ ] Confirm dialog nằm ở đây, không nằm trong OverviewTab
- [ ] `onBack` và `onDiscard` xử lý confirm logic

**OverviewTab:**
- [ ] Không import `useRouter`, service, composable
- [ ] Emit đúng 4 event: `update:form`, `save`, `discard`, `back`
- [ ] Dirty border CSS: `info-card` + `info-card--dirty`
- [ ] `AppAuditHistory` ở cuối, `cols="12"`, truyền `formatDate`
- [ ] `Number(v)` có guard `isNaN`

**ViewModel:**
- [ ] Có đủ 4 audit fields: `createdAt`, `createdBy`, `updatedAt`, `updatedBy`
