import { brandApi } from '@/modules/brand/api/brand.api'
import { brandMapper } from '@/modules/brand/mappers/brand.mapper'
import type {
    BrandFilterDto,
    CreateBrandRequest,
    UpdateBrandRequest,
} from '@/modules/brand/models/dtos/_index'
import type { BrandViewModel } from '@/modules/brand/models/view-models/brand.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class BrandService {
    async getPagedBrandsAsync(filter: BrandFilterDto): Promise<PagedResult<BrandViewModel>> {
        const response = await brandApi.getPagedAsync(filter)
        return {
            items: brandMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getBrandAsync(id: number): Promise<BrandViewModel | null> {
        const response = await brandApi.getByIdAsync(id)
        return response.Data ? brandMapper.toViewModel(response.Data) : null
    }

    async getBrandsByUserIdAsync(userId: string): Promise<BrandViewModel[]> {
        const response = await brandApi.getByUserIdAsync(userId)
        return brandMapper.toViewModels(response.Data ?? [])
    }

    async createBrandAsync(payload: CreateBrandRequest): Promise<BrandViewModel | null> {
        const response = await brandApi.createAsync(payload)
        return response.Data ? brandMapper.createResponseToViewModel(response.Data) : null
    }

    async updateBrandAsync(
        id: number,
        payload: UpdateBrandRequest,
    ): Promise<BrandViewModel | null> {
        const response = await brandApi.updateAsync(id, payload)
        return response.Data ? brandMapper.updateResponseToViewModel(response.Data) : null
    }

    async deleteBrandAsync(id: number): Promise<void> {
        await brandApi.deleteAsync(id)
    }

    async removeUserFromBrandAsync(id: number, userId: string): Promise<void> {
        await brandApi.removeUserAsync(id, userId)
    }
}

export const brandService = new BrandService()
