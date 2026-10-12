<template>
  <div
    v-if="line.kind === 'row'"
    class="row"
    :class="{ bold: line.bold }"
    :style="textStyleOf(line)"
  >
    <span class="row-label">{{ line.label }}</span>
    <span v-if="line.value" class="row-value">{{ line.value }}</span>
  </div>
  <div
    v-else-if="line.kind === 'text'"
    :class="{ bold: line.bold, center: line.center }"
    :style="textStyleOf(line)"
  >
    {{ line.text }}
  </div>
  <div v-else-if="line.kind === 'logo'" class="logo" aria-hidden="true">LOGO</div>
  <div v-else-if="line.kind === 'qr'" class="qr" aria-hidden="true" />
  <div v-else class="barcode" aria-hidden="true" />
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { lineHeightOf } from '../../utils/print-template.util'
import type {
  PreviewLine,
  PreviewRowLine,
  PreviewTextLine,
} from '../../models/view-models/print-preview.view-model'

interface Props {
  line: PreviewLine
}

defineProps<Props>()

/** Cỡ chữ là dot của bản in, hiển thị 1 dot = 1px. */
function textStyleOf(line: PreviewRowLine | PreviewTextLine): CSSProperties {
  return {
    fontSize: `${line.size}px`,
    lineHeight: `${lineHeightOf(line.size)}px`,
    paddingLeft: line.indent ? `${line.size}px` : undefined,
  }
}
</script>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.row-label {
  min-width: 0;
  overflow-wrap: anywhere;
}

.row-value {
  flex-shrink: 0;
  text-align: right;
}

.bold {
  font-weight: 700;
}

.center {
  text-align: center;
}

/* Logo, QR, mã vạch chỉ minh hoạ vị trí và cỡ thật trên bản in (logo 96 dot, QR khoảng 176 dot, vạch cao 64 dot). */
.logo {
  width: 96px;
  height: 96px;
  margin: 0 auto;
  border: 4px solid currentColor;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 20px;
}

.qr {
  width: 176px;
  height: 176px;
  margin: 0 auto;
  background:
    linear-gradient(currentColor, currentColor) 0 0 / 48px 48px no-repeat,
    linear-gradient(currentColor, currentColor) 100% 0 / 48px 48px no-repeat,
    linear-gradient(currentColor, currentColor) 0 100% / 48px 48px no-repeat,
    repeating-conic-gradient(currentColor 0 25%, transparent 0 50%) 0 0 / 16px 16px;
}

.barcode {
  height: 64px;
  margin: 0 24px;
  background: repeating-linear-gradient(
    90deg,
    currentColor 0 4px,
    transparent 4px 6px,
    currentColor 6px 8px,
    transparent 8px 12px
  );
}
</style>
