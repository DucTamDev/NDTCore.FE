import { productClient } from '@/core/api/clients/product.client'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import type { ApiResponse, PagedApiResponse } from '@/core/models/common.dto'
import type {
    ProductDto,
    ProductFilterDto,
    CreateProductRequest,
    CreateProductResponse,
    UpdateProductRequest,
    UpdateProductResponse,
    DeleteProductResponse,
    AddProductImageRequest,
    AddProductImageResponse,
    DeleteProductImageResponse,
} from '../models/dtos/product.dto'

export const productApi = {
    getPagedAsync(params: ProductFilterDto): Promise<PagedApiResponse<ProductDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.PRODUCT_API.GET_PAGED, params)
    },

    getByIdAsync(id: number): Promise<ApiResponse<ProductDto>> {
        return productClient.get(API_ENDPOINTS.PRODUCT.PRODUCT_API.GET_BY_ID(id))
    },

    createAsync(payload: CreateProductRequest): Promise<ApiResponse<CreateProductResponse>> {
        return productClient.post(API_ENDPOINTS.PRODUCT.PRODUCT_API.CREATE, payload)
    },

    updateAsync(id: number, payload: UpdateProductRequest): Promise<ApiResponse<UpdateProductResponse>> {
        return productClient.put(API_ENDPOINTS.PRODUCT.PRODUCT_API.UPDATE(id), payload)
    },

    deleteAsync(id: number): Promise<ApiResponse<DeleteProductResponse>> {
        return productClient.delete(API_ENDPOINTS.PRODUCT.PRODUCT_API.DELETE(id))
    },

    addImageAsync(id: number, payload: AddProductImageRequest): Promise<ApiResponse<AddProductImageResponse>> {
        return productClient.post(API_ENDPOINTS.PRODUCT.PRODUCT_API.ADD_IMAGE(id), payload)
    },

    deleteImageAsync(id: number, imageId: number): Promise<ApiResponse<DeleteProductImageResponse>> {
        return productClient.delete(API_ENDPOINTS.PRODUCT.PRODUCT_API.DELETE_IMAGE(id, imageId))
    },
}
