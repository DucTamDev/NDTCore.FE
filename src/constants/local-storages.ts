export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth.access_token',
  REFRESH_TOKEN: 'auth.refresh_token',
  TOKEN_EXPIRY: 'auth.token_expiry',
  TOKEN_TYPE: 'auth.token_type',
  USER_INFO: 'auth.user_info',
  USER_PERMISSIONS: 'auth.user_permissions',
  USER_ROLES: 'auth.user_roles',
  SESSION_ID: 'auth.session_id',
  SESSION_EXPIRY: 'auth.session_expiry',
  LAST_ACTIVITY: 'auth.last_activity',
  TENANT_ID: 'ctx.tenant_id',
  TENANT_CONFIG: 'ctx.tenant_config',
  CORRELATION_ID: 'ctx.correlation_id',
  APP_CONFIG: 'config.app',
  APP_VERSION: 'config.version',
  ENV_OVERRIDE: 'config.env_override',
  LOG_LEVEL: 'logger.level',
} as const

export type LocalStorageKey = (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS]

export const LOCAL_STORAGE_GROUPS = {
  AUTH: [
    LOCAL_STORAGE_KEYS.ACCESS_TOKEN,
    LOCAL_STORAGE_KEYS.REFRESH_TOKEN,
    LOCAL_STORAGE_KEYS.TOKEN_EXPIRY,
    LOCAL_STORAGE_KEYS.TOKEN_TYPE,
    LOCAL_STORAGE_KEYS.USER_INFO,
    LOCAL_STORAGE_KEYS.USER_PERMISSIONS,
    LOCAL_STORAGE_KEYS.USER_ROLES,
    LOCAL_STORAGE_KEYS.SESSION_ID,
    LOCAL_STORAGE_KEYS.SESSION_EXPIRY,
    LOCAL_STORAGE_KEYS.LAST_ACTIVITY,
  ],
  CONTEXT: [
    LOCAL_STORAGE_KEYS.TENANT_ID,
    LOCAL_STORAGE_KEYS.TENANT_CONFIG,
    LOCAL_STORAGE_KEYS.CORRELATION_ID,
  ],
  CONFIG: [
    LOCAL_STORAGE_KEYS.APP_CONFIG,
    LOCAL_STORAGE_KEYS.APP_VERSION,
    LOCAL_STORAGE_KEYS.ENV_OVERRIDE,
  ],
} as const satisfies Record<string, LocalStorageKey[]>
