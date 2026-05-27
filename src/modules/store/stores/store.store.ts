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
