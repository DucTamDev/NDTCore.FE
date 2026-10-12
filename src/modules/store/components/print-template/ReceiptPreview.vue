<template>
  <div class="d-flex flex-column align-center ga-3">
    <div class="text-caption text-medium-emphasis">
      {{ paperWidth }}mm · ảnh rộng {{ paperDots }} dot · thu nhỏ để vừa khung
    </div>
    <div ref="wrapRef" class="paper-wrap">
      <div class="paper" :style="paperStyle">
        <template v-for="section in sections" :key="section.key">
          <div v-if="section.divider" class="divider" :class="section.divider" />
          <div class="section" :style="sectionStyle">
            <PrintPreviewLine v-for="line in section.lines" :key="line.key" :line="line" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type CSSProperties } from 'vue'
import PrintPreviewLine from './PrintPreviewLine.vue'
import { ReceiptPaperWidth } from '../../enums/print-template.enum'
import { RECEIPT_PAPER_DOTS } from '../../constants/print-template.constants'
import { receiptPreviewSectionsOf } from '../../utils/print-preview.util'
import type { ReceiptTemplateFormModel } from '../../models/form-models/print-template.model'
import type { PrintPreviewOrderViewModel } from '../../models/view-models/print-preview.view-model'

interface Props {
  options: ReceiptTemplateFormModel

  order: PrintPreviewOrderViewModel

  paperWidth: ReceiptPaperWidth
}

const props = defineProps<Props>()

const wrapRef = ref<HTMLElement | null>(null)
const wrapWidth = ref(0)

let resizeObserver: ResizeObserver | null = null

const paperDots = computed(() => RECEIPT_PAPER_DOTS[props.paperWidth])

const sections = computed(() => receiptPreviewSectionsOf(props.order, props.options))

/** Giấy vẽ đúng 1 dot = 1px; khung hẹp hơn khổ 80mm (576 dot) thì thu nhỏ cả tờ, giữ tỉ lệ. */
const paperStyle = computed((): CSSProperties => {
  const { padding, sectionGap } = props.options
  const zoom = wrapWidth.value > 0 ? Math.min(1, wrapWidth.value / paperDots.value) : 1
  return {
    width: `${paperDots.value}px`,
    padding: `${padding.top}px ${padding.right}px ${padding.bottom}px ${padding.left}px`,
    gap: `${sectionGap}px`,
    zoom,
  }
})

const sectionStyle = computed((): CSSProperties => ({ gap: `${props.options.lineGap}px` }))

onMounted(() => {
  if (!wrapRef.value) return
  resizeObserver = new ResizeObserver(([entry]) => {
    wrapWidth.value = entry?.contentRect.width ?? 0
  })
  resizeObserver.observe(wrapRef.value)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})
</script>

<style scoped>
.paper-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

/* Giấy in luôn trắng chữ đen, không theo theme: đây là hình ảnh tờ giấy thật. */
.paper {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  color: #111111;
  font-family: 'Roboto Mono', ui-monospace, Consolas, monospace;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 12%),
    0 8px 24px rgb(0 0 0 / 10%);
}

.section {
  display: flex;
  flex-direction: column;
}

.divider.solid {
  border-top: 2px solid currentColor;
}

.divider.dashed {
  border-top: 2px dashed currentColor;
}
</style>
