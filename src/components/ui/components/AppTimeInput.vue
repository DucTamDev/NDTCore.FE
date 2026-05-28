<template>
  <v-text-field
    ref="fieldRef"
    v-model="displayValue"
    :label="label"
    :placeholder="computedPlaceholder"
    :hint="computedHint"
    :persistent-hint="persistentHint || !!computedHint"
    :disabled="disabled"
    :readonly="readonly"
    :error-messages="errorMessages"
    :variant="variant"
    :density="density"
    :color="color"
    :bg-color="bgColor"
    :prepend-inner-icon="prependIcon"
    :clearable="clearable"
    :rules="computedRules"
    :maxlength="inputMaxLength"
    inputmode="numeric"
    v-bind="$attrs"
    @input="onInput"
    @blur="onBlur"
    @keydown="onKeydown"
    @click="resetBuffer"
    @click:clear="onClear"
  >
    <!-- AM/PM toggle — chỉ hiển thị ở chế độ 12h -->
    <template v-if="format === '12'" #append-inner>
      <div class="app-time-input__ampm" @mousedown.prevent>
        <button
          v-for="period in AMPM_OPTIONS"
          :key="period"
          class="app-time-input__ampm-btn"
          :class="{ 'app-time-input__ampm-btn--active': ampm === period }"
          type="button"
          tabindex="-1"
          @click="setAmpm(period)"
        >
          {{ period }}
        </button>
      </div>
    </template>

    <!-- Pass-through các slot khác -->
    <template v-for="(_, name) in passSlots" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps ?? {}" />
    </template>
  </v-text-field>
</template>

<script setup lang="ts">
import { ref, computed, watch, useSlots, nextTick } from 'vue'
import type { ValidationRule } from 'vuetify'

// ── Types ─────────────────────────────────────────────────────────────────────

/** Định dạng hiển thị giờ */
type TimeFormat = '12' | '24'

/** Giá trị AM hoặc PM */
type AmPm = 'AM' | 'PM'

/** Kiểu variant của Vuetify VTextField */
type TextFieldVariant =
  | 'outlined'
  | 'filled'
  | 'underlined'
  | 'solo'
  | 'solo-filled'
  | 'solo-inverted'
  | 'plain'

/** Mật độ của Vuetify */
type Density = 'default' | 'comfortable' | 'compact'

/** Segment đang được chỉnh sửa */
type TimeSegment = 'hour' | 'minute' | 'second'

/** Kết quả parse 12h nội bộ */
interface Time12hDisplay {
  display: string
  ampm: AmPm
}

// ── Constants ─────────────────────────────────────────────────────────────────

const AMPM_OPTIONS: readonly AmPm[] = ['AM', 'PM'] as const

const HOUR_MAX_24  = 23
const HOUR_MAX_12  = 12
const HOUR_MIN_12  = 1
const MINS_IN_HOUR = 60
const SECS_IN_MIN  = 60
const MINS_IN_DAY  = 1440

/**
 * Vị trí bắt đầu (index ký tự) của từng segment trong chuỗi "HH:mm:ss"
 * hour  → 0  (ký tự 0-1)
 * minute → 3  (ký tự 3-4)
 * second → 6  (ký tự 6-7)
 */
