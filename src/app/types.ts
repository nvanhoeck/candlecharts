export interface CandlestickData {
    openTime: number
    open: string
    high: string
    low: string
    close: string
    volume: string
    closeTime: number
    quoteVolume: string
    trades: number
    baseAssetVolume: string
    quoteAssetVolume: string
}


export interface TradingSignal {
    state: {
        [timeframe: string]: {
            [key: string]: any
        }
    }
    action: "BUY" | "SELL"
    candlestick: {
        openTime: number
        open: string
        high: string
        low: string
        close: string
        volume: string
        closeTime: number
        quoteVolume: string
        trades: number
        baseAssetVolume: string
        quoteAssetVolume: string
    }
}

export interface SupportResistanceLevel {
    type: "support" | "resistance"
    price: number
    touches: number
}


export interface EnhancedTooltipData {
    [closeTime: string]: {
        state: string // JSON string
    }
}

export interface EnhancedCandlestickData {
    openTime: number
    open: string
    high: string
    low: string
    close: string
    volume: string
    closeTime: number
    quoteVolume: string
    trades: number
    baseAssetVolume: string
    quoteAssetVolume: string
    stateData: string
}
