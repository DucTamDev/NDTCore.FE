import { productRelationsApi } from '../api/product-relations.api'
import type {
    ProductTagDto,
    AssignTagRequest,
    ProductOptionGroupDto,
    AssignOptionGroupRequest,
    UpdateProductOptionGroupRequest,
    ProductOptionConfigDto,
    UpsertOptionConfigRequest,
} from '../models/dtos/product-relations.dto'

class ProductRelationsService {
    async getTagsAsync(productId: number): Promise<ProductTagDto[]> {
        const r = await productRelationsApi.getTagsAsync(productId)
        return r.Data ?? []
    }

    async assignTagAsync(productId: number, payload: AssignTagRequest): Promise<ProductTagDto | null> {
        const r = await productRelationsApi.assignTagAsync(productId, payload)
        return r.Data ?? null
    }

    async removeTagAsync(productId: number, tagId: number): Promise<boolean> {
        await productRelationsApi.removeTagAsync(productId, tagId)
        return true
    }

    async getOptionGroupsAsync(productId: number): Promise<ProductOptionGroupDto[]> {
        const r = await productRelationsApi.getOptionGroupsAsync(productId)
        return r.Data ?? []
    }

    async assignOptionGroupAsync(productId: number, payload: AssignOptionGroupRequest): Promise<ProductOptionGroupDto | null> {
        const r = await productRelationsApi.assignOptionGroupAsync(productId, payload)
        return r.Data ?? null
    }

    async updateOptionGroupAsync(
        productId: number,
        groupId: number,
        payload: UpdateProductOptionGroupRequest,
    ): Promise<ProductOptionGroupDto | null> {
        const r = await productRelationsApi.updateOptionGroupAsync(productId, groupId, payload)
        return r.Data ?? null
    }

    async removeOptionGroupAsync(productId: number, groupId: number): Promise<boolean> {
        await productRelationsApi.removeOptionGroupAsync(productId, groupId)
        return true
    }

    async getOptionConfigsAsync(productId: number): Promise<ProductOptionConfigDto[]> {
        const r = await productRelationsApi.getOptionConfigsAsync(productId)
        return r.Data ?? []
    }

    async upsertOptionConfigAsync(productId: number, payload: UpsertOptionConfigRequest): Promise<ProductOptionConfigDto | null> {
        const r = await productRelationsApi.upsertOptionConfigAsync(productId, payload)
        return r.Data ?? null
    }

    async removeOptionConfigAsync(productId: number, optionId: number): Promise<boolean> {
        await productRelationsApi.removeOptionConfigAsync(productId, optionId)
        return true
    }
}

export const productRelationsService = new ProductRelationsService()
