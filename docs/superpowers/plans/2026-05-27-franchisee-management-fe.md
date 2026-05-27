# Franchisee Management — Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Prerequisite:** `2026-05-27-franchisee-management-be.md` must be completed first — this plan requires the BE endpoints `GET /admin/franchisee/{id}`, `POST /admin/franchisee`, `PUT /admin/franchisee/{id}`, `DELETE /admin/franchisee/{id}` to exist.

**Goal:** Build a full Franchisee management feature inside `src/modules/brand/` — list page with CRUD, detail page with inline edit — following the exact patterns of the Store module and Brand module.

**Architecture:**
- Franchisee lives inside the Brand module (`src/modules/brand/`) — NOT a separate module
- All HTTP calls use `brandClient` from `@/core/api/clients/brand.client` (Franchisee lives in the Brand bounded context on the BE)
- List page follows `BrandsView` + `StoresView` pattern (useListPage composable + form dialog + delete dialog)
- Detail page follows `BrandDetailView` + `StoreDetailView` pattern (useAsyncState + reactive form + snapshot + isDirty)
- `FranchiseeViewModel extends Record<string, unknown>` — required by `AppDataTable`
- `v-switch` emits `boolean | null` — always coerce with `!!$event` when binding to strict `boolean` fields

**Tech Stack:** Vue 3 Composition API, TypeScript strict, Pinia, Vuetify 3, brandClient

**Key composables / utilities (already exist — do NOT create):**
- `useListPage` from `@/components/ui/composables` — returns `{ items, loading, pagination, filters, sortBy, refresh, onSearch, onResetFilters, onPageChange, onPageSizeChange, onSort }`
- `useAsyncState` from `@/composables/useAsyncState` — returns `{ data, loading, error, execute }`
- `useToastNotification` from `@/composables/useToastNotification` — returns `{ success, error, warning, info }`
- `brandClient` from `@/core/api/clients/brand.client` — Axios wrapper with auth injection and retry
- `DEFAULT_PAGINATION` from `@/core/constants/_index` — `DEFAULT_PAGINATION.LIMIT = 10`
- `createLogger` from `@/core/logger/logger` — factory for named loggers
- `AppDialog`, `AppDataTable`, `AppPagination`, `AppRowActions`, `AppStatusChip`, `AppFilterBar`, `AppDataFilter`, `AppPageHeader`, `AppBreadcrumb`, `AppEmptyState` — all from `@/components/ui`
- `FilterOption`, `FilterField`, `TableColumn`, `RowAction`, `StatusConfig`, `SortState`, `ActiveFilters` — all from `@/components/ui`
- `PagedResult<T>` from `@/core/types/pagination.types`
- `ApiResponse<T>`, `PagedApiResponse<T>` from `@/core/models/common.dto` — `PagedApiResponse<T>` has direct fields `PageNumber`, `PageSize`, `TotalCount`, `TotalPages`, `HasPreviousPage`, `HasNextPage` and `Data: T[] | null`

**Existing files to MODIFY (not create):**
- `src/core/constants/app-routes.constants.ts` — add `FRANCHISEE_DETAIL`
- `src/core/constants/api.constants.ts` — extend `FRANCHISEE_API`
- `src/router/routes.ts` — replace ComingSoon with FranchiseesView, add FranchiseeDetailView

---

## File Structure

```
NDTCore.FE/src/
├── core/constants/
│   ├── app-routes.constants.ts       (MODIFY)
│   └── api.constants.ts              (MODIFY)
├── modules/franchisee/
│   ├── api/
│   │   └── franchisee.api.ts         (NEW)
│   ├── components/
│   │   ├── FranchiseeList.vue        (NEW)
│   │   ├── FranchiseeForm.vue        (NEW)
│   │   ├── FranchiseeMemberList.vue  (NEW)
│   │   ├── detail/
│   │   │   └── FranchiseeOverviewTab.vue (NEW)
│   │   └── _index.ts                 (NEW)
│   ├── composables/
│   │   └── useFranchisee.ts          (NEW)
│   ├── constants/
│   │   ├── franchisee-list.constants.ts        (NEW)
│   │   ├── franchisee-form.constants.ts        (NEW)
│   │   └── franchisee-member-list.constants.ts (NEW)
│   ├── enums/
│   │   ├── franchisee-status.enum.ts (NEW)
│   │   └── _index.ts                 (NEW)
│   ├── mappers/
│   │   └── franchisee.mapper.ts      (NEW)
│   ├── models/
│   │   ├── dtos/
│   │   │   ├── franchisee.dto.ts           (NEW)
│   │   │   ├── franchisee-filter.dto.ts    (NEW)
│   │   │   ├── create-franchisee.dto.ts    (NEW)
│   │   │   ├── update-franchisee.dto.ts    (NEW)
│   │   │   ├── delete-franchisee.dto.ts    (NEW)
│   │   │   ├── franchisee-member.dto.ts    (NEW)
│   │   │   └── _index.ts                   (NEW)
│   │   ├── form-models/
│   │   │   └── franchisee.model.ts         (NEW)
│   │   └── view-models/
│   │       ├── franchisee.view-model.ts    (NEW)
│   │       └── franchisee-member.view-model.ts (NEW)
│   ├── services/
│   │   └── franchisee.service.ts     (NEW)
│   ├── stores/
│   │   └── franchisee.store.ts       (NEW)
│   └── views/
│       ├── FranchiseesView.vue       (NEW)
│       └── FranchiseeDetailView.vue  (NEW)
└── router/routes.ts                  (MODIFY)
```

---

## Task 1: Route Constants

**File:** `src/core/constants/app-routes.constants.ts`

Add `FRANCHISEE_DETAIL` inside `ADMIN.CHILDREN`. The current file has `FRANCHISEES` but no `FRANCHISEE_DETAIL`.

- [ ] **Step 1: Add FRANCHISEE_DETAIL after FRANCHISEES**

In `src/core/constants/app-routes.constants.ts`, locate the `FRANCHISEES` entry and add `FRANCHISEE_DETAIL` immediately after it:

```ts
            FRANCHISEES: {
                NAME: 'admin:franchisees',
                PATH: 'franchisees',
            },
            FRANCHISEE_DETAIL: {
                NAME: 'admin:franchisee-detail',
                PATH: 'franchisees/:id',
            },
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
npm run type-check
```

Expected: 0 new errors related to app-routes.constants.ts

- [ ] **Step 3: Commit**

```bash
git add src/core/constants/app-routes.constants.ts
git commit -m "feat(franchisee): add FRANCHISEE_DETAIL route constant"
```

---

## Task 2: API Constants

**File:** `src/core/constants/api.constants.ts`

Extend `BRAND.FRANCHISEE_API` from 2 methods to 10 methods.

- [ ] **Step 1: Replace FRANCHISEE_API block**

Locate and replace the current `FRANCHISEE_API` block inside `BRAND`:

Current:
```ts
        FRANCHISEE_API: {
            GET_BY_USER_ID: (userId: string) => `/admin/franchisee/by-user/${userId}`,
            GET_BY_BRAND_ID: (brandId: number) => `/admin/franchisee/by-brand/${brandId}`,
        },
```

Replace with:
```ts
        FRANCHISEE_API: {
            GET_PAGED: '/admin/franchisee',
            GET_BY_ID: (id: number) => `/admin/franchisee/${id}`,
            GET_BY_USER_ID: (userId: string) => `/admin/franchisee/by-user/${userId}`,
            GET_BY_BRAND_ID: (brandId: number) => `/admin/franchisee/by-brand/${brandId}`,
            CREATE: '/admin/franchisee',
            UPDATE: (id: number) => `/admin/franchisee/${id}`,
            DELETE: (id: number) => `/admin/franchisee/${id}`,
            GET_MEMBERS: (id: number) => `/admin/franchisee/${id}/users`,
            ASSIGN_USERS: (id: number) => `/admin/franchisee/${id}/users`,
            REMOVE_USER: (id: number, userId: string) => `/admin/franchisee/${id}/users/${userId}`,
        },
```

