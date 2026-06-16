export interface PosTagDto {
    Id: number
    Name: string
    ColorHex: string | null
    TextColor: string | null
}

export interface PosOptionDto {
    Id: number
    Name: string
    ResolvedPrice: number
    IsDefault: boolean
    IsAvailable: boolean
}

export interface PosOptionGroupDto {
    GroupId: number
    GroupName: string
    UiType: 'SingleSelect' | 'MultiSelect'
    IsRequired: boolean
    MinSelect: number
    MaxSelect: number
    DisplayOrder: number
    Options: PosOptionDto[]
}

export interface PosProductDto {
    Id: number
    CategoryId: number | null
    Sku: string
    Name: string
    ShortDescription: string | null
    ResolvedPrice: number
    IsAvailable: boolean
    DisplayOrder: number
    ImageUrl: string | null
    Tags: PosTagDto[]
    OptionGroups: PosOptionGroupDto[]
}

export interface PosCategoryDto {
    Id: number
    ParentId: number | null
    Name: string
    ProductCount: number
    Children: PosCategoryDto[]
}

export interface PosCatalogDto {
    Categories: PosCategoryDto[]
    Products: PosProductDto[]
}
