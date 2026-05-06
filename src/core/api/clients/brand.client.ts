import { ApiClient } from './api.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type {
    AssignUsersToBrandRequest,
    AssignUsersToBrandResponse,
    BrandFilterDto,
    BrandMemberResponse,
    BrandPagedResponse,
    CreateBrandRequest,
    CreateBrandResponse,
    DeleteBrandResponse,
    GetBrandResponse,
    RemoveUserFromBrandResponse,
    UpdateBrandRequest,
    UpdateBrandResponse,
    UpdateBrandStatusRequest,
    UpdateBrandStatusResponse,
} from '@/core/api/dtos/brand.dtos'
import type { ApiResponse } from '@/core/api/dtos/common.dtos'
import type { QueryParams } from '@/core/api/types/api.types'

class BrandClient extends ApiClient {
    constructor() {
        super({
            baseURL: import.meta.env.VITE_API_BASE_URL,
            timeout: 20_000,
        })
    }

    getPagedAsync(params: BrandFilterDto): Promise<BrandPagedResponse> {
        const queryParams: QueryParams = {
            PageNumber: params.PageNumber,
            PageSize: params.PageSize,
            Keyword: params.Keyword,
            IsActive: params.IsActive,
            CreatedAfter: params.CreatedAfter,
            CreatedBefore: params.CreatedBefore,
        }

        return this.get<BrandPagedResponse>(API_ENDPOINTS.BRAND.BRAND_API.GET_PAGED, queryParams)
    }

    createAsync(payload: CreateBrandRequest): Promise<ApiResponse<CreateBrandResponse>> {
        return this.post<ApiResponse<CreateBrandResponse>>(
            API_ENDPOINTS.BRAND.BRAND_API.CREATE,
            payload,
        )
    }

    getByIdAsync(id: number): Promise<ApiResponse<GetBrandResponse>> {
        return this.get<ApiResponse<GetBrandResponse>>(
            API_ENDPOINTS.BRAND.BRAND_API.GET_BY_ID(id),
        )
    }

    getByUserIdAsync(userId: string): Promise<ApiResponse<GetBrandResponse[]>> {
        return this.get<ApiResponse<GetBrandResponse[]>>(
            API_ENDPOINTS.BRAND.BRAND_API.GET_BY_USER_ID(userId),
        )
    }

    getMembersAsync(id: number): Promise<ApiResponse<BrandMemberResponse[]>> {
        return this.get<ApiResponse<BrandMemberResponse[]>>(
            API_ENDPOINTS.BRAND.BRAND_API.GET_MEMBERS(id),
        )
    }

    updateAsync(id: number, payload: UpdateBrandRequest): Promise<ApiResponse<UpdateBrandResponse>> {
        return this.put<ApiResponse<UpdateBrandResponse>>(
            API_ENDPOINTS.BRAND.BRAND_API.UPDATE(id),
            payload,
        )
    }

    updateStatusAsync(
        id: number,
        payload: UpdateBrandStatusRequest,
    ): Promise<ApiResponse<UpdateBrandStatusResponse>> {
        return this.patch<ApiResponse<UpdateBrandStatusResponse>>(
            API_ENDPOINTS.BRAND.BRAND_API.UPDATE_STATUS(id),
            payload,
        )
    }

    assignUsersAsync(
        id: number,
        payload: AssignUsersToBrandRequest,
    ): Promise<ApiResponse<AssignUsersToBrandResponse>> {
        return this.post<ApiResponse<AssignUsersToBrandResponse>>(
            API_ENDPOINTS.BRAND.BRAND_API.ASSIGN_USERS(id),
            payload,
        )
    }

    removeUserAsync(id: number, userId: string): Promise<ApiResponse<RemoveUserFromBrandResponse>> {
        return this.delete<ApiResponse<RemoveUserFromBrandResponse>>(
            API_ENDPOINTS.BRAND.BRAND_API.REMOVE_USER(id, userId),
        )
    }

    deleteAsync(id: number): Promise<ApiResponse<DeleteBrandResponse>> {
        return this.delete<ApiResponse<DeleteBrandResponse>>(
            API_ENDPOINTS.BRAND.BRAND_API.DELETE(id),
        )
    }
}

export const brandClient = new BrandClient()
