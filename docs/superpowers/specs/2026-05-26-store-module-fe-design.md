# Store Module FE — Design Spec

**Date:** 2026-05-26  
**Scope:** Vue 3 + TypeScript — Store module full CRUD + Store Member sub-menu  
**Reference pattern:** Brand module (`src/modules/brand/`)

---

## 1. Context

The Store module BE exposes 5 REST endpoints under `/admin/store`. The `AppStoreUser` join table exists in the DB but has no management endpoints yet. The FE currently has only a stray `useUser.ts` placeholder in `src/modules/store/` and the route mounts `ComingSoonView`.

The admin sidebar will have a **Quản lý cửa hàng** section with two sub-menus:
- **Cửa hàng** — full CRUD list + detail
- **Thành viên** — store-user assignments (placeholder until BE ships endpoints)

The Store filter dropdowns need Brand and Franchisee lists from the current user. The Brand-by-user API already exists on the FE (`brandApi.getByUserIdAsync`). The Franchisee layer does not — it will be built as part of this spec inside `modules/brand/`.

`BrandDetailView.vue` cleanup (stale `currency`/`timeZone` refs) was completed before this plan.

---

## 2. Goal

1. Build Franchisee FE layer (API constants + DTO + api + service) inside `modules/brand/`
2. Build full Store module FE: DTOs → ViewModel → FormModel → Mapper → Client → API → Service → Pinia store → Composable → Constants → Components → Views
3. Register routes; replace `ComingSoonView` with real views
4. Fix stale `GET_PAGED: '/stores'` constant (correct path is `/admin/store`)
5. Stub `StoreMembersView` with `AppEmptyState` until BE ships StoreUser endpoints

---

## 3. Architecture

Follows Brand module 4-layer FE pattern exactly:

```
DTO (PascalCase, BE contract)
  ↓ mapper
ViewModel (camelCase, UI state)
  ↓ mapper
FormModel (camelCase, form binding)

api.ts → storeClient (BaseClient subclass)
service.ts → wraps api, returns ViewModels
store.ts (Pinia) → state + actions calling service
composable.ts → toast-wrapped service calls for components
```

---

## 4. File Inventory

### 4.1 Modify existing files

| File | Change |
|---|---|
| `src/core/constants/api.constants.ts` | Fix STORE paths; add `FRANCHISEE_API`; add `STORE_MEMBER_API` |
| `src/core/constants/app-routes.constants.ts` | Add `STORES`, `STORE_DETAIL`, `STORE_MEMBERS`, `FRANCHISEES` |
| `src/router/routes.ts` | Mount `StoresView`, `StoreDetailView`, `StoreMembersView`; add `admin:franchisees` → `ComingSoonView` |
| `src/core/constants/menu-config.constants.ts` | Restructure Brand + Store entries as expandable groups with children |

### 4.2 New — Franchisee layer (`src/modules/brand/`)

```
models/dtos/franchisee.dto.ts
api/franchisee.api.ts
services/franchisee.service.ts
```

### 4.3 New — Store module (`src/modules/store/`)

```
models/dtos/
  _index.ts
  store.dto.ts
  store-filter.dto.ts
  create-store.dto.ts
  update-store.dto.ts
  delete-store.dto.ts
  store-member.dto.ts
  store-member-filter.dto.ts

models/view-models/
  store.view-model.ts
  store-member.view-model.ts

models/form-models/
  store.model.ts

mappers/
  store.mapper.ts
  store-member.mapper.ts

api/
  store.api.ts
  store-member.api.ts

services/
  store.service.ts
  store-member.service.ts

stores/
  store.store.ts
  store-member.store.ts

composables/
  useStore.ts
  useStoreMember.ts

constants/
  store-list.constants.ts
  store-form.constants.ts
  store-member-list.constants.ts

components/
  _index.ts
  StoreList.vue
  StoreForm.vue
  StoreMemberList.vue
  detail/StoreOverviewTab.vue

views/
  StoresView.vue
  StoreDetailView.vue
  StoreMembersView.vue

src/core/api/clients/store.client.ts
```

**Delete:** `src/modules/store/composables/useUser.ts` (stray placeholder)

---

## 5. Data Layer

### 5.1 API Constants additions

