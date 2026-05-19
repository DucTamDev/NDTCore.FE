import { userApi } from '@/modules/user/api/user.api'
import { UserProfileDto } from '@/modules/user/models/dtos/_index'

class UserService {
    async getProfileAsync(): Promise<UserProfileDto | null> {
        const response = await userApi.getProfileAsync()

        return response.Data
    }
}

export const userService = new UserService()
