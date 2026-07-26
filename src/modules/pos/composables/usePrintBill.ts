import { ref } from 'vue'
import { useToastNotification } from '@/composables/useToastNotification'
import { posService } from '../services/pos.service'
import { usePosShiftStore } from '../stores/pos-shift.store'
import { buildBillHtml } from '../utils/build-bill-html.util'
import { openPrintWindow, printHtmlInWindow } from '../utils/print-window.util'

export function usePrintBill() {
    const toast = useToastNotification()
    const shiftStore = usePosShiftStore()
    const isPrinting = ref(false)

    async function printBill(orderId: number): Promise<void> {
        isPrinting.value = true
        const printWindow = openPrintWindow()
        try {
            if (!printWindow) {
                toast.error('Không thể mở cửa sổ in. Vui lòng cho phép popup.')
                return
            }
            const order = await posService.getOrderByIdAsync(orderId)
            if (!order) {
                printWindow.close()
                toast.error('Không tải được chi tiết đơn hàng.')
                return
            }
            const html = buildBillHtml(order, {
                name: shiftStore.storeName,
                logoUrl: shiftStore.logoUrl,
                address: shiftStore.address,
                hotline: shiftStore.hotline,
            })
            printHtmlInWindow(printWindow, html)
        } catch (error) {
            printWindow?.close()
            toast.error(error instanceof Error ? error.message : 'In bill thất bại.')
        } finally {
            isPrinting.value = false
        }
    }

    return { isPrinting, printBill }
}
