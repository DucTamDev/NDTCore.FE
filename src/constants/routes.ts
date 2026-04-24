export const APP_ROUTES = {
  HOME: { NAME: 'home', PATH: '/' },
  AUTH: {
    LOGIN: { NAME: 'auth:login', PATH: '/auth/login' },
    REGISTER: { NAME: 'auth:register', PATH: '/auth/register' },
  },
  DASHBOARD: {
    HOME: { NAME: 'dashboard:home', PATH: '/admin' },
  },
  USERS: {
    LIST: { NAME: 'users:list', PATH: '/admin/users' },
  },
  NOT_FOUND: { NAME: 'not-found', PATH: '/:pathMatch(.*)*' },
} as const
