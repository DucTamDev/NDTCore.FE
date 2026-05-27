import { BaseClient } from './base.client'

const ENV_STORE_API_URL = import.meta.env.VITE_STORE_BASE_URL as string | undefined
if (!ENV_STORE_API_URL) throw new Error('[StoreClient] VITE_STORE_BASE_URL is not defined')

export class StoreClient extends BaseClient {
    constructor() {
        super({
            baseURL: ENV_STORE_API_URL,
        })
    }
}

export const storeClient = new StoreClient()
