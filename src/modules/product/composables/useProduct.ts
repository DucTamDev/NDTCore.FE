import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProductStore } from '../stores/product.store'
import { productService } from '../services/product.service'
import { useToastNotification } from '@/composables/useToastNotification'
import type { ProductFilterDto, CreateProductRequest, UpdateProductRequest } from '../models/dtos/product.dto'
import type { ProductViewModel } from '../models/view-models/product.view-model'

export function useProduct() {
    const store = useProductStore()
    const { items, total, isLoading } = storeToRefs(store)
    const toast = useToastNotification()
    const isSubmitting = ref(false)

    async function loadProducts(filter: ProductFilterDto) {
        await store.fetchPaged(filter)
    }

    async function createProduct(payload: CreateProductRequest): Promise<ProductViewModel | null> {
        isSubmitting.value = true
        try {
            const result = await productService.createAsync(payload)
            if (result) toast.success('Tạo sản phẩm thành công.')
            return result
        } catch {
            toast.error('Tạo sản phẩm thất bại.')
            return null
        } finally {
            isSubmitting.value = false
        }
    }

    async function updateProduct(id: number, payload: UpdateProductRequest): Promise<boolean> {
        isSubmitting.value = true
        try {
            const result = await productService.updateAsync(id, payload)
            if (result) {
                toast.success('Cập nhật sản phẩm thành công.')
                return true
            }
            return false
        } catch {
            toast.error('Cập nhật sản phẩm thất bại.')
            return false
        } finally {
            isSubmitting.value = false
        }
    }

    async function deleteProduct(id: number): Promise<boolean> {
        try {
            await productService.deleteAsync(id)
            toast.success('Xóa sản phẩm thành công.')
            return true
        } catch {
            toast.error('Xóa sản phẩm thất bại.')
            return false
        }
    }

    return {
        items,
        total,
        isLoading,
        isSubmitting,
        loadProducts,
        createProduct,
        updateProduct,
        deleteProduct,
    }
}
