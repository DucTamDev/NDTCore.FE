export function formatStoreDate(value: string | null | undefined): string {
    if (!value) return '---'
    return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(
        new Date(value),
    )
}

const TIME_PASSTHROUGH_KEYS = [
    'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
    'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End',
]

/** Block non-digit keystrokes and out-of-range values (hours > 23, minutes > 59). */
export function onTimeKeydown(event: KeyboardEvent): void {
    if (TIME_PASSTHROUGH_KEYS.includes(event.key)) return
    if (event.ctrlKey || event.metaKey) return
    if (!/^\d$/.test(event.key)) {
        event.preventDefault()
        return
    }

    const input = event.target as HTMLInputElement
    const s = input.selectionStart ?? 0
    const e = input.selectionEnd ?? s

    // Simulate what the raw string would look like after this keypress
    const next = input.value.slice(0, s) + event.key + input.value.slice(e)
    const digits = next.replace(/\D/g, '').slice(0, 4)

    const d0 = digits[0]
    const d2 = digits[2]
    if (digits.length >= 1 && d0 !== undefined && parseInt(d0) > 2) { event.preventDefault(); return }
    if (digits.length >= 2 && parseInt(digits.slice(0, 2)) > 23) { event.preventDefault(); return }
    if (digits.length >= 3 && d2 !== undefined && parseInt(d2) > 5) { event.preventDefault(); return }
    if (digits.length >= 4 && parseInt(digits.slice(2, 4)) > 59) { event.preventDefault(); return }
}

/** Auto-insert colon after HH. Call with the raw value from @update:model-value. */
export function formatTimeInput(value: string | null | undefined): string | null {
    if (!value) return null
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (!digits) return null
    return digits.length <= 2 ? digits : `${digits.slice(0, 2)}:${digits.slice(2)}`
}
