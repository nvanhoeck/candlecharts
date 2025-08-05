"use client"

import {Bar, BarChart, Cell, ReferenceDot, ReferenceLine, Tooltip, XAxis, YAxis} from "recharts"
import type {
    CandlestickData,
    EnhancedTooltipData,
    SupportResistanceLevel,
    TradingSignal,
    ZoneTrend,
} from "@/src/app/types"
import {useCallback, useEffect, useRef, useState} from "react"
import type {CategoricalChartFunc} from "recharts/types/chart/generateCategoricalChart"
import CustomTooltip from "./CustomTooltip"

type StockData = {
    time: string
    timestamp: number
    open: string
    close: string
    openClose: [string, string]
    high: string
    low: string
    highLow: [string, string]
    signalType?: "BUY" | "SELL" // For trading signals
    hasSignal?: boolean
    signalPrice?: number // Position for trading signal arrow
    trendDirection?: "UP" | "DOWN" // For zone trends
    hasTrend?: boolean
    trendPrice?: number // Position for trend arrow
}

// Custom arrow component for signals and trends
const ArrowShape = (props: any) => {
    const { cx, cy, payload } = props

    // Determine if it's a trading signal or a trend
    const isTradingSignal = payload.hasSignal && payload.signalType
    const isTrend = payload.hasTrend && payload.trendDirection

    if (!isTradingSignal && !isTrend) return null

    let color = ""
    let direction = ""
    let offset = 0 // Vertical offset for the arrow

    if (isTradingSignal) {
        color = payload.signalType === "BUY" ? "#22c55e" : "#ef4444"
        direction = payload.signalType === "BUY" ? "UP" : "DOWN"
        offset = direction === "UP" ? -20 : 20 // Above for BUY, below for SELL
    } else if (isTrend) {
        color = payload.trendDirection === "UP" ? "#22c55e" : "#ef4444"
        direction = payload.trendDirection === "UP" ? "UP" : "DOWN"
        offset = direction === "UP" ? -20 : 20 // Above for UP trend, below for DOWN trend
    }

    const arrowSize = 8

    return (
        <g>
            <circle
                cx={cx}
                cy={cy + offset}
                r={arrowSize}
                fill={color}
                stroke="white"
                strokeWidth="2"
                style={{ cursor: "pointer" }}
            />
            {direction === "UP" ? (
                <polygon
                    points={`${cx - 4},${cy + offset + 2} ${cx + 4},${cy + offset + 2} ${cx},${cy + offset - 4}`}
                    fill="white"
                />
            ) : (
                <polygon
                    points={`${cx - 4},${cy + offset - 2} ${cx + 4},${cy + offset - 2} ${cx},${cy + offset + 4}`}
                    fill="white"
                />
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
    enhancedTooltipData?: EnhancedTooltipData
    showEnhancedTooltip?: boolean
    supportResistanceLevels?: SupportResistanceLevel[]
    zoneTrends?: ZoneTrend[]
    onZoneTrendClick: (trend: ZoneTrend) => void
}) => {
    const data: StockData[] = props.data.map((stock, index) => {
        // Find if there's a trading signal for this timestamp
        const signal = props.tradingSignals.find((s) => s.candlestick.closeTime === stock.closeTime)

        // Find if there's a zone trend for this timestamp
        const trend = props.zoneTrends?.find((t) => t.timestampOfSwing === stock.closeTime)

        const high = Number.parseFloat(stock.high)
        const low = Number.parseFloat(stock.low)

        // Calculate arrow positions
        const signalPrice = signal ? high + high * 0.02 : undefined // Above candle for signals
        const trendPrice = trend
            ? trend.direction === "UP"
                ? high + high * 0.02 // Above candle for UP trend
                : low - low * 0.02 // Below candle for DOWN trend
            : undefined

        return {
            time: new Date(stock.closeTime).toLocaleString() + `(${index})`,
            timestamp: stock.closeTime,
            open: stock.open,
            close: stock.close,
            openClose: [stock.open, stock.close],
            high: stock.high,
            low: stock.low,
            highLow: [stock.high, stock.low],
            signalType: signal ? signal.action : undefined,
            hasSignal: !!signal,
            signalPrice: signalPrice,
            trendDirection: trend ? trend.direction : undefined,
            hasTrend: !!trend,
            trendPrice: trendPrice,
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

            // Prioritize trading signal click
            const signal = props.tradingSignals.find((s) => s.candlestick.closeTime === timestamp)
            if (signal) {
                props.onSignalClick(signal)
                return
            }

            // Then check for zone trend click
            const trend = props.zoneTrends?.find((t) => t.timestampOfSwing === timestamp)
            if (trend) {
                props.onZoneTrendClick(trend)
                return
            }

            // Default to selecting timestamp if no signal or trend
            props.selectTimestamp(timestamp)
        },
        [props.tradingSignals, props.onSignalClick, props.zoneTrends, props.onZoneTrendClick, props.selectTimestamp],
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
                <Tooltip
                    content={
                        <CustomTooltip enhancedData={props.enhancedTooltipData} showEnhancedTooltip={props.showEnhancedTooltip} />
                    }
                />

                {/* Support and Resistance Lines */}
                {props.supportResistanceLevels?.map((level, index) => (
                    <ReferenceLine
                        key={`sr-${index}`}
                        y={level.price}
                        stroke={level.type === "support" ? "#22c55e" : "#ef4444"}
                        strokeWidth={Math.max(1, Math.min(level.touches / 4, 8))} // Scale touches to reasonable line width
                        strokeDasharray={level.type === "support" ? "0" : "5 5"} // Solid for support, dashed for resistance
                        label={{
                            value: `${level.type.toUpperCase()}: ${level.price} (${level.touches} touches)`,
                            position: 'insideTopRight',
                            fontSize: 12,
                            fill: level.type === "support" ? "#22c55e" : "#ef4444",
                        }}
                    />
                ))}

                {/* Main candlestick bars */}
                <Bar dataKey="openClose">
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.open < entry.close ? "green" : "red"}
                            stroke={
                                props.selectedTimestamp && entry.timestamp === props.selectedTimestamp
                                    ? "#ff00ff"
                                    : entry.hasSignal || entry.hasTrend
                                        ? entry.signalType === "BUY" || entry.trendDirection === "UP"
                                            ? "#22c55e"
                                            : "#ef4444"
                                        : ""
                            }
                            strokeWidth={entry.hasSignal || entry.hasTrend ? 3 : 1}
                        />
                    ))}
                </Bar>

                {/* High-low wicks */}
                <Bar dataKey="highLow">
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} width={1} fill={entry.open < entry.close ? "green" : "red"} />
                    ))}
                </Bar>

                {/* Trading Signal arrows using ReferenceDot */}
                {data.map((entry, index) => {
                    if (!entry.hasSignal || !entry.signalPrice) return null

                    return (
                        <ReferenceDot
                            key={`signal-${index}`}
                            x={entry.time}
                            y={entry.signalPrice}
                            shape={(props: any) => <ArrowShape {...props} payload={entry} />}
                            onClick={() => {
                                const signal = props.tradingSignals.find((s) => s.candlestick.closeTime === entry.timestamp)
                                if (signal) props.onSignalClick(signal)
                            }}
                        />
                    )
                })}

                {/* Zone Trend arrows using ReferenceDot */}
                {data.map((entry, index) => {
                    if (!entry.hasTrend || !entry.trendPrice) return null

                    return (
                        <ReferenceDot
                            key={`trend-${index}`}
                            x={entry.time}
                            y={entry.trendPrice}
                            shape={(props: any) => <ArrowShape {...props} payload={entry} />}
                            onClick={() => {
                                const trend = props.zoneTrends?.find((t) => t.timestampOfSwing === entry.timestamp)
                                if (trend) props.onZoneTrendClick(trend)
                            }}
                        />
                    )
                })}
            </BarChart>
        </div>
    )
}
