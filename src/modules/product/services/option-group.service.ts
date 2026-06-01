import { optionGroupApi } from '../api/option-group.api'
import { optionGroupMapper } from '../mappers/option-group.mapper'
import { optionMapper } from '../mappers/option.mapper'
import type { OptionGroupFilterDto, CreateOptionGroupRequest, UpdateOptionGroupRequest } from '../models/dtos/option-group.dto'
import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'
import type { OptionViewModel } from '../models/view-models/option.view-model'
import type { PagedResult } from '@/core/types/pagination.types'

class OptionGroupService {
    async getPagedAsync(filter: OptionGroupFilterDto): Promise<PagedResult<OptionGroupViewModel>> {
        const response = await optionGroupApi.getPagedAsync(filter)
        return {
            items: optionGroupMapper.toViewModels(response.Data ?? []),
            pageNumber: response.PageNumber,
            pageSize: response.PageSize,
            totalCount: response.TotalCount,
            totalPages: response.TotalPages,
            hasPreviousPage: response.HasPreviousPage,
            hasNextPage: response.HasNextPage,
        }
    }

    async getByIdAsync(id: number): Promise<OptionGroupViewModel | null> {
        const response = await optionGroupApi.getByIdAsync(id)
        return response.Data ? optionGroupMapper.toViewModel(response.Data) : null
    }

    async getOptionsForGroupAsync(id: number): Promise<OptionViewModel[]> {
        const response = await optionGroupApi.getOptionsForGroupAsync(id)
        return optionMapper.toViewModels(response.Data ?? [])
    }

    async createAsync(payload: CreateOptionGroupRequest): Promise<OptionGroupViewModel | null> {
        const response = await optionGroupApi.createAsync(payload)
        return response.Data ? optionGroupMapper.createResponseToViewModel(response.Data) : null
    }

    async updateAsync(id: number, payload: UpdateOptionGroupRequest): Promise<Partial<OptionGroupViewModel> | null> {
        const response = await optionGroupApi.updateAsync(id, payload)
        return response.Data ? optionGroupMapper.updateResponseToViewModel(response.Data) : null
    }

    async deleteAsync(id: number): Promise<void> {
        await optionGroupApi.deleteAsync(id)
    }
}

export const optionGroupService = new OptionGroupService()