```ts
// Under BRAND — add alongside BRAND_API:
FRANCHISEE_API: {
  GET_BY_USER_ID: (userId: string) => `/admin/franchisee/by-user/${userId}`,
  GET_BY_BRAND_ID: (brandId: number) => `/admin/franchisee/by-brand/${brandId}`,
},

// Replace STORE section entirely:
STORE: {
  STORE_API: {
    GET_PAGED:  '/admin/store',
    CREATE:     '/admin/store',
    GET_BY_ID:  (id: number) => `/admin/store/${id}`,
    UPDATE:     (id: number) => `/admin/store/${id}`,
    DELETE:     (id: number) => `/admin/store/${id}`,
  },
  STORE_MEMBER_API: {
    GET_BY_STORE: (storeId: number) => `/admin/store/${storeId}/members`,
    ASSIGN:       (storeId: number) => `/admin/store/${storeId}/members`,
    REMOVE:       (storeId: number, userId: string) => `/admin/store/${storeId}/members/${userId}`,
  },
},
```

### 5.2 Franchisee DTO (`franchisee.dto.ts`)

PascalCase — matches `GetFranchiseeResponse`:

```ts
export interface FranchiseeDto {
  Id: number
  TenantId: string
  BrandId: number
  Name: string
  OwnerUserId?: string | null
  LegalName?: string | null
  TaxCode?: string | null
  Currency?: string | null
  IsActive: boolean
  JoinedDate?: string | null
  TerminatedDate?: string | null
  CreatedAt?: string | null
  CreatedBy?: string | null
  UpdatedAt?: string | null
  UpdatedBy?: string | null
}
```

### 5.3 Store DTOs

**`store.dto.ts`** — matches `GetStoreResponse`:
```ts
export interface StoreDto {
  Id: number
  TenantId: string
  BrandId: number
  FranchiseeId?: number | null
  Name: string
  Code: string
  Slug?: string | null
  LogoUrl?: string | null
  IsActive: boolean
  IsAcceptingOrders: boolean
  Phone?: string | null
  Email?: string | null
  Address?: string | null
  City?: string | null
  Ward?: string | null
  District?: string | null
  Province?: string | null
  Country?: string | null
  Latitude?: number | null
  Longitude?: number | null
  OpenTime?: string | null   // TimeOnly → "HH:mm:ss"
  CloseTime?: string | null
  TimeZone?: string | null
  CreatedAt?: string | null
  CreatedBy?: string | null
  UpdatedAt?: string | null
  UpdatedBy?: string | null
}
```

**`store-filter.dto.ts`**:
```ts
export interface StoreFilterDto {
  PageNumber: number
  PageSize: number
  BrandId?: number | null
  FranchiseeId?: number | null
  IsActive?: boolean | null
  Province?: string | null
  District?: string | null
  Keyword?: string | null
  SortBy?: string | null
  SortDirection?: string | null
}
```

**`create-store.dto.ts`** — matches `CreateStoreRequest` / `CreateStoreResponse` (same shape as StoreDto):

```ts
export interface CreateStoreRequest {
  BrandId: number
  FranchiseeId?: number | null
  Name: string
  Code: string
  Slug?: string | null
  LogoUrl?: string | null
  IsActive: boolean
  IsAcceptingOrders: boolean
  Phone?: string | null
  Email?: string | null
  Address?: string | null
  City?: string | null
  Ward?: string | null
  District?: string | null
  Province?: string | null
  Country?: string | null
  Latitude?: number | null
  Longitude?: number | null
  OpenTime?: string | null
  CloseTime?: string | null
  TimeZone?: string | null
}

export interface CreateStoreResponse extends StoreDto {}
```

**`update-store.dto.ts`** — matches `UpdateStoreRequest` / `UpdateStoreResponse`:

```ts
export interface UpdateStoreRequest {
  Name: string
  Slug?: string | null
  LogoUrl?: string | null
  IsActive: boolean
  IsAcceptingOrders: boolean
  Phone?: string | null
  Email?: string | null
  Address?: string | null
  City?: string | null
  Ward?: string | null
  District?: string | null
  Province?: string | null
  Country?: string | null
  Latitude?: number | null
  Longitude?: number | null
  OpenTime?: string | null
  CloseTime?: string | null
  TimeZone?: string | null
}

export interface UpdateStoreResponse extends StoreDto {}
```

