import axios from 'axios'

import type { ApiResponse } from '@/core/api/dtos/common.dtos'
import type { AuthTokenModel } from '@/core/models/auth.model'

import { tokenStorageService } from '@/core/storage/token-storage.service'
import { HTTP_HEADER } from '@/core/constants/http.constants'
import { CLIENT_ID, CLIENT_TYPE } from '@/core/constants/client-type.constants'
import { API_ENDPOINTS } from '@/core/constants/api.constants'
import { createLogger } from '@/core/logger/logger'

// ─── Env ──────────────────────────────────────────────────────────────────────

const ENV_IDENTITY_BASE_URL = import.meta.env.VITE_IDENTITY_BASE_URL as string | undefined

if (!ENV_IDENTITY_BASE_URL) {
    throw new Error('[refreshTokenApi] VITE_IDENTITY_API_URL is not defined')
}

const IDENTITY_BASE_URL = ENV_IDENTITY_BASE_URL

interface RefreshTokenResponse {
    AccessToken?: string | null
    RefreshToken?: string | null
    AccessTokenExpiration?: string | null
    RefreshTokenExpiration?: string | null
}

// ─── Constants ────────────────────────────────────────────────────────────────

const log = createLogger('refreshTokenApi')

const http = axios.create({
    baseURL: IDENTITY_BASE_URL,
    timeout: 15_000,
    headers: Object.freeze({
        [HTTP_HEADER.CONTENT_TYPE]: 'application/json',
        [HTTP_HEADER.ACCEPT]: 'application/json',
        [HTTP_HEADER.CLIENT_TYPE]: CLIENT_TYPE.WEB,
        [HTTP_HEADER.CLIENT_ID]: CLIENT_ID.WEB_APP,
    }),
})

// ─── Core function ────────────────────────────────────────────────────────────

async function refreshToken(): Promise<string> {
    const accessToken = tokenStorageService.getAccessToken()
    if (!accessToken) {
        throw new Error('[refreshTokenApi] Missing access token')
    }

    const refreshToken = tokenStorageService.getRefreshToken()
    if (!refreshToken) {
        throw new Error('[refreshTokenApi] Missing refresh token')
    }

    const { data } = await http.post<ApiResponse<RefreshTokenResponse>>(
        API_ENDPOINTS.IDENTITY.AUTH_API.REFRESH,
        {
            AccessToken: accessToken,
            RefreshToken: refreshToken,
        },
    )

    const d = data.Data

    if (
        !d?.AccessToken ||
        !d?.RefreshToken ||
        d.AccessTokenExpiration == null ||
        d.RefreshTokenExpiration == null
    ) {
        throw new Error('[refreshTokenApi] Invalid refresh response')
    }

    const token: AuthTokenModel = {
        accessToken: d.AccessToken,
        refreshToken: d.RefreshToken,
        accessTokenExpiration: d.AccessTokenExpiration,
        refreshTokenExpiration: d.RefreshTokenExpiration,
    }

    tokenStorageService.save(token)
    log.info('[refreshTokenApi] Token refreshed')

    return token.accessToken
}

// ─── Export functional API ────────────────────────────────────────────────────

export const refreshTokenApi = {
    refreshToken,
}
