export interface CreateUserFormModel {
    email: string
    userName: string
    password: string
    firstName: string
    lastName: string
    phoneNumber?: string | null
    dateOfBirth?: string | null
    gender?: string | null
    isActive: boolean
}

export interface UserOverviewFormModel {
    firstName: string
    lastName: string
    phoneNumber?: string | null
    avatarUrl?: string | null
    dateOfBirth?: string | null
    gender?: string | null
    isActive: boolean
}
