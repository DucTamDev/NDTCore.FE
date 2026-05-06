import { brandService } from '@/services/brand.service'
import { useToastNotification } from './useToastNotification'
import type {
    AssignUsersToBrandRequest,
    BrandFilterDto,
    CreateBrandRequest,
    UpdateBrandRequest,
} from '@/core/api/dtos/brand.dtos'

export function useBrand() {
    const toast = useToastNotification()

    async function getPagedBrands(filter: BrandFilterDto) {
        try {
            return await brandService.getPagedBrandsAsync(filter)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách thương hiệu.')
            throw error
        }
    }

    async function getBrand(id: number) {
        try {
            return await brandService.getBrandAsync(id)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải chi tiết thương hiệu.')
            throw error
        }
    }

    async function createBrand(payload: CreateBrandRequest) {
        try {
            const brand = await brandService.createBrandAsync(payload)
            toast.success('Tạo thương hiệu thành công.')
            return brand
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Tạo thương hiệu thất bại.')
            throw error
        }
    }

    async function updateBrand(id: number, payload: UpdateBrandRequest) {
        try {
            const brand = await brandService.updateBrandAsync(id, payload)
            toast.success('Cập nhật thương hiệu thành công.')
            return brand
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Cập nhật thương hiệu thất bại.')
            throw error
        }
    }

    async function updateBrandStatus(id: number, isActive: boolean) {
        try {
            const brand = await brandService.updateBrandStatusAsync(id, isActive)
            toast.success('Cập nhật trạng thái thương hiệu thành công.')
            return brand
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Cập nhật trạng thái thất bại.')
            throw error
        }
    }

    async function getBrandMembers(id: number) {
        try {
            return await brandService.getBrandMembersAsync(id)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải thành viên thương hiệu.')
            throw error
        }
    }

    async function assignUsersToBrand(id: number, payload: AssignUsersToBrandRequest) {
        try {
            await brandService.assignUsersToBrandAsync(id, payload)
            toast.success('Gán người dùng vào thương hiệu thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gán người dùng thất bại.')
            throw error
        }
    }

    async function removeUserFromBrand(id: number, userId: string) {
        try {
            await brandService.removeUserFromBrandAsync(id, userId)
            toast.success('Xóa người dùng khỏi thương hiệu thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xóa người dùng thất bại.')
            throw error
        }
    }

    async function deleteBrand(id: number) {
        try {
            await brandService.deleteBrandAsync(id)
            toast.success('Xóa thương hiệu thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xóa thương hiệu thất bại.')
            throw error
        }
    }

    return {
        getPagedBrands,
        getBrand,
        createBrand,
        updateBrand,
        updateBrandStatus,
        getBrandMembers,
        assignUsersToBrand,
        removeUserFromBrand,
        deleteBrand,
    }
}
