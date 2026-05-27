# Store Module FE Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Store module FE (full CRUD + Store Member stub) and the Franchisee FE API layer used for Store filter/form dropdowns.

**Prerequisite:** `2026-05-26-menu-restructure.md` must be completed first — it adds `FRANCHISEES`, `STORES`, `STORE_DETAIL`, `STORE_MEMBERS` to `app-routes.constants.ts` and registers ComingSoon placeholder routes for each.

**Architecture:** Mirrors Brand module 4-layer pattern — DTO → Mapper → ViewModel / FormModel → API → Service → Pinia store → Composable → Constants → Components → Views. A `StoreClient` extends `BaseClient`. Franchisee API/service lives in `modules/brand/` and provides dropdown options to Store filter and form. All working directory commands run from `NDTCore.FE/`.

**Tech Stack:** Vue 3 Composition API, TypeScript strict, Pinia, Vuetify 3, Axios via `BaseClient`, `useListPage` composable for list pages.

---

## File Map

| File | Action | Purpose |
|---|---|---|
| `src/core/constants/api.constants.ts` | Modify | Fix STORE paths, add FRANCHISEE_API + STORE_MEMBER_API |
| `src/core/api/clients/store.client.ts` | Create | Axios client scoped to VITE_STORE_BASE_URL |
| `src/modules/store/composables/useUser.ts` | Delete | Stray placeholder |
| `src/modules/brand/models/dtos/franchisee.dto.ts` | Create | PascalCase DTO matching GetFranchiseeResponse |
| `src/modules/brand/api/franchisee.api.ts` | Create | HTTP calls using brandClient |
| `src/modules/brand/services/franchisee.service.ts` | Create | Business logic returning FranchiseeDto[] for dropdowns |
| `src/modules/store/models/dtos/_index.ts` | Create | Barrel export |
| `src/modules/store/models/dtos/store.dto.ts` | Create | GetStoreResponse contract |
| `src/modules/store/models/dtos/store-filter.dto.ts` | Create | Query params |
| `src/modules/store/models/dtos/create-store.dto.ts` | Create | Request + Response |
| `src/modules/store/models/dtos/update-store.dto.ts` | Create | Request + Response |
| `src/modules/store/models/dtos/delete-store.dto.ts` | Create | Delete response |
| `src/modules/store/models/dtos/store-member.dto.ts` | Create | StoreUser record |
| `src/modules/store/models/dtos/store-member-filter.dto.ts` | Create | StoreUser filter params |
| `src/modules/store/models/view-models/store.view-model.ts` | Create | camelCase UI model |
| `src/modules/store/models/view-models/store-member.view-model.ts` | Create | camelCase StoreUser |
| `src/modules/store/models/form-models/store.model.ts` | Create | Form binding model |
| `src/modules/store/mappers/store.mapper.ts` | Create | DTO ↔ ViewModel ↔ FormModel |
| `src/modules/store/mappers/store-member.mapper.ts` | Create | StoreMember DTO → ViewModel |
| `src/modules/store/api/store.api.ts` | Create | 5 CRUD methods |
| `src/modules/store/api/store-member.api.ts` | Create | Typed stubs (BE not ready) |
| `src/modules/store/services/store.service.ts` | Create | Wraps API, returns ViewModels |
| `src/modules/store/services/store-member.service.ts` | Create | Stub |
| `src/modules/store/stores/store.store.ts` | Create | Pinia store — full CRUD state |
| `src/modules/store/stores/store-member.store.ts` | Create | Stub state |
| `src/modules/store/composables/useStore.ts` | Create | Toast-wrapped service calls |
| `src/modules/store/composables/useStoreMember.ts` | Create | Stub |
| `src/modules/store/constants/store-list.constants.ts` | Create | Columns, filter factory, row actions, status config |
| `src/modules/store/constants/store-form.constants.ts` | Create | Form section enum |
| `src/modules/store/constants/store-member-list.constants.ts` | Create | Columns + emits for member list |
| `src/modules/store/components/_index.ts` | Create | Barrel |
| `src/modules/store/components/StoreList.vue` | Create | Dumb list component |
| `src/modules/store/components/StoreForm.vue` | Create | Create/edit dialog, 4 sections |
| `src/modules/store/components/StoreMemberList.vue` | Create | Placeholder AppEmptyState |
| `src/modules/store/components/detail/StoreOverviewTab.vue` | Create | Inline edit, 4 sections |
| `src/modules/store/views/StoresView.vue` | Create | List page |
| `src/modules/store/views/StoreDetailView.vue` | Create | Detail page |
| `src/modules/store/views/StoreMembersView.vue` | Create | Placeholder page |
| `src/router/routes.ts` | Modify | Replace ComingSoon entries with real views |

---

## Task 1: Fix `api.constants.ts`

**Files:** Modify `src/core/constants/api.constants.ts`

- [ ] Replace the entire file with the corrected constants:

```ts
export const API_ENDPOINTS = {
    IDENTITY: {
        AUTH_API: {
            LOGIN: '/admin/auth/login',
            REFRESH: '/admin/auth/refresh',
            REGISTER: 'admin/auth/register',
        },
        USERS_API: {
            GET_PAGED: '/admin/users',
            GET_PROFILE: 'admin/users/profile',
        },
    },
    BRAND: {
        BRAND_API: {
            GET_PAGED: '/admin/brand',
            CREATE: '/admin/brand',
            GET_BY_ID: (id: number) => `/admin/brand/${id}`,
            UPDATE: (id: number) => `/admin/brand/${id}`,
            UPDATE_STATUS: (id: number) => `/admin/brand/${id}/status`,
            DELETE: (id: number) => `/admin/brand/${id}`,
            GET_BY_USER_ID: (userId: string) => `/admin/brand/by-user/${userId}`,
            GET_MEMBERS: (id: number) => `/admin/brand/${id}/users`,
            ASSIGN_USERS: (id: number) => `/admin/brand/${id}/users`,
            REMOVE_USER: (id: number, userId: string) => `/admin/brand/${id}/users/${userId}`,
        },
        FRANCHISEE_API: {
            GET_BY_USER_ID: (userId: string) => `/admin/franchisee/by-user/${userId}`,
            GET_BY_BRAND_ID: (brandId: number) => `/admin/franchisee/by-brand/${brandId}`,
        },
    },
    STORE: {
        STORE_API: {
            GET_PAGED: '/admin/store',
            CREATE: '/admin/store',
            GET_BY_ID: (id: number) => `/admin/store/${id}`,
            UPDATE: (id: number) => `/admin/store/${id}`,
            DELETE: (id: number) => `/admin/store/${id}`,
        },
        STORE_MEMBER_API: {
            GET_BY_STORE: (storeId: number) => `/admin/store/${storeId}/members`,
            ASSIGN: (storeId: number) => `/admin/store/${storeId}/members`,
            REMOVE: (storeId: number, userId: string) => `/admin/store/${storeId}/members/${userId}`,
        },
    },
    ORDER: {
        ORDER_API: {},
    },
} as const
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/core/constants/api.constants.ts
git commit -m "fix: correct store API paths and add franchisee + store-member endpoint constants"
```

---

## Task 2: Create `store.client.ts`

**Files:** Create `src/core/api/clients/store.client.ts`

- [ ] Create the file:

```ts
import { BaseClient } from './base.client'

const ENV_STORE_API_URL = import.meta.env.VITE_STORE_BASE_URL as string | undefined
if (!ENV_STORE_API_URL) throw new Error('[StoreClient] VITE_STORE_BASE_URL is not defined')

export class StoreClient extends BaseClient {
    constructor() {
        super({
            baseURL: ENV_STORE_API_URL,
        })
    }
}

export const storeClient = new StoreClient()
```

- [ ] Confirm `VITE_STORE_BASE_URL` is in `.env.development` — open the file and verify a line like `VITE_STORE_BASE_URL=https://localhost:44392/api` exists. Add it if missing.

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/core/api/clients/store.client.ts
git commit -m "feat: add StoreClient"
```

---

## Task 3: Delete stray placeholder

**Files:** Delete `src/modules/store/composables/useUser.ts`

- [ ] Delete the file:
```powershell
Remove-Item "src/modules/store/composables/useUser.ts"
```

- [ ] Run type-check: `npm run type-check` — expected: PASS (nothing imports it)

- [ ] Commit:
```bash
git add src/modules/store/composables/useUser.ts
git commit -m "chore: remove stray useUser placeholder from store module"
```

---

## Task 4: Franchisee DTO + API

**Files:**
- Create `src/modules/brand/models/dtos/franchisee.dto.ts`
- Create `src/modules/brand/api/franchisee.api.ts`

- [ ] Create `franchisee.dto.ts` (PascalCase — matches `GetFranchiseeResponse` on BE):

```ts
export interface FranchiseeDto {
    Id: number
    TenantId: string
    BrandId: number
    Name: string
    LegalName?: string | null
    TaxCode?: string | null
    BankAccount?: string | null
    BankName?: string | null
    IsActive: boolean
    JoinedDate?: string | null
    TerminatedDate?: string | null
    CreatedAt?: string | null
    CreatedBy?: string | null
    UpdatedAt?: string | null
    UpdatedBy?: string | null
}
```

- [ ] Create `franchisee.api.ts`:

```ts
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse } from '@/core/models/common.dto'
import type { FranchiseeDto } from '@/modules/brand/models/dtos/franchisee.dto'
import { brandClient } from '@/core/api/clients/brand.client'

