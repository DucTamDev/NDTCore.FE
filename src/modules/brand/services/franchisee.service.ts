import { franchiseeApi } from '@/modules/brand/api/franchisee.api'
import { franchiseeMapper } from '@/modules/brand/mappers/franchisee.mapper'
import type {
    FranchiseeFilterDto,
    CreateFranchiseeRequest,
    UpdateFranchiseeRequest,
} from '@/modules/brand/models/dtos/_index'
import type { FranchiseeDto } from '@/modules/brand/models/dtos/franchisee.dto'
import type { FranchiseeViewModel } from '@/modules/brand/models/view-models/franchisee.view-model'
import type { FranchiseeMemberViewModel } from '@/modules/brand/models/view-models/franchisee-member.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class FranchiseeService {
    async getFranchiseesByUserIdAsync(userId: string): Promise<FranchiseeDto[]> {
        const response = await franchiseeApi.getByUserIdAsync(userId)
        return response.Data ?? []
    }

    async getFranchiseesByBrandIdAsync(brandId: number): Promise<FranchiseeDto[]> {
        const response = await franchiseeApi.getByBrandIdAsync(brandId)
        return response.Data ?? []
    }

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
