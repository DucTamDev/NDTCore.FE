import { toDateKey } from '@/core/utils/date-range.util'

// new Date(year, month + 1, 0) rolls back to the last day of `month` — avoids an off-by-one.
export function currentMonthDateKeys(): [string, string] {
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return [toDateKey(firstDay), toDateKey(lastDay)]
}

export function todayKey(): string {
    return toDateKey(new Date())
}

export function yesterdayKey(): string {
    const now = new Date()
    return toDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
}

// Inclusive of today — e.g. "7 ngày gần nhất" spans today and the 6 days before it.
export function last7DaysKeys(): [string, string] {
    const now = new Date()
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
    return [toDateKey(from), toDateKey(now)]
}

export function last30DaysKeys(): [string, string] {
    const now = new Date()
    const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
    return [toDateKey(from), toDateKey(now)]
}