export const franchiseeApi = {
    getByUserIdAsync(userId: string): Promise<ApiResponse<FranchiseeDto[]>> {
        return brandClient.get(API_ENDPOINTS.BRAND.FRANCHISEE_API.GET_BY_USER_ID(userId))
    },

    getByBrandIdAsync(brandId: number): Promise<ApiResponse<FranchiseeDto[]>> {
        return brandClient.get(API_ENDPOINTS.BRAND.FRANCHISEE_API.GET_BY_BRAND_ID(brandId))
    },
}
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/brand/models/dtos/franchisee.dto.ts src/modules/brand/api/franchisee.api.ts
git commit -m "feat: add franchisee DTO and API"
```

---

## Task 5: Franchisee Service

**Files:** Create `src/modules/brand/services/franchisee.service.ts`

- [ ] Create the file (returns raw DTOs — used only for dropdown options, no ViewModel mapping needed):

```ts
import { franchiseeApi } from '@/modules/brand/api/franchisee.api'
import type { FranchiseeDto } from '@/modules/brand/models/dtos/franchisee.dto'

class FranchiseeService {
    async getFranchiseesByUserIdAsync(userId: string): Promise<FranchiseeDto[]> {
        const response = await franchiseeApi.getByUserIdAsync(userId)
        return response.Data ?? []
    }

    async getFranchiseesByBrandIdAsync(brandId: number): Promise<FranchiseeDto[]> {
        const response = await franchiseeApi.getByBrandIdAsync(brandId)
        return response.Data ?? []
    }
}

export const franchiseeService = new FranchiseeService()
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/brand/services/franchisee.service.ts
git commit -m "feat: add franchisee service"
```

---

## Task 6: Store DTOs — core

**Files:**
- Create `src/modules/store/models/dtos/store.dto.ts`
- Create `src/modules/store/models/dtos/store-filter.dto.ts`

- [ ] Create `store.dto.ts` (matches `GetStoreResponse`):

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
    OpenTime?: string | null
    CloseTime?: string | null
    TimeZone?: string | null
    CreatedAt?: string | null
    CreatedBy?: string | null
    UpdatedAt?: string | null
    UpdatedBy?: string | null
}
```

- [ ] Create `store-filter.dto.ts` (matches `StoreFilterDto` + shared paging/sort fields):

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

- [ ] Run type-check: `npm run type-check` — expected: PASS

---

## Task 7: Store DTOs — CRUD request/response

**Files:**
- Create `src/modules/store/models/dtos/create-store.dto.ts`
- Create `src/modules/store/models/dtos/update-store.dto.ts`
- Create `src/modules/store/models/dtos/delete-store.dto.ts`
- Create `src/modules/store/models/dtos/store-member.dto.ts`
- Create `src/modules/store/models/dtos/store-member-filter.dto.ts`
- Create `src/modules/store/models/dtos/_index.ts`

- [ ] Create `create-store.dto.ts` (matches `CreateStoreRequest` / `CreateStoreResponse`):

```ts
import type { StoreDto } from './store.dto'

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

// CreateStoreResponse has the same shape as GetStoreResponse
export type CreateStoreResponse = StoreDto
```

- [ ] Create `update-store.dto.ts` (matches `UpdateStoreRequest` — BrandId/FranchiseeId/Code are NOT included):

```ts
import type { StoreDto } from './store.dto'

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

export type UpdateStoreResponse = StoreDto
```

- [ ] Create `delete-store.dto.ts`:

```ts
export interface DeleteStoreResponse {
    StoreId: number
    Name: string
    DeletedAt: string
    DeletedBy?: string | null
}
```

- [ ] Create `store-member.dto.ts`:

```ts
export interface StoreMemberDto {
    TenantId: string
    StoreId: number
    UserId: string
}
```

- [ ] Create `store-member-filter.dto.ts`:

```ts
export interface StoreMemberFilterDto {
    PageNumber: number
    PageSize: number
    StoreId?: number | null
}
```

- [ ] Create `_index.ts` barrel:

```ts
export * from './store.dto'
export * from './store-filter.dto'
export * from './create-store.dto'
export * from './update-store.dto'
export * from './delete-store.dto'
export * from './store-member.dto'
export * from './store-member-filter.dto'
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/models/dtos/
git commit -m "feat: add store DTOs"
```

---

## Task 8: Store ViewModel + FormModel

**Files:**
- Create `src/modules/store/models/view-models/store.view-model.ts`
- Create `src/modules/store/models/view-models/store-member.view-model.ts`
- Create `src/modules/store/models/form-models/store.model.ts`

- [ ] Create `store.view-model.ts` (`extends Record<string, unknown>` required by `AppDataTable`):

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

- [ ] Create `store-member.view-model.ts`:

```ts
export interface StoreMemberViewModel {
    storeId: number
    userId: string
    tenantId: string
}
```

- [ ] Create `store.model.ts` (FormModel — all fields including create-only ones; mapper excludes them for update):

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

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/models/
git commit -m "feat: add store view-models and form model"
```

---

## Task 9: Store Mapper

**Files:**
- Create `src/modules/store/mappers/store.mapper.ts`
- Create `src/modules/store/mappers/store-member.mapper.ts`

- [ ] Create `store.mapper.ts`:

```ts
import type { StoreDto } from '@/modules/store/models/dtos/store.dto'
import type { CreateStoreResponse } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreResponse } from '@/modules/store/models/dtos/update-store.dto'
import type { CreateStoreRequest } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreRequest } from '@/modules/store/models/dtos/update-store.dto'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'