**`delete-store.dto.ts`**:
```ts
export interface DeleteStoreResponse {
  StoreId: number
  Name: string
  DeletedAt: string
  DeletedBy?: string | null
}
```

**`store-member.dto.ts`**:
```ts
export interface StoreMemberDto {
  TenantId: string
  StoreId: number
  UserId: string
}
```

**`store-member-filter.dto.ts`**:
```ts
export interface StoreMemberFilterDto {
  PageNumber: number
  PageSize: number
  StoreId?: number | null
}
```

### 5.4 ViewModels

**`store.view-model.ts`**:
```ts
export interface StoreViewModel extends Record<string, unknown> {
  id: number
  tenantId: string
  brandId: number
  franchiseeId?: number | null
  name: string
  code: string
  slug?: string | null
  logoUrl?: string | null
  isActive: boolean
  isAcceptingOrders: boolean
  phone?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  ward?: string | null
  district?: string | null
  province?: string | null
  country?: string | null
  latitude?: number | null
  longitude?: number | null
  openTime?: string | null
  closeTime?: string | null
  timeZone?: string | null
  createdAt?: string | null
  createdBy?: string | null
  updatedAt?: string | null
  updatedBy?: string | null
}
```

**`store-member.view-model.ts`**:
```ts
export interface StoreMemberViewModel {
  storeId: number
  userId: string
  tenantId: string
}
```

### 5.5 FormModel

**`store.model.ts`** (used by `StoreForm` dialog and `StoreOverviewTab` inline edit):
```ts
export interface StoreFormModel {
  brandId: number | null
  franchiseeId?: number | null
  name: string
  code: string
  slug?: string | null
  logoUrl?: string | null
  isActive: boolean
  isAcceptingOrders: boolean
  phone?: string | null
  email?: string | null
  address?: string | null
  city?: string | null
  ward?: string | null
  district?: string | null
  province?: string | null
  country?: string | null
  latitude?: number | null
  longitude?: number | null
  openTime?: string | null
  closeTime?: string | null
  timeZone?: string | null
}
```

### 5.6 Mapper (`store.mapper.ts`)

Methods:
- `toViewModels(dtos: StoreDto[]): StoreViewModel[]`
- `toViewModel(dto: StoreDto): StoreViewModel`
- `toFormModel(vm: StoreViewModel | null): StoreFormModel | null`
- `createResponseToViewModel(res: CreateStoreResponse): StoreViewModel`
- `updateResponseToViewModel(res: UpdateStoreResponse): StoreViewModel`
- `formModelToCreateRequest(form: StoreFormModel): CreateStoreRequest`
- `formModelToUpdateRequest(form: StoreFormModel): UpdateStoreRequest`

`store-member.mapper.ts` — `toViewModel(dto: StoreMemberDto): StoreMemberViewModel`

---

## 6. Infrastructure

### 6.1 StoreClient (`src/core/api/clients/store.client.ts`)

```ts
const ENV_STORE_API_URL = import.meta.env.VITE_STORE_BASE_URL
// throws if undefined, same guard as brand.client.ts
export class StoreClient extends BaseClient { ... }
export const storeClient = new StoreClient()
```

Env var `VITE_STORE_BASE_URL` must be added to `.env.development`.

### 6.2 `store.api.ts`

Uses `storeClient`:
- `getPagedAsync(params: StoreFilterDto): Promise<PagedApiResponse<StoreDto>>`
- `getByIdAsync(id: number): Promise<ApiResponse<StoreDto>>`
- `createAsync(payload: CreateStoreRequest): Promise<ApiResponse<CreateStoreResponse>>`
- `updateAsync(id: number, payload: UpdateStoreRequest): Promise<ApiResponse<UpdateStoreResponse>>`
- `deleteAsync(id: number): Promise<ApiResponse<DeleteStoreResponse>>`

### 6.3 `store-member.api.ts`

Uses `storeClient`. BE endpoints not implemented — methods are **typed shells only** (no throws, bodies return `Promise.reject('not implemented')` so TypeScript is satisfied and file compiles):
- `getMembersByStoreAsync(storeId: number): Promise<PagedApiResponse<StoreMemberDto>>`
- `assignAsync(storeId: number, userId: string): Promise<ApiResponse<StoreMemberDto>>`
- `removeAsync(storeId: number, userId: string): Promise<ApiResponse<void>>`

