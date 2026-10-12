<template>
  <div class="d-flex flex-column ga-6">
    <section class="d-flex flex-column ga-2">
      <div class="text-overline text-medium-emphasis">Cỡ tem (của máy in, không tự tăng)</div>
      <v-btn-toggle
        :model-value="labelSize"
        mandatory
        density="compact"
        variant="outlined"
        divided
        color="primary"
        @update:model-value="(value: LabelSize) => emit('update:labelSize', value)"
      >
        <v-btn v-for="size in LABEL_SIZES" :key="size" :value="size" class="text-none">
          {{ LABEL_SIZE_MM[size].widthMm }}×{{ LABEL_SIZE_MM[size].heightMm }}
        </v-btn>
      </v-btn-toggle>
    </section>

    <section class="d-flex flex-column ga-3">
      <div class="text-overline text-medium-emphasis">Topping</div>
      <div class="number-row">
        <v-text-field
          id="label-max-toppings"
          :model-value="modelValue.maxToppingsPerLabel"
          :min="MAX_TOPPINGS_RANGE.min"
          :max="MAX_TOPPINGS_RANGE.max"
          :rules="[maxToppingsRule]"
          label="Tối đa mỗi tem"
          type="number"
          density="compact"
          variant="outlined"
          hide-details="auto"
          @update:model-value="onMaxToppingsUpdate"
        />
        <v-text-field
          id="label-sample-toppings"
          :model-value="sampleToppingCount"
          :min="SAMPLE_TOPPING_RANGE.min"
          :max="SAMPLE_TOPPING_RANGE.max"
          :rules="[sampleToppingRule]"
          label="Topping của ly mẫu"
          type="number"
          density="compact"
          variant="outlined"
          hide-details="auto"
          @update:model-value="onSampleToppingUpdate"
        />
      </div>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ capacityHint }}</p>
    </section>

    <section class="d-flex flex-column ga-3">
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <div class="text-overline text-medium-emphasis">Cỡ chữ từng phần</div>
        <v-btn-toggle
          :model-value="fontPreset"
          density="compact"
          variant="outlined"
          divided
          color="primary"
          @update:model-value="onPresetSelect"
        >
          <v-btn
            v-for="preset in FONT_PRESETS"
            :key="preset"
            :value="preset"
            size="small"
            class="text-none"
          >
            {{ FONT_SIZE_PRESET_LABELS[preset] }}
          </v-btn>
        </v-btn-toggle>
      </div>
      <PrintTemplateNumberFields
        :model-value="modelValue.fontSize"
        :labels="LABEL_FONT_SIZE_LABELS"
        :range="FONT_SIZE_RANGE"
        id-prefix="label-font"
        @update:model-value="(fontSize) => update({ fontSize })"
      />
    </section>

    <section class="d-flex flex-column ga-3">
      <div class="text-overline text-medium-emphasis">Padding & khoảng cách</div>
      <PrintTemplateNumberFields
        :model-value="spacing"
        :labels="SPACING_LABELS"
        :range="SPACING_RANGE"
        id-prefix="label-spacing"
        @update:model-value="onSpacingUpdate"
      />
    </section>

    <PrintTemplateToggleGroup
      v-for="group in LABEL_TOGGLE_GROUPS"
      :key="group.title"
      :title="group.title"
      :keys="group.keys"
      :labels="LABEL_TOGGLE_LABELS"
      :values="modelValue"
      @change="(changes) => update(changes)"
    />

    <p class="text-body-2 text-medium-emphasis mb-0">
      Mỗi ly ít nhất một tem. Ly có nhiều loại topping hơn mức tối đa thì tách thêm tem cho phần
      topping còn lại, ghi "tem 1/2", "tem 2/2" bên phải tên món; cỡ tem giữ nguyên. Topping x2, x3
      ghi cùng dòng nên vẫn tính là một dòng.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PrintTemplateNumberFields from './PrintTemplateNumberFields.vue'
