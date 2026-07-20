import type { UserDetailViewModel } from '../models/view-models/user-detail.view-model'
import type { CreateUserFormModel, UserOverviewFormModel } from '../models/form-models/user.model'
import type { CreateUserRequest } from '../models/dtos/create-user.dto'
import type { UpdateUserRequest } from '../models/dtos/update-user.dto'

export const TRACKED_FIELDS: ReadonlyArray<keyof UserOverviewFormModel> = [
    'firstName', 'lastName', 'phoneNumber', 'avatarUrl', 'dateOfBirth', 'gender', 'isActive',
] as const

export function emptyCreateForm(): CreateUserFormModel {
    return {
        email: '',
        userName: '',
        password: '',
        firstName: '',
        lastName: '',
        phoneNumber: null,
        dateOfBirth: null,
        gender: null,
        isActive: true,
    }
}

export function toCreatePayload(form: CreateUserFormModel): CreateUserRequest {
    return {
        Email: form.email.trim(),
        UserName: form.userName.trim(),
        Password: form.password,
        FirstName: form.firstName.trim(),
        LastName: form.lastName.trim(),
        PhoneNumber: form.phoneNumber?.trim() ?? null,
        DateOfBirth: form.dateOfBirth ?? null,
        Gender: form.gender ?? null,
        IsActive: form.isActive,
    }
}

export function toOverviewForm(entity: UserDetailViewModel): UserOverviewFormModel {
    return {
        firstName: entity.firstName ?? '',
        lastName: entity.lastName ?? '',
        phoneNumber: entity.phoneNumber ?? null,
        avatarUrl: entity.avatarUrl ?? null,
        dateOfBirth: entity.dateOfBirth ?? null,
        gender: entity.gender ?? null,
        isActive: entity.isActive ?? true,
    }
}

export function toUpdatePayload(form: UserOverviewFormModel): UpdateUserRequest {
    return {
        FirstName: form.firstName.trim(),
        LastName: form.lastName.trim(),
        PhoneNumber: form.phoneNumber?.trim() ?? null,
        AvatarUrl: form.avatarUrl?.trim() ?? null,
        DateOfBirth: form.dateOfBirth ?? null,
        Gender: form.gender ?? null,
        IsActive: form.isActive,
    }
}