- [ ] **Step 2: Verify type-check**

```bash
npm run type-check
```

Expected: 0 new errors

- [ ] **Step 3: Commit**

```bash
git add src/core/constants/api.constants.ts
git commit -m "feat(franchisee): extend FRANCHISEE_API constants with full CRUD endpoints"
```

---

## Task 3: Enums

**Files:**
- Create: `src/modules/franchisee/enums/franchisee-status.enum.ts`
- Create: `src/modules/franchisee/enums/_index.ts`

- [ ] **Step 1: Create franchisee-status.enum.ts**

```ts
export enum FranchiseeStatus {
    Active = 'active',
    Inactive = 'inactive',
}
```

- [ ] **Step 2: Create enums/_index.ts**

```ts
export * from './franchisee-status.enum'
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/franchisee/enums/
git commit -m "feat(franchisee): add FranchiseeStatus enum"
```

---

## Task 4: DTOs

**Files:** 7 files under `src/modules/franchisee/models/dtos/`

- [ ] **Step 1: Create franchisee.dto.ts**

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

- [ ] **Step 2: Create franchisee-filter.dto.ts**

```ts
export interface FranchiseeFilterDto {
    PageNumber: number
    PageSize: number
    BrandId?: number | null
    UserId?: string | null
    Keyword?: string | null
    IsActive?: boolean | null
    JoinedAfter?: string | null
    JoinedBefore?: string | null
}
```

- [ ] **Step 3: Create create-franchisee.dto.ts**

```ts
export interface CreateFranchiseeRequest {
    BrandId: number
    Name: string
    LegalName?: string | null
    TaxCode?: string | null
    BankAccount?: string | null
    BankName?: string | null
    JoinedDate?: string | null
}

export interface CreateFranchiseeResponse {
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
    CreatedAt?: string | null
    CreatedBy?: string | null
}
```

- [ ] **Step 4: Create update-franchisee.dto.ts**

```ts
export interface UpdateFranchiseeRequest {
    Name: string
    IsActive: boolean
    LegalName?: string | null
    TaxCode?: string | null
    BankAccount?: string | null
    BankName?: string | null
    JoinedDate?: string | null
    TerminatedDate?: string | null
}

export interface UpdateFranchiseeResponse {
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
    UpdatedAt?: string | null
    UpdatedBy?: string | null
}
```

- [ ] **Step 5: Create delete-franchisee.dto.ts**

```ts
export interface DeleteFranchiseeResponse {
    FranchiseeId: number
    Name?: string | null
    DeletedAt: string
    DeletedBy?: string | null
}
```

- [ ] **Step 6: Create franchisee-member.dto.ts**

```ts
export interface FranchiseeMemberDto {
    FranchiseeId: number
    TenantId: string
    UserId: string
}

export interface AssignFranchiseeUsersRequest {
    UserIds: string[]
}

export interface AssignFranchiseeUsersResponse {
    FranchiseeId: number
    AssignedUserIds: string[]
}

export interface RemoveFranchiseeUserResponse {
    FranchiseeId: number
    UserId: string
}
```

- [ ] **Step 7: Create dtos/_index.ts**

```ts
export * from './franchisee.dto'
export * from './franchisee-filter.dto'
export * from './create-franchisee.dto'
export * from './update-franchisee.dto'
export * from './delete-franchisee.dto'
export * from './franchisee-member.dto'
```

- [ ] **Step 8: Commit**

```bash
git add src/modules/franchisee/models/dtos/
git commit -m "feat(franchisee): add all DTO interfaces"
```

---

## Task 5: View-Models

**Files:**
- Create: `src/modules/franchisee/models/view-models/franchisee.view-model.ts`
- Create: `src/modules/franchisee/models/view-models/franchisee-member.view-model.ts`

- [ ] **Step 1: Create franchisee.view-model.ts**

```ts
export interface FranchiseeViewModel extends Record<string, unknown> {
    id: number
    tenantId: string
    brandId: number
    name: string
    legalName?: string | null
    taxCode?: string | null
    bankAccount?: string | null
    bankName?: string | null
    isActive: boolean
    joinedDate?: string | null
    terminatedDate?: string | null
    createdAt?: string | null
    createdBy?: string | null
    updatedAt?: string | null
    updatedBy?: string | null
}
```

- [ ] **Step 2: Create franchisee-member.view-model.ts**

```ts
export interface FranchiseeMemberViewModel extends Record<string, unknown> {
    franchiseeId: number
    tenantId: string
    userId: string
}
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/franchisee/models/view-models/
git commit -m "feat(franchisee): add FranchiseeViewModel and FranchiseeMemberViewModel"
```

---

## Task 6: Form Model

**File:** `src/modules/franchisee/models/form-models/franchisee.model.ts`

- [ ] **Step 1: Create franchisee.model.ts**

```ts
export interface FranchiseeFormModel {
    brandId: number | null
    name: string
    legalName: string | null
    taxCode: string | null
    bankAccount: string | null
    bankName: string | null
    joinedDate: string | null
    terminatedDate: string | null
    isActive: boolean
    createdAt?: string | null
    createdBy?: string | null
    updatedAt?: string | null
    updatedBy?: string | null
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/models/form-models/
git commit -m "feat(franchisee): add FranchiseeFormModel"
```

---

## Task 7: Mapper

**File:** `src/modules/franchisee/mappers/franchisee.mapper.ts`

- [ ] **Step 1: Create franchisee.mapper.ts**

```ts
import type {
    FranchiseeDto,
    CreateFranchiseeResponse,
    UpdateFranchiseeResponse,
    CreateFranchiseeRequest,
    UpdateFranchiseeRequest,
} from '@/modules/franchisee/models/dtos/_index'
import type { FranchiseeFormModel } from '@/modules/franchisee/models/form-models/franchisee.model'
import type { FranchiseeViewModel } from '@/modules/franchisee/models/view-models/franchisee.view-model'

export const franchiseeMapper = {
    toViewModels(dtos: FranchiseeDto[]): FranchiseeViewModel[] {
        return (dtos ?? []).map((dto) => this.toViewModel(dto))
    },

    toViewModel(dto: FranchiseeDto): FranchiseeViewModel {
        return {
            id: dto.Id,
            tenantId: dto.TenantId,
            brandId: dto.BrandId,
            name: dto.Name,
            legalName: dto.LegalName ?? null,
            taxCode: dto.TaxCode ?? null,
            bankAccount: dto.BankAccount ?? null,
            bankName: dto.BankName ?? null,
            isActive: dto.IsActive,
            joinedDate: dto.JoinedDate ?? null,
            terminatedDate: dto.TerminatedDate ?? null,
            createdAt: dto.CreatedAt ?? null,
            createdBy: dto.CreatedBy ?? null,
            updatedAt: dto.UpdatedAt ?? null,
            updatedBy: dto.UpdatedBy ?? null,
        }
    },

    toFormModel(vm: FranchiseeViewModel | null): FranchiseeFormModel | null {
        if (!vm) return null
        return {
            brandId: vm.brandId,
            name: vm.name ?? '',
            legalName: vm.legalName ?? null,
            taxCode: vm.taxCode ?? null,
            bankAccount: vm.bankAccount ?? null,
            bankName: vm.bankName ?? null,
            joinedDate: vm.joinedDate ?? null,
            terminatedDate: vm.terminatedDate ?? null,
            isActive: vm.isActive ?? true,
            createdAt: vm.createdAt ?? null,
            createdBy: vm.createdBy ?? null,
            updatedAt: vm.updatedAt ?? null,
            updatedBy: vm.updatedBy ?? null,
        }
    },

    createResponseToViewModel(r: CreateFranchiseeResponse): FranchiseeViewModel {
        return {
            id: r.Id,
            tenantId: r.TenantId,
            brandId: r.BrandId,
            name: r.Name,
            legalName: r.LegalName ?? null,
            taxCode: r.TaxCode ?? null,
            bankAccount: r.BankAccount ?? null,
            bankName: r.BankName ?? null,
            isActive: r.IsActive,
            joinedDate: r.JoinedDate ?? null,
            terminatedDate: null,
            createdAt: r.CreatedAt ?? null,
            createdBy: r.CreatedBy ?? null,
            updatedAt: null,
            updatedBy: null,
        }
    },

    updateResponseToViewModel(r: UpdateFranchiseeResponse): FranchiseeViewModel {
        return {
            id: r.Id,
            tenantId: r.TenantId,
            brandId: r.BrandId,
            name: r.Name,
            legalName: r.LegalName ?? null,
            taxCode: r.TaxCode ?? null,
            bankAccount: r.BankAccount ?? null,
            bankName: r.BankName ?? null,
            isActive: r.IsActive,
            joinedDate: r.JoinedDate ?? null,
            terminatedDate: r.TerminatedDate ?? null,
            createdAt: null,
            createdBy: null,
            updatedAt: r.UpdatedAt ?? null,
            updatedBy: r.UpdatedBy ?? null,
        }
    },

    formModelToCreateRequest(form: FranchiseeFormModel): CreateFranchiseeRequest {
        return {
            BrandId: form.brandId!,
            Name: form.name.trim(),
            LegalName: form.legalName?.trim() ?? null,
            TaxCode: form.taxCode?.trim() ?? null,
            BankAccount: form.bankAccount?.trim() ?? null,
            BankName: form.bankName?.trim() ?? null,
            JoinedDate: form.joinedDate ?? null,
        }
    },

    formModelToUpdateRequest(form: FranchiseeFormModel): UpdateFranchiseeRequest {
        return {
            Name: form.name.trim(),
            IsActive: form.isActive,
            LegalName: form.legalName?.trim() ?? null,
            TaxCode: form.taxCode?.trim() ?? null,
            BankAccount: form.bankAccount?.trim() ?? null,
            BankName: form.bankName?.trim() ?? null,
            JoinedDate: form.joinedDate ?? null,
            TerminatedDate: form.terminatedDate ?? null,
        }
    },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/mappers/
git commit -m "feat(franchisee): add franchiseeMapper"
```

