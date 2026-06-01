import type { OptionDto, CreateOptionResponse, UpdateOptionResponse } from '../models/dtos/option.dto'
import type { OptionViewModel } from '../models/view-models/option.view-model'

const toViewModel = (dto: OptionDto): OptionViewModel => ({
    id: dto.Id,
    tenantId: dto.TenantId,
    groupId: dto.GroupId,
    name: dto.Name,
    defaultPrice: dto.DefaultPrice,
    description: dto.Description,
    imageUrl: dto.ImageUrl,
    displayOrder: dto.DisplayOrder,
    isActive: dto.IsActive,
    createdAt: dto.CreatedAt,
    updatedAt: dto.UpdatedAt,
    createdBy: dto.CreatedBy,
    updatedBy: dto.UpdatedBy,
})

const toViewModels = (dtos: OptionDto[]): OptionViewModel[] => (dtos ?? []).map(toViewModel)

const createResponseToViewModel = (dto: CreateOptionResponse): OptionViewModel => ({
    id: dto.Id,
    tenantId: '',
    groupId: dto.GroupId,
    name: dto.Name,
    defaultPrice: dto.DefaultPrice,
    description: null,
    imageUrl: null,
    displayOrder: 0,
    isActive: dto.IsActive,
    createdAt: dto.CreatedAt,
    updatedAt: null,
    createdBy: null,
    updatedBy: null,
})

const updateResponseToViewModel = (dto: UpdateOptionResponse): Partial<OptionViewModel> => ({
    id: dto.Id,
    name: dto.Name,
    defaultPrice: dto.DefaultPrice,
    isActive: dto.IsActive,
    updatedAt: dto.UpdatedAt,
})

export const optionMapper = { toViewModel, toViewModels, createResponseToViewModel, updateResponseToViewModel }
