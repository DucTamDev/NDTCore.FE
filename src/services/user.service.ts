import type { User } from '@/models/auth.models'

const mockUsers: User[] = [
  {
    id: 'u-1',
    name: 'Admin User',
    email: 'admin@ndtcore.local',
    role: 'admin',
    permissions: [
      { resource: 'dashboard', action: 'read' },
      { resource: 'users', action: 'manage' },
    ],
  },
  {
    id: 'u-2',
    name: 'Operations Lead',
    email: 'ops@ndtcore.local',
    role: 'manager',
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
