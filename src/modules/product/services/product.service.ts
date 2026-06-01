import { productApi } from '../api/product.api'
import { productMapper } from '../mappers/product.mapper'
import type {
    ProductFilterDto,
    CreateProductRequest,
    UpdateProductRequest,
    AddProductImageRequest,
    AddProductImageResponse,
    DeleteProductImageResponse,
} from '../models/dtos/product.dto'
import type { ProductViewModel } from '../models/view-models/product.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class ProductService {
    async getPagedAsync(filter: ProductFilterDto): Promise<PagedResult<ProductViewModel>> {
        const response = await productApi.getPagedAsync(filter)
        return {
            items: productMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getByIdAsync(id: number): Promise<ProductViewModel | null> {
        const response = await productApi.getByIdAsync(id)
        return response.Data ? productMapper.toViewModel(response.Data) : null
    }

    async createAsync(payload: CreateProductRequest): Promise<ProductViewModel | null> {
        const response = await productApi.createAsync(payload)
        return response.Data ? productMapper.createResponseToViewModel(response.Data) : null
    }

    async updateAsync(id: number, payload: UpdateProductRequest): Promise<Partial<ProductViewModel> | null> {
        const response = await productApi.updateAsync(id, payload)
        return response.Data ? productMapper.updateResponseToViewModel(response.Data) : null
    }

    async deleteAsync(id: number): Promise<void> {
        await productApi.deleteAsync(id)
    }

    async addImageAsync(id: number, payload: AddProductImageRequest): Promise<AddProductImageResponse | null> {
        const response = await productApi.addImageAsync(id, payload)
        return response.Data ?? null
    }

    async deleteImageAsync(id: number, imageId: number): Promise<DeleteProductImageResponse | null> {
        const response = await productApi.deleteImageAsync(id, imageId)
        return response.Data ?? null
    }
}

export const productService = new ProductService()
