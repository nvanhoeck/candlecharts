import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog"
import {TradingSignal} from '../app/types'

interface TradingSignalPopupProps {
    isOpen: boolean
    onClose: () => void
    signal: TradingSignal | null
}

export default function TradingSignalPopup({ isOpen, onClose, signal }: TradingSignalPopupProps) {
    if (!signal) return null

    const signalType = signal.BUY ? 'BUY' : 'SELL'
    const signalData = signal.BUY || signal.SELL

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className={`text-xl font-bold ${signalType === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                        {signalType} Signal Details
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Candlestick Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">Candlestick Data</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">

                            <div><span className="font-medium">Open Time:</span> {typeof signalData!.candlestick.openTime}</div>
                            <div><span className="font-medium">Open Time:</span> {new Date(signalData!.candlestick.openTime).toLocaleString()}</div>
                            <div><span className="font-medium">Close Time:</span> {new Date(signalData!.candlestick.closeTime).toLocaleString()}</div>
                            <div><span className="font-medium">Open:</span> {signalData!.candlestick.open}</div>
                            <div><span className="font-medium">High:</span> {signalData!.candlestick.high}</div>
                            <div><span className="font-medium">Low:</span> {signalData!.candlestick.low}</div>
                            <div><span className="font-medium">Close:</span> {signalData!.candlestick.close}</div>
                            <div><span className="font-medium">Volume:</span> {signalData!.candlestick.volume}</div>
                            <div><span className="font-medium">Trades:</span> {signalData!.candlestick.trades}</div>
                        </div>
                    </div>

                    {/* State Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-3">State Information</h3>
                        <div className="space-y-4">
                            {Object.entries(signalData!.state).map(([timeframe, stateData]) => (
                                <div key={timeframe} className="border-l-4 border-blue-500 pl-4">
                                    <h4 className="font-medium text-base mb-2 text-blue-700">{timeframe} Timeframe</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        {Object.entries(stateData).map(([key, value]) => (
                                            <div key={key} className="flex justify-between">
                                                <span className="font-medium text-gray-600">{key}:</span>
                                                <span className={`font-mono ${
                                                    typeof value === 'boolean'
                                                        ? value ? 'text-green-600' : 'text-red-600'
                                                        : 'text-gray-800'
                                                }`}>
                          {String(value)}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