---

## Task 8: API Module

**File:** `src/modules/franchisee/api/franchisee.api.ts`

Uses `brandClient` because Franchisee is part of the Brand bounded context on the BE.

- [ ] **Step 1: Create franchisee.api.ts**

```ts
import { brandClient } from '@/core/api/clients/brand.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type {
    FranchiseeDto,
    FranchiseeFilterDto,
    CreateFranchiseeRequest,
    CreateFranchiseeResponse,
    UpdateFranchiseeRequest,
    UpdateFranchiseeResponse,
    DeleteFranchiseeResponse,
    FranchiseeMemberDto,
    AssignFranchiseeUsersRequest,
    AssignFranchiseeUsersResponse,
    RemoveFranchiseeUserResponse,
} from '@/modules/franchisee/models/dtos/_index'

export const franchiseeApi = {
    getPagedAsync(filter: FranchiseeFilterDto): Promise<PagedApiResponse<FranchiseeDto>> {
        return brandClient.get(API_ENDPOINTS.BRAND.FRANCHISEE_API.GET_PAGED, { params: filter })
    },

    getByIdAsync(id: number): Promise<ApiResponse<FranchiseeDto>> {
        return brandClient.get(API_ENDPOINTS.BRAND.FRANCHISEE_API.GET_BY_ID(id))
    },

    getByUserIdAsync(userId: string): Promise<ApiResponse<FranchiseeDto[]>> {
        return brandClient.get(API_ENDPOINTS.BRAND.FRANCHISEE_API.GET_BY_USER_ID(userId))
    },

    getByBrandIdAsync(brandId: number): Promise<ApiResponse<FranchiseeDto[]>> {
        return brandClient.get(API_ENDPOINTS.BRAND.FRANCHISEE_API.GET_BY_BRAND_ID(brandId))
    },

    createAsync(payload: CreateFranchiseeRequest): Promise<ApiResponse<CreateFranchiseeResponse>> {
        return brandClient.post(API_ENDPOINTS.BRAND.FRANCHISEE_API.CREATE, payload)
    },

    updateAsync(id: number, payload: UpdateFranchiseeRequest): Promise<ApiResponse<UpdateFranchiseeResponse>> {
        return brandClient.put(API_ENDPOINTS.BRAND.FRANCHISEE_API.UPDATE(id), payload)
    },

    deleteAsync(id: number): Promise<ApiResponse<DeleteFranchiseeResponse>> {
        return brandClient.delete(API_ENDPOINTS.BRAND.FRANCHISEE_API.DELETE(id))
    },

    getMembersAsync(id: number): Promise<ApiResponse<FranchiseeMemberDto[]>> {
        return brandClient.get(API_ENDPOINTS.BRAND.FRANCHISEE_API.GET_MEMBERS(id))
    },

    assignUsersAsync(id: number, payload: AssignFranchiseeUsersRequest): Promise<ApiResponse<AssignFranchiseeUsersResponse>> {
        return brandClient.post(API_ENDPOINTS.BRAND.FRANCHISEE_API.ASSIGN_USERS(id), payload)
    },

    removeUserAsync(id: number, userId: string): Promise<ApiResponse<RemoveFranchiseeUserResponse>> {
        return brandClient.delete(API_ENDPOINTS.BRAND.FRANCHISEE_API.REMOVE_USER(id, userId))
    },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/api/
git commit -m "feat(franchisee): add franchiseeApi module"
```

---

## Task 9: Service

**File:** `src/modules/franchisee/services/franchisee.service.ts`

Thin mapping layer. Exceptions propagate to the composable (which adds toast). `PagedApiResponse<T>` fields `PageNumber`, `TotalCount`, etc. are direct properties (not nested under `Data`); `Data` is the items array.

- [ ] **Step 1: Create franchisee.service.ts**

```ts
import { franchiseeApi } from '@/modules/franchisee/api/franchisee.api'
import { franchiseeMapper } from '@/modules/franchisee/mappers/franchisee.mapper'
import type {
    FranchiseeFilterDto,
    CreateFranchiseeRequest,
    UpdateFranchiseeRequest,
} from '@/modules/franchisee/models/dtos/_index'
import type { FranchiseeViewModel } from '@/modules/franchisee/models/view-models/franchisee.view-model'
import type { FranchiseeMemberViewModel } from '@/modules/franchisee/models/view-models/franchisee-member.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class FranchiseeService {
    async getPagedFranchiseesAsync(filter: FranchiseeFilterDto): Promise<PagedResult<FranchiseeViewModel>> {
        const response = await franchiseeApi.getPagedAsync(filter)
        return {
            items: franchiseeMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getFranchiseeAsync(id: number): Promise<FranchiseeViewModel | null> {
        const response = await franchiseeApi.getByIdAsync(id)
        return response.Data ? franchiseeMapper.toViewModel(response.Data) : null
    }

    async createFranchiseeAsync(payload: CreateFranchiseeRequest): Promise<FranchiseeViewModel | null> {
        const response = await franchiseeApi.createAsync(payload)
        return response.Data ? franchiseeMapper.createResponseToViewModel(response.Data) : null
    }

    async updateFranchiseeAsync(id: number, payload: UpdateFranchiseeRequest): Promise<FranchiseeViewModel | null> {
        const response = await franchiseeApi.updateAsync(id, payload)
        return response.Data ? franchiseeMapper.updateResponseToViewModel(response.Data) : null
    }

    async deleteFranchiseeAsync(id: number): Promise<void> {
        await franchiseeApi.deleteAsync(id)
    }

    async getMembersAsync(id: number): Promise<FranchiseeMemberViewModel[]> {
        const response = await franchiseeApi.getMembersAsync(id)
        return (response.Data ?? []).map((m) => ({
            franchiseeId: m.FranchiseeId,
            tenantId: m.TenantId,
            userId: m.UserId,
        }))
    }
}

export const franchiseeService = new FranchiseeService()
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/services/
git commit -m "feat(franchisee): add FranchiseeService"
```

