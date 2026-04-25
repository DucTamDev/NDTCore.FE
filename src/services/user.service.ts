import { USER_ROLES } from '@/constants/app.constants'
import type { User } from '@/types/auth.types'

const mockUsers: User[] = [
  {
    id: 'u-1',
    name: 'Admin User',
    email: 'admin@ndtcore.local',
    role: USER_ROLES.ADMIN,
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'users', action: 'manage' },
    ],
  },
  {
    id: 'u-2',
    name: 'Operations Lead',
    email: 'ops@ndtcore.local',
    role: USER_ROLES.USER,
    permissions: [{ resource: 'users', action: 'read' }],
  },
]

class UserService {
  async getUsers(): Promise<User[]> {
    await new Promise((resolve) => window.setTimeout(resolve, 200))
    return [...mockUsers]
  }
}

export const userService = new UserService()
