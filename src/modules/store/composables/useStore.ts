import { useToastNotification } from '@/composables/useToastNotification'
import { storeService } from '@/modules/store/services/store.service'
import type { StoreFilterDto } from '@/modules/store/models/dtos/store-filter.dto'
import type { CreateStoreRequest } from '@/modules/store/models/dtos/create-store.dto'
import type { UpdateStoreRequest } from '@/modules/store/models/dtos/update-store.dto'

export function useStore() {
    const toast = useToastNotification()

    async function getPagedStores(filter: StoreFilterDto) {
        try {
            return await storeService.getPagedStoresAsync(filter)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách cửa hàng.')
            throw error
        }
    }

    async function getStore(id: number) {
        try {
            return await storeService.getStoreAsync(id)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải chi tiết cửa hàng.')
            throw error
        }
    }

    async function createStore(payload: CreateStoreRequest) {
        try {
            const store = await storeService.createStoreAsync(payload)
            toast.success('Tạo cửa hàng thành công.')
            return store
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Tạo cửa hàng thất bại.')
            throw error
        }
    }

    async function updateStore(id: number, payload: UpdateStoreRequest) {
        try {
            const store = await storeService.updateStoreAsync(id, payload)
            toast.success('Cập nhật cửa hàng thành công.')
            return store
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Cập nhật cửa hàng thất bại.')
            throw error
        }
    }

    async function deleteStore(id: number) {
        try {
            await storeService.deleteStoreAsync(id)
            toast.success('Xóa cửa hàng thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xóa cửa hàng thất bại.')
            throw error
        }
    }

    return { getPagedStores, getStore, createStore, updateStore, deleteStore }
}