const SEGMENT_START: Record<TimeSegment, number> = {
  hour:   0,
  minute: 3,
  second: 6,
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  /**
   * Giá trị v-model — luôn ở dạng 24h.
   * - Không giây : "HH:mm"   (ví dụ "09:30")
   * - Có giây    : "HH:mm:ss" (ví dụ "09:30:05")
   * - Chưa nhập  : null
   */
  modelValue?: string | null

  /** Nhãn hiển thị */
  label?: string

  /** Placeholder — tự động nếu không truyền */
  placeholder?: string

  /**
   * Gợi ý phía dưới field.
   * Nếu không truyền và có min/max, tự động hiển thị khoảng cho phép.
   */
  hint?: string

  /** Luôn hiển thị hint dù chưa focus */
  persistentHint?: boolean

  /**
   * Định dạng giờ hiển thị.
   * - '24' : 00:00 → 23:59
   * - '12' : 01:00 → 12:59 + toggle AM/PM
   * @default '24'
   */
  format?: TimeFormat

  /**
   * Bật nhập giây (HH:mm:ss).
   * modelValue sẽ bao gồm seconds khi true.
   * @default false
   */
  withSeconds?: boolean

  /**
   * Giờ tối thiểu — dạng 24h "HH:mm" hoặc "HH:mm:ss".
   * @example "08:00" | "08:00:00"
   */
  min?: string | null

  /**
   * Giờ tối đa — dạng 24h "HH:mm" hoặc "HH:mm:ss".
   * @example "20:00" | "20:00:00"
   */
  max?: string | null

  disabled?: boolean
  readonly?: boolean

  /** Danh sách lỗi từ bên ngoài */
  errorMessages?: string | string[]

  /** @default 'outlined' */
  variant?: TextFieldVariant

  /** @default 'default' */
  density?: Density

  /** @default 'primary' */
  color?: string

  bgColor?: string

  /** Icon Mdi bên trái bên trong */
  prependIcon?: string

  /** Hiển thị nút xóa */
  clearable?: boolean

  /** Bắt buộc nhập */
  required?: boolean

  /** Rules tùy chỉnh bổ sung */
  rules?: ValidationRule[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue:     null,
  label:          'Thời gian',
  placeholder:    undefined,
  hint:           '',
  persistentHint: false,
  format:         '24',
  withSeconds:    false,
  min:            null,
  max:            null,
  disabled:       false,
  readonly:       false,
  errorMessages:  () => [],
  variant:        'outlined',
  density:        'default',
  color:          'primary',
  bgColor:        undefined,
  prependIcon:    'mdi-clock-outline',
  clearable:      false,
  required:       false,
  rules:          () => [],
})

// ── Emits ─────────────────────────────────────────────────────────────────────

interface Emits {
  /** Giá trị 24h "HH:mm" hoặc "HH:mm:ss", null nếu xóa/chưa hợp lệ */
  (e: 'update:modelValue', value: string | null): void
  (e: 'change', value: string | null): void
}

const emit = defineEmits<Emits>()

// ── Slots ─────────────────────────────────────────────────────────────────────

const slots = useSlots()

/** Lọc append-inner khi format='12' để không ghi đè AM/PM toggle */
const passSlots = computed<typeof slots>(() => {
  if (props.format !== '12') return slots
  return Object.fromEntries(
    Object.entries(slots).filter(([key]) => key !== 'append-inner'),
  ) as typeof slots
})

// ── Computed config ───────────────────────────────────────────────────────────

/** Số ký tự tối đa trong input (bao gồm dấu ':') */
const inputMaxLength = computed(() => (props.withSeconds ? 8 : 5))

/** Placeholder tự động */
const computedPlaceholder = computed(() => {
  if (props.placeholder) return props.placeholder
  const h = props.format === '12' ? 'hh' : 'HH'
  return props.withSeconds ? `${h}:mm:ss` : `${h}:mm`
})

// ── Refs ──────────────────────────────────────────────────────────────────────

const fieldRef = ref<{ $el: HTMLElement } | null>(null)

// ── Time helpers ──────────────────────────────────────────────────────────────

/**
 * Chuyển "HH:mm" hoặc "HH:mm:ss" thành tổng số giây từ nửa đêm.
 * Dùng để so sánh min/max.
 */
function toSeconds(hhmm: string | null | undefined): number | null {
  if (!hhmm) return null
  const parts = hhmm.split(':')
  if (parts.length < 2) return null
  const h = Number(parts[0])
  const m = Number(parts[1])
  const s = parts[2] !== undefined ? Number(parts[2]) : 0
  if (isNaN(h) || isNaN(m) || isNaN(s)) return null
  return h * 3600 + m * SECS_IN_MIN + s
}

