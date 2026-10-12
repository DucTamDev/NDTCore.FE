<template>
  <div class="d-flex flex-column align-center ga-3">
    <div class="text-caption text-medium-emphasis">
      Tem {{ sizeMm.widthMm }}×{{ sizeMm.heightMm }}mm · {{ widthDots }}×{{ heightDots }} dot ·
      {{ pages.length }} tem cho {{ cupCount }} ly
    </div>

    <div class="d-flex flex-column ga-2 w-100">
      <v-alert
        v-if="capacityWarning"
        type="warning"
        variant="tonal"
        density="compact"
        :text="capacityWarning"
      />
      <v-alert
        v-if="overflowCount > 0"
        type="error"
        variant="tonal"
        density="compact"
        :text="`${overflowCount} tem bị tràn (viền đỏ): nội dung dài hơn chiều cao tem, phần dưới sẽ bị cắt khi in.`"
      />
      <div
        v-if="!capacityWarning && overflowCount === 0"
        class="text-caption text-medium-emphasis text-center"
      >
        Mọi tem vừa khổ.
      </div>
    </div>

    <div class="labels">
      <div
        v-for="(label, index) in labels"
        :key="index"
        class="d-flex flex-column align-center ga-1"
      >
        <div
          :ref="(element) => setLabelRef(element, index)"
          class="label"
          :class="{ overflow: overflowIndexes.has(index) }"
          :style="labelStyle"
        >
          <div
            v-if="label.preview.headerParts.length > 0"
            class="spread bold"
            :style="textStyleOf(fontSize.header)"
          >
            <span v-for="part in label.preview.headerParts" :key="part">{{ part }}</span>
          </div>
          <div class="spread" :style="textStyleOf(fontSize.itemName)">
            <span class="name bold">{{ label.preview.itemName }}</span>
            <span v-if="label.preview.partText" class="part">{{ label.preview.partText }}</span>
          </div>
          <div v-for="line in label.preview.lines" :key="line.key" :style="textStyleOf(line.size)">
            {{ line.text }}
          </div>
          <div
            v-if="label.preview.footer"
            class="spread footer"
            :style="textStyleOf(fontSize.footer)"
          >
            <span>{{ label.preview.footer.left }}</span>
            <span>{{ label.preview.footer.right }}</span>
          </div>
        </div>
        <span class="text-caption text-medium-emphasis">{{ label.caption }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  ref,
  watch,
  type ComponentPublicInstance,
  type CSSProperties,
} from 'vue'
import { LabelSize } from '../../enums/print-template.enum'
import { LABEL_SIZE_MM } from '../../constants/print-template.constants'
import { labelPreviewOf } from '../../utils/print-preview.util'
import { labelHeightDotsOf, labelWidthDotsOf, lineHeightOf } from '../../utils/print-template.util'
import type { LabelTemplateFormModel } from '../../models/form-models/print-template.model'
import type {
  LabelPageViewModel,
  PrintPreviewOrderViewModel,
} from '../../models/view-models/print-preview.view-model'

interface Props {
  options: LabelTemplateFormModel

  order: PrintPreviewOrderViewModel

  pages: LabelPageViewModel[]

  labelSize: LabelSize

  /** Cảnh báo cấu hình vượt sức chứa của tem; `null` khi vừa. */
  capacityWarning: string | null
}

const props = defineProps<Props>()

const labelElements: (HTMLElement | null)[] = []
const overflowIndexes = ref(new Set<number>())

const sizeMm = computed(() => LABEL_SIZE_MM[props.labelSize])

const widthDots = computed(() => labelWidthDotsOf(props.labelSize))

/** Cao đúng phần app cho phép in trên một con tem. */
const heightDots = computed(() => labelHeightDotsOf(props.labelSize))

const fontSize = computed(() => props.options.fontSize)

const cupCount = computed(() => new Set(props.pages.map((page) => page.cupNumber)).size)

const labels = computed(() =>
  props.pages.map((page) => ({
    preview: labelPreviewOf(props.order, page, props.options),
    caption:
      page.partCount > 1
        ? `ly ${page.cupNumber} · tem ${page.partNumber}/${page.partCount}`
        : `ly ${page.cupNumber}`,
  })),
)

const overflowCount = computed(() => overflowIndexes.value.size)

const labelStyle = computed((): CSSProperties => {
  const { padding, lineGap } = props.options
  return {
    width: `${widthDots.value}px`,
    height: `${heightDots.value}px`,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    gap: `${lineGap}px`,
  }
})

/** Tên món dài xuống dòng thì công thức sức chứa không lường trước được, nên đo thật trên từng tem đã vẽ. */
watch(
  [labels, labelStyle],
  async () => {
    await nextTick()
    const overflowing = labelElements
      .slice(0, labels.value.length)
      .map((element, index) =>
        element && element.scrollHeight > element.clientHeight + 1 ? index : -1,
      )
      .filter((index) => index >= 0)
    overflowIndexes.value = new Set(overflowing)
  },
  { immediate: true, flush: 'post' },
)

function setLabelRef(element: Element | ComponentPublicInstance | null, index: number) {
  labelElements[index] = element instanceof HTMLElement ? element : null
}

function textStyleOf(size: number): CSSProperties {
  return { fontSize: `${size}px`, lineHeight: `${lineHeightOf(size)}px` }
}
</script>

<style scoped>
.labels {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
}

/* Tem luôn trắng chữ đen, không theo theme: đây là hình ảnh con tem thật. */
.label {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #ffffff;
  color: #111111;
  font-family: 'Roboto Mono', ui-monospace, Consolas, monospace;
  border-radius: 6px;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 12%),
    0 8px 24px rgb(0 0 0 / 10%);
}

.label.overflow {
  outline: 3px solid rgb(var(--v-theme-error));
  outline-offset: 2px;
}

.spread {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.bold {
  font-weight: 700;
}

.name {
  min-width: 0;
  overflow-wrap: anywhere;
}

.part {
  flex-shrink: 0;
  white-space: nowrap;
}

.footer {
  margin-top: auto;
}
</style>
