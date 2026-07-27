import { storageService } from '@/core/storage/storage.service'
import { STORAGE_KEYS } from '@/core/storage/storage.constant'

interface StoredUsbPrinterDevice {
    serialNumber: string | null
    vendorId: number
    productId: number
}

const CHUNK_SIZE = 4096

let connectedDevice: USBDevice | null = null
let outEndpointNumber: number | null = null

function findBulkOutEndpoint(device: USBDevice): { interfaceNumber: number; endpointNumber: number } | null {
    const configuration = device.configuration
    if (!configuration) return null

    for (const iface of configuration.interfaces) {
        const outEndpoint = iface.alternate.endpoints.find((e) => e.direction === 'out')
        if (outEndpoint) {
            return { interfaceNumber: iface.interfaceNumber, endpointNumber: outEndpoint.endpointNumber }
        }
    }
    return null
}

async function openDevice(device: USBDevice): Promise<void> {
    await device.open()

    if (!device.configuration) {
        const configurationValue = device.configurations[0]?.configurationValue
        if (configurationValue === undefined) {
            throw new Error('Thiết bị USB không có configuration khả dụng.')
        }
        await device.selectConfiguration(configurationValue)
    }

    const found = findBulkOutEndpoint(device)
    if (!found) {
        throw new Error('Không tìm thấy cổng gửi dữ liệu (OUT endpoint) trên thiết bị USB này.')
    }
    await device.claimInterface(found.interfaceNumber)

    connectedDevice = device
    outEndpointNumber = found.endpointNumber

    storageService.set<StoredUsbPrinterDevice>(STORAGE_KEYS.POS_USB_PRINTER_DEVICE, {
        serialNumber: device.serialNumber,
        vendorId: device.vendorId,
        productId: device.productId,
    })
}

async function tryReconnect(): Promise<boolean> {
    const saved = storageService.get<StoredUsbPrinterDevice>(STORAGE_KEYS.POS_USB_PRINTER_DEVICE)
    if (!saved) return false

    const devices = await navigator.usb.getDevices()
    const match =
        (saved.serialNumber && devices.find((d) => d.serialNumber === saved.serialNumber)) ||
        devices.find((d) => d.vendorId === saved.vendorId && d.productId === saved.productId)

    if (!match) return false

    await openDevice(match)
    return true
}

export const usbPrinterService = {
    async ensureConnected(): Promise<void> {
        if (connectedDevice) return

        if (!('usb' in navigator)) {
            throw new Error('Trình duyệt không hỗ trợ WebUSB.')
        }

        if (await tryReconnect()) return

        const device = await navigator.usb.requestDevice({ filters: [{}] })
        await openDevice(device)
    },

    async print(data: Uint8Array): Promise<void> {
        if (!connectedDevice || outEndpointNumber === null) {
            throw new Error('Chưa kết nối máy in USB.')
        }

        for (let offset = 0; offset < data.length; offset += CHUNK_SIZE) {
            const chunk = data.slice(offset, offset + CHUNK_SIZE)
            const result = await connectedDevice.transferOut(outEndpointNumber, chunk)
            if (result.status !== 'ok') {
                throw new Error(`Gửi lệnh in thất bại: ${result.status}`)
            }
        }
    },
}
