import { brandClient } from '@/core/api/clients/brand.client'
import type {
    AssignUsersToBrandRequest,
    BrandFilterDto,
    CreateBrandRequest,
    GetBrandResponse,
    UpdateBrandRequest,
} from '@/core/api/dtos/brand.dtos'
import type {
    BrandListResultModel,
    BrandMemberModel,
    BrandModel,
} from '@/models/brand.model'

function mapBrand(response: GetBrandResponse): BrandModel {
    return {
        id: response.Id,
        tenantId: response.TenantId,
        name: response.Name,
        code: response.Code,
        legalName: response.LegalName,
        taxCode: response.TaxCode,
        currency: response.Currency,
        timeZone: response.TimeZone,
        isActive: response.IsActive,
        createdAt: response.CreatedAt,
        createdBy: response.CreatedBy,
        updatedAt: response.UpdatedAt,
        updatedBy: response.UpdatedBy,
    }
}

function mapBrandMember(brandId: number, tenantId: string, userId: string): BrandMemberModel {
    return {
        brandId,
        tenantId,
        userId,
    }
}

class BrandService {
    async getPagedBrandsAsync(filter: BrandFilterDto): Promise<BrandListResultModel> {
        const response = await brandClient.getPagedAsync(filter)

        return {
            items: (response.Data ?? []).map(mapBrand),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async createBrandAsync(payload: CreateBrandRequest): Promise<BrandModel | null> {
        const response = await brandClient.createAsync(payload)
        return response.Data ? mapBrand(response.Data) : null
    }

    async getBrandAsync(id: number): Promise<BrandModel | null> {
        const response = await brandClient.getByIdAsync(id)
        return response.Data ? mapBrand(response.Data) : null
    }

    async getBrandsByUserIdAsync(userId: string): Promise<BrandModel[]> {
        const response = await brandClient.getByUserIdAsync(userId)
        return (response.Data ?? []).map(mapBrand)
    }

    async getBrandMembersAsync(id: number): Promise<BrandMemberModel[]> {
        const response = await brandClient.getMembersAsync(id)
        return (response.Data ?? []).map((item) =>
            mapBrandMember(item.BrandId, item.TenantId, item.UserId),
        )
    }

    async updateBrandAsync(id: number, payload: UpdateBrandRequest): Promise<BrandModel | null> {
        const response = await brandClient.updateAsync(id, payload)
        return response.Data ? mapBrand(response.Data) : null
    }

    async updateBrandStatusAsync(id: number, isActive: boolean): Promise<BrandModel | null> {
        const response = await brandClient.updateStatusAsync(id, { IsActive: isActive })
        return response.Data ? mapBrand(response.Data) : null
    }

    async assignUsersToBrandAsync(id: number, payload: AssignUsersToBrandRequest): Promise<void> {
        await brandClient.assignUsersAsync(id, payload)
    }

    async removeUserFromBrandAsync(id: number, userId: string): Promise<void> {
        await brandClient.removeUserAsync(id, userId)
    }

    async deleteBrandAsync(id: number): Promise<void> {
        await brandClient.deleteAsync(id)
    }
}

export const brandService = new BrandService()