---

## Task 10: Pinia Store

**File:** `src/modules/franchisee/stores/franchisee.store.ts`

- [ ] **Step 1: Create franchisee.store.ts**

```ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { franchiseeService } from '@/modules/franchisee/services/franchisee.service'
import { createLogger } from '@/core/logger/logger'
import type { FranchiseeFilterDto } from '@/modules/franchisee/models/dtos/_index'
import type { CreateFranchiseeRequest } from '@/modules/franchisee/models/dtos/_index'
import type { UpdateFranchiseeRequest } from '@/modules/franchisee/models/dtos/_index'
import type { FranchiseeViewModel } from '@/modules/franchisee/models/view-models/franchisee.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

const log = createLogger('franchisee-store')

type PaginationState = Omit<PagedResult<FranchiseeViewModel>, 'items'>

const DEFAULT_PAGINATION: PaginationState = {
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
}

const DEFAULT_FILTER: FranchiseeFilterDto = {
    PageNumber: 1,
    PageSize: 10,
}

export const useFranchiseeStore = defineStore('franchisee', () => {
    const franchisees = ref<FranchiseeViewModel[]>([])
    const currentFranchisee = ref<FranchiseeViewModel | null>(null)
    const pagination = ref<PaginationState>({ ...DEFAULT_PAGINATION })
    const filter = ref<FranchiseeFilterDto>({ ...DEFAULT_FILTER })

    const listLoading = ref(false)
    const detailLoading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const error = ref<string | null>(null)

    const isEmpty = computed(() => franchisees.value.length === 0)
    const totalCount = computed(() => pagination.value.totalCount)

    async function fetchPaged(params?: Partial<FranchiseeFilterDto>): Promise<void> {
        if (params) filter.value = { ...filter.value, ...params }
        listLoading.value = true
        error.value = null
        try {
            log.info('Fetching paged franchisees')
            const result = await franchiseeService.getPagedFranchiseesAsync(filter.value)
            franchisees.value = result.items
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
            log.warn('Fetch paged franchisees failed', { error: error.value })
            throw err
        } finally {
            listLoading.value = false
        }
    }

    async function fetchById(id: number): Promise<void> {
        detailLoading.value = true
        error.value = null
        try {
            log.info('Fetching franchisee by id', { id })
            currentFranchisee.value = await franchiseeService.getFranchiseeAsync(id)
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Fetch franchisee by id failed', { error: error.value, id })
            throw err
        } finally {
            detailLoading.value = false
        }
    }

    async function create(payload: CreateFranchiseeRequest): Promise<FranchiseeViewModel | null> {
        saving.value = true
        error.value = null
        try {
            log.info('Creating franchisee', { name: payload.Name })
            const item = await franchiseeService.createFranchiseeAsync(payload)
            if (item) {
                franchisees.value.unshift(item)
                pagination.value.totalCount++
            }
            return item
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Create franchisee failed', { error: error.value })
            throw err
        } finally {
            saving.value = false
        }
    }

    async function update(id: number, payload: UpdateFranchiseeRequest): Promise<FranchiseeViewModel | null> {
        saving.value = true
        error.value = null
        try {
            log.info('Updating franchisee', { id })
            const updated = await franchiseeService.updateFranchiseeAsync(id, payload)
            if (updated) {
                const index = franchisees.value.findIndex((f) => f.id === id)
                if (index !== -1) franchisees.value[index] = updated
                if (currentFranchisee.value?.id === id) currentFranchisee.value = updated
            }
            return updated
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Update franchisee failed', { error: error.value, id })
            throw err
        } finally {
            saving.value = false
        }
    }

    async function remove(id: number): Promise<void> {
        deleting.value = true
        error.value = null
        try {
            log.info('Deleting franchisee', { id })
            await franchiseeService.deleteFranchiseeAsync(id)
            franchisees.value = franchisees.value.filter((f) => f.id !== id)
            pagination.value.totalCount = Math.max(0, pagination.value.totalCount - 1)
            if (currentFranchisee.value?.id === id) currentFranchisee.value = null
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Delete franchisee failed', { error: error.value, id })
            throw err
        } finally {
            deleting.value = false
        }
    }

    function setFilter(params: Partial<FranchiseeFilterDto>): void {
        filter.value = { ...filter.value, ...params }
    }

    function setCurrentFranchisee(item: FranchiseeViewModel | null): void {
        currentFranchisee.value = item
    }

    function reset(): void {
        franchisees.value = []
        currentFranchisee.value = null
        pagination.value = { ...DEFAULT_PAGINATION }
        filter.value = { ...DEFAULT_FILTER }
        listLoading.value = false
        detailLoading.value = false
        saving.value = false
        deleting.value = false
        error.value = null
        log.info('Franchisee store reset')
    }

    return {
        franchisees, currentFranchisee, pagination, filter,
        listLoading, detailLoading, saving, deleting, error,
        isEmpty, totalCount,
        fetchPaged, fetchById, create, update, remove,
        setFilter, setCurrentFranchisee, reset,
    }
})
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/stores/
git commit -m "feat(franchisee): add useFranchiseeStore"
```

---

## Task 11: Composable

**File:** `src/modules/franchisee/composables/useFranchisee.ts`

Toast-wrapped service calls. Errors are always re-thrown after toast so callers can react.

- [ ] **Step 1: Create useFranchisee.ts**

```ts
import { useToastNotification } from '@/composables/useToastNotification'
import { franchiseeService } from '@/modules/franchisee/services/franchisee.service'
import type {
    FranchiseeFilterDto,
    CreateFranchiseeRequest,
    UpdateFranchiseeRequest,
} from '@/modules/franchisee/models/dtos/_index'

export function useFranchisee() {
    const toast = useToastNotification()

    async function getPagedFranchisees(filter: FranchiseeFilterDto) {
        try {
            return await franchiseeService.getPagedFranchiseesAsync(filter)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách nhà nhượng quyền.')
            throw error
        }
    }

    async function getFranchisee(id: number) {
        try {
            return await franchiseeService.getFranchiseeAsync(id)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải chi tiết nhà nhượng quyền.')
            throw error
        }
    }

    async function createFranchisee(payload: CreateFranchiseeRequest) {
        try {
            const item = await franchiseeService.createFranchiseeAsync(payload)
            toast.success('Tạo nhà nhượng quyền thành công.')
            return item
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Tạo nhà nhượng quyền thất bại.')
            throw error
        }
    }

    async function updateFranchisee(id: number, payload: UpdateFranchiseeRequest) {
        try {
            const item = await franchiseeService.updateFranchiseeAsync(id, payload)
            toast.success('Cập nhật nhà nhượng quyền thành công.')
            return item
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Cập nhật nhà nhượng quyền thất bại.')
            throw error
        }
    }

    async function deleteFranchisee(id: number) {
        try {
            await franchiseeService.deleteFranchiseeAsync(id)
            toast.success('Xóa nhà nhượng quyền thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xóa nhà nhượng quyền thất bại.')
            throw error
        }
    }

    return {
        getPagedFranchisees,
        getFranchisee,
        createFranchisee,
        updateFranchisee,
        deleteFranchisee,
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/composables/
git commit -m "feat(franchisee): add useFranchisee composable"
```

---

## Task 12: List Constants

**File:** `src/modules/franchisee/constants/franchisee-list.constants.ts`

- [ ] **Step 1: Create franchisee-list.constants.ts**

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
import { FranchiseeStatus } from '@/modules/franchisee/enums/_index'
import type { FranchiseeViewModel } from '@/modules/franchisee/models/view-models/franchisee.view-model'

