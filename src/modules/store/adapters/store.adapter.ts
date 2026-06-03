import type { StoreViewModel } from '../models/view-models/store.view-model'
import type { StoreFormModel } from '../models/form-models/store.model'
import type { UpdateStoreRequest } from '../models/dtos/update-store.dto'

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
        Slug: form.slug || null,
        LogoUrl: form.logoUrl || null,
        IsActive: form.isActive,
        IsAcceptingOrders: form.isAcceptingOrders,
        Phone: form.phone || null,
        Email: form.email || null,
        Address: form.address || null,
        City: form.city || null,
        Ward: form.ward || null,
        District: form.district || null,
        Province: form.province || null,
        Country: form.country || null,
        Latitude: form.latitude ?? null,
        Longitude: form.longitude ?? null,
        OpenTime: form.openTime || null,
        CloseTime: form.closeTime || null,
        TimeZone: form.timeZone || null,
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