import PrintTemplateToggleGroup from './PrintTemplateToggleGroup.vue'
import { FontSizePreset, LabelSize } from '../../enums/print-template.enum'
import {
  FONT_SIZE_PRESET_LABELS,
  FONT_SIZE_RANGE,
  LABEL_FONT_SIZE_LABELS,
  LABEL_SIZE_MM,
  LABEL_TOGGLE_GROUPS,
  LABEL_TOGGLE_LABELS,
  MAX_TOPPINGS_RANGE,
  PADDING_LABELS,
  SAMPLE_TOPPING_RANGE,
  SPACING_RANGE,
} from '../../constants/print-template.constants'
import type { LabelTemplateFormModel } from '../../models/form-models/print-template.model'

interface Props {
  modelValue: LabelTemplateFormModel

  labelSize: LabelSize

  /** Mức cỡ chữ đang khớp; `null` khi đã chỉnh tay từng ô. */
  fontPreset: FontSizePreset | null

  /** Số loại topping của ly trà sữa mẫu. */
  sampleToppingCount: number

  /** Số dòng topping vừa một tem; `null` khi tắt topping. */
  toppingCapacity: number | null
}

const LABEL_SIZES = Object.values(LabelSize)

const FONT_PRESETS = Object.values(FontSizePreset)

const SPACING_LABELS = { ...PADDING_LABELS, lineGap: 'Giữa các dòng' }

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: LabelTemplateFormModel]
  'update:labelSize': [value: LabelSize]
  'update:sampleToppingCount': [value: number]
  'apply-font-preset': [preset: FontSizePreset]
}>()

const spacing = computed(() => ({ ...props.modelValue.padding, lineGap: props.modelValue.lineGap }))

const capacityHint = computed(() => {
  if (props.toppingCapacity === null) return 'Topping đang tắt nên không tách tem.'
  const { widthMm, heightMm } = LABEL_SIZE_MM[props.labelSize]
  const capacity = Math.max(0, props.toppingCapacity)
  return `Với cấu hình hiện tại, tem ${widthMm}×${heightMm} vừa tối đa ${capacity} dòng topping.`
})

const integerIn = (value: string, range: { min: number; max: number }): number | null => {
  const parsed = Number(value)
  const isValid =
    value !== '' && Number.isInteger(parsed) && parsed >= range.min && parsed <= range.max
  return isValid ? parsed : null
}

const maxToppingsRule = (value: string): true | string =>
  integerIn(String(value), MAX_TOPPINGS_RANGE) !== null ||
  `${MAX_TOPPINGS_RANGE.min}–${MAX_TOPPINGS_RANGE.max}`

const sampleToppingRule = (value: string): true | string =>
  integerIn(String(value), SAMPLE_TOPPING_RANGE) !== null ||
  `${SAMPLE_TOPPING_RANGE.min}–${SAMPLE_TOPPING_RANGE.max}`

function update(changes: Partial<LabelTemplateFormModel>) {
  emit('update:modelValue', { ...props.modelValue, ...changes })
}

function onSpacingUpdate(value: typeof spacing.value) {
  const { lineGap, ...padding } = value
  update({ padding, lineGap })
}

/** Giá trị đang gõ dở thì chưa áp, để bản xem trước không nhảy theo từng phím. */
function onMaxToppingsUpdate(value: string) {
  const maxToppingsPerLabel = integerIn(value, MAX_TOPPINGS_RANGE)
  if (maxToppingsPerLabel !== null) update({ maxToppingsPerLabel })
}

function onSampleToppingUpdate(value: string) {
  const count = integerIn(value, SAMPLE_TOPPING_RANGE)
  if (count !== null) emit('update:sampleToppingCount', count)
}

/** Bấm lại mức đang chọn thì v-btn-toggle trả rỗng; giữ nguyên cỡ chữ. */
function onPresetSelect(preset: FontSizePreset | null | undefined) {
  if (preset) emit('apply-font-preset', preset)
}
</script>

<style scoped>
.number-row {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
</style>
