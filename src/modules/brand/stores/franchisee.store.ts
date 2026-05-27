import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { franchiseeService } from '@/modules/brand/services/franchisee.service'
import { createLogger } from '@/core/logger/logger'
import type { FranchiseeFilterDto } from '@/modules/brand/models/dtos/_index'
import type { CreateFranchiseeRequest } from '@/modules/brand/models/dtos/_index'
import type { UpdateFranchiseeRequest } from '@/modules/brand/models/dtos/_index'
import type { FranchiseeViewModel } from '@/modules/brand/models/view-models/franchisee.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

const log = createLogger('franchisee-store')

type PaginationState = Omit<PagedResult<FranchiseeViewModel>, 'items'>

const DEFAULT_PAGINATION_STATE: PaginationState = {
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
    const pagination = ref<PaginationState>({ ...DEFAULT_PAGINATION_STATE })
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

    function setCurrentFranchisee(item: FranchiseeViewModel | null): void {
        currentFranchisee.value = item
    }

    function reset(): void {
        franchisees.value = []
        currentFranchisee.value = null
        pagination.value = { ...DEFAULT_PAGINATION_STATE }
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
        setCurrentFranchisee, reset,
    }
})
