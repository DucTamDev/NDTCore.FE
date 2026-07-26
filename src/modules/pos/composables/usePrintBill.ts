import { ref } from 'vue'
import { useToastNotification } from '@/composables/useToastNotification'
import { posService } from '../services/pos.service'
import { usePosShiftStore } from '../stores/pos-shift.store'
import { buildBillHtml } from '../utils/build-bill-html.util'
import { printHtmlInline } from '../utils/print-inline.util'

export function usePrintBill() {
    const toast = useToastNotification()
    const shiftStore = usePosShiftStore()
    const isPrinting = ref(false)

    async function printBill(orderId: number): Promise<void> {
        isPrinting.value = true
        try {
            const order = await posService.getOrderByIdAsync(orderId)
            if (!order) {
                toast.error('Không tải được chi tiết đơn hàng.')
                return
            }
            const html = buildBillHtml(order, {
                name: shiftStore.storeName,
                address: shiftStore.address,
                hotline: shiftStore.hotline,
            })
            printHtmlInline(html)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'In bill thất bại.')
        } finally {
            isPrinting.value = false
        }
    }

    return { isPrinting, printBill }
}