/** Kiểm tra chuỗi "HH:mm" hoặc "HH:mm:ss" hợp lệ theo 24h */
function isValid24(value: string, withSec = props.withSeconds): boolean {
  if (!value) return false
  const expectedLen = withSec ? 8 : 5
  if (value.length < expectedLen) return false
  const parts = value.split(':')
  if (withSec && parts.length < 3) return false
  if (!withSec && parts.length < 2) return false
  const h = Number(parts[0])
  const m = Number(parts[1])
  const s = withSec ? Number(parts[2]) : 0
  return (
    h >= 0 && h <= HOUR_MAX_24 &&
    m >= 0 && m < MINS_IN_HOUR &&
    s >= 0 && s < SECS_IN_MIN
  )
}

/** Kiểm tra chuỗi hợp lệ theo 12h (01–12) */
function isValid12Display(value: string, withSec = props.withSeconds): boolean {
  if (!value) return false
  const expectedLen = withSec ? 8 : 5
  if (value.length < expectedLen) return false
  const parts = value.split(':')
  const h = Number(parts[0])
  const m = Number(parts[1])
  const s = withSec ? Number(parts[2]) : 0
  return (
    h >= HOUR_MIN_12 && h <= HOUR_MAX_12 &&
    m >= 0 && m < MINS_IN_HOUR &&
    s >= 0 && s < SECS_IN_MIN
  )
}

/**
 * Chuyển 24h → 12h display + AM/PM
 * @example "13:30:05" → { display: "01:30:05", ampm: "PM" }
 * @example "00:00"    → { display: "12:00",    ampm: "AM" }
 */
function to12hDisplay(time24: string): Time12hDisplay {
  if (!isValid24(time24, time24.length > 5)) return { display: '', ampm: 'AM' }
  const parts = time24.split(':')
  let h       = Number(parts[0])
  const m     = Number(parts[1])
  const s     = parts[2] !== undefined ? Number(parts[2]) : null
  const ap: AmPm = h < 12 ? 'AM' : 'PM'
  if (h === 0)    h = 12
  else if (h > 12) h -= 12
  const hh = String(h).padStart(2, '0')
  const mm = String(m).padStart(2, '0')
  const display =
    s !== null
      ? `${hh}:${mm}:${String(s).padStart(2, '0')}`
      : `${hh}:${mm}`
  return { display, ampm: ap }
}

/**
 * Chuyển 12h display + AM/PM → 24h
 * @example "01:30:05", "PM" → "13:30:05"
 * @example "12:00",    "AM" → "00:00"
 */
function to24h(display12: string, ap: AmPm): string | null {
  if (!isValid12Display(display12, display12.length > 5)) return null
  const parts = display12.split(':')
  let h       = Number(parts[0])
  const m     = Number(parts[1])
  const s     = parts[2] !== undefined ? Number(parts[2]) : null
  if (ap === 'AM') {
    if (h === HOUR_MAX_12) h = 0
  } else {
    if (h !== HOUR_MAX_12) h += 12
  }
  const hh = String(h).padStart(2, '0')
  const mm = String(m).padStart(2, '0')
  return s !== null
    ? `${hh}:${mm}:${String(s).padStart(2, '0')}`
    : `${hh}:${mm}`
}

/**
 * Auto-format chuỗi nhập thô → "HH:mm" hoặc "HH:mm:ss".
 * Dùng cho paste / onInput fallback.
 */
function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, props.withSeconds ? 6 : 4)
  if (props.withSeconds) {
    if (digits.length <= 2) return digits
    if (digits.length <= 4) return `${digits.slice(0, 2)}:${digits.slice(2)}`
    return `${digits.slice(0, 2)}:${digits.slice(2, 4)}:${digits.slice(4)}`
  } else {
    if (digits.length <= 2) return digits
    return `${digits.slice(0, 2)}:${digits.slice(2)}`
  }
}

/** Tạo chuỗi thời gian từ h, m, s */
function toTimeString(h: number, m: number, s?: number): string {
  const hh = String(h).padStart(2, '0')
  const mm = String(m).padStart(2, '0')
  if (s !== undefined && props.withSeconds) {
    return `${hh}:${mm}:${String(s).padStart(2, '0')}`
  }
  return `${hh}:${mm}`
}

