import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { todayKey, yesterdayKey, last7DaysKeys, last30DaysKeys } from './date-range.util'

describe('date-range.util presets', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.setSystemTime(new Date(2026, 5, 30)) // June 30, 2026 (month is 0-indexed)
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('todayKey returns the current local date', () => {
        expect(todayKey()).toBe('2026-06-30')
    })

    it('yesterdayKey rolls back across a month boundary correctly', () => {
        vi.setSystemTime(new Date(2026, 6, 1)) // July 1, 2026
        expect(yesterdayKey()).toBe('2026-06-30')
    })

    it('last7DaysKeys returns a 7-day inclusive range ending today', () => {
        expect(last7DaysKeys()).toEqual(['2026-06-24', '2026-06-30'])
    })

    it('last30DaysKeys returns a 30-day inclusive range ending today', () => {
        expect(last30DaysKeys()).toEqual(['2026-06-01', '2026-06-30'])
    })
})