### 6.4 `franchisee.api.ts`

Uses `brandClient` (same base URL as Brand):
- `getByUserIdAsync(userId: string): Promise<ApiResponse<FranchiseeDto[]>>`
- `getByBrandIdAsync(brandId: number): Promise<ApiResponse<FranchiseeDto[]>>`

### 6.5 Services

**`store.service.ts`** — class `StoreService`, exported as singleton `storeService`:
- `getPagedStoresAsync(filter): Promise<PagedResult<StoreViewModel>>`
- `getStoreAsync(id): Promise<StoreViewModel | null>`
- `createStoreAsync(payload): Promise<StoreViewModel | null>`
- `updateStoreAsync(id, payload): Promise<StoreViewModel | null>`
- `deleteStoreAsync(id): Promise<void>`

**`franchisee.service.ts`** — `FranchiseeService` / `franchiseeService`:
- `getFranchiseesByUserIdAsync(userId): Promise<FranchiseeDto[]>`
- `getFranchiseesByBrandIdAsync(brandId): Promise<FranchiseeDto[]>`

> **Exception:** Returns raw `FranchiseeDto[]` instead of a ViewModel — intentional. Franchisees are consumed only as filter dropdown options (`{ value: dto.Id, label: dto.Name }`). Adding a ViewModel + mapper for this read-only use case would be over-engineering.

**`store-member.service.ts`** — stub, mirrors service pattern, wires to `store-member.api.ts`.

---

## 7. State

### 7.1 `store.store.ts` (Pinia)

Mirrors `brand.store.ts` exactly:

```ts
// State
stores: StoreViewModel[]
currentStore: StoreViewModel | null
pagination: PaginationState
filter: StoreFilterDto
listLoading / detailLoading / saving / deleting / error

// Actions
fetchPaged(params?) / fetchById(id) / create(payload) / update(id, payload) / remove(id)
setFilter / setCurrentStore / reset
```

### 7.2 `store-member.store.ts`

Minimal store — stub state ready for when BE is available:
```ts
members: StoreMemberViewModel[]
listLoading: boolean
error: string | null
```

### 7.3 `useStore.ts` (composable)

Toast-wrapped service calls — mirrors `useBrand.ts`:
- `getPagedStores / getStore / createStore / updateStore / deleteStore`

### 7.4 `useStoreMember.ts`

Stub composable — wires to `store-member.service` when BE ready.

---

## 8. UI

### 8.1 Constants

**`store-list.constants.ts`**:
- `STORE_LIST_EMIT` — same event set as `BRAND_LIST_EMIT`
- `STORE_ROW_ACTION` — `VIEW`, `EDIT`, `DELETE`
- `STORE_LIST_FILTER_FIELDS(brandOptions, franchiseeOptions): FilterField[]` — factory function, not a static const. Called by `StoresView` after async options load, then passed as prop to `StoreList`. This avoids the static-options limitation of `AppDataFilter`.
- `STORE_LIST_COLUMNS`: Name, Code, Brand, IsActive, IsAcceptingOrders, Province, UpdatedAt, Actions
- `STORE_LIST_ROW_ACTIONS`
- `STORE_STATUS_CONFIG` (Active / Inactive)

**`store-form.constants.ts`**:
- `STORE_FORM_SECTION` enum — `BASIC`, `CONTACT`, `LOCATION`, `OPERATION`

**`store-member-list.constants.ts`**:
- Columns, emit constants for `StoreMemberList`

### 8.2 Components

**`StoreList.vue`** — dumb component, mirrors `BrandList.vue`:
- Props: items, loading, pageNumber, pageSize, totalPages, totalItems, activeFilters, sortBy
- Emits: all standard list events
- Filter dropdowns for BrandId / FranchiseeId are driven by props (options passed from view)