/** Xác định segment (hour/minute/second) theo vị trí con trỏ */
function getSegment(cursorPos: number): TimeSegment {
  if (cursorPos <= 2) return 'hour'
  if (cursorPos <= 5) return 'minute'
  return 'second'
}

// ── Segment buffer state ──────────────────────────────────────────────────────

/**
 * Chữ số đầu tiên của segment đang chờ chữ số thứ hai.
 * '' = không có buffer (segment chưa bắt đầu hoặc đã hoàn thành).
 */
const segBuffer     = ref<string>('')
const bufferSegment = ref<TimeSegment | null>(null)

/** Xóa buffer khi user chuyển sang segment khác hoặc click */
function resetBuffer(): void {
  segBuffer.value     = ''
  bufferSegment.value = null
}

// ── Internal state ────────────────────────────────────────────────────────────

/** Giá trị hiển thị trong text field */
const displayValue = ref<string>('')

/** Trạng thái AM/PM */
const ampm = ref<AmPm>('AM')

/** Đồng bộ state từ modelValue bên ngoài */
function syncFromModelValue(val: string | null | undefined): void {
  if (!val) {
    displayValue.value = ''
    ampm.value = 'AM'
    return
  }
  if (props.format === '12') {
    const { display, ampm: ap } = to12hDisplay(val)
    displayValue.value = display
    ampm.value = ap
  } else {
    displayValue.value = val
  }
}

syncFromModelValue(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    const current24 =
      props.format === '12'
        ? to24h(displayValue.value, ampm.value)
        : displayValue.value
    if (val !== current24) syncFromModelValue(val)
  },
)

watch([() => props.format, () => props.withSeconds], () => {
  syncFromModelValue(props.modelValue)
})

// ── Computed ──────────────────────────────────────────────────────────────────

const computedHint = computed<string>(() => {
  if (props.hint) return props.hint
  const parts: string[] = []
  if (props.min) parts.push(`từ ${props.min}`)
  if (props.max) parts.push(`đến ${props.max}`)
  return parts.join(' ')
})

const computedRules = computed<ValidationRule[]>(() => {
  const rules: ValidationRule[] = []

  if (props.required) {
    rules.push((v: unknown) =>
      (typeof v === 'string' && v.length > 0) || 'Vui lòng nhập thời gian',
    )
  }

  // Validate format
  rules.push((v: unknown) => {
    if (!v || typeof v !== 'string') return true
    if (props.format === '24') {
      const label = props.withSeconds ? '00:00:00–23:59:59' : '00:00–23:59'
      return isValid24(v) || `Thời gian không hợp lệ (${label})`
    }
    const label = props.withSeconds ? '01:00:00–12:59:59' : '01:00–12:59'
    return isValid12Display(v) || `Thời gian không hợp lệ (${label})`
  })

  // Validate min
  if (props.min) {
    const minLabel = props.min
    rules.push((v: unknown) => {
      if (!v || typeof v !== 'string') return true
      const val24 = props.format === '12' ? to24h(v, ampm.value) : v
      if (!val24) return true
      const valSecs = toSeconds(val24)
      const minSecs = toSeconds(minLabel)
      if (valSecs === null || minSecs === null) return true
      return valSecs >= minSecs || `Không được nhỏ hơn ${minLabel}`
    })
  }

  // Validate max
  if (props.max) {
    const maxLabel = props.max
    rules.push((v: unknown) => {
      if (!v || typeof v !== 'string') return true
      const val24 = props.format === '12' ? to24h(v, ampm.value) : v
      if (!val24) return true
      const valSecs = toSeconds(val24)
      const maxSecs = toSeconds(maxLabel) ?? MINS_IN_DAY * SECS_IN_MIN
      if (valSecs === null) return true
      return valSecs <= maxSecs || `Không được lớn hơn ${maxLabel}`
    })
  }

  return [...rules, ...props.rules]
})

// ── Emit helper ───────────────────────────────────────────────────────────────

