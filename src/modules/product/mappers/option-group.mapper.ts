import type { OptionGroupDto, CreateOptionGroupResponse, UpdateOptionGroupResponse } from '../models/dtos/option-group.dto'
import type { OptionGroupViewModel } from '../models/view-models/option-group.view-model'

const toViewModel = (dto: OptionGroupDto): OptionGroupViewModel => ({
    id: dto.Id,
    tenantId: dto.TenantId,
    name: dto.Name,
    uiType: dto.UiType,
    description: dto.Description,
    displayOrder: dto.DisplayOrder,
    isActive: dto.IsActive,
    createdAt: dto.CreatedAt,
    updatedAt: dto.UpdatedAt,
    createdBy: dto.CreatedBy,
    updatedBy: dto.UpdatedBy,
})

const toViewModels = (dtos: OptionGroupDto[]): OptionGroupViewModel[] => (dtos ?? []).map(toViewModel)

const createResponseToViewModel = (dto: CreateOptionGroupResponse): OptionGroupViewModel => ({
    id: dto.Id,
    tenantId: '',
    name: dto.Name,
    uiType: dto.UiType,
    description: null,
    displayOrder: 0,
    isActive: dto.IsActive,
    createdAt: dto.CreatedAt,
    updatedAt: null,
    createdBy: null,
    updatedBy: null,
})

const updateResponseToViewModel = (dto: UpdateOptionGroupResponse): Partial<OptionGroupViewModel> => ({
    id: dto.Id,
    name: dto.Name,
    uiType: dto.UiType,
    isActive: dto.IsActive,
    updatedAt: dto.UpdatedAt,
})

export const optionGroupMapper = { toViewModel, toViewModels, createResponseToViewModel, updateResponseToViewModel }