export const storeMapper = {
    toViewModels(dtos: StoreDto[]): StoreViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },

    toViewModel(dto: StoreDto): StoreViewModel {
        return {
            id: dto.Id,
            tenantId: dto.TenantId,
            brandId: dto.BrandId,
            franchiseeId: dto.FranchiseeId ?? null,
            name: dto.Name,
            code: dto.Code,
            slug: dto.Slug ?? null,
            logoUrl: dto.LogoUrl ?? null,
            isActive: dto.IsActive,
            isAcceptingOrders: dto.IsAcceptingOrders,
            phone: dto.Phone ?? null,
            email: dto.Email ?? null,
            address: dto.Address ?? null,
            city: dto.City ?? null,
            ward: dto.Ward ?? null,
            district: dto.District ?? null,
            province: dto.Province ?? null,
            country: dto.Country ?? null,
            latitude: dto.Latitude ?? null,
            longitude: dto.Longitude ?? null,
            openTime: dto.OpenTime ?? null,
            closeTime: dto.CloseTime ?? null,
            timeZone: dto.TimeZone ?? null,
            createdAt: dto.CreatedAt ?? null,
            createdBy: dto.CreatedBy ?? null,
            updatedAt: dto.UpdatedAt ?? null,
            updatedBy: dto.UpdatedBy ?? null,
        }
    },

    toFormModel(store: StoreViewModel | null): StoreFormModel | null {
        if (!store) return null
        return {
            brandId: store.brandId,
            franchiseeId: store.franchiseeId ?? null,
            name: store.name,
            code: store.code,
            slug: store.slug ?? null,
            logoUrl: store.logoUrl ?? null,
            isActive: store.isActive,
            isAcceptingOrders: store.isAcceptingOrders,
            phone: store.phone ?? null,
            email: store.email ?? null,
            address: store.address ?? null,
            city: store.city ?? null,
            ward: store.ward ?? null,
            district: store.district ?? null,
            province: store.province ?? null,
            country: store.country ?? null,
            latitude: store.latitude ?? null,
            longitude: store.longitude ?? null,
            openTime: store.openTime ?? null,
            closeTime: store.closeTime ?? null,
            timeZone: store.timeZone ?? null,
        }
    },

    createResponseToViewModel(res: CreateStoreResponse): StoreViewModel {
        return this.toViewModel(res)
    },

    updateResponseToViewModel(res: UpdateStoreResponse): StoreViewModel {
        return this.toViewModel(res)
    },

    formModelToCreateRequest(form: StoreFormModel): CreateStoreRequest {
        return {
            BrandId: form.brandId!,
            FranchiseeId: form.franchiseeId ?? null,
            Name: form.name.trim(),
            Code: form.code.trim(),
            Slug: form.slug?.trim() ?? null,
            LogoUrl: form.logoUrl?.trim() ?? null,
            IsActive: form.isActive,
            IsAcceptingOrders: form.isAcceptingOrders,
            Phone: form.phone?.trim() ?? null,
            Email: form.email?.trim() ?? null,
            Address: form.address?.trim() ?? null,
            City: form.city?.trim() ?? null,
            Ward: form.ward?.trim() ?? null,
            District: form.district?.trim() ?? null,
            Province: form.province?.trim() ?? null,
            Country: form.country?.trim() ?? null,
            Latitude: form.latitude ?? null,
            Longitude: form.longitude ?? null,
            OpenTime: form.openTime ?? null,
            CloseTime: form.closeTime ?? null,
            TimeZone: form.timeZone?.trim() ?? null,
        }
    },

    // BrandId, FranchiseeId, Code are NOT in UpdateStoreRequest
    formModelToUpdateRequest(form: StoreFormModel): UpdateStoreRequest {
        return {
            Name: form.name.trim(),
            Slug: form.slug?.trim() ?? null,
            LogoUrl: form.logoUrl?.trim() ?? null,
            IsActive: form.isActive,
            IsAcceptingOrders: form.isAcceptingOrders,
            Phone: form.phone?.trim() ?? null,
            Email: form.email?.trim() ?? null,
            Address: form.address?.trim() ?? null,
            City: form.city?.trim() ?? null,
            Ward: form.ward?.trim() ?? null,
            District: form.district?.trim() ?? null,
            Province: form.province?.trim() ?? null,
            Country: form.country?.trim() ?? null,
            Latitude: form.latitude ?? null,
            Longitude: form.longitude ?? null,
            OpenTime: form.openTime ?? null,
            CloseTime: form.closeTime ?? null,
            TimeZone: form.timeZone?.trim() ?? null,
        }
    },
}
```

- [ ] Create `store-member.mapper.ts`:

```ts
import type { StoreMemberDto } from '@/modules/store/models/dtos/store-member.dto'
import type { StoreMemberViewModel } from '@/modules/store/models/view-models/store-member.view-model'

export const storeMemberMapper = {
    toViewModel(dto: StoreMemberDto): StoreMemberViewModel {
        return {
            storeId: dto.StoreId,
            userId: dto.UserId,
            tenantId: dto.TenantId,
        }
    },

    toViewModels(dtos: StoreMemberDto[]): StoreMemberViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },
}
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/mappers/
git commit -m "feat: add store and store-member mappers"
```

---

## Task 10: Store API + Store Member API

**Files:**
- Create `src/modules/store/api/store.api.ts`
- Create `src/modules/store/api/store-member.api.ts`

- [ ] Create `store.api.ts`:

```ts
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type { StoreDto } from '@/modules/store/models/dtos/store.dto'
import type { StoreFilterDto } from '@/modules/store/models/dtos/store-filter.dto'
import type { CreateStoreRequest, CreateStoreResponse } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreRequest, UpdateStoreResponse } from '@/modules/store/models/dtos/update-store.dto'
import type { DeleteStoreResponse } from '@/modules/store/models/dtos/delete-store.dto'
import { storeClient } from '@/core/api/clients/store.client'

export const storeApi = {
    getPagedAsync(params: StoreFilterDto): Promise<PagedApiResponse<StoreDto>> {
        return storeClient.get(API_ENDPOINTS.STORE.STORE_API.GET_PAGED, params)
    },

    getByIdAsync(id: number): Promise<ApiResponse<StoreDto>> {
        return storeClient.get(API_ENDPOINTS.STORE.STORE_API.GET_BY_ID(id))
    },

    createAsync(payload: CreateStoreRequest): Promise<ApiResponse<CreateStoreResponse>> {
        return storeClient.post(API_ENDPOINTS.STORE.STORE_API.CREATE, payload)
    },

    updateAsync(id: number, payload: UpdateStoreRequest): Promise<ApiResponse<UpdateStoreResponse>> {
        return storeClient.put(API_ENDPOINTS.STORE.STORE_API.UPDATE(id), payload)
    },

    deleteAsync(id: number): Promise<ApiResponse<DeleteStoreResponse>> {
        return storeClient.delete(API_ENDPOINTS.STORE.STORE_API.DELETE(id))
    },
}
```

- [ ] Create `store-member.api.ts` (typed stubs — BE endpoints not yet implemented):

```ts
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type { StoreMemberDto } from '@/modules/store/models/dtos/store-member.dto'
import { storeClient } from '@/core/api/clients/store.client'