function emitValue(display: string, ap: AmPm): void {
  let val24: string | null
  if (props.format === '12') {
    val24 = isValid12Display(display, display.length > 5) ? to24h(display, ap) : null
  } else {
    val24 = isValid24(display) ? display : null
  }
  emit('update:modelValue', val24)
  emit('change', val24)
}

// ── Cursor helper ─────────────────────────────────────────────────────────────

/**
 * Đặt con trỏ vào đầu segment (+ offset tùy chọn).
 * Cần gọi trong nextTick sau khi Vue re-render.
 */
function setCursorToSegment(
  el: HTMLInputElement,
  seg: TimeSegment,
  offset = 0,
): void {
  const pos = SEGMENT_START[seg] + offset
  el.setSelectionRange(pos, pos)
}

// ── Digit-by-digit input logic ────────────────────────────────────────────────

/**
 * Tách `displayValue` thành mảng các part, đảm bảo đủ phần tử.
 * Nếu `displayValue` rỗng → khởi tạo với "00".
 */
function getEditableParts(): string[] {
  const raw   = displayValue.value || (props.withSeconds ? '00:00:00' : '00:00')
  const parts = raw.split(':')
  while (parts.length < (props.withSeconds ? 3 : 2)) parts.push('00')
  return parts
}

/**
 * Xử lý nhập một chữ số theo segment hiện tại.
 *
 * State machine cho mỗi segment:
 *  - Lần nhập 1 (buffer rỗng):
 *    → digit ≤ maxFirstDigit  : ghi buffer, hiển thị "d0", cursor +1, chưa emit
 *    → digit > maxFirstDigit  : auto-complete "0d", emit, advance cursor
 *  - Lần nhập 2 (buffer có chữ số đầu):
 *    → digit hợp lệ với prefix: hoàn thành segment, emit, advance cursor
 *    → digit không hợp lệ     : bỏ qua (không thay đổi gì)
 *
 * Quy tắc maxFirstDigit:
 *  HH 24h → 2  (0–2 chờ; 3–9 → "0X")
 *  HH 12h → 1  (0–1 chờ; 2–9 → "0X")
 *  MM / SS → 5  (0–5 chờ; 6–9 → "0X")
 *
 * Quy tắc maxSecondDigit:
 *  HH 24h: prefix 0|1 → 0–9; prefix 2 → 0–3
 *  HH 12h: prefix 0   → 1–9 (loại "00"); prefix 1 → 0–2 (10–12)
 *  MM / SS: luôn 0–9
 */
