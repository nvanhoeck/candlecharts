import { TooltipProps } from 'recharts'
import { CandlestickData } from '../app/types'

export default function CustomTooltip({ active, payload }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const data = payload[0].payload as CandlestickData

    return (
      <div className="bg-white p-4 rounded shadow-md">
        <p className="font-bold">Open Time: {new Date(data.openTime).toLocaleString()}</p>
        <p className="font-bold">Close Time: {new Date(data.closeTime).toLocaleString()}</p>
        <p>Open: {data.open}</p>
        <p>High: {data.high}</p>
        <p>Low: {data.low}</p>
        <p>Close: {data.close}</p>
        <p>Volume: {data.volume}</p>
        <p>Quote Volume: {data.quoteVolume}</p>
        <p>Trades: {data.trades}</p>
        <p>Base Asset Volume: {data.baseAssetVolume}</p>
        <p>Quote Asset Volume: {data.quoteAssetVolume}</p>
      </div>
    )
  }

  return null
}

