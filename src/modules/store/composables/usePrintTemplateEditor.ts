import { computed, ref } from 'vue'
import { FontSizePreset, LabelSize, ReceiptPaperWidth } from '../enums/print-template.enum'
import {
    DEFAULT_SAMPLE_TOPPING_COUNT,
    LABEL_SIZE_MM,
    NORMAL_LABEL_FONT_SIZES,
    NORMAL_RECEIPT_FONT_SIZES,
} from '../constants/print-template.constants'
import {
    buildPreviewOrder,
    createDefaultLabelTemplate,
    createDefaultReceiptTemplate,
    labelPagesOf,
    labelToppingCapacityOf,
    matchFontSizePreset,
    scaleFontSizes,
} from '../utils/print-template.util'

/**
 * Trạng thái trang chỉnh mẫu hoá đơn và tem. Chưa có API nên chỉ sửa bản xem trước trong bộ nhớ: tải lại trang là về
 * mặc định.
 */
export function usePrintTemplateEditor() {
    const receipt = ref(createDefaultReceiptTemplate())
    const label = ref(createDefaultLabelTemplate())
    const receiptPaperWidth = ref(ReceiptPaperWidth.Mm80)
    const labelSize = ref(LabelSize.Mm40x30)
    const sampleToppingCount = ref(DEFAULT_SAMPLE_TOPPING_COUNT)

    const previewOrder = computed(() => buildPreviewOrder(sampleToppingCount.value))

    const receiptFontPreset = computed(() =>
        matchFontSizePreset(NORMAL_RECEIPT_FONT_SIZES, receipt.value.fontSize),
    )

    const labelFontPreset = computed(() =>
        matchFontSizePreset(NORMAL_LABEL_FONT_SIZES, label.value.fontSize),
    )

    const isReceiptChanged = computed(
        () => JSON.stringify(receipt.value) !== JSON.stringify(createDefaultReceiptTemplate()),
    )

    const isLabelChanged = computed(
        () => JSON.stringify(label.value) !== JSON.stringify(createDefaultLabelTemplate()),
    )

    const labelPages = computed(() => labelPagesOf(previewOrder.value.items, label.value))

    /** `null` khi tắt topping: không tách tem nên không cần sức chứa. */
    const labelToppingCapacity = computed(() =>
        label.value.showToppings ? labelToppingCapacityOf(label.value, labelSize.value) : null,
    )

    /** Cỡ tem không tự tăng nên cấu hình vượt sức chứa phải báo ngay lúc chỉnh. */
    const labelCapacityWarning = computed((): string | null => {
        const capacity = labelToppingCapacity.value
        const { widthMm, heightMm } = LABEL_SIZE_MM[labelSize.value]
        const sizeText = `${widthMm}×${heightMm}`

        if (capacity === null) return null

        if (capacity < 1) {
            return (
                `Tem ${sizeText} với cỡ chữ và padding hiện tại không còn chỗ cho topping nào. ` +
                'Giảm cỡ chữ, padding hoặc tắt bớt dòng.'
            )
        }

        if (label.value.maxToppingsPerLabel > capacity) {
            return (
                `Đặt tối đa ${label.value.maxToppingsPerLabel} topping/tem nhưng tem ${sizeText} chỉ vừa ${capacity}. ` +
                'Giảm số topping tối đa, cỡ chữ hoặc padding; cỡ tem không tự tăng.'
            )
        }

        return null
    })

    function applyReceiptFontPreset(preset: FontSizePreset) {
        receipt.value = {
            ...receipt.value,
            fontSize: scaleFontSizes(NORMAL_RECEIPT_FONT_SIZES, preset),
        }
    }

    function applyLabelFontPreset(preset: FontSizePreset) {
        label.value = { ...label.value, fontSize: scaleFontSizes(NORMAL_LABEL_FONT_SIZES, preset) }
    }

    function resetReceipt() {
        receipt.value = createDefaultReceiptTemplate()
    }

    function resetLabel() {
        label.value = createDefaultLabelTemplate()
    }

    return {
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
    }
}
