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
} from '@/modules/brand/models/dtos/_index'

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
