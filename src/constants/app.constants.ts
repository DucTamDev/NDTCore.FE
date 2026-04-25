export const APP_NAME = import.meta.env.VITE_APP_NAME || 'NDTCore'

export const ROUTE_NAMES = {
  HOME: 'home',
  LOGIN: 'auth:login',
  REGISTER: 'auth:register',
  DASHBOARD: 'dashboard:home',
  USERS: 'users:list',
  NOT_FOUND: 'not-found',
} as const

export const ROUTE_PATHS = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/admin',
  USERS: '/admin/users',
  NOT_FOUND: '/:pathMatch(.*)*',
} as const

export const USER_ROLES = {
  ADMIN: 'admin',
  ORG_ADMIN: 'orgadmin',
  SUPER_ADMIN: 'superadmin',
  CASHIER: 'orgcashier',
  USER: 'user',
} as const

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  LIMIT_OPTIONS: [10, 25, 50, 100],
} as const

export const TOAST_CONFIG = {
  TIMEOUT: 3000,
} as const

export const CONFIRM_DIALOG_DEFAULTS = {
  CONFIRM_TEXT: 'Xac nhan',
  CANCEL_TEXT: 'Huy',
  CONFIRM_COLOR: 'error',
} as const
