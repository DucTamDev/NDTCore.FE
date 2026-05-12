import { ApiClient } from '@/core/api/clients/api.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/api/dtos/common.dtos'
import type {
  BrandDto,
  BrandFilterDto,
  CreateBrandRequest,
  CreateBrandResponse,
  DeleteBrandResponse,
  UpdateBrandRequest,
  UpdateBrandResponse,
} from '@/modules/brand/models/dtos/_index'

class BrandClient extends ApiClient {
  constructor() {
    super({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      timeout: 20_000,
    })
  }

  getPagedAsync(params: BrandFilterDto): Promise<PagedApiResponse<BrandDto>> {
    return this.get<PagedApiResponse<BrandDto>>(API_ENDPOINTS.BRAND.BRAND_API.GET_PAGED, params)
  }

  getByIdAsync(id: number): Promise<ApiResponse<BrandDto>> {
    return this.get<ApiResponse<BrandDto>>(API_ENDPOINTS.BRAND.BRAND_API.GET_BY_ID(id))
  }

  getByUserIdAsync(userId: string): Promise<ApiResponse<BrandDto[]>> {
    return this.get<ApiResponse<BrandDto[]>>(API_ENDPOINTS.BRAND.BRAND_API.GET_BY_USER_ID(userId))
  }

  createAsync(payload: CreateBrandRequest): Promise<ApiResponse<CreateBrandResponse>> {
    return this.post<ApiResponse<CreateBrandResponse>>(
      API_ENDPOINTS.BRAND.BRAND_API.CREATE,
      payload,
    )
  }

  updateAsync(id: number, payload: UpdateBrandRequest): Promise<ApiResponse<UpdateBrandResponse>> {
    return this.put<ApiResponse<UpdateBrandResponse>>(
      API_ENDPOINTS.BRAND.BRAND_API.UPDATE(id),
      payload,
    )
  }

  deleteAsync(id: number): Promise<ApiResponse<DeleteBrandResponse>> {
    return this.delete<ApiResponse<DeleteBrandResponse>>(API_ENDPOINTS.BRAND.BRAND_API.DELETE(id))
  }

  removeUserAsync(id: number, userId: string): Promise<ApiResponse<void>> {
    return this.delete<ApiResponse<void>>(API_ENDPOINTS.BRAND.BRAND_API.REMOVE_USER(id, userId))
  }
}

export const brandClient = new BrandClient()
