import { BaseClient } from './base.client'

const ENV_PRODUCT_API_URL = import.meta.env.VITE_PRODUCT_BASE_URL as string | undefined
if (!ENV_PRODUCT_API_URL) throw new Error('[ProductClient] VITE_PRODUCT_BASE_URL is not defined')

export class ProductClient extends BaseClient {
    constructor() {
        super({
            baseURL: ENV_PRODUCT_API_URL,
        })
    }
}

export const productClient = new ProductClient()
