import type { TagDto, CreateTagResponse, UpdateTagResponse } from '../models/dtos/tag.dto'
import type { TagViewModel } from '../models/view-models/tag.view-model'

const toViewModel = (dto: TagDto): TagViewModel => ({
    id: dto.Id,
    tenantId: dto.TenantId,
    name: dto.Name,
    textColor: dto.TextColor,
    colorHex: dto.ColorHex,
    iconUrl: dto.IconUrl,
    displayOrder: dto.DisplayOrder,
    isActive: dto.IsActive,
    createdAt: dto.CreatedAt,
    updatedAt: dto.UpdatedAt,
    createdBy: dto.CreatedBy,
    updatedBy: dto.UpdatedBy,
})

const toViewModels = (dtos: TagDto[]): TagViewModel[] => (dtos ?? []).map(toViewModel)

const createResponseToViewModel = (dto: CreateTagResponse): TagViewModel => ({
    id: dto.Id,
    tenantId: '',
    name: dto.Name,
    textColor: null,
    colorHex: dto.ColorHex,
    iconUrl: null,
    displayOrder: 0,
    isActive: dto.IsActive,
    createdAt: dto.CreatedAt,
    updatedAt: null,
    createdBy: null,
    updatedBy: null,
})

const updateResponseToViewModel = (dto: UpdateTagResponse): Partial<TagViewModel> => ({
    id: dto.Id,
    name: dto.Name,
    colorHex: dto.ColorHex,
    isActive: dto.IsActive,
    updatedAt: dto.UpdatedAt,
})

export const tagMapper = { toViewModel, toViewModels, createResponseToViewModel, updateResponseToViewModel }
