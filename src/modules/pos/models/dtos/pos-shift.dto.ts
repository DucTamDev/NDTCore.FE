export interface PosStoreStatusDto {
    StoreId: number
    StoreName: string
    LogoUrl: string | null
    IsAcceptingOrders: boolean
    HasOpenShift: boolean
    ShiftId: number | null
    ShiftOpenedAt: string | null
    ShiftOpenedBy: string | null
}