export const storeMemberApi = {
    getMembersByStoreAsync(storeId: number): Promise<PagedApiResponse<StoreMemberDto>> {
        return storeClient.get(API_ENDPOINTS.STORE.STORE_MEMBER_API.GET_BY_STORE(storeId))
    },

    assignAsync(storeId: number, userId: string): Promise<ApiResponse<StoreMemberDto>> {
        return storeClient.post(API_ENDPOINTS.STORE.STORE_MEMBER_API.ASSIGN(storeId), { userId })
    },

    removeAsync(storeId: number, userId: string): Promise<ApiResponse<void>> {
        return storeClient.delete(API_ENDPOINTS.STORE.STORE_MEMBER_API.REMOVE(storeId, userId))
    },
}
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/api/
git commit -m "feat: add store and store-member API modules"
```

---

## Task 11: Store Service + Store Member Service

**Files:**
- Create `src/modules/store/services/store.service.ts`
- Create `src/modules/store/services/store-member.service.ts`

- [ ] Create `store.service.ts`:

```ts
import { storeApi } from '@/modules/store/api/store.api'
import { storeMapper } from '@/modules/store/mappers/store.mapper'
import type { StoreFilterDto } from '@/modules/store/models/dtos/store-filter.dto'
import type { CreateStoreRequest } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreRequest } from '@/modules/store/models/dtos/update-store.dto'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class StoreService {
    async getPagedStoresAsync(filter: StoreFilterDto): Promise<PagedResult<StoreViewModel>> {
        const response = await storeApi.getPagedAsync(filter)
        return {
            items: storeMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getStoreAsync(id: number): Promise<StoreViewModel | null> {
        const response = await storeApi.getByIdAsync(id)
        return response.Data ? storeMapper.toViewModel(response.Data) : null
    }

    async createStoreAsync(payload: CreateStoreRequest): Promise<StoreViewModel | null> {
        const response = await storeApi.createAsync(payload)
        return response.Data ? storeMapper.createResponseToViewModel(response.Data) : null
    }

    async updateStoreAsync(id: number, payload: UpdateStoreRequest): Promise<StoreViewModel | null> {
        const response = await storeApi.updateAsync(id, payload)
        return response.Data ? storeMapper.updateResponseToViewModel(response.Data) : null
    }

    async deleteStoreAsync(id: number): Promise<void> {
        await storeApi.deleteAsync(id)
    }
}

export const storeService = new StoreService()
```

- [ ] Create `store-member.service.ts` (stub):

```ts
import { storeMemberApi } from '@/modules/store/api/store-member.api'
import { storeMemberMapper } from '@/modules/store/mappers/store-member.mapper'
import type { StoreMemberViewModel } from '@/modules/store/models/view-models/store-member.view-model'

class StoreMemberService {
    async getMembersByStoreAsync(storeId: number): Promise<StoreMemberViewModel[]> {
        const response = await storeMemberApi.getMembersByStoreAsync(storeId)
        return storeMemberMapper.toViewModels(response.Data ?? [])
    }

    async assignAsync(storeId: number, userId: string): Promise<void> {
        await storeMemberApi.assignAsync(storeId, userId)
    }

    async removeAsync(storeId: number, userId: string): Promise<void> {
        await storeMemberApi.removeAsync(storeId, userId)
    }
}

export const storeMemberService = new StoreMemberService()
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/services/
git commit -m "feat: add store and store-member services"
```

---

## Task 12: Pinia Stores

**Files:**
- Create `src/modules/store/stores/store.store.ts`
- Create `src/modules/store/stores/store-member.store.ts`

- [ ] Create `store.store.ts` (mirrors `brand.store.ts`):

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { storeService } from '@/modules/store/services/store.service'
import { createLogger } from '@/core/logger/logger'
import type { StoreFilterDto } from '@/modules/store/models/dtos/store-filter.dto'
import type { CreateStoreRequest } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreRequest } from '@/modules/store/models/dtos/update-store.dto'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

const log = createLogger('store-store')

type PaginationState = Omit<PagedResult<StoreViewModel>, 'items'>

const DEFAULT_PAGINATION: PaginationState = {
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
}

const DEFAULT_FILTER: StoreFilterDto = {
    PageNumber: 1,
    PageSize: 10,
}

export const useStoreStore = defineStore('store', () => {
    const stores = ref<StoreViewModel[]>([])
    const currentStore = ref<StoreViewModel | null>(null)
    const pagination = ref<PaginationState>({ ...DEFAULT_PAGINATION })
    const filter = ref<StoreFilterDto>({ ...DEFAULT_FILTER })

    const listLoading = ref(false)
    const detailLoading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const error = ref<string | null>(null)

    const isEmpty = computed(() => stores.value.length === 0)
    const totalCount = computed(() => pagination.value.totalCount)

    async function fetchPaged(params?: Partial<StoreFilterDto>): Promise<void> {
        if (params) filter.value = { ...filter.value, ...params }
        listLoading.value = true
        error.value = null
        try {
            log.info('Fetching paged stores')
            const result = await storeService.getPagedStoresAsync(filter.value)
            stores.value = result.items
            pagination.value = {
                pageNumber: result.pageNumber,
                pageSize: result.pageSize,
                totalCount: result.totalCount,
                totalPages: result.totalPages,
                hasPreviousPage: result.hasPreviousPage,
                hasNextPage: result.hasNextPage,
            }
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Fetch paged stores failed', { error: error.value })
            throw err
        } finally {
            listLoading.value = false
        }
    }

    async function fetchById(id: number): Promise<void> {
        detailLoading.value = true
        error.value = null
        try {
            log.info('Fetching store by id', { id })
            currentStore.value = await storeService.getStoreAsync(id)
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Fetch store by id failed', { error: error.value, id })
            throw err
        } finally {
            detailLoading.value = false
        }
    }

    async function create(payload: CreateStoreRequest): Promise<StoreViewModel | null> {
        saving.value = true
        error.value = null
        try {
            log.info('Creating store', { name: payload.Name })
            const store = await storeService.createStoreAsync(payload)
            if (store) {
                stores.value.unshift(store)
                pagination.value.totalCount++
            }
            return store
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Create store failed', { error: error.value })
            throw err
        } finally {
            saving.value = false
        }
    }

    async function update(id: number, payload: UpdateStoreRequest): Promise<StoreViewModel | null> {
        saving.value = true
        error.value = null
        try {
            log.info('Updating store', { id })
            const updated = await storeService.updateStoreAsync(id, payload)
            if (updated) {
                const index = stores.value.findIndex((s) => s.id === id)
                if (index !== -1) stores.value[index] = updated
                if (currentStore.value?.id === id) currentStore.value = updated
            }
            return updated
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Update store failed', { error: error.value, id })
            throw err
        } finally {
            saving.value = false
        }
    }

    async function remove(id: number): Promise<void> {
        deleting.value = true
        error.value = null
        try {
            log.info('Deleting store', { id })
            await storeService.deleteStoreAsync(id)
            stores.value = stores.value.filter((s) => s.id !== id)
            pagination.value.totalCount = Math.max(0, pagination.value.totalCount - 1)
            if (currentStore.value?.id === id) currentStore.value = null
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Delete store failed', { error: error.value, id })
            throw err
        } finally {
            deleting.value = false
        }
    }

    function setFilter(params: Partial<StoreFilterDto>): void {
        filter.value = { ...filter.value, ...params }
    }

    function setCurrentStore(store: StoreViewModel | null): void {
        currentStore.value = store
    }

    function reset(): void {
        stores.value = []
        currentStore.value = null
        pagination.value = { ...DEFAULT_PAGINATION }
        filter.value = { ...DEFAULT_FILTER }
        listLoading.value = false
        detailLoading.value = false
        saving.value = false
        deleting.value = false
        error.value = null
        log.info('Store store reset')
    }

    return {
        stores, currentStore, pagination, filter,
        listLoading, detailLoading, saving, deleting, error,
        isEmpty, totalCount,
        fetchPaged, fetchById, create, update, remove,
        setFilter, setCurrentStore, reset,
    }
})
```

- [ ] Create `store-member.store.ts` (stub):

```ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StoreMemberViewModel } from '@/modules/store/models/view-models/store-member.view-model'

export const useStoreMemberStore = defineStore('store-member', () => {
    const members = ref<StoreMemberViewModel[]>([])
    const listLoading = ref(false)
    const error = ref<string | null>(null)

    return { members, listLoading, error }
})
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/stores/
git commit -m "feat: add store and store-member Pinia stores"
```

---

## Task 13: Composables

**Files:**
- Create `src/modules/store/composables/useStore.ts`
- Create `src/modules/store/composables/useStoreMember.ts`

- [ ] Create `useStore.ts` (toast-wrapped — mirrors `useBrand.ts`):

```ts
import { useToastNotification } from '@/composables/useToastNotification'
import { storeService } from '@/modules/store/services/store.service'
import type { StoreFilterDto } from '@/modules/store/models/dtos/store-filter.dto'
import type { CreateStoreRequest } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreRequest } from '@/modules/store/models/dtos/update-store.dto'

export function useStore() {
    const toast = useToastNotification()

    async function getPagedStores(filter: StoreFilterDto) {
        try {
            return await storeService.getPagedStoresAsync(filter)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách cửa hàng.')
            throw error
        }
    }

    async function getStore(id: number) {
        try {
            return await storeService.getStoreAsync(id)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải chi tiết cửa hàng.')
            throw error
        }
    }

    async function createStore(payload: CreateStoreRequest) {
        try {
            const store = await storeService.createStoreAsync(payload)
            toast.success('Tạo cửa hàng thành công.')
            return store
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Tạo cửa hàng thất bại.')
            throw error
        }
    }

    async function updateStore(id: number, payload: UpdateStoreRequest) {
        try {
            const store = await storeService.updateStoreAsync(id, payload)
            toast.success('Cập nhật cửa hàng thành công.')
            return store
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Cập nhật cửa hàng thất bại.')
            throw error
        }
    }

    async function deleteStore(id: number) {
        try {
            await storeService.deleteStoreAsync(id)
            toast.success('Xóa cửa hàng thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xóa cửa hàng thất bại.')
            throw error
        }
    }

    return { getPagedStores, getStore, createStore, updateStore, deleteStore }
}
```

- [ ] Create `useStoreMember.ts` (stub):

```ts
export function useStoreMember() {
    return {}
}
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/composables/
git commit -m "feat: add useStore and useStoreMember composables"
```

---

## Task 14: Store Constants

**Files:**
- Create `src/modules/store/constants/store-list.constants.ts`
- Create `src/modules/store/constants/store-form.constants.ts`
- Create `src/modules/store/constants/store-member-list.constants.ts`

- [ ] Create `store-list.constants.ts`:

```ts
import type {
    FilterField,
    FilterOption,
    TableColumn,
    RowAction,
    StatusConfig,
    SortState,
    ActiveFilters,
} from '@/components/ui'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'

export const STORE_LIST_EMIT = {
    UPDATE_ACTIVE_FILTERS: 'update:activeFilters',
    SEARCH: 'search',
    RESET: 'reset',
    PAGE_CHANGE: 'page-change',
    PAGE_SIZE_CHANGE: 'page-size-change',
    SORT_CHANGE: 'sort-change',
    ROW_ACTION: 'row-action',
    CREATE: 'create',
    REFRESH: 'refresh',
} as const

export type StoreListEmits = {
    (event: typeof STORE_LIST_EMIT.UPDATE_ACTIVE_FILTERS, value: ActiveFilters): void
    (event: typeof STORE_LIST_EMIT.SEARCH): void
    (event: typeof STORE_LIST_EMIT.RESET): void
    (event: typeof STORE_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof STORE_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof STORE_LIST_EMIT.SORT_CHANGE, state: SortState | null): void
    (event: typeof STORE_LIST_EMIT.ROW_ACTION, key: string, item: StoreViewModel): void
    (event: typeof STORE_LIST_EMIT.CREATE): void
    (event: typeof STORE_LIST_EMIT.REFRESH): void
}

export const STORE_ROW_ACTION = {
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete',
} as const

// Factory — called by StoresView after brand/franchisee options are loaded
export function buildStoreFilterFields(
    brandOptions: FilterOption[],
    franchiseeOptions: FilterOption[],
): FilterField[] {
    return [
        { key: 'keyword', label: 'Tìm kiếm', type: 'text', placeholder: 'Tên, mã cửa hàng...' },
        {
            key: 'brandId',
            label: 'Thương hiệu',
            type: 'select',
            options: [{ label: 'Tất cả', value: null }, ...brandOptions],
        },
        {
            key: 'franchiseeId',
            label: 'Nhà nhượng quyền',
            type: 'select',
            options: [{ label: 'Tất cả', value: null }, ...franchiseeOptions],
        },
        {
            key: 'isActive',
            label: 'Trạng thái',
            type: 'select',
            options: [
                { label: 'Tất cả', value: null },
                { label: 'Đang hoạt động', value: 'true' },
                { label: 'Ngừng hoạt động', value: 'false' },
            ],
        },
        { key: 'province', label: 'Tỉnh/Thành', type: 'text', placeholder: 'Lọc theo tỉnh...' },
    ]
}

export const STORE_LIST_COLUMNS: TableColumn[] = [
    { key: 'name', title: 'Cửa hàng', sortable: true, minWidth: '200px' },
    { key: 'code', title: 'Mã', width: '110px' },
    { key: 'province', title: 'Tỉnh/Thành', width: '140px', hideBelow: 'md' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'isAcceptingOrders', title: 'Nhận đơn', width: '110px', align: 'center', hideBelow: 'lg' },
    { key: 'updatedAt', title: 'Cập nhật', width: '150px', hideBelow: 'lg' },
    { key: 'actions', title: '', width: '120px', align: 'end' },
]

export const STORE_LIST_ROW_ACTIONS: RowAction<StoreViewModel>[] = [
    { key: STORE_ROW_ACTION.VIEW, label: 'Xem chi tiết', icon: 'mdi-eye-outline' },
    { key: STORE_ROW_ACTION.EDIT, label: 'Chỉnh sửa', icon: 'mdi-pencil-outline', color: 'primary' },
    { key: STORE_ROW_ACTION.DELETE, label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

export const STORE_STATUS_CONFIG: Record<'active' | 'inactive', StatusConfig> = {
    active: { label: 'Hoạt động', color: 'success', icon: 'mdi-check-circle-outline', variant: 'tonal' },
    inactive: { label: 'Ngừng', color: 'error', icon: 'mdi-close-circle-outline', variant: 'tonal' },
}
```

- [ ] Create `store-form.constants.ts`:

```ts
export const STORE_FORM_SECTION = {
    BASIC: 'basic',
    CONTACT: 'contact',
    LOCATION: 'location',
    OPERATION: 'operation',
} as const
```

- [ ] Create `store-member-list.constants.ts`:

```ts
import type { TableColumn } from '@/components/ui'

export const STORE_MEMBER_LIST_EMIT = {
    REFRESH: 'refresh',
} as const

export const STORE_MEMBER_LIST_COLUMNS: TableColumn[] = [
    { key: 'userId', title: 'User ID', minWidth: '200px' },
    { key: 'storeId', title: 'Store', width: '120px' },
]
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/constants/
git commit -m "feat: add store list, form, and member constants"
```

---

## Task 15: `StoreList.vue`

**Files:** Create `src/modules/store/components/StoreList.vue`

- [ ] Create the file (mirrors `BrandList.vue`; receives `filterFields` as prop for dynamic brand/franchisee options):

```vue
<template>
  <div class="d-flex flex-column ga-4">
    <AppPageHeader
      title="Cửa hàng"
      subtitle="Quản lý danh sách cửa hàng và trạng thái hoạt động"
    >
      <template #breadcrumb>
        <AppBreadcrumb
          :items="[
            { title: 'Dashboard', to: '/admin' },
            { title: 'Cửa hàng', disabled: true },
          ]"
        />
      </template>

      <v-btn
        variant="outlined"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="emit(STORE_LIST_EMIT.REFRESH)"
      >
        Tải lại
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(STORE_LIST_EMIT.CREATE)">
        Tạo cửa hàng
      </v-btn>
    </AppPageHeader>

    <AppFilterBar>
      <AppDataFilter
        :fields="filterFields"
        :model-value="activeFilters"
        @update:model-value="emit(STORE_LIST_EMIT.UPDATE_ACTIVE_FILTERS, $event)"
        @search="emit(STORE_LIST_EMIT.SEARCH)"
      />

      <template #actions>
        <v-btn variant="text" prepend-icon="mdi-filter-off-outline" @click="emit(STORE_LIST_EMIT.RESET)">
          Xóa lọc
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-magnify" @click="emit(STORE_LIST_EMIT.SEARCH)">
          Tìm kiếm
        </v-btn>
      </template>
    </AppFilterBar>

    <v-card rounded="lg">
      <AppDataTable
        :items="items"
        :columns="STORE_LIST_COLUMNS"
        :loading="loading"
        :sort-by="sortBy"
        item-key="id"
        @update:sort-by="emit(STORE_LIST_EMIT.SORT_CHANGE, $event)"
        @row-click="(item) => emit(STORE_LIST_EMIT.ROW_ACTION, STORE_ROW_ACTION.VIEW, item)"
      >
        <template #[`item.name`]="{ item }">
          <div class="d-flex flex-column py-1">
            <span class="font-weight-medium">{{ item.name }}</span>
            <span v-if="item.code" class="text-caption text-medium-emphasis">{{ item.code }}</span>
          </div>
        </template>

        <template #[`item.isActive`]="{ item }">
          <AppStatusChip :config="STORE_STATUS_CONFIG[item.isActive ? 'active' : 'inactive']" />
        </template>

        <template #[`item.isAcceptingOrders`]="{ item }">
          <v-icon
            :icon="item.isAcceptingOrders ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline'"
            :color="item.isAcceptingOrders ? 'success' : 'error'"
            size="20"
          />
        </template>

        <template #[`item.actions`]="{ item }">
          <AppRowActions
            :actions="STORE_LIST_ROW_ACTIONS"
            :item="item"
            @action="emit(STORE_LIST_EMIT.ROW_ACTION, $event, item)"
          />
        </template>

        <template #empty>
          <AppEmptyState
            icon="mdi-store-off-outline"
            title="Chưa có cửa hàng"
            description="Tạo cửa hàng đầu tiên để bắt đầu quản lý."
          >
            <template #actions>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(STORE_LIST_EMIT.CREATE)">
                Tạo cửa hàng
              </v-btn>
            </template>
          </AppEmptyState>
        </template>
      </AppDataTable>

      <v-divider />

      <AppPagination
        :page-number="pageNumber"
        :page-size="pageSize"
        :total-pages="totalPages"
        :total-items="totalItems"
        @update:page-number="emit(STORE_LIST_EMIT.PAGE_CHANGE, $event)"
        @update:page-size="emit(STORE_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import type { ActiveFilters, FilterField, SortState } from '@/components/ui'
import {
  AppBreadcrumb,
  AppPageHeader,
  AppFilterBar,
  AppDataFilter,
  AppDataTable,
  AppPagination,
  AppRowActions,
  AppStatusChip,
  AppEmptyState,
} from '@/components/ui'
import {
  STORE_LIST_EMIT,
  STORE_ROW_ACTION,
  STORE_LIST_COLUMNS,
  STORE_LIST_ROW_ACTIONS,
  STORE_STATUS_CONFIG,
  type StoreListEmits,
} from '@/modules/store/constants/store-list.constants'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'

defineProps<{
  items: StoreViewModel[]
  loading: boolean
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItems: number
  activeFilters: ActiveFilters
  filterFields: FilterField[]
  sortBy: SortState | null
}>()

const emit = defineEmits<StoreListEmits>()
</script>
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

---

## Task 16: `StoreForm.vue`

**Files:** Create `src/modules/store/components/StoreForm.vue`

- [ ] Create the file (dialog, 4 sections, `isEdit` prop hides create-only fields):

```vue
<template>
  <AppDialog
    :model-value="modelValue"
    :title="title"
    :loading="submitting"
    confirm-label="Lưu"
    cancel-label="Hủy"
    size="lg"
    @update:model-value="emit('update:modelValue', $event)"
    @confirm="handleSubmit"
    @cancel="emit('update:modelValue', false)"
  >
    <v-form ref="formRef">
      <!-- ── Thông tin chung ──────────────────────────────── -->
      <div class="text-subtitle-2 font-weight-semibold mb-3">Thông tin chung</div>
      <v-row dense>
        <v-col v-if="!isEdit" cols="12" md="6">
          <v-select
            :model-value="localForm.brandId"
            :items="brandOptions"
            item-title="label"
            item-value="value"
            label="Thương hiệu *"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('brandId', $event)"
          />
        </v-col>
        <v-col v-if="!isEdit" cols="12" md="6">
          <v-select
            :model-value="localForm.franchiseeId"
            :items="franchiseeOptions"
            item-title="label"
            item-value="value"
            label="Nhà nhượng quyền"
            variant="outlined"
            density="comfortable"
            color="primary"
            clearable
            @update:model-value="update('franchiseeId', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.name"
            label="Tên cửa hàng *"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('name', $event)"
          />
        </v-col>
        <v-col v-if="!isEdit" cols="12" md="6">
          <v-text-field
            :model-value="localForm.code"
            label="Mã cửa hàng *"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('code', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.slug"
            label="Slug"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('slug', $event)"
          />
        </v-col>
        <v-col cols="12">
          <div class="d-flex align-center ga-4">
            <v-switch
              :model-value="localForm.isActive"
              label="Đang hoạt động"
              color="primary"
              hide-details
              @update:model-value="update('isActive', $event)"
            />
            <v-switch
              :model-value="localForm.isAcceptingOrders"
              label="Nhận đơn"
              color="primary"
              hide-details
              @update:model-value="update('isAcceptingOrders', $event)"
            />
          </div>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- ── Liên hệ ──────────────────────────────────────── -->
      <div class="text-subtitle-2 font-weight-semibold mb-3">Liên hệ</div>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.phone"
            label="Số điện thoại"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('phone', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.email"
            label="Email"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('email', $event)"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- ── Địa chỉ ──────────────────────────────────────── -->
      <div class="text-subtitle-2 font-weight-semibold mb-3">Địa chỉ</div>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            :model-value="localForm.address"
            label="Địa chỉ"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('address', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.province"
            label="Tỉnh/Thành"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('province', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.district"
            label="Quận/Huyện"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('district', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.ward"
            label="Phường/Xã"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('ward', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.country"
            label="Quốc gia"
            variant="outlined"
            density="comfortable"
            color="primary"
            @update:model-value="update('country', $event)"
          />
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <!-- ── Vận hành ──────────────────────────────────────── -->
      <div class="text-subtitle-2 font-weight-semibold mb-3">Vận hành</div>
      <v-row dense>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.openTime"
            label="Giờ mở cửa"
            variant="outlined"
            density="comfortable"
            color="primary"
            placeholder="HH:mm"
            @update:model-value="update('openTime', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.closeTime"
            label="Giờ đóng cửa"
            variant="outlined"
            density="comfortable"
            color="primary"
            placeholder="HH:mm"
            @update:model-value="update('closeTime', $event)"
          />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="localForm.timeZone"
            label="Múi giờ"
            variant="outlined"
            density="comfortable"
            color="primary"
            placeholder="Asia/Ho_Chi_Minh"
            @update:model-value="update('timeZone', $event)"
          />
        </v-col>
      </v-row>
    </v-form>
  </AppDialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { AppDialog } from '@/components/ui'
import type { FilterOption } from '@/components/ui'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'

interface Props {
  modelValue: boolean
  title: string
  form: StoreFormModel | null
  submitting: boolean
  isEdit?: boolean
  brandOptions?: FilterOption[]
  franchiseeOptions?: FilterOption[]
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  brandOptions: () => [],
  franchiseeOptions: () => [],
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [form: StoreFormModel]
}>()

const EMPTY_FORM: StoreFormModel = {
  brandId: null,
  franchiseeId: null,
  name: '',
  code: '',
  slug: null,
  logoUrl: null,
  isActive: true,
  isAcceptingOrders: true,
  phone: null,
  email: null,
  address: null,
  city: null,
  ward: null,
  district: null,
  province: null,
  country: null,
  latitude: null,
  longitude: null,
  openTime: null,
  closeTime: null,
  timeZone: null,
}

const localForm = ref<StoreFormModel>({ ...EMPTY_FORM })

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      localForm.value = props.form ? { ...props.form } : { ...EMPTY_FORM }
    }
  },
)

function update<K extends keyof StoreFormModel>(key: K, value: StoreFormModel[K]) {
  localForm.value[key] = value
}

function handleSubmit() {
  emit('submit', { ...localForm.value })
}
</script>
```

- [ ] Run type-check: `npm run type-check` — fix any type errors before continuing

- [ ] Commit:
```bash
git add src/modules/store/components/StoreForm.vue
git commit -m "feat: add StoreForm dialog component"
```

---

## Task 17: `StoreOverviewTab.vue`

**Files:** Create `src/modules/store/components/detail/StoreOverviewTab.vue`

- [ ] Create the file (inline edit; Code is read-only display):

```vue
<template>
  <div>
    <div class="d-flex align-center justify-space-between ga-2 pa-3 px-4">
      <v-btn variant="text" rounded="lg" size="small" prepend-icon="mdi-arrow-left" @click="$router.back()">
        Quay lại
      </v-btn>
      <div class="d-flex align-center ga-2">
        <v-slide-x-reverse-transition>
          <v-btn
            v-if="isDirty"
            variant="text"
            rounded="lg"
            size="small"
            :disabled="submitting"
            @click="emit('discard')"
          >
            Hủy thay đổi
          </v-btn>
        </v-slide-x-reverse-transition>
        <v-btn
          color="primary"
          variant="flat"
          rounded="lg"
          size="small"
          prepend-icon="mdi-content-save-outline"
          :loading="submitting"
          :disabled="!isDirty"
          @click="emit('save')"
        >
          Lưu thay đổi
        </v-btn>
      </div>
    </div>

    <v-divider />

    <div class="pa-5">
      <v-row>
        <v-col cols="12" md="6">
          <v-card elevation="0" rounded="lg">
            <v-list-item class="bg-surface-variant py-3">
              <v-list-item-title class="font-weight-semibold">Thông tin chung</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field
                :model-value="form.name"
                label="Tên cửa hàng *"
                variant="outlined"
                density="comfortable"
                color="primary"
                @update:model-value="emit('update:form', 'name', $event)"
              />
              <v-text-field :model-value="form.code" label="Mã cửa hàng" variant="outlined" density="comfortable" readonly />
              <div class="d-flex ga-4">
                <v-switch
                  :model-value="form.isActive"
                  label="Đang hoạt động"
                  color="primary"
                  hide-details
                  @update:model-value="emit('update:form', 'isActive', $event)"
                />
                <v-switch
                  :model-value="form.isAcceptingOrders"
                  label="Nhận đơn"
                  color="primary"
                  hide-details
                  @update:model-value="emit('update:form', 'isAcceptingOrders', $event)"
                />
              </div>
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="0" rounded="lg">
            <v-list-item class="bg-surface-variant py-3">
              <v-list-item-title class="font-weight-semibold">Liên hệ</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field :model-value="form.phone" label="Số điện thoại" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'phone', $event)" />
              <v-text-field :model-value="form.email" label="Email" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'email', $event)" />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="0" rounded="lg">
            <v-list-item class="bg-surface-variant py-3">
              <v-list-item-title class="font-weight-semibold">Địa chỉ</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field :model-value="form.address" label="Địa chỉ" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'address', $event)" />
              <v-text-field :model-value="form.province" label="Tỉnh/Thành" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'province', $event)" />
              <v-text-field :model-value="form.district" label="Quận/Huyện" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'district', $event)" />
              <v-text-field :model-value="form.ward" label="Phường/Xã" variant="outlined" density="comfortable" color="primary" @update:model-value="emit('update:form', 'ward', $event)" />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" md="6">
          <v-card elevation="0" rounded="lg">
            <v-list-item class="bg-surface-variant py-3">
              <v-list-item-title class="font-weight-semibold">Vận hành</v-list-item-title>
            </v-list-item>
            <v-divider />
            <div class="pa-4 d-flex flex-column ga-4">
              <v-text-field :model-value="form.openTime" label="Giờ mở cửa" variant="outlined" density="comfortable" color="primary" placeholder="HH:mm" @update:model-value="emit('update:form', 'openTime', $event)" />
              <v-text-field :model-value="form.closeTime" label="Giờ đóng cửa" variant="outlined" density="comfortable" color="primary" placeholder="HH:mm" @update:model-value="emit('update:form', 'closeTime', $event)" />
              <v-text-field :model-value="form.timeZone" label="Múi giờ" variant="outlined" density="comfortable" color="primary" placeholder="Asia/Ho_Chi_Minh" @update:model-value="emit('update:form', 'timeZone', $event)" />
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'

