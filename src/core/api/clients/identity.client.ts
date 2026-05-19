import { BaseClient } from './base.client'

const IDENTITY_BASE_URL = import.meta.env.VITE_IDENTITY_BASE_URL
if (!IDENTITY_BASE_URL) {
    throw new Error('[IdentityClient] VITE_IDENTITY_API_URL is not defined')
}

class IdentityClient extends BaseClient {
    constructor() {
        super({
            baseURL: IDENTITY_BASE_URL,
        })
    }
}

export const identityClient = new IdentityClient()
