export interface StoreMemberViewModel extends Record<string, unknown> {
    storeId: number
    tenantId: string
    userId: string
    userName: string
    email: string
    fullName: string
    avatarUrl?: string | null
    isActive: boolean
    roles: string[]
    assignedAt: string
}