export const FRANCHISEE_LIST_EMIT = {
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

export type FranchiseeListEmits = {
    (event: typeof FRANCHISEE_LIST_EMIT.UPDATE_ACTIVE_FILTERS, value: ActiveFilters): void
    (event: typeof FRANCHISEE_LIST_EMIT.SEARCH): void
    (event: typeof FRANCHISEE_LIST_EMIT.RESET): void
    (event: typeof FRANCHISEE_LIST_EMIT.PAGE_CHANGE, page: number): void
    (event: typeof FRANCHISEE_LIST_EMIT.PAGE_SIZE_CHANGE, size: number): void
    (event: typeof FRANCHISEE_LIST_EMIT.SORT_CHANGE, state: SortState | null): void
    (event: typeof FRANCHISEE_LIST_EMIT.ROW_ACTION, key: string, item: FranchiseeViewModel): void
    (event: typeof FRANCHISEE_LIST_EMIT.CREATE): void
    (event: typeof FRANCHISEE_LIST_EMIT.REFRESH): void
}

export const FRANCHISEE_ROW_ACTION = {
    VIEW: 'view',
    EDIT: 'edit',
    DELETE: 'delete',
} as const

export type FranchiseeRowActionKey = (typeof FRANCHISEE_ROW_ACTION)[keyof typeof FRANCHISEE_ROW_ACTION]

export function buildFranchiseeFilterFields(brandOptions: FilterOption[]): FilterField[] {
    return [
        { key: 'keyword', label: 'Tìm kiếm', type: 'text', placeholder: 'Tên, mã số thuế...' },
        {
            key: 'brandId',
            label: 'Thương hiệu',
            type: 'select',
            options: [{ label: 'Tất cả', value: null }, ...brandOptions],
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
    ]
}

export const FRANCHISEE_LIST_COLUMNS: TableColumn[] = [
    { key: 'name', title: 'Nhà nhượng quyền', sortable: false, minWidth: '200px' },
    { key: 'taxCode', title: 'MST', width: '130px' },
    { key: 'isActive', title: 'Trạng thái', width: '130px', align: 'center' },
    { key: 'joinedDate', title: 'Ngày tham gia', width: '150px', hideBelow: 'lg' },
    { key: 'actions', title: '', width: '120px', align: 'end' },
]

export const FRANCHISEE_LIST_ROW_ACTIONS: RowAction<FranchiseeViewModel>[] = [
    { key: FRANCHISEE_ROW_ACTION.VIEW, label: 'Xem chi tiết', icon: 'mdi-eye-outline' },
    { key: FRANCHISEE_ROW_ACTION.EDIT, label: 'Chỉnh sửa', icon: 'mdi-pencil-outline', color: 'primary' },
    { key: FRANCHISEE_ROW_ACTION.DELETE, label: 'Xóa', icon: 'mdi-delete-outline', color: 'error' },
]

export const FRANCHISEE_STATUS_CONFIG: Record<FranchiseeStatus, StatusConfig> = {
    [FranchiseeStatus.Active]: {
        label: 'Hoạt động',
        color: 'success',
        icon: 'mdi-check-circle-outline',
        variant: 'tonal',
    },
    [FranchiseeStatus.Inactive]: {
        label: 'Ngừng',
        color: 'error',
        icon: 'mdi-close-circle-outline',
        variant: 'tonal',
    },
}
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/constants/franchisee-list.constants.ts
git commit -m "feat(franchisee): add franchisee list constants"
```

---

## Task 13: Form and Member List Constants

**Files:**
- Create: `src/modules/franchisee/constants/franchisee-form.constants.ts`
- Create: `src/modules/franchisee/constants/franchisee-member-list.constants.ts`

- [ ] **Step 1: Create franchisee-form.constants.ts**

```ts
import type { FranchiseeFormModel } from '@/modules/franchisee/models/form-models/franchisee.model'

export const FRANCHISEE_FORM_EMIT = {
    UPDATE_MODEL_VALUE: 'update:modelValue',
    SUBMIT: 'submit',
} as const

export type FranchiseeFormEmits = {
    (event: typeof FRANCHISEE_FORM_EMIT.UPDATE_MODEL_VALUE, value: boolean): void
    (event: typeof FRANCHISEE_FORM_EMIT.SUBMIT, form: FranchiseeFormModel): void
}
```

- [ ] **Step 2: Create franchisee-member-list.constants.ts**

```ts
import type { TableColumn } from '@/components/ui'

export const FRANCHISEE_MEMBER_LIST_EMIT = {
    ROW_ACTION: 'row-action',
    ASSIGN: 'assign',
    REFRESH: 'refresh',
} as const

export const FRANCHISEE_MEMBER_LIST_COLUMNS: TableColumn[] = [
    { key: 'userId', title: 'User ID', minWidth: '200px' },
    { key: 'actions', title: '', width: '80px', align: 'end' },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/franchisee/constants/
git commit -m "feat(franchisee): add form and member list constants"
```

---

## Task 14: FranchiseeList Component

**File:** `src/modules/franchisee/components/FranchiseeList.vue`

- [ ] **Step 1: Create FranchiseeList.vue**

```vue
<template>
  <div class="d-flex flex-column ga-4">
    <AppPageHeader
      title="Nhà nhượng quyền"
      subtitle="Quản lý danh sách nhà nhượng quyền và trạng thái hoạt động"
    >
      <template #breadcrumb>
        <AppBreadcrumb
          :items="[
            { title: 'Dashboard', to: '/admin' },
            { title: 'Nhà nhượng quyền', disabled: true },
          ]"
        />
      </template>

      <v-btn
        variant="outlined"
        prepend-icon="mdi-refresh"
        :loading="loading"
        @click="emit(FRANCHISEE_LIST_EMIT.REFRESH)"
      >
        Tải lại
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(FRANCHISEE_LIST_EMIT.CREATE)">
        Tạo nhà NQ
      </v-btn>
    </AppPageHeader>

    <AppFilterBar>
      <AppDataFilter
        :fields="filterFields"
        :model-value="activeFilters"
        @update:model-value="emit(FRANCHISEE_LIST_EMIT.UPDATE_ACTIVE_FILTERS, $event)"
        @search="emit(FRANCHISEE_LIST_EMIT.SEARCH)"
      />
      <template #actions>
        <v-btn variant="text" prepend-icon="mdi-filter-off-outline" @click="emit(FRANCHISEE_LIST_EMIT.RESET)">
          Xóa lọc
        </v-btn>
        <v-btn color="primary" prepend-icon="mdi-magnify" @click="emit(FRANCHISEE_LIST_EMIT.SEARCH)">
          Tìm kiếm
        </v-btn>
      </template>
    </AppFilterBar>

    <v-card rounded="lg">
      <AppDataTable
        :items="items"
        :columns="FRANCHISEE_LIST_COLUMNS"
        :loading="loading"
        :sort-by="sortBy"
        item-key="id"
        @update:sort-by="emit(FRANCHISEE_LIST_EMIT.SORT_CHANGE, $event)"
        @row-click="(item) => emit(FRANCHISEE_LIST_EMIT.ROW_ACTION, FRANCHISEE_ROW_ACTION.VIEW, item)"
      >
        <template #[`item.name`]="{ item }">
          <div class="d-flex flex-column py-1">
            <span class="font-weight-medium">{{ item.name }}</span>
            <span v-if="item.legalName" class="text-caption text-medium-emphasis">{{ item.legalName }}</span>
          </div>
        </template>

        <template #[`item.taxCode`]="{ item }">
          <v-chip v-if="item.taxCode" size="small" variant="tonal" color="primary">{{ item.taxCode }}</v-chip>
          <span v-else class="text-medium-emphasis text-caption">—</span>
        </template>

        <template #[`item.isActive`]="{ item }">
          <AppStatusChip
            :config="FRANCHISEE_STATUS_CONFIG[item.isActive ? FranchiseeStatus.Active : FranchiseeStatus.Inactive]"
          />
        </template>

        <template #[`item.joinedDate`]="{ item }">
          <span v-if="item.joinedDate" class="text-body-2">
            {{ new Date(item.joinedDate).toLocaleDateString('vi-VN') }}
          </span>
          <span v-else class="text-medium-emphasis text-caption">—</span>
        </template>

        <template #[`item.actions`]="{ item }">
          <AppRowActions
            :actions="FRANCHISEE_LIST_ROW_ACTIONS"
            :item="item"
            @action="emit(FRANCHISEE_LIST_EMIT.ROW_ACTION, $event, item)"
          />
        </template>

        <template #empty>
          <AppEmptyState
            icon="mdi-handshake-outline"
            title="Chưa có nhà nhượng quyền"
            description="Tạo nhà nhượng quyền đầu tiên để bắt đầu quản lý."
          >
            <template #actions>
              <v-btn color="primary" prepend-icon="mdi-plus" @click="emit(FRANCHISEE_LIST_EMIT.CREATE)">
                Tạo nhà NQ
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
        @update:page-number="emit(FRANCHISEE_LIST_EMIT.PAGE_CHANGE, $event)"
        @update:page-size="emit(FRANCHISEE_LIST_EMIT.PAGE_SIZE_CHANGE, $event)"
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
  FRANCHISEE_LIST_EMIT,
  FRANCHISEE_ROW_ACTION,
  FRANCHISEE_LIST_COLUMNS,
  FRANCHISEE_LIST_ROW_ACTIONS,
  FRANCHISEE_STATUS_CONFIG,
  type FranchiseeListEmits,
} from '@/modules/franchisee/constants/franchisee-list.constants'
import { FranchiseeStatus } from '@/modules/franchisee/enums/_index'
import type { FranchiseeViewModel } from '@/modules/franchisee/models/view-models/franchisee.view-model'

defineProps<{
  items: FranchiseeViewModel[]
  loading: boolean
  pageNumber: number
  pageSize: number
  totalPages: number
  totalItems: number
  activeFilters: ActiveFilters
  filterFields: FilterField[]
  sortBy: SortState | null
}>()

const emit = defineEmits<FranchiseeListEmits>()
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/components/FranchiseeList.vue
git commit -m "feat(franchisee): add FranchiseeList component"
```

---

## Task 15: FranchiseeForm Component

**File:** `src/modules/franchisee/components/FranchiseeForm.vue`

Dialog for create and edit. When `isEdit === true`, the `BrandId` field is hidden (brand cannot be changed after creation). `v-switch` emits `boolean | null` — use `!!$event` when binding to the strict `boolean` field `isActive`.

- [ ] **Step 1: Create FranchiseeForm.vue**

```vue
<template>
  <AppDialog
    :model-value="modelValue"
    :title="title"
    :loading="submitting"
    size="lg"
    @update:model-value="emit(FRANCHISEE_FORM_EMIT.UPDATE_MODEL_VALUE, $event)"
  >
    <v-form ref="formRef" @submit.prevent="onSubmit">
      <v-row>
        <v-col v-if="!isEdit" cols="12" md="6">
          <v-select
            v-model="form.brandId"
            :items="brandOptions"
            item-title="label"
            item-value="value"
            label="Thương hiệu *"
            :rules="[(v) => !!v || 'Thương hiệu là bắt buộc']"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.name"
            label="Tên nhà nhượng quyền *"
            :rules="[(v: string) => !!v?.trim() || 'Tên là bắt buộc']"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.legalName"
            label="Tên pháp nhân"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.taxCode"
            label="Mã số thuế"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.bankAccount"
            label="Số tài khoản ngân hàng"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.bankName"
            label="Tên ngân hàng"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="form.joinedDate"
            label="Ngày tham gia (ISO 8601)"
            placeholder="2024-01-15T00:00:00Z"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col v-if="isEdit" cols="12" md="6">
          <v-text-field
            v-model="form.terminatedDate"
            label="Ngày kết thúc (ISO 8601)"
            placeholder="2025-12-31T00:00:00Z"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col v-if="isEdit" cols="12" md="6">
          <v-switch
            :model-value="form.isActive"
            label="Đang hoạt động"
            color="primary"
            density="comfortable"
            hide-details
            @update:model-value="form.isActive = !!$event"
          />
        </v-col>
      </v-row>
    </v-form>

    <template #[`actions`]>
      <v-btn variant="text" :disabled="submitting" @click="emit(FRANCHISEE_FORM_EMIT.UPDATE_MODEL_VALUE, false)">
        Hủy
      </v-btn>
      <v-btn color="primary" :loading="submitting" @click="onSubmit">Lưu</v-btn>
    </template>
  </AppDialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { VForm } from 'vuetify/components'
import { AppDialog } from '@/components/ui'
import type { FilterOption } from '@/components/ui'
import {
  FRANCHISEE_FORM_EMIT,
  type FranchiseeFormEmits,
} from '@/modules/franchisee/constants/franchisee-form.constants'
import type { FranchiseeFormModel } from '@/modules/franchisee/models/form-models/franchisee.model'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    form?: FranchiseeFormModel | null
    isEdit?: boolean
    brandOptions?: FilterOption[]
    submitting?: boolean
  }>(),
  { form: null, isEdit: false, brandOptions: () => [], submitting: false },
)