defineProps<{
  form: StoreFormModel
  isDirty: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:form': [field: keyof StoreFormModel, value: unknown]
  save: []
  discard: []
}>()
</script>
```

- [ ] Run type-check: `npm run type-check` — fix any errors

- [ ] Commit:
```bash
git add src/modules/store/components/detail/StoreOverviewTab.vue
git commit -m "feat: add StoreOverviewTab inline edit component"
```

---

## Task 18: `StoreMemberList.vue` + `_index.ts`

**Files:**
- Create `src/modules/store/components/StoreMemberList.vue`
- Create `src/modules/store/components/_index.ts`

- [ ] Create `StoreMemberList.vue` (placeholder until BE ships endpoints):

```vue
<template>
  <div class="pa-8 d-flex justify-center">
    <AppEmptyState
      icon="mdi-account-group-outline"
      title="Tính năng đang phát triển"
      description="Quản lý thành viên cửa hàng sẽ được ra mắt sau khi hoàn thiện backend."
    />
  </div>
</template>

<script setup lang="ts">
import { AppEmptyState } from '@/components/ui'
</script>
```

- [ ] Create `_index.ts`:

```ts
export { default as StoreList } from './StoreList.vue'
export { default as StoreForm } from './StoreForm.vue'
export { default as StoreMemberList } from './StoreMemberList.vue'
export { default as StoreOverviewTab } from './detail/StoreOverviewTab.vue'
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/components/
git commit -m "feat: add store components barrel and StoreMemberList placeholder"
```

---

## Task 19: `StoresView.vue`

**Files:** Create `src/modules/store/views/StoresView.vue`

> **Note:** This view reads `authStore.user?.id` to load brand/franchisee dropdown options on mount. Before writing, verify the auth store's export name and user shape by checking `src/stores/auth.store.ts`. The import will be `import { useAuthStore } from '@/stores/auth.store'` if auth is in the root stores folder. Adjust the import path if different.

- [ ] Create the file:

```vue
<template>
  <div class="d-flex flex-column ga-4">
    <StoreList
      :items="viewItems"
      :loading="listPage.loading.value"
      :page-number="listPage.pagination.pageNumber.value"
      :page-size="listPage.pagination.pageSize.value"
      :total-pages="listPage.pagination.totalPages.value"
      :total-items="listPage.pagination.totalItems.value"
      :active-filters="listPage.filters.activeFilters.value"
      :filter-fields="filterFields"
      :sort-by="listPage.sortBy.value"
      @update:active-filters="listPage.filters.setFilters"
      @search="listPage.onSearch"
      @reset="listPage.onResetFilters"
      @page-change="listPage.onPageChange"
      @page-size-change="listPage.onPageSizeChange"
      @sort-change="listPage.onSort"
      @row-action="handleRowAction"
      @create="openCreateDialog"
      @refresh="listPage.refresh"
    />

    <StoreForm
      v-model="isFormDialogOpen"
      :title="selectedStore ? 'Cập nhật cửa hàng' : 'Tạo cửa hàng'"
      :form="selectedStore ? storeMapper.toFormModel(selectedStore) : null"
      :is-edit="!!selectedStore"
      :brand-options="brandOptions"
      :franchisee-options="franchiseeOptions"
      :submitting="submitting"
      @submit="saveStore"
    />

    <AppDialog
      v-model="isDeleteDialogOpen"
      title="Xóa cửa hàng"
      size="sm"
      confirm-label="Xóa"
      cancel-label="Hủy"
      :loading="deleting"
      @confirm="doDelete"
      @cancel="storeToDelete = null"
    >
      Bạn có chắc muốn xóa cửa hàng
      <strong>{{ storeToDelete?.name }}</strong>?
    </AppDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { AppDialog } from '@/components/ui'
