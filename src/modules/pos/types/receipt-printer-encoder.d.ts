declare module '@point-of-sale/receipt-printer-encoder' {
    export interface ReceiptPrinterEncoderOptions {
        language?: 'esc-pos' | 'star-prnt' | 'star-line'
    }

    export default class ReceiptPrinterEncoder {
        constructor(options?: ReceiptPrinterEncoderOptions)
        initialize(): this
        image(
            input: HTMLCanvasElement,
            width: number,
            height: number,
            algorithm?: 'threshold' | 'bayer' | 'floydsteinberg' | 'atkinson',
            threshold?: number,
        ): this
        cut(value?: 'partial' | 'full'): this
        encode(format?: 'commands' | 'lines' | 'array'): Uint8Array
    }
}