const emit = defineEmits<FranchiseeFormEmits>()

const formRef = ref<VForm | null>(null)

const localForm = reactive<FranchiseeFormModel>({
  brandId: null,
  name: '',
  legalName: null,
  taxCode: null,
  bankAccount: null,
  bankName: null,
  joinedDate: null,
  terminatedDate: null,
  isActive: true,
})

function fillForm(source: FranchiseeFormModel | null) {
  localForm.brandId = source?.brandId ?? null
  localForm.name = source?.name ?? ''
  localForm.legalName = source?.legalName ?? null
  localForm.taxCode = source?.taxCode ?? null
  localForm.bankAccount = source?.bankAccount ?? null
  localForm.bankName = source?.bankName ?? null
  localForm.joinedDate = source?.joinedDate ?? null
  localForm.terminatedDate = source?.terminatedDate ?? null
  localForm.isActive = source?.isActive ?? true
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) fillForm(props.form ?? null)
    else fillForm(null)
  },
)

async function onSubmit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return
  emit(FRANCHISEE_FORM_EMIT.SUBMIT, { ...localForm })
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/components/FranchiseeForm.vue
git commit -m "feat(franchisee): add FranchiseeForm dialog component"
```

---

## Task 16: FranchiseeOverviewTab Component

**File:** `src/modules/franchisee/components/detail/FranchiseeOverviewTab.vue`

Inline-edit tab. Receives `form` and `isDirty` from the parent view. Emits field-level updates.

- [ ] **Step 1: Create FranchiseeOverviewTab.vue**

```vue
<template>
  <v-card-text class="pa-5">
    <div v-if="isDirty" class="d-flex justify-end ga-2 mb-5">
      <v-btn variant="text" :disabled="submitting" @click="emit('discard')">Hủy thay đổi</v-btn>
      <v-btn color="primary" :loading="submitting" @click="emit('save')">Lưu thay đổi</v-btn>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.name"
          label="Tên nhà nhượng quyền *"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'name', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.legalName"
          label="Tên pháp nhân"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'legalName', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.taxCode"
          label="Mã số thuế"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'taxCode', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.bankAccount"
          label="Số tài khoản ngân hàng"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'bankAccount', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.bankName"
          label="Tên ngân hàng"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'bankName', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.joinedDate"
          label="Ngày tham gia (ISO 8601)"
          placeholder="2024-01-15T00:00:00Z"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'joinedDate', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          :model-value="form.terminatedDate"
          label="Ngày kết thúc (ISO 8601)"
          placeholder="2025-12-31T00:00:00Z"
          variant="outlined"
          density="comfortable"
          @update:model-value="emit('update:form', 'terminatedDate', $event)"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-switch
          :model-value="form.isActive"
          label="Đang hoạt động"
          color="primary"
          density="comfortable"
          hide-details
          @update:model-value="emit('update:form', 'isActive', !!$event)"
        />
      </v-col>
    </v-row>

    <v-divider class="my-4" />

    <div class="text-caption text-medium-emphasis d-flex flex-column ga-1">
      <span v-if="form.createdAt">Tạo lúc: {{ new Date(form.createdAt).toLocaleString('vi-VN') }} bởi {{ form.createdBy }}</span>
      <span v-if="form.updatedAt">Cập nhật: {{ new Date(form.updatedAt).toLocaleString('vi-VN') }} bởi {{ form.updatedBy }}</span>
    </div>
  </v-card-text>