import type { FilterOption } from '@/components/ui'
import { useListPage } from '@/components/ui/composables'
import type { ListPageParams } from '@/components/ui/composables'
import { APP_ROUTES, DEFAULT_PAGINATION } from '@/core/constants/_index'
import { storeMapper } from '@/modules/store/mappers/store.mapper'
import { useStore } from '@/modules/store/composables/useStore'
import { buildStoreFilterFields, STORE_ROW_ACTION } from '@/modules/store/constants/store-list.constants'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'
import type { StoreViewModel } from '@/modules/store/models/view-models/store.view-model'
import StoreList from '@/modules/store/components/StoreList.vue'
import StoreForm from '@/modules/store/components/StoreForm.vue'
import { brandService } from '@/modules/brand/services/brand.service'
import { franchiseeService } from '@/modules/brand/services/franchisee.service'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const { getPagedStores, createStore, updateStore, deleteStore } = useStore()
const authStore = useAuthStore()

// ── Filter options (loaded once on mount) ──────────────────
const brandOptions = ref<FilterOption[]>([])
const franchiseeOptions = ref<FilterOption[]>([])
const filterFields = computed(() =>
  buildStoreFilterFields(brandOptions.value, franchiseeOptions.value),
)

// ── List page ──────────────────────────────────────────────
const fetchStores = async (params: ListPageParams): Promise<{ items: StoreViewModel[]; total: number }> => {
  const isActiveStr = params.filters['isActive'] as string | null
  const result = await getPagedStores({
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    Keyword: (params.filters['keyword'] as string | null) ?? null,
    BrandId: params.filters['brandId'] ? Number(params.filters['brandId']) : null,
    FranchiseeId: params.filters['franchiseeId'] ? Number(params.filters['franchiseeId']) : null,
    IsActive: isActiveStr === 'true' ? true : isActiveStr === 'false' ? false : null,
    Province: (params.filters['province'] as string | null) ?? null,
    SortBy: params.sortBy?.key ?? null,
    SortDirection: params.sortBy?.order ?? null,
  })
  return { items: result.items, total: result.totalCount }
}

