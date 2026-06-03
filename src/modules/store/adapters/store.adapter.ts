import type { StoreViewModel } from '../models/view-models/store.view-model'
import type { StoreFormModel } from '../models/form-models/store.model'
import type { CreateStoreRequest } from '../models/dtos/create-store.dto'
import type { UpdateStoreRequest } from '../models/dtos/update-store.dto'

// input type="time" yields "HH:mm"; .NET TimeOnly requires "HH:mm:ss"
function toTimeOnly(value: string | null | undefined): string | null {
    if (!value) return null
    return value.length === 5 ? `${value}:00` : value
}

export const TRACKED_FIELDS: ReadonlyArray<keyof StoreFormModel> = [
    'brandId', 'franchiseeId', 'name', 'slug',
    'isActive', 'isAcceptingOrders',
    'phone', 'email',
    'address', 'province', 'district', 'ward',
    'openTime', 'closeTime', 'timeZone',
] as const

export function toForm(entity: StoreViewModel): StoreFormModel {
    return {
        brandId: entity.brandId ?? null,
        franchiseeId: entity.franchiseeId ?? null,
        name: entity.name ?? '',
        code: entity.code ?? '',
        slug: entity.slug ?? null,
        logoUrl: entity.logoUrl ?? null,
        isActive: entity.isActive ?? true,
        isAcceptingOrders: entity.isAcceptingOrders ?? true,
        phone: entity.phone ?? null,
        email: entity.email ?? null,
        address: entity.address ?? null,
        city: entity.city ?? null,
        ward: entity.ward ?? null,
        district: entity.district ?? null,
        province: entity.province ?? null,
        country: entity.country ?? null,
        latitude: entity.latitude ?? null,
        longitude: entity.longitude ?? null,
        openTime: entity.openTime ?? null,
        closeTime: entity.closeTime ?? null,
        timeZone: entity.timeZone ?? null,
    }
}

export function toPayload(form: StoreFormModel): UpdateStoreRequest {
    return {
        BrandId: form.brandId!,
        FranchiseeId: form.franchiseeId ?? null,
        Name: form.name.trim(),
        Slug: form.slug?.trim() ?? null,
        LogoUrl: form.logoUrl?.trim() ?? null,
        IsActive: form.isActive,
        IsAcceptingOrders: form.isAcceptingOrders,
        Phone: form.phone?.trim() ?? null,
        Email: form.email?.trim() ?? null,
        Address: form.address?.trim() ?? null,
        City: form.city?.trim() ?? null,
        Ward: form.ward?.trim() ?? null,
        District: form.district?.trim() ?? null,
        Province: form.province?.trim() ?? null,
        Country: form.country?.trim() ?? null,
        Latitude: form.latitude ?? null,
        Longitude: form.longitude ?? null,
        OpenTime: toTimeOnly(form.openTime),
        CloseTime: toTimeOnly(form.closeTime),
        TimeZone: form.timeZone?.trim() ?? null,
    }
}

export function toCreatePayload(form: StoreFormModel): CreateStoreRequest {
    return {
        BrandId: form.brandId!,
        FranchiseeId: form.franchiseeId ?? null,
        Name: form.name.trim(),
        Code: form.code.trim(),
        Slug: form.slug?.trim() ?? null,
        LogoUrl: form.logoUrl?.trim() ?? null,
        IsActive: form.isActive,
        IsAcceptingOrders: form.isAcceptingOrders,
        Phone: form.phone?.trim() ?? null,
        Email: form.email?.trim() ?? null,
        Address: form.address?.trim() ?? null,
        City: form.city?.trim() ?? null,
        Ward: form.ward?.trim() ?? null,
        District: form.district?.trim() ?? null,
        Province: form.province?.trim() ?? null,
        Country: form.country?.trim() ?? null,
        Latitude: form.latitude ?? null,
        Longitude: form.longitude ?? null,
        OpenTime: toTimeOnly(form.openTime),
        CloseTime: toTimeOnly(form.closeTime),
        TimeZone: form.timeZone?.trim() ?? null,
    }
}

export function emptyForm(): StoreFormModel {
    return {
        brandId: null,
        franchiseeId: null,
        name: '',
        code: '',
        slug: null,
        logoUrl: null,
        isActive: true,
        isAcceptingOrders: true,
        phone: null,
        email: null,
        address: null,
        city: null,
        ward: null,
        district: null,
        province: null,
        country: null,
        latitude: null,
        longitude: null,
        openTime: null,
        closeTime: null,
        timeZone: null,
    }
}
