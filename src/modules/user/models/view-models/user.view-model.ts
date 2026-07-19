export interface UserViewModel extends Record<string, unknown> {
    id: string
    email: string
    userName: string
    firstName: string
    lastName: string
    fullName: string
    phoneNumber?: string | null
    avatarUrl?: string | null
    emailConfirmed: boolean
    phoneNumberConfirmed: boolean
    isActive: boolean
    lastLoginAt?: string | null
    createdAt?: string | null
    updatedAt?: string | null
    roles: string[]
}