const listPage = useListPage<StoreViewModel>({
  fetchFn: fetchStores,
  keyField: 'id',
  defaultPageSize: DEFAULT_PAGINATION.LIMIT,
})

const viewItems = computed<StoreViewModel[]>(() => listPage.items.value ?? [])

// ── Form dialog ────────────────────────────────────────────
const selectedStore = ref<StoreViewModel | null>(null)
const isFormDialogOpen = ref(false)
const submitting = ref(false)

const openCreateDialog = () => {
  selectedStore.value = null
  isFormDialogOpen.value = true
}

const saveStore = async (form: StoreFormModel) => {
  submitting.value = true
  try {
    if (selectedStore.value) {
      await updateStore(selectedStore.value.id, storeMapper.formModelToUpdateRequest(form))
    } else {
      await createStore(storeMapper.formModelToCreateRequest(form))
    }
    isFormDialogOpen.value = false
    selectedStore.value = null
    await listPage.refresh()
  } finally {
    submitting.value = false
  }
}

// ── Delete dialog ──────────────────────────────────────────
const storeToDelete = ref<StoreViewModel | null>(null)
const isDeleteDialogOpen = ref(false)
const deleting = ref(false)

const doDelete = async () => {
  if (!storeToDelete.value) return
  deleting.value = true
  try {
    await deleteStore(storeToDelete.value.id)
    isDeleteDialogOpen.value = false
    storeToDelete.value = null
    await listPage.refresh()
  } finally {
    deleting.value = false
  }
}

// ── Row actions ────────────────────────────────────────────
const handleRowAction = (key: string, item: StoreViewModel) => {
  if (key === STORE_ROW_ACTION.VIEW) {
    void router.push({ name: APP_ROUTES.ADMIN.CHILDREN.STORE_DETAIL.NAME, params: { id: item.id } })
  } else if (key === STORE_ROW_ACTION.EDIT) {
    selectedStore.value = item
    isFormDialogOpen.value = true
  } else if (key === STORE_ROW_ACTION.DELETE) {
    storeToDelete.value = item
    isDeleteDialogOpen.value = true
  }
}