function handleDigitInput(
  digit: string,
  el: HTMLInputElement,
  cursorPos: number,
): void {
  const seg = getSegment(cursorPos)
  const d   = parseInt(digit, 10)

  // Reset buffer nếu user đã nhảy sang segment khác
  if (bufferSegment.value !== null && bufferSegment.value !== seg) {
    resetBuffer()
  }

  const parts = getEditableParts()

  // ── Hour segment ────────────────────────────────────────────────────────────

  if (seg === 'hour') {
    const maxFirst = props.format === '24' ? 2 : 1

    if (!segBuffer.value) {
      // Chữ số đầu
      if (d > maxFirst) {
        // Auto-complete: "0d" → advance sang minute
        parts[0] = `0${d}`
        displayValue.value = parts.join(':')
        emitValue(displayValue.value, ampm.value)
        resetBuffer()
        nextTick(() => setCursorToSegment(el, 'minute'))
      } else {
        // Ghi buffer, hiển thị "d0" tạm thời, cursor tại vị trí sau H1
        segBuffer.value     = digit
        bufferSegment.value = 'hour'
        parts[0]            = `${digit}0`
        displayValue.value  = parts.join(':')
        nextTick(() => setCursorToSegment(el, 'hour', 1))
      }
      return
    }

    // Chữ số thứ hai
    const h1 = parseInt(segBuffer.value, 10)
    let maxSecond = 9

    if (props.format === '24') {
      if (h1 === 2) maxSecond = 3                      // 20–23
    } else {
      // 12h: chỉ 01–12
      if (h1 === 0 && d === 0) return                  // "00" không hợp lệ
      if (h1 === 1)             maxSecond = 2           // 10–12
    }

    if (d <= maxSecond) {
      parts[0]           = `${segBuffer.value}${digit}`
      displayValue.value = parts.join(':')
      emitValue(displayValue.value, ampm.value)
      resetBuffer()
      nextTick(() => setCursorToSegment(el, 'minute'))
    }
    // else: chữ số không hợp lệ — bỏ qua hoàn toàn
    return
  }

  // ── Minute segment ──────────────────────────────────────────────────────────

  if (seg === 'minute') {
    if (!segBuffer.value) {
      if (d >= 6) {
        // Auto-complete: "0d" → advance sang second hoặc kết thúc
        parts[1]           = `0${d}`
        displayValue.value = parts.join(':')
        emitValue(displayValue.value, ampm.value)
        resetBuffer()
        if (props.withSeconds) {
          nextTick(() => setCursorToSegment(el, 'second'))
        }
      } else {
        segBuffer.value     = digit
        bufferSegment.value = 'minute'
        parts[1]            = `${digit}0`
        displayValue.value  = parts.join(':')
        nextTick(() => setCursorToSegment(el, 'minute', 1))
      }
      return
    }

    // Chữ số thứ hai — mọi giá trị 0–9 đều hợp lệ
    parts[1]           = `${segBuffer.value}${digit}`
    displayValue.value = parts.join(':')
    emitValue(displayValue.value, ampm.value)
    resetBuffer()
    if (props.withSeconds) {
      nextTick(() => setCursorToSegment(el, 'second'))
    }
    return
  }

  // ── Second segment ──────────────────────────────────────────────────────────

  if (seg === 'second' && props.withSeconds) {
    if (!segBuffer.value) {
      if (d >= 6) {
        parts[2]           = `0${d}`
        displayValue.value = parts.join(':')
        emitValue(displayValue.value, ampm.value)
        resetBuffer()
      } else {
        segBuffer.value     = digit
        bufferSegment.value = 'second'
        parts[2]            = `${digit}0`
        displayValue.value  = parts.join(':')
        nextTick(() => setCursorToSegment(el, 'second', 1))
      }
      return
    }

    parts[2]           = `${segBuffer.value}${digit}`
    displayValue.value = parts.join(':')
    emitValue(displayValue.value, ampm.value)
    resetBuffer()
  }
}

/**
 * Xử lý Backspace: xóa segment hiện tại về "00",
 * hoặc xóa toàn bộ nếu đang ở hour và giá trị đã là rỗng/"00".
 */
function handleBackspace(el: HTMLInputElement, cursorPos: number): void {
  resetBuffer()
  const seg   = getSegment(cursorPos)
  const parts = displayValue.value.split(':')

  if (seg === 'hour') {
    // Xóa toàn bộ nếu field trống hoặc giờ đã là 00
    if (!displayValue.value || parts[0] === '00') {
      displayValue.value = ''
      emit('update:modelValue', null)
      emit('change', null)
      return
    }
    parts[0] = '00'
  } else if (seg === 'minute') {
    if (parts.length < 2) return
    parts[1] = '00'
  } else if (seg === 'second' && props.withSeconds) {
    if (parts.length < 3) return
    parts[2] = '00'
  }

  displayValue.value = parts.join(':')
  emitValue(displayValue.value, ampm.value)
  nextTick(() => setCursorToSegment(el, seg))
}

// ── Event handlers ────────────────────────────────────────────────────────────

/**
 * onInput: chỉ xử lý paste / autocomplete trình duyệt.
 * Các digit key đã được preventDefault trong onKeydown → không trigger onInput.
 */
function onInput(event: Event): void {
  const target    = event.target as HTMLInputElement
  const formatted = formatTimeInput(target.value ?? '')
  displayValue.value = formatted
  target.value       = formatted
  resetBuffer()
  emitValue(formatted, ampm.value)
}

function onBlur(): void {
  resetBuffer()
  emitValue(displayValue.value, ampm.value)
}