**`StoreForm.vue`** — dialog with 4 visual sections separated by `<v-divider>`:
1. **Thông tin chung** — BrandId (select), FranchiseeId (select), Name\*, Code\*, Slug, LogoUrl, IsActive toggle, IsAcceptingOrders toggle
2. **Liên hệ** — Phone, Email
3. **Địa chỉ** — Address, City, Ward, District, Province, Country, Latitude, Longitude
4. **Vận hành** — OpenTime, CloseTime, TimeZone

`BrandId` and `FranchiseeId` selects receive options as props from `StoresView` (loaded once on mount).

**`StoreOverviewTab.vue`** — inline edit, same 4 sections as `StoreForm`. Mirrors `BrandOverviewTab` pattern — `@update:form`, `@save`, `@discard` emits.

**`StoreMemberList.vue`** — stub: renders `AppEmptyState` with "Tính năng đang phát triển" message until BE ships.

**`_index.ts`** — barrel export for all components.

### 8.3 Views

**`StoresView.vue`** — mirrors `BrandsView.vue`:
- `useListPage` for pagination/filter/sort
- Loads brand options and franchisee options on mount (for filter dropdowns)
- `StoreList` + `StoreForm` dialog + delete `AppDialog`
- Row action VIEW → navigate to `admin:store-detail`

**`StoreDetailView.vue`** — mirrors `BrandDetailView.vue`:
- Hero header with name + code
- Single tab: **Tổng quan** → `StoreOverviewTab`
- Breadcrumb: Dashboard → Cửa hàng → {name}
- Not-found state

**`StoreMembersView.vue`**:
- `AppPageHeader` title "Thành viên cửa hàng"
- `StoreMemberList` (renders placeholder `AppEmptyState`)

---

## 9. Navigation Menu Restructuring

Both **Thương hiệu** and **Cửa hàng** entries in `menu-config.constants.ts` are currently standalone links. They become expandable groups (same pattern as Sản phẩm).

### Brand group (remove `to`, add `children`)

```ts
{
  title: 'Thương hiệu',
  icon: 'mdi-domain',
  roles: [SUPER_ADMIN, ORG_ADMIN, BRAND_MANAGER, BRAND_ACCOUNTANT],
  children: [
    { title: 'Thương hiệu', to: APP_ROUTES.ADMIN.CHILDREN.BRANDS.NAME },
    { title: 'Nhà nhượng quyền', to: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME },
  ],
},
```

New route `admin:franchisees` → `ComingSoonView`, path `'franchisees'`.

### Store group (remove `to`, add `children`)

```ts
{
  title: 'Cửa hàng',
  icon: 'mdi-store',
  roles: [SUPER_ADMIN, ORG_ADMIN],
  children: [
    { title: 'Cửa hàng', to: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME },
    { title: 'Thành viên', to: APP_ROUTES.ADMIN.CHILDREN.STORE_MEMBERS.NAME },
  ],
},
```

### `app-routes.constants.ts` additions

```ts
FRANCHISEES:   { NAME: 'admin:franchisees',    PATH: 'franchisees' },
STORES:        { NAME: 'admin:stores',          PATH: 'stores' },
STORE_DETAIL:  { NAME: 'admin:store-detail',    PATH: 'stores/:id' },
STORE_MEMBERS: { NAME: 'admin:store-members',   PATH: 'store-members' },
```

---

## 10. Routing

### `routes.ts` changes:

- Replace `ComingSoonView` on path `'stores'` → `StoresView` (name `admin:stores`)
- Add `{ path: 'stores/:id', name: 'admin:store-detail', component: StoreDetailView }`
- Add `{ path: 'store-members', name: 'admin:store-members', component: StoreMembersView }`
- Add `{ path: 'franchisees', name: 'admin:franchisees', component: ComingSoonView }`

---

## 11. Dependencies & Constraints

| Item | Status |
|---|---|
| BE Store CRUD endpoints | ✅ Implemented |
| BE Franchisee by-user / by-brand endpoints | ✅ Implemented |
| BE StoreUser management endpoints | ❌ Not implemented — `StoreMembersView` and `store-member.*` files are stubs |
| `VITE_STORE_BASE_URL` env var | Must be added to `.env.development` |

---

## 11. Out of Scope

- Store Member full implementation (blocked on BE)
- Store detail "Members" tab (same blocker)
- EF Core migration to drop `Currency`/`TimeZone` from `AppBrands` (BE task, separate)
