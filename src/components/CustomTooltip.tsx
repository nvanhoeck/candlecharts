import type {TooltipProps} from "recharts"
import type {EnhancedTooltipData} from "../app/types"

// Define the actual data structure that the tooltip receives
type TooltipData = {
    time: string
    timestamp: number
    open: string
    close: string
    openClose: [string, string]
    high: string
    low: string
    highLow: [string, string]
    signalType?: "BUY" | "SELL"
    hasSignal?: boolean
    signalPrice?: number
}

interface CustomTooltipProps extends TooltipProps<number, string> {
    enhancedData?: EnhancedTooltipData
    showEnhancedTooltip?: boolean
}

export default function CustomTooltip({ active, payload, enhancedData, showEnhancedTooltip }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        const data = payload[0].payload as TooltipData

        // If enhanced tooltip is enabled and we have enhanced data
        if (showEnhancedTooltip && enhancedData) {
            const enhancedInfo = enhancedData[data.timestamp.toString()]

            if (enhancedInfo) {
                let stateInfo = null
                try {
                    stateInfo = JSON.parse(enhancedInfo.state)
                } catch (e) {
                    console.error("Failed to parse state data:", e)
                }

                return (
                    <div className="bg-white p-4 rounded shadow-md border max-w-md">
                        <div className="mb-3">
                            <p className="font-bold text-lg">Enhanced Data</p>
                            <p className="text-sm text-gray-600">{new Date(data.timestamp).toLocaleString()}</p>
                        </div>

                        {/* Basic Price Data */}
                        <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="font-medium">Open:</span> {data.open}
                            </div>
                            <div>
                                <span className="font-medium">High:</span> {data.high}
                            </div>
                            <div>
                                <span className="font-medium">Low:</span> {data.low}
                            </div>
                            <div>
                                <span className="font-medium">Close:</span> {data.close}
                            </div>
                        </div>

                        {/* State Information */}
                        {stateInfo && (
                            <div className="border-t pt-2">
                                <p className="font-semibold text-sm mb-2">State Information:</p>
                                <div className="space-y-2">
                                    {Object.entries(stateInfo).map(([timeframe, stateData]: [string, any]) => (
                                        <div key={timeframe} className="border-l-2 border-blue-400 pl-2">
                                            <p className="font-medium text-xs text-blue-700 mb-1">{timeframe}</p>
                                            <div className="grid grid-cols-1 gap-1 text-xs">
                                                {Object.entries(stateData)
                                                    .slice(0, 6)
                                                    .map(([key, value]) => (
                                                        <div key={key} className="flex justify-between">
                                                            <span className="text-gray-600 truncate">{key}:</span>
                                                            <span
                                                                className={`font-mono ml-2 ${
                                                                    typeof value === "boolean"
                                                                        ? value
                                                                            ? "text-green-600"
                                                                            : "text-red-600"
                                                                        : "text-gray-800"
                                                                }`}
                                                            >
                                {String(value)}
                              </span>
                                                        </div>
                                                    ))}
                                                {Object.keys(stateData).length > 6 && (
                                                    <div className="text-xs text-gray-500 italic">
                                                        +{Object.keys(stateData).length - 6} more...
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        }

        // Default tooltip (basic price and time data)
        return (
            <div className="bg-white p-4 rounded shadow-md">
                <p className="font-bold">Time: {data.time}</p>
                <p>Open: {data.open}</p>
                <p>High: {data.high}</p>
                <p>Low: {data.low}</p>
                <p>Close: {data.close}</p>
                {data.hasSignal && (
                    <p className={`font-bold ${data.signalType === "BUY" ? "text-green-600" : "text-red-600"}`}>
                        Signal: {data.signalType}
                    </p>
                )}
            </div>
        )
    }

    return null
}
