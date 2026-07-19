export interface UserDetailViewModel {
    id: string
    email: string
    userName: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber?: string | null
    avatarUrl?: string | null
    dateOfBirth?: string | null
    gender?: string | null
    isActive: boolean
    emailConfirmed: boolean
    phoneNumberConfirmed: boolean
    lockoutEnabled: boolean
    lockoutEnd?: string | null
    accessFailedCount: number
    lastLoginAt?: string | null
    roles: string[]
    tenantId: string
    createdAt?: string | null
    createdBy?: string | null
    updatedAt?: string | null
    updatedBy?: string | null
    isDeleted: boolean
    deletedAt?: string | null
    deletedBy?: string | null
}