onMounted(async () => {
  const userId = authStore.user?.id
  if (userId) {
    const [brands, franchisees] = await Promise.all([
      brandService.getBrandsByUserIdAsync(userId),
      franchiseeService.getFranchiseesByUserIdAsync(userId),
    ])
    brandOptions.value = brands.map((b) => ({ label: b.name, value: b.id }))
    franchiseeOptions.value = franchisees.map((f) => ({ label: f.Name, value: f.Id }))
  }
  await listPage.refresh()
})
</script>
```

> **Check:** Verify `brandService.getBrandsByUserIdAsync` exists in `src/modules/brand/services/brand.service.ts`. If missing, add:
> ```ts
> async getBrandsByUserIdAsync(userId: string): Promise<BrandViewModel[]> {
>     const response = await brandApi.getByUserIdAsync(userId)
>     return brandMapper.toViewModels(response.Data ?? [])
> }
> ```
> and add `GET_BY_USER_ID` to `brandApi` if not already present (it's in `api.constants.ts` as `BRAND.BRAND_API.GET_BY_USER_ID`).

- [ ] Run type-check: `npm run type-check` — fix any errors

- [ ] Commit:
```bash
git add src/modules/store/views/StoresView.vue
git commit -m "feat: add StoresView list page"
```

---

## Task 20: `StoreDetailView.vue`

**Files:** Create `src/modules/store/views/StoreDetailView.vue`

- [ ] Create the file (mirrors `BrandDetailView.vue`):

```vue
<template>
  <div class="d-flex flex-column ga-5">
    <template v-if="store.loading.value">
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="card" height="120" />
      <v-skeleton-loader type="card" />
    </template>

    <template v-else-if="store.data.value">
      <v-card variant="tonal" color="primary" rounded="lg" flat>
        <v-card-text class="pa-5">
          <div class="d-flex align-start justify-space-between flex-wrap ga-4">
            <div class="d-flex flex-column ga-3">
              <AppBreadcrumb
                :items="[
                  { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                  { title: 'Cửa hàng', to: { name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME } },
                  { title: store.data.value.name, disabled: true },
                ]"
              />
              <div class="d-flex align-center ga-3">
                <v-sheet rounded="lg" width="52" height="52" class="d-flex align-center justify-center flex-shrink-0">
                  <v-icon icon="mdi-store" size="28" color="primary" />
                </v-sheet>
                <div>
                  <div class="text-h6 font-weight-bold text-high-emphasis">{{ store.data.value.name }}</div>
                  <div class="text-body-2 text-medium-emphasis mt-1">{{ store.data.value.code }}</div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-card rounded="lg" elevation="1">
        <v-tabs v-model="activeTab" color="primary" class="px-2">
          <v-tab value="overview" class="text-none" rounded="lg">
            <v-icon start icon="mdi-information-outline" size="18" />
            Tổng quan
          </v-tab>
        </v-tabs>
        <v-divider />
        <v-window v-model="activeTab">
          <v-window-item value="overview">
            <StoreOverviewTab
              :form="editForm"
              :is-dirty="isDirty"
              :submitting="submitting"
              @update:form="onFormUpdate"
              @save="saveChanges"
              @discard="discardChanges"
            />
          </v-window-item>
        </v-window>
      </v-card>
    </template>

    <AppEmptyState
      v-else-if="!store.loading.value"
      icon="mdi-store-off-outline"
      title="Không tìm thấy cửa hàng"
      description="Cửa hàng này không tồn tại hoặc đã bị xóa."
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-arrow-left" rounded="lg" :to="{ name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME }">
          Quay lại danh sách
        </v-btn>
      </template>
    </AppEmptyState>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { AppBreadcrumb, AppEmptyState } from '@/components/ui'
import { useAsyncState } from '@/composables/useAsyncState'
import { APP_ROUTES } from '@/core/constants/_index'
import { storeMapper } from '@/modules/store/mappers/store.mapper'
import { useStore } from '@/modules/store/composables/useStore'
import type { StoreFormModel } from '@/modules/store/models/form-models/store.model'
import StoreOverviewTab from '@/modules/store/components/detail/StoreOverviewTab.vue'

const route = useRoute()
const { getStore, updateStore } = useStore()

const storeId = Number(route.params['id'])
const activeTab = ref('overview')

const store = useAsyncState(() => getStore(storeId))

const editForm = reactive<StoreFormModel>({
  brandId: null,
  franchiseeId: null,
  name: '',
  code: '',
  slug: null,
  logoUrl: null,
  isActive: true,
  isAcceptingOrders: true,
  phone: null,
  email: null,
  address: null,
  city: null,
  ward: null,
  district: null,
  province: null,
  country: null,
  latitude: null,
  longitude: null,
  openTime: null,
  closeTime: null,
  timeZone: null,
})

const snapshot = ref<StoreFormModel | null>(null)

function syncFormFromStore() {
  if (!store.data.value) return
  const mapped = storeMapper.toFormModel(store.data.value)
  if (!mapped) return
  Object.assign(editForm, mapped)
  snapshot.value = { ...editForm }
}

onMounted(async () => {
  await store.execute()
  syncFormFromStore()
})

const isDirty = computed(() => {
  if (!snapshot.value) return false
  return (
    editForm.name !== snapshot.value.name ||
    editForm.slug !== snapshot.value.slug ||
    editForm.isActive !== snapshot.value.isActive ||
    editForm.isAcceptingOrders !== snapshot.value.isAcceptingOrders ||
    editForm.phone !== snapshot.value.phone ||
    editForm.email !== snapshot.value.email ||
    editForm.address !== snapshot.value.address ||
    editForm.province !== snapshot.value.province ||
    editForm.district !== snapshot.value.district ||
    editForm.ward !== snapshot.value.ward ||
    editForm.openTime !== snapshot.value.openTime ||
    editForm.closeTime !== snapshot.value.closeTime ||
    editForm.timeZone !== snapshot.value.timeZone
  )
})

function onFormUpdate(field: keyof StoreFormModel, value: unknown) {
  ;(editForm as Record<string, unknown>)[field] = value
}

const submitting = ref(false)

function discardChanges() {
  syncFormFromStore()
}

async function saveChanges() {
  submitting.value = true
  try {
    const updated = await updateStore(storeId, storeMapper.formModelToUpdateRequest(editForm))
    if (updated) {
      store.data.value = updated
      syncFormFromStore()
    }
  } finally {
    submitting.value = false
  }
}
</script>
```

- [ ] Run type-check: `npm run type-check` — fix any errors

- [ ] Commit:
```bash
git add src/modules/store/views/StoreDetailView.vue
git commit -m "feat: add StoreDetailView"
```

---

## Task 21: `StoreMembersView.vue`

**Files:** Create `src/modules/store/views/StoreMembersView.vue`

- [ ] Create the file:

```vue
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
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/modules/store/views/StoreMembersView.vue
git commit -m "feat: add StoreMembersView placeholder"
```

---

## Task 22: Update `routes.ts` — wire up real views

**Files:** Modify `src/router/routes.ts`

The menu plan already registered these routes as ComingSoon. Replace only the `component` imports for the 3 store routes; leave franchisees as ComingSoon.

- [ ] Replace the Stores ComingSoon component:

Find:
```ts
            {
                path: APP_ROUTES.ADMIN.CHILDREN.STORES.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME,
                component: () => import('@/components/common/ComingSoonView.vue'),
                meta: { title: 'Cửa hàng', requiresAuth: true },
            },
```

Replace with:
```ts
            {
                path: APP_ROUTES.ADMIN.CHILDREN.STORES.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.STORES.NAME,
                component: () => import('@/modules/store/views/StoresView.vue'),
                meta: { title: 'Cửa hàng', requiresAuth: true },
            },
```

- [ ] Replace the StoreDetail ComingSoon component:

Find:
```ts
            {
                path: APP_ROUTES.ADMIN.CHILDREN.STORE_DETAIL.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.STORE_DETAIL.NAME,
                component: () => import('@/components/common/ComingSoonView.vue'),
                meta: { title: 'Chi tiết cửa hàng', requiresAuth: true },
            },
```

Replace with:
```ts
            {
                path: APP_ROUTES.ADMIN.CHILDREN.STORE_DETAIL.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.STORE_DETAIL.NAME,
                component: () => import('@/modules/store/views/StoreDetailView.vue'),
                meta: { title: 'Chi tiết cửa hàng', requiresAuth: true },
            },
```

- [ ] Replace the StoreMembers ComingSoon component:

Find:
```ts
            {
                path: APP_ROUTES.ADMIN.CHILDREN.STORE_MEMBERS.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.STORE_MEMBERS.NAME,
                component: () => import('@/components/common/ComingSoonView.vue'),
                meta: { title: 'Thành viên cửa hàng', requiresAuth: true },
            },
```

Replace with:
```ts
            {
                path: APP_ROUTES.ADMIN.CHILDREN.STORE_MEMBERS.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.STORE_MEMBERS.NAME,
                component: () => import('@/modules/store/views/StoreMembersView.vue'),
                meta: { title: 'Thành viên cửa hàng', requiresAuth: true },
            },
```

- [ ] Run type-check: `npm run type-check` — expected: PASS

- [ ] Commit:
```bash
git add src/router/routes.ts
git commit -m "feat: wire store views to router (replace ComingSoon)"
```

---

## Task 23: Final type-check + lint

- [ ] Run full type-check: `npm run type-check`
  - Expected: **0 errors**
  - If errors remain: fix them before marking complete

- [ ] Run lint: `npm run lint`
  - Expected: 0 errors (warnings acceptable)

- [ ] Final commit if any lint auto-fixes were applied:
```bash
git add -A
git commit -m "chore: lint fixes post store module implementation"
```
