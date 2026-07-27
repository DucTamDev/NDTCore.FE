import { ref } from 'vue'
import { useToastNotification } from '@/composables/useToastNotification'
import { posService } from '../services/pos.service'
import { usePosShiftStore } from '../stores/pos-shift.store'
import { buildBillCanvas } from '../utils/build-bill-canvas.util'
import { usbPrinterService } from '../services/usb-printer.service'
import ReceiptPrinterEncoder from '@point-of-sale/receipt-printer-encoder'

export function usePrintBillUsb() {
    const toast = useToastNotification()
    const shiftStore = usePosShiftStore()
    const isPrinting = ref(false)

    async function printBillUsb(orderId: number): Promise<void> {
        isPrinting.value = true
        try {
            await usbPrinterService.ensureConnected()

            const order = await posService.getOrderByIdAsync(orderId)
            if (!order) {
                toast.error('Không tải được chi tiết đơn hàng.')
                return
            }

            const canvas = buildBillCanvas(order, {
                name: shiftStore.storeName,
                address: shiftStore.address,
                hotline: shiftStore.hotline,
            })

            const data = new ReceiptPrinterEncoder({ language: 'esc-pos' })
                .initialize()
                .image(canvas, canvas.width, canvas.height, 'threshold')
                .cut()
                .encode()

            await usbPrinterService.print(data)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'In bill qua USB thất bại.')
        } finally {
            isPrinting.value = false
        }
    }

    return { isPrinting, printBillUsb }
}
