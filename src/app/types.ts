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
    BUY?: {
        state: {
            [timeframe: string]: {
                [key: string]: any;
            };
        };
        candlestick: {
            openTime: number;
            open: string;
            high: string;
            low: string;
            close: string;
            volume: string;
            closeTime: number;
            quoteVolume: string;
            trades: number;
            baseAssetVolume: string;
            quoteAssetVolume: string;
        };
    };
    SELL?: {
        state: {
            [timeframe: string]: {
                [key: string]: any;
            };
        };
        candlestick: {
            openTime: number;
            open: string;
            high: string;
            low: string;
            close: string;
            volume: string;
            closeTime: number;
            quoteVolume: string;
            trades: number;
            baseAssetVolume: string;
            quoteAssetVolume: string;
        };
    };
}


export interface EnhancedTooltipData {
    [closeTime: string]: {
        state: string // JSON string
        decision: {
            BUY: number
            HOLD: number
            SELL: number
            WAIT: number
        }
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
    signalProbabilities: {
        BUY: number
        HOLD: number
        SELL: number
        WAIT: number
    }
}
