<template>
  <div class="d-flex flex-column ga-6">
    <section class="d-flex flex-column ga-2">
      <div class="text-overline text-medium-emphasis">Khổ giấy (của máy in, chỉ để xem trước)</div>
      <v-btn-toggle
        :model-value="paperWidth"
        mandatory
        density="compact"
        variant="outlined"
        divided
        color="primary"
        @update:model-value="(value: ReceiptPaperWidth) => emit('update:paperWidth', value)"
      >
        <v-btn v-for="width in PAPER_WIDTHS" :key="width" :value="width" class="text-none">
          {{ width }}mm
        </v-btn>
      </v-btn-toggle>
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
        :labels="RECEIPT_FONT_SIZE_LABELS"
        :range="FONT_SIZE_RANGE"
        id-prefix="receipt-font"
        @update:model-value="(fontSize) => update({ fontSize })"
      />
    </section>

    <section class="d-flex flex-column ga-3">
      <div class="text-overline text-medium-emphasis">Padding & khoảng cách</div>
      <PrintTemplateNumberFields
        :model-value="modelValue.padding"
        :labels="PADDING_LABELS"
        :range="SPACING_RANGE"
        id-prefix="receipt-padding"
        @update:model-value="(padding) => update({ padding })"
      />
      <PrintTemplateNumberFields
        :model-value="gaps"
        :labels="GAP_LABELS"
        :range="SPACING_RANGE"
        id-prefix="receipt-gap"
        @update:model-value="(value) => update(value)"
      />
    </section>

    <PrintTemplateToggleGroup
      v-for="group in RECEIPT_TOGGLE_GROUPS"
      :key="group.title"
      :title="group.title"
      :keys="group.keys"
      :labels="RECEIPT_TOGGLE_LABELS"
      :values="modelValue"
      @change="(changes) => update(changes)"
    />

    <v-text-field
      id="receipt-footer-text"
      :model-value="modelValue.footerText"
      label="Lời cảm ơn cuối bill"
      density="compact"
      variant="outlined"
      hide-details
      clearable
      @update:model-value="(footerText: string | null) => update({ footerText: footerText ?? '' })"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PrintTemplateNumberFields from './PrintTemplateNumberFields.vue'
import PrintTemplateToggleGroup from './PrintTemplateToggleGroup.vue'
import { FontSizePreset, ReceiptPaperWidth } from '../../enums/print-template.enum'
import {
  FONT_SIZE_PRESET_LABELS,
  FONT_SIZE_RANGE,
  PADDING_LABELS,
  RECEIPT_FONT_SIZE_LABELS,
  RECEIPT_TOGGLE_GROUPS,
  RECEIPT_TOGGLE_LABELS,
  SPACING_RANGE,
} from '../../constants/print-template.constants'
import type { ReceiptTemplateFormModel } from '../../models/form-models/print-template.model'

interface Props {
  modelValue: ReceiptTemplateFormModel

  paperWidth: ReceiptPaperWidth

  /** Mức cỡ chữ đang khớp; `null` khi đã chỉnh tay từng ô. */
  fontPreset: FontSizePreset | null
}

const PAPER_WIDTHS = [ReceiptPaperWidth.Mm58, ReceiptPaperWidth.Mm80]

const FONT_PRESETS = Object.values(FontSizePreset)

const GAP_LABELS = { sectionGap: 'Giữa các phần', lineGap: 'Giữa các dòng' }

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: ReceiptTemplateFormModel]
  'update:paperWidth': [value: ReceiptPaperWidth]
  'apply-font-preset': [preset: FontSizePreset]
}>()

const gaps = computed(() => ({
  sectionGap: props.modelValue.sectionGap,
  lineGap: props.modelValue.lineGap,
}))

function update(changes: Partial<ReceiptTemplateFormModel>) {
  emit('update:modelValue', { ...props.modelValue, ...changes })
}

/** Bấm lại mức đang chọn thì v-btn-toggle trả rỗng; giữ nguyên cỡ chữ. */
function onPresetSelect(preset: FontSizePreset | null | undefined) {
  if (preset) emit('apply-font-preset', preset)
}
</script>
