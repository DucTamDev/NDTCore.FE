import { BaseClient } from './base.client'

const ENV_ORDER_API_URL = import.meta.env.VITE_ORDER_BASE_URL as string | undefined
if (!ENV_ORDER_API_URL) throw new Error('[OrderClient] VITE_ORDER_BASE_URL is not defined')

export class OrderClient extends BaseClient {
    constructor() {
        super({
            baseURL: ENV_ORDER_API_URL,
        })
    }
}

export const orderClient = new OrderClient()