</template>

<script setup lang="ts">
import type { FranchiseeFormModel } from '@/modules/franchisee/models/form-models/franchisee.model'

defineProps<{
  form: FranchiseeFormModel
  isDirty: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:form': [field: keyof FranchiseeFormModel, value: unknown]
  save: []
  discard: []
}>()
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/components/detail/
git commit -m "feat(franchisee): add FranchiseeOverviewTab inline-edit component"
```

---

## Task 17: FranchiseeMemberList + Components Barrel

**Files:**
- Create: `src/modules/franchisee/components/FranchiseeMemberList.vue`
- Create: `src/modules/franchisee/components/_index.ts`

- [ ] **Step 1: Create FranchiseeMemberList.vue** (placeholder — full implementation out of scope)

```vue
<template>
  <v-card-text class="pa-5">
    <AppEmptyState
      icon="mdi-account-group-outline"
      title="Tính năng đang phát triển"
      description="Quản lý thành viên nhà nhượng quyền sẽ sớm được hỗ trợ."
    />
  </v-card-text>
</template>

<script setup lang="ts">
import { AppEmptyState } from '@/components/ui'

defineProps<{
  franchiseeId: number
}>()
</script>
```

- [ ] **Step 2: Create components/_index.ts**

```ts
export { default as FranchiseeList } from './FranchiseeList.vue'
export { default as FranchiseeForm } from './FranchiseeForm.vue'
export { default as FranchiseeMemberList } from './FranchiseeMemberList.vue'
export { default as FranchiseeOverviewTab } from './detail/FranchiseeOverviewTab.vue'
```

- [ ] **Step 3: Commit**

```bash
git add src/modules/franchisee/components/
git commit -m "feat(franchisee): add FranchiseeMemberList placeholder and components barrel"
```

---

## Task 18: FranchiseesView

**File:** `src/modules/franchisee/views/FranchiseesView.vue`

List page. Loads brand options at mount. Follows StoresView pattern exactly. Brand service uses `brandService.getBrandsByUserIdAsync` from `@/modules/brand/services/brand.service`.

- [ ] **Step 1: Create FranchiseesView.vue**

```vue
<template>
  <div class="d-flex flex-column ga-4">
    <FranchiseeList
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

    <FranchiseeForm
      v-model="isFormDialogOpen"
      :title="selectedFranchisee ? 'Cập nhật nhà nhượng quyền' : 'Tạo nhà nhượng quyền'"
      :form="selectedFranchisee ? franchiseeMapper.toFormModel(selectedFranchisee) : null"
      :is-edit="!!selectedFranchisee"
      :brand-options="brandOptions"
      :submitting="submitting"
      @submit="saveFranchisee"
    />

    <AppDialog
      v-model="isDeleteDialogOpen"
      title="Xóa nhà nhượng quyền"
      size="sm"
      confirm-label="Xóa"
      cancel-label="Hủy"
      :loading="deleting"
      @confirm="doDelete"
      @cancel="franchiseeToDelete = null"
    >
      Bạn có chắc muốn xóa nhà nhượng quyền
      <strong>{{ franchiseeToDelete?.name }}</strong>?
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
import { franchiseeMapper } from '@/modules/franchisee/mappers/franchisee.mapper'
import { useFranchisee } from '@/modules/franchisee/composables/useFranchisee'
import { buildFranchiseeFilterFields, FRANCHISEE_ROW_ACTION } from '@/modules/franchisee/constants/franchisee-list.constants'
import type { FranchiseeFormModel } from '@/modules/franchisee/models/form-models/franchisee.model'
import type { FranchiseeViewModel } from '@/modules/franchisee/models/view-models/franchisee.view-model'
import FranchiseeList from '@/modules/franchisee/components/FranchiseeList.vue'
import FranchiseeForm from '@/modules/franchisee/components/FranchiseeForm.vue'
import { brandService } from '@/modules/brand/services/brand.service'
import { useUserStore } from '@/modules/user/stores/user.store'

const router = useRouter()
const { getPagedFranchisees, createFranchisee, updateFranchisee, deleteFranchisee } = useFranchisee()
const userStore = useUserStore()

// ── Filter options ──────────────────────────────────────────────────────────
const brandOptions = ref<FilterOption[]>([])
const filterFields = computed(() => buildFranchiseeFilterFields(brandOptions.value))

// ── List page ───────────────────────────────────────────────────────────────
const fetchFranchisees = async (
  params: ListPageParams,
): Promise<{ items: FranchiseeViewModel[]; total: number }> => {
  const isActiveStr = params.filters['isActive'] as string | null
  const result = await getPagedFranchisees({
    PageNumber: params.pageNumber,
    PageSize: params.pageSize,
    Keyword: (params.filters['keyword'] as string | null) ?? null,
    BrandId: params.filters['brandId'] ? Number(params.filters['brandId']) : null,
    IsActive: isActiveStr === 'true' ? true : isActiveStr === 'false' ? false : null,
  })
  return { items: result.items, total: result.totalCount }
}

const listPage = useListPage<FranchiseeViewModel>({
  fetchFn: fetchFranchisees,
  keyField: 'id',
  defaultPageSize: DEFAULT_PAGINATION.LIMIT,
})

const viewItems = computed<FranchiseeViewModel[]>(() => listPage.items.value ?? [])

// ── Form dialog ─────────────────────────────────────────────────────────────
const selectedFranchisee = ref<FranchiseeViewModel | null>(null)
const isFormDialogOpen = ref(false)
const submitting = ref(false)

const openCreateDialog = () => {
  selectedFranchisee.value = null
  isFormDialogOpen.value = true
}

const saveFranchisee = async (form: FranchiseeFormModel) => {
  submitting.value = true
  try {
    if (selectedFranchisee.value) {
      await updateFranchisee(selectedFranchisee.value.id, franchiseeMapper.formModelToUpdateRequest(form))
    } else {
      await createFranchisee(franchiseeMapper.formModelToCreateRequest(form))
    }
    isFormDialogOpen.value = false
    selectedFranchisee.value = null
    await listPage.refresh()
  } finally {
    submitting.value = false
  }
}

// ── Delete dialog ───────────────────────────────────────────────────────────
const franchiseeToDelete = ref<FranchiseeViewModel | null>(null)
const isDeleteDialogOpen = ref(false)
const deleting = ref(false)

const doDelete = async () => {
  if (!franchiseeToDelete.value) return
  deleting.value = true
  try {
    await deleteFranchisee(franchiseeToDelete.value.id)
    isDeleteDialogOpen.value = false
    franchiseeToDelete.value = null
    await listPage.refresh()
  } finally {
    deleting.value = false
  }
}

// ── Row actions ─────────────────────────────────────────────────────────────
const handleRowAction = (key: string, item: FranchiseeViewModel) => {
  if (key === FRANCHISEE_ROW_ACTION.VIEW) {
    void router.push({
      name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEE_DETAIL.NAME,
      params: { id: item.id },
    })
  } else if (key === FRANCHISEE_ROW_ACTION.EDIT) {
    selectedFranchisee.value = item
    isFormDialogOpen.value = true
  } else if (key === FRANCHISEE_ROW_ACTION.DELETE) {
    franchiseeToDelete.value = item
    isDeleteDialogOpen.value = true
  }
}

