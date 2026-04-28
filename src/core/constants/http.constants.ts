export const HTTP_HEADER = {
    INTERNAL_API_KEY: 'Internal-Api-Key',
    API_KEY: 'Api-Key',

    TENANT_ID: 'Tenant-Id',

    REQUEST_ID: 'Request-Id',
    CORRELATION_ID: 'Correlation-Id',

    CLIENT_TYPE: 'Client-Type',
    CLIENT_ID: 'Client-Id',

    RATE_LIMIT_REMAINING: 'RateLimit-Remaining',
    RATE_LIMIT_RESET: 'RateLimit-Reset',

    CONTENT_SECURITY_POLICY: 'Content-Security-Policy',
    FRAME_OPTIONS: 'Frame-Options',
    CONTENT_TYPE_OPTIONS: 'Content-Type-Options',
    XSS_PROTECTION: 'XSS-Protection',
    STRICT_TRANSPORT_SECURITY: 'Strict-Transport-Security',

    AUTHORIZATION: 'Authorization',
    CONTENT_TYPE: 'Content-Type',
    ACCEPT: 'Accept',

    ACCEPT_LANGUAGE: 'Accept-Language',
    ACCEPT_ENCODING: 'Accept-Encoding',
    USER_AGENT: 'User-Agent',

    TIMEZONE: 'Timezone',

    TRACEPARENT: 'traceparent',
} as const

export const HTTP_STATUS = {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY: 429,
    SERVER_ERROR: 500,
} as const

export type HttpHeaderKey = (typeof HTTP_HEADER)[keyof typeof HTTP_HEADER]

export const ERROR_CODES = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    NOT_FOUND: 'NOT_FOUND',
    CONFLICT: 'CONFLICT',
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',

    SERVER_ERROR: 'SERVER_ERROR',
    BAD_GATEWAY: 'BAD_GATEWAY',
    SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',

    NETWORK_ERROR: 'NETWORK_ERROR',
    TIMEOUT_ERROR: 'TIMEOUT_ERROR',

    UNKNOWN_ERROR: 'UNKNOWN_ERROR',

    TOKEN_MISSING: 'TOKEN_MISSING',
    TOKEN_INVALID: 'TOKEN_INVALID',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    REFRESH_TOKEN_MISSING: 'REFRESH_TOKEN_MISSING',
    REFRESH_TOKEN_INVALID: 'REFRESH_TOKEN_INVALID',
    REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',
    SESSION_EXPIRED: 'SESSION_EXPIRED',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
