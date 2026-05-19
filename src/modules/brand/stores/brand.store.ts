import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import { brandService } from '@/modules/brand/services/brand.service'
import { createLogger } from '@/core/logger/logger'

import type { BrandFilterDto, CreateBrandRequest, UpdateBrandRequest } from '@/modules/brand/models/dtos/_index'
import type { BrandViewModel } from '@/modules/brand/models/view-models/brand.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

const log = createLogger('brand-store')

type PaginationState = Omit<PagedResult<BrandViewModel>, 'items'>

const DEFAULT_PAGINATION: PaginationState = {
    pageNumber: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
}

const DEFAULT_FILTER: BrandFilterDto = {
    PageNumber: 1,
    PageSize: 10,
}

export const useBrandStore = defineStore('brand', () => {
    // ─────────────────────────────
    // STATE
    // ─────────────────────────────

    const brands = ref<BrandViewModel[]>([])
    const currentBrand = ref<BrandViewModel | null>(null)
    const pagination = ref<PaginationState>({ ...DEFAULT_PAGINATION })
    const filter = ref<BrandFilterDto>({ ...DEFAULT_FILTER })

    const listLoading = ref(false)
    const detailLoading = ref(false)
    const saving = ref(false)
    const deleting = ref(false)
    const error = ref<string | null>(null)

    // ─────────────────────────────
    // GETTERS
    // ─────────────────────────────

    const isEmpty = computed(() => brands.value.length === 0)
    const totalCount = computed(() => pagination.value.totalCount)

    // ─────────────────────────────
    // ACTIONS
    // ─────────────────────────────

    async function fetchPaged(params?: Partial<BrandFilterDto>): Promise<void> {
        if (params) {
            filter.value = { ...filter.value, ...params }
        }

        listLoading.value = true
        error.value = null

        try {
            log.info('Fetching paged brands')

            const result = await brandService.getPagedBrandsAsync(filter.value)

            brands.value = result.items
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
            log.warn('Fetch paged brands failed', { error: error.value })
            throw err
        } finally {
            listLoading.value = false
        }
    }

    async function fetchById(id: number): Promise<void> {
        detailLoading.value = true
        error.value = null

        try {
            log.info('Fetching brand by id', { id })

            currentBrand.value = await brandService.getBrandAsync(id)
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Fetch brand by id failed', { error: error.value, id })
            throw err
        } finally {
            detailLoading.value = false
        }
    }

    async function create(payload: CreateBrandRequest): Promise<BrandViewModel | null> {
        saving.value = true
        error.value = null

        try {
            log.info('Creating brand', { name: payload.Name })

            const brand = await brandService.createBrandAsync(payload)

            if (brand) {
                brands.value.unshift(brand)
                pagination.value.totalCount++
            }

            return brand
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Create brand failed', { error: error.value })
            throw err
        } finally {
            saving.value = false
        }
    }

    async function update(id: number, payload: UpdateBrandRequest): Promise<BrandViewModel | null> {
        saving.value = true
        error.value = null

        try {
            log.info('Updating brand', { id })

            const updated = await brandService.updateBrandAsync(id, payload)

            if (updated) {
                const index = brands.value.findIndex((b) => b.id === id)
                if (index !== -1) brands.value[index] = updated
                if (currentBrand.value?.id === id) currentBrand.value = updated
            }

            return updated
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Update brand failed', { error: error.value, id })
            throw err
        } finally {
            saving.value = false
        }
    }

    async function remove(id: number): Promise<void> {
        deleting.value = true
        error.value = null

        try {
            log.info('Deleting brand', { id })

            await brandService.deleteBrandAsync(id)

            brands.value = brands.value.filter((b) => b.id !== id)
            pagination.value.totalCount = Math.max(0, pagination.value.totalCount - 1)

            if (currentBrand.value?.id === id) currentBrand.value = null
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Delete brand failed', { error: error.value, id })
            throw err
        } finally {
            deleting.value = false
        }
    }

    async function removeUser(brandId: number, userId: string): Promise<void> {
        try {
            log.info('Removing user from brand', { brandId, userId })

            await brandService.removeUserFromBrandAsync(brandId, userId)
        } catch (err) {
            error.value = (err as Error).message
            log.warn('Remove user from brand failed', { error: error.value, brandId, userId })
            throw err
        }
    }

    function setFilter(params: Partial<BrandFilterDto>): void {
        filter.value = { ...filter.value, ...params }
    }

    function setCurrentBrand(brand: BrandViewModel | null): void {
        currentBrand.value = brand
    }

    function reset(): void {
        brands.value = []
        currentBrand.value = null
        pagination.value = { ...DEFAULT_PAGINATION }
        filter.value = { ...DEFAULT_FILTER }
        listLoading.value = false
        detailLoading.value = false
        saving.value = false
        deleting.value = false
        error.value = null
        log.info('Brand store reset')
    }

    return {
        // state
        brands,
        currentBrand,
        pagination,
        filter,
        listLoading,
        detailLoading,
        saving,
        deleting,
        error,
        // getters
        isEmpty,
        totalCount,
        // actions
        fetchPaged,
        fetchById,
        create,
        update,
        remove,
        removeUser,
        setFilter,
        setCurrentBrand,
        reset,
    }
})
