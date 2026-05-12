import { useToastNotification } from '@/composables/useToastNotification'
import { brandService } from '@/modules/brand/services/brand.service'
import type {
  BrandFilterDto,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '@/modules/brand/models/dtos/_index'

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

  async function deleteBrand(id: number) {
    try {
      await brandService.deleteBrandAsync(id)
      toast.success('Xóa thương hiệu thành công.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Xóa thương hiệu thất bại.')
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

  return {
    getPagedBrands,
    getBrand,
    createBrand,
    updateBrand,
    deleteBrand,
    removeUserFromBrand,
  }
}
