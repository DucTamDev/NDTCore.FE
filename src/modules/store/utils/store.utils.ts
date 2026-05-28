export function formatStoreDate(value: string | null | undefined): string {
    if (!value) return '---'
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(
        new Date(value),
    )
}
