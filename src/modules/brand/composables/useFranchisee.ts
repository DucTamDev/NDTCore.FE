import { useToastNotification } from '@/composables/useToastNotification'
import { franchiseeService } from '@/modules/brand/services/franchisee.service'
import type {
    FranchiseeFilterDto,
    CreateFranchiseeRequest,
    UpdateFranchiseeRequest,
} from '@/modules/brand/models/dtos/_index'

export function useFranchisee() {
    const toast = useToastNotification()

    async function getPagedFranchisees(filter: FranchiseeFilterDto) {
        try {
            return await franchiseeService.getPagedFranchiseesAsync(filter)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách nhà nhượng quyền.')
            throw error
        }
    }

    async function getFranchisee(id: number) {
        try {
            return await franchiseeService.getFranchiseeAsync(id)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải chi tiết nhà nhượng quyền.')
            throw error
        }
    }

    async function createFranchisee(payload: CreateFranchiseeRequest) {
        try {
            const item = await franchiseeService.createFranchiseeAsync(payload)
            toast.success('Tạo nhà nhượng quyền thành công.')
            return item
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Tạo nhà nhượng quyền thất bại.')
            throw error
        }
    }

    async function updateFranchisee(id: number, payload: UpdateFranchiseeRequest) {
        try {
            const item = await franchiseeService.updateFranchiseeAsync(id, payload)
            toast.success('Cập nhật nhà nhượng quyền thành công.')
            return item
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Cập nhật nhà nhượng quyền thất bại.')
            throw error
        }
    }

    async function deleteFranchisee(id: number) {
        try {
            await franchiseeService.deleteFranchiseeAsync(id)
            toast.success('Xóa nhà nhượng quyền thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xóa nhà nhượng quyền thất bại.')
            throw error
        }
    }

    return {
        getPagedFranchisees,
        getFranchisee,
        createFranchisee,
        updateFranchisee,
        deleteFranchisee,
    }
}
