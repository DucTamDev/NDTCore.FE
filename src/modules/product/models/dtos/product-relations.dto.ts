export interface ProductTagDto {
    ProductId: number
    TagId: number
    TagName: string
}

export interface AssignTagRequest {
    TagId: number
}

export interface ProductOptionGroupDto {
    ProductId: number
    GroupId: number
    GroupName: string
    IsRequired: boolean
    MinSelect: number
    MaxSelect: number
    DisplayOrder: number
}

export interface AssignOptionGroupRequest {
    GroupId: number
    IsRequired: boolean
    MinSelect: number
    MaxSelect: number
    DisplayOrder: number
}

export interface UpdateProductOptionGroupRequest {
    IsRequired: boolean
    MinSelect: number
    MaxSelect: number
    DisplayOrder: number
}

export interface ProductOptionConfigDto {
    ProductId: number
    OptionId: number
    OptionName: string
    CustomPrice: number | null
    IsDefault: boolean
    IsHidden: boolean
}

export interface UpsertOptionConfigRequest {
    OptionId: number
    CustomPrice: number | null
    IsDefault: boolean
    IsHidden: boolean
}
