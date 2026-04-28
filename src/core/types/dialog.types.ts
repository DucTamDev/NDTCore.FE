export interface ConfirmDialogOptions {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    confirmColor?: string
}

export interface ConfirmDialogState
    extends Required<Omit<ConfirmDialogOptions, 'message' | 'title'>> {
    show: boolean
    title: string
    message: string
    resolve: ((confirmed: boolean) => void) | null
}
