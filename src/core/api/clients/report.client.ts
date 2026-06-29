import { BaseClient } from './base.client'

const ENV_REPORT_API_URL = import.meta.env.VITE_REPORT_BASE_URL as string | undefined
if (!ENV_REPORT_API_URL) throw new Error('[ReportClient] VITE_REPORT_BASE_URL is not defined')

export class ReportClient extends BaseClient {
    constructor() {
        super({
            baseURL: ENV_REPORT_API_URL,
        })
    }
}

export const reportClient = new ReportClient()
