import { optionApi } from '../api/option.api'
import { optionMapper } from '../mappers/option.mapper'
import type { OptionFilterDto, CreateOptionRequest, UpdateOptionRequest } from '../models/dtos/option.dto'
import type { OptionViewModel } from '../models/view-models/option.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class OptionService {
    async getPagedAsync(filter: OptionFilterDto): Promise<PagedResult<OptionViewModel>> {
        const response = await optionApi.getPagedAsync(filter)
        return {
            items: optionMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getByIdAsync(id: number): Promise<OptionViewModel | null> {
        const response = await optionApi.getByIdAsync(id)
        return response.Data ? optionMapper.toViewModel(response.Data) : null
    }

    async createAsync(payload: CreateOptionRequest): Promise<OptionViewModel | null> {
        const response = await optionApi.createAsync(payload)
        return response.Data ? optionMapper.createResponseToViewModel(response.Data) : null
    }

    async updateAsync(id: number, payload: UpdateOptionRequest): Promise<Partial<OptionViewModel> | null> {
        const response = await optionApi.updateAsync(id, payload)
        return response.Data ? optionMapper.updateResponseToViewModel(response.Data) : null
    }

    async deleteAsync(id: number): Promise<void> {
        await optionApi.deleteAsync(id)
    }
}

export const optionService = new OptionService()