onMounted(async () => {
  await userStore.fetchProfile()
  const userId = userStore.profile?.Id
  if (userId) {
    const brands = await brandService.getBrandsByUserIdAsync(userId)
    brandOptions.value = brands.map((b) => ({ label: b.name, value: b.id }))
  }
  await listPage.refresh()
})
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/views/FranchiseesView.vue
git commit -m "feat(franchisee): add FranchiseesView list page"
```

---

## Task 19: FranchiseeDetailView

**File:** `src/modules/franchisee/views/FranchiseeDetailView.vue`

Detail page with hero header, tabs (Tổng quan, Thành viên), and inline edit. Follows BrandDetailView + StoreDetailView pattern exactly.

- [ ] **Step 1: Create FranchiseeDetailView.vue**

```vue
<template>
  <div class="d-flex flex-column ga-5">
    <template v-if="franchisee.loading.value">
      <v-skeleton-loader type="heading" />
      <v-skeleton-loader type="card" height="120" />
      <v-skeleton-loader type="card" />
    </template>

    <template v-else-if="franchisee.data.value">
      <!-- ── Hero Header ──────────────────────────────────────── -->
      <v-card variant="tonal" color="primary" rounded="lg" flat>
        <v-card-text class="pa-5">
          <div class="d-flex align-start justify-space-between flex-wrap ga-4">
            <div class="d-flex flex-column ga-3">
              <AppBreadcrumb
                :items="[
                  { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
                  { title: 'Nhà nhượng quyền', to: { name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME } },
                  { title: franchisee.data.value.name, disabled: true },
                ]"
              />
              <div class="d-flex align-center ga-3">
                <v-sheet
                  rounded="lg"
                  width="52"
                  height="52"
                  class="d-flex align-center justify-center flex-shrink-0"
                >
                  <v-icon icon="mdi-handshake-outline" size="28" color="primary" />
                </v-sheet>
                <div>
                  <div class="text-h6 font-weight-bold text-high-emphasis">
                    {{ franchisee.data.value.name }}
                  </div>
                  <div class="text-body-2 text-medium-emphasis mt-1">
                    {{ franchisee.data.value.legalName || `Brand ID: ${franchisee.data.value.brandId}` }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- ── Tabs ────────────────────────────────────────────── -->
      <v-card rounded="lg" elevation="1">
        <v-tabs v-model="activeTab" color="primary" class="px-2">
          <v-tab value="overview" class="text-none" rounded="lg">
            <v-icon start icon="mdi-information-outline" size="18" />
            Tổng quan
          </v-tab>
          <v-tab value="members" class="text-none" rounded="lg">
            <v-icon start icon="mdi-account-group-outline" size="18" />
            Thành viên
          </v-tab>
        </v-tabs>

        <v-divider />

        <v-window v-model="activeTab">
          <v-window-item value="overview">
            <FranchiseeOverviewTab
              :form="editForm"
              :is-dirty="isDirty"
              :submitting="submitting"
              @update:form="onFormUpdate"
              @save="saveChanges"
              @discard="discardChanges"
            />
          </v-window-item>
          <v-window-item value="members">
            <FranchiseeMemberList :franchisee-id="franchisee.data.value.id" />
          </v-window-item>
        </v-window>
      </v-card>
    </template>

    <!-- Not found -->
    <AppEmptyState
      v-else-if="!franchisee.loading.value"
      icon="mdi-handshake-outline"
      title="Không tìm thấy nhà nhượng quyền"
      description="Nhà nhượng quyền này không tồn tại hoặc đã bị xóa."
    >
      <template #actions>
        <v-btn
          color="primary"
          prepend-icon="mdi-arrow-left"
          rounded="lg"
          :to="{ name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME }"
        >
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
import { franchiseeMapper } from '@/modules/franchisee/mappers/franchisee.mapper'
import { useFranchisee } from '@/modules/franchisee/composables/useFranchisee'
import type { FranchiseeFormModel } from '@/modules/franchisee/models/form-models/franchisee.model'
import FranchiseeOverviewTab from '@/modules/franchisee/components/detail/FranchiseeOverviewTab.vue'
import FranchiseeMemberList from '@/modules/franchisee/components/FranchiseeMemberList.vue'

const route = useRoute()
const { getFranchisee, updateFranchisee } = useFranchisee()

const franchiseeId = Number(route.params['id'])
const activeTab = ref('overview')

const franchisee = useAsyncState(() => getFranchisee(franchiseeId))

// ── Inline edit form ──────────────────────────────────────
const editForm = reactive<FranchiseeFormModel>({
  brandId: null,
  name: '',
  legalName: null,
  taxCode: null,
  bankAccount: null,
  bankName: null,
  joinedDate: null,
  terminatedDate: null,
  isActive: true,
})

const snapshot = ref<FranchiseeFormModel | null>(null)

function syncFormFromFranchisee() {
  if (!franchisee.data.value) return
  const mapped = franchiseeMapper.toFormModel(franchisee.data.value)
  if (!mapped) return
  Object.assign(editForm, mapped)
  snapshot.value = { ...editForm }
}

onMounted(async () => {
  await franchisee.execute()
  syncFormFromFranchisee()
})

const isDirty = computed(() => {
  if (!snapshot.value) return false
  return (
    editForm.name !== snapshot.value.name ||
    editForm.legalName !== snapshot.value.legalName ||
    editForm.taxCode !== snapshot.value.taxCode ||
    editForm.bankAccount !== snapshot.value.bankAccount ||
    editForm.bankName !== snapshot.value.bankName ||
    editForm.joinedDate !== snapshot.value.joinedDate ||
    editForm.terminatedDate !== snapshot.value.terminatedDate ||
    editForm.isActive !== snapshot.value.isActive
  )
})

function onFormUpdate(field: keyof FranchiseeFormModel, value: unknown) {
  ;(editForm as Record<string, unknown>)[field] = value
}

// ── Save / Discard ───────────────────────────────────────
const submitting = ref(false)

function discardChanges() {
  syncFormFromFranchisee()
}

async function saveChanges() {
  submitting.value = true
  try {
    const updated = await updateFranchisee(
      franchiseeId,
      franchiseeMapper.formModelToUpdateRequest(editForm),
    )
    if (updated) {
      franchisee.data.value = updated
      syncFormFromFranchisee()
    }
  } finally {
    submitting.value = false
  }
}
</script>
```

- [ ] **Step 2: Commit**

```bash
git add src/modules/franchisee/views/FranchiseeDetailView.vue
git commit -m "feat(franchisee): add FranchiseeDetailView"
```

---

## Task 20: Update routes.ts

**File:** `src/router/routes.ts`

Replace the `FRANCHISEES → ComingSoonView` route with `FranchiseesView`, and add the `FRANCHISEE_DETAIL` route.

- [ ] **Step 1: Replace FRANCHISEES route and add FRANCHISEE_DETAIL**

Locate and replace the current FRANCHISEES entry:

```ts
            {
                path: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME,
                component: () => import('@/components/common/ComingSoonView.vue'),
                meta: { title: 'Nhà nhượng quyền', requiresAuth: true },
            },
```

Replace with:

```ts
            {
                path: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEES.NAME,
                component: () => import('@/modules/franchisee/views/FranchiseesView.vue'),
                meta: { title: 'Nhà nhượng quyền', requiresAuth: true },
            },
            {
                path: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEE_DETAIL.PATH,
                name: APP_ROUTES.ADMIN.CHILDREN.FRANCHISEE_DETAIL.NAME,
                component: () => import('@/modules/franchisee/views/FranchiseeDetailView.vue'),
                meta: { title: 'Chi tiết nhà nhượng quyền', requiresAuth: true },
            },
```

- [ ] **Step 2: Run type-check**

```bash
npm run type-check
```

Expected: 0 new errors

- [ ] **Step 3: Run dev server and smoke test**

```bash
npm run dev
```

Navigate to `/admin/franchisees` — verify the list page loads (empty state or data).
Navigate to `/admin/franchisees/1` — verify the detail page loads (empty state if ID doesn't exist yet).

- [ ] **Step 4: Commit**

```bash
git add src/router/routes.ts
git commit -m "feat(franchisee): wire FranchiseesView and FranchiseeDetailView into router"
```
