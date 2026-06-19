export interface PosStoreStatusDto {
    StoreId: number
    StoreName: string
    LogoUrl: string | null
    Address: string | null
    City: string | null
    District: string | null
    Province: string | null
    Phone: string | null
    IsAcceptingOrders: boolean
    HasOpenShift: boolean
    ShiftId: number | null
    ShiftOpenedAt: string | null
    ShiftOpenedBy: string | null
}
