"use client"

import {Bar, BarChart, Cell, ReferenceDot, Tooltip, XAxis, YAxis} from "recharts"
import type {CandlestickData, TradingSignal} from "@/src/app/types"
import {useCallback, useEffect, useRef, useState} from "react"
import type {CategoricalChartFunc} from "recharts/types/chart/generateCategoricalChart"

type StockData = {
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

// Custom arrow component for signals
const SignalArrow = (props: any) => {
    const { cx, cy, payload } = props

    if (!payload || !payload.hasSignal) return null

    const isBuy = payload.signalType === "BUY"
    const arrowSize = 8

    return (
        <g>
            <circle
                cx={cx}
                cy={cy - 20}
                r={arrowSize}
                fill={isBuy ? "#22c55e" : "#ef4444"}
                stroke="white"
                strokeWidth="2"
                style={{ cursor: "pointer" }}
            />
            {isBuy ? (
                <polygon points={`${cx - 4},${cy - 18} ${cx + 4},${cy - 18} ${cx},${cy - 24}`} fill="white" />
            ) : (
                <polygon points={`${cx - 4},${cy - 22} ${cx + 4},${cy - 22} ${cx},${cy - 16}`} fill="white" />
            )}
        </g>
    )
}

export const CandlestickChart = (props: {
    data: CandlestickData[]
    selectedTimestamp: number | null
    selectTimestamp: (timestamp: number) => void
    tradingSignals: TradingSignal[]
    onSignalClick: (signal: TradingSignal) => void
}) => {
    const data: StockData[] = props.data.map((stock) => {
        // Find if there's a trading signal for this timestamp
        const signal = props.tradingSignals.find((signal) => {
            const signalData = signal.BUY || signal.SELL
            return signalData?.candlestick.closeTime === stock.closeTime
        })

        const high = Number.parseFloat(stock.high)
        const signalPrice = signal ? high + high * 0.02 : undefined

        return {
            time: new Date(stock.closeTime).toLocaleString(),
            timestamp: stock.closeTime,
            open: stock.open,
            close: stock.close,
            openClose: [stock.open, stock.close],
            high: stock.high,
            low: stock.low,
            highLow: [stock.high, stock.low],
            signalType: signal ? (signal.BUY ? "BUY" : "SELL") : undefined,
            hasSignal: !!signal,
            signalPrice: signalPrice,
        }
    })

    const chartContainerRef = useRef<HTMLDivElement>(null)
    const [chartWidth, setChartWidth] = useState<number>(0)

    useEffect(() => {
        const handleResize = () => {
            if (chartContainerRef.current) {
                setChartWidth(chartContainerRef.current.offsetWidth)
            }
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    const selectBar: CategoricalChartFunc = useCallback(
        (e) => {
            const timestamp = e.activePayload![0].payload.timestamp

            // Check if this candlestick has a trading signal
            const signal = props.tradingSignals.find((signal) => {
                const signalData = signal.BUY || signal.SELL
                return signalData?.candlestick.closeTime === timestamp
            })

            if (signal) {
                props.onSignalClick(signal)
            } else {
                props.selectTimestamp(timestamp)
            }
        },
        [props.tradingSignals, props.onSignalClick, props.selectTimestamp],
    )

    return (
        <div ref={chartContainerRef} style={{ width: "100%", overflowX: "auto" }}>
            <BarChart
                onClick={selectBar}
                width={chartWidth}
                height={600}
                data={data}
                barGap={data.length > 125 ? -1.5 : -5}
                margin={{ top: 40, right: 20, bottom: 20, left: 20 }}
            >
                <XAxis dataKey="time" />
                <YAxis type="number" domain={["dataMin", "dataMax"]} />
                <Tooltip />

                {/* Main candlestick bars */}
                <Bar dataKey="openClose">
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.open < entry.close ? "green" : "red"}
                            stroke={
                                props.selectedTimestamp && entry.timestamp === props.selectedTimestamp
                                    ? "#ff00ff"
                                    : entry.hasSignal
                                        ? entry.signalType === "BUY"
                                            ? "#22c55e"
                                            : "#ef4444"
                                        : ""
                            }
                            strokeWidth={entry.hasSignal ? 3 : 1}
                        />
                    ))}
                </Bar>

                {/* High-low wicks */}
                <Bar dataKey="highLow">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} width={1} fill={entry.open < entry.close ? "green" : "red"} />
                    ))}
                </Bar>

                {/* Signal arrows using ReferenceDot */}
                {data.map((entry, index) => {
                    if (!entry.hasSignal || !entry.signalPrice) return null

                    return (
                        <ReferenceDot
                            key={`signal-${index}`}
                            x={entry.time}
                            y={entry.signalPrice}
                            shape={(props: any) => <SignalArrow {...props} payload={entry} />}
                            onClick={() => {
                                const signal = props.tradingSignals.find((signal) => {
                                    const signalData = signal.BUY || signal.SELL
                                    return signalData?.candlestick.closeTime === entry.timestamp
                                })
                                if (signal) props.onSignalClick(signal)
                            }}
                        />
                    )
                })}
            </BarChart>
        </div>
    )
}
