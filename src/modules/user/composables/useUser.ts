import { useToastNotification } from '@/composables/useToastNotification'
import { userService } from '@/modules/user/services/user.service'
import type { UserFilterDto } from '@/modules/user/models/dtos/user-filter.dto'
import type { CreateUserRequest } from '@/modules/user/models/dtos/create-user.dto'
import type { UpdateUserRequest } from '@/modules/user/models/dtos/update-user.dto'
import type { AssignRolesRequest } from '@/modules/user/models/dtos/assign-roles.dto'

export function useUser() {
    const toast = useToastNotification()

    async function getPagedUsers(filter: UserFilterDto) {
        try {
            return await userService.getPagedUsersAsync(filter)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải danh sách người dùng.')
            throw error
        }
    }

    async function getUser(id: string) {
        try {
            return await userService.getUserAsync(id)
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Không thể tải chi tiết người dùng.')
            throw error
        }
    }

    async function createUser(payload: CreateUserRequest) {
        try {
            const user = await userService.createUserAsync(payload)
            toast.success('Tạo người dùng thành công.')
            return user
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Tạo người dùng thất bại.')
            throw error
        }
    }

    async function updateUser(id: string, payload: UpdateUserRequest) {
        try {
            await userService.updateUserAsync(id, payload)
            toast.success('Cập nhật người dùng thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Cập nhật người dùng thất bại.')
            throw error
        }
    }

    async function deleteUser(id: string) {
        try {
            await userService.deleteUserAsync(id)
            toast.success('Xóa người dùng thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Xóa người dùng thất bại.')
            throw error
        }
    }

    async function assignRoles(id: string, payload: AssignRolesRequest) {
        try {
            await userService.assignRolesAsync(id, payload)
            toast.success('Gán role thành công.')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Gán role thất bại.')
            throw error
        }
    }

    return { getPagedUsers, getUser, createUser, updateUser, deleteUser, assignRoles }
}
