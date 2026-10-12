<template>
  <div class="d-flex flex-column ga-4">
    <AppPageHeader
      title="Hoá đơn và tem"
      subtitle="Mẫu in hoá đơn và tem dán ly cho máy in nhiệt; cỡ chữ, padding tính bằng dot (8 dot = 1mm)"
    >
      <template #breadcrumb>
        <AppBreadcrumb
          :items="[
            { title: 'Dashboard', to: APP_ROUTES.ADMIN.BASE.PATH },
            { title: 'Cửa hàng' },
            { title: 'Hoá đơn và tem', disabled: true },
          ]"
        />
      </template>
      <v-btn
        variant="outlined"
        prepend-icon="mdi-restore"
        :disabled="!isActiveTemplateChanged"
        @click="resetActiveTemplate"
      >
        Khôi phục mặc định
      </v-btn>
    </AppPageHeader>

    <v-alert type="info" variant="tonal" density="compact">
      Đang xem trước mẫu mặc định. Thay đổi chưa được lưu và sẽ mất khi tải lại trang.
    </v-alert>

    <v-card rounded="lg" elevation="1">
      <v-tabs v-model="activeKind" color="primary" class="px-2">
        <v-tab :value="PrintTemplateKind.Receipt" class="text-none" rounded="lg">
          <v-icon start icon="mdi-receipt-text-outline" size="18" />
          Hoá đơn
        </v-tab>
        <v-tab :value="PrintTemplateKind.Label" class="text-none" rounded="lg">
          <v-icon start icon="mdi-label-outline" size="18" />
          Tem dán ly
        </v-tab>
      </v-tabs>
      <v-divider />
      <v-window v-model="activeKind">
        <v-window-item :value="PrintTemplateKind.Receipt">
          <div class="workspace pa-4">
            <ReceiptTemplateForm
              v-model="receipt"
              v-model:paper-width="receiptPaperWidth"
              :font-preset="receiptFontPreset"
              @apply-font-preset="applyReceiptFontPreset"
            />
            <v-sheet class="stage pa-4" rounded="lg" color="surface-variant">
              <ReceiptPreview
                :options="receipt"
                :order="previewOrder"
                :paper-width="receiptPaperWidth"
              />
            </v-sheet>
          </div>
        </v-window-item>
        <v-window-item :value="PrintTemplateKind.Label">
          <div class="workspace pa-4">
            <LabelTemplateForm
              v-model="label"
              v-model:label-size="labelSize"
              v-model:sample-topping-count="sampleToppingCount"
              :font-preset="labelFontPreset"
              :topping-capacity="labelToppingCapacity"
              @apply-font-preset="applyLabelFontPreset"
            />
            <v-sheet class="stage pa-4" rounded="lg" color="surface-variant">
              <LabelPreview
                :options="label"
                :order="previewOrder"
                :pages="labelPages"
                :label-size="labelSize"
                :capacity-warning="labelCapacityWarning"
              />
            </v-sheet>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { AppBreadcrumb, AppPageHeader } from '@/components/ui'
import { APP_ROUTES } from '@/core/constants/_index'
import ReceiptTemplateForm from '../components/print-template/ReceiptTemplateForm.vue'
import ReceiptPreview from '../components/print-template/ReceiptPreview.vue'
import LabelTemplateForm from '../components/print-template/LabelTemplateForm.vue'
import LabelPreview from '../components/print-template/LabelPreview.vue'
import { usePrintTemplateEditor } from '../composables/usePrintTemplateEditor'
import { PrintTemplateKind } from '../enums/print-template.enum'

const {
  receipt,
  label,
  receiptPaperWidth,
  labelSize,
  sampleToppingCount,
  previewOrder,
  receiptFontPreset,
  labelFontPreset,
  isReceiptChanged,
  isLabelChanged,
  labelPages,
  labelToppingCapacity,
  labelCapacityWarning,
  applyReceiptFontPreset,
  applyLabelFontPreset,
  resetReceipt,
  resetLabel,
} = usePrintTemplateEditor()

const activeKind = ref(PrintTemplateKind.Receipt)

const isActiveTemplateChanged = computed(() =>
  activeKind.value === PrintTemplateKind.Receipt ? isReceiptChanged.value : isLabelChanged.value,
)

function resetActiveTemplate() {
  if (activeKind.value === PrintTemplateKind.Receipt) resetReceipt()
  else resetLabel()
}
</script>

<style scoped>
.workspace {
  display: grid;
  grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.stage {
  position: sticky;
  top: 80px;
  min-width: 0;
}

@media (max-width: 960px) {
  .workspace {
    grid-template-columns: minmax(0, 1fr);
  }

  .stage {
    position: static;
  }
}
</style>
