import { tagApi } from '../api/tag.api'
import { tagMapper } from '../mappers/tag.mapper'
import type { TagFilterDto, CreateTagRequest, UpdateTagRequest } from '../models/dtos/tag.dto'
import type { TagViewModel } from '../models/view-models/tag.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class TagService {
    async getPagedAsync(filter: TagFilterDto): Promise<PagedResult<TagViewModel>> {
        const response = await tagApi.getPagedAsync(filter)
        return {
            items: tagMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getByIdAsync(id: number): Promise<TagViewModel | null> {
        const response = await tagApi.getByIdAsync(id)
        return response.Data ? tagMapper.toViewModel(response.Data) : null
    }

    async createAsync(payload: CreateTagRequest): Promise<TagViewModel | null> {
        const response = await tagApi.createAsync(payload)
        return response.Data ? tagMapper.createResponseToViewModel(response.Data) : null
    }

    async updateAsync(id: number, payload: UpdateTagRequest): Promise<Partial<TagViewModel> | null> {
        const response = await tagApi.updateAsync(id, payload)
        return response.Data ? tagMapper.updateResponseToViewModel(response.Data) : null
    }

    async deleteAsync(id: number): Promise<void> {
        await tagApi.deleteAsync(id)
    }
}

export const tagService = new TagService()