function onKeydown(event: KeyboardEvent): void {
  const el        = event.target as HTMLInputElement
  const cursorPos = el.selectionStart ?? 0

  // ── Digit ───────────────────────────────────────────────────────────────────
  if (/^\d$/.test(event.key)) {
    event.preventDefault()
    handleDigitInput(event.key, el, cursorPos)
    return
  }

  // ── Backspace ───────────────────────────────────────────────────────────────
  if (event.key === 'Backspace') {
    event.preventDefault()
    handleBackspace(el, cursorPos)
    return
  }

  // ── Dấu ':' — nhảy sang segment tiếp theo ──────────────────────────────────
  if (event.key === ':') {
    event.preventDefault()
    resetBuffer()
    const seg = getSegment(cursorPos)
    if (seg === 'hour') {
      nextTick(() => setCursorToSegment(el, 'minute'))
    } else if (seg === 'minute' && props.withSeconds) {
      nextTick(() => setCursorToSegment(el, 'second'))
    }
    return
  }

  // ── Arrow Up/Down — tăng/giảm giá trị segment ──────────────────────────────
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault()
    resetBuffer()
    const delta = event.key === 'ArrowUp' ? 1 : -1
    adjustTime(delta, cursorPos)
    return
  }

  // ── Arrow Left/Right — cho phép (reset buffer) ──────────────────────────────
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    resetBuffer()
    return
  }

  // ── Cho phép: Tab, Delete, Ctrl/Cmd+A/C/V/X/Z ──────────────────────────────
  const PASSTHROUGH = new Set(['Tab', 'Delete', 'Enter'])
  if (!PASSTHROUGH.has(event.key) && !event.ctrlKey && !event.metaKey) {
    event.preventDefault()
  }
}

function adjustTime(delta: 1 | -1, cursorPos: number): void {
  const withSec  = props.withSeconds
  const fallback = props.format === '12'
    ? (withSec ? '12:00:00' : '12:00')
    : (withSec ? '00:00:00' : '00:00')

  const raw   = displayValue.value || fallback
  const parts = (raw.includes(':') ? raw : fallback).split(':')
  let h       = Number(parts[0] ?? 0)
  let m       = Number(parts[1] ?? 0)
  let s       = Number(parts[2] ?? 0)

  const segment = getSegment(cursorPos)

  if (segment === 'hour') {
    if (props.format === '24') {
      h = (h + delta + 24) % 24
    } else {
      h += delta
      if (h > HOUR_MAX_12) h = HOUR_MIN_12
      if (h < HOUR_MIN_12) h = HOUR_MAX_12
    }
  } else if (segment === 'minute') {
    m = (m + delta + MINS_IN_HOUR) % MINS_IN_HOUR
  } else {
    s = (s + delta + SECS_IN_MIN) % SECS_IN_MIN
  }

  const newValue = toTimeString(h, m, withSec ? s : undefined)
  displayValue.value = newValue
  emitValue(newValue, ampm.value)
}

function setAmpm(value: AmPm): void {
  ampm.value = value
  emitValue(displayValue.value, value)
}

function onClear(): void {
  displayValue.value = ''
  ampm.value = 'AM'
  resetBuffer()
  emit('update:modelValue', null)
  emit('change', null)
}
</script>

<style scoped>
/* ── AM/PM Toggle ──────────────────────────────────────────────────────────── */

.app-time-input__ampm {
  display: flex;
  align-self: center;
  border: 0.5px solid currentColor;
  opacity: 0.7;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 2px;
  flex-shrink: 0;
}

.app-time-input__ampm-btn {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 2px 7px;
  line-height: 1.7;
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
  opacity: 0.45;
  transition: opacity 0.12s, background 0.12s;
}

.app-time-input__ampm-btn + .app-time-input__ampm-btn {
  border-left: 0.5px solid currentColor;
}

.app-time-input__ampm-btn--active {
  background: rgba(var(--v-theme-primary), 0.15);
  color: rgb(var(--v-theme-primary));
  opacity: 1;
}

.app-time-input__ampm-btn:hover:not(.app-time-input__ampm-btn--active) {
  opacity: 0.7;
  background: rgba(0, 0, 0, 0.04);
}
</style>