import { useToastNotification } from '@/composables/useToastNotification'
import { storeMemberService } from '@/modules/store/services/store-member.service'
import type { AssignStoreMembersRequest } from '@/modules/store/models/dtos/store-member.dto'

export function useStoreMember() {
    const toast = useToastNotification()

    async function getStoreMembers(storeId: number) {
        try {
            return await storeMemberService.getByStoreAsync(storeId)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách thành viên.')
            throw error
        }
    }

    async function assignStoreMembers(storeId: number, payload: AssignStoreMembersRequest) {
        try {
            await storeMemberService.assignAsync(storeId, payload)
            toast.success('Gán thành viên thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gán thành viên thất bại.')
            throw error
        }
    }

    async function removeStoreMember(storeId: number, userId: string) {
        try {
            await storeMemberService.removeAsync(storeId, userId)
            toast.success('Xóa thành viên thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xóa thành viên thất bại.')
            throw error
        }
    }

    return { getStoreMembers, assignStoreMembers, removeStoreMember }
}
