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

export type HttpHeaderKey = typeof HTTP_HEADER[keyof typeof HTTP_HEADER]