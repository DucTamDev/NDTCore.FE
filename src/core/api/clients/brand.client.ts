import { BaseClient } from './base.client'

const ENV_BRAND_API_URL = import.meta.env.VITE_BRAND_BASE_URL as string | undefined
if (!ENV_BRAND_API_URL) throw new Error('[BrandClient] VITE_BRAND_API_URL is not defined')

export class BrandClient extends BaseClient {
    constructor() {
        super({
            baseURL: ENV_BRAND_API_URL,
        })
    }
}

export const brandClient = new BrandClient()
