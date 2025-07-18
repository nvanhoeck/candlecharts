"use client"

import type React from "react"
import {useEffect, useState} from "react"
import {Button} from "../components/ui/button"
import {Switch} from "../components/ui/switch"
import {Info, PlusIcon, TrendingUp} from "lucide-react"
import JsonInputModal from "../components/JsonInputModal"
import TradingSignalModal from "../components/TradingSignalModal"
import TradingSignalPopup from "../components/TradingSignalPopup"
import type {CandlestickData, EnhancedTooltipData, TradingSignal} from "../app/types"
import {CandlestickChart} from "../components/CandlestickChart"
import EnhancedTooltipDataModal from "../components/EnhancedTooltipDataModel";

export default function Home() {
    const [chartData, setChartData] = useState<CandlestickData[]>([])
    const [fullData, setFullData] = useState<CandlestickData[]>([])
    const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([])
    const [enhancedTooltipData, setEnhancedTooltipData] = useState<EnhancedTooltipData>({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSignalModalOpen, setIsSignalModalOpen] = useState(false)
    const [isEnhancedTooltipModalOpen, setIsEnhancedTooltipModalOpen] = useState(false)
    const [isSignalPopupOpen, setIsSignalPopupOpen] = useState(false)
    const [selectedSignal, setSelectedSignal] = useState<TradingSignal | null>(null)
    const [selectedDay, setSelectedDay] = useState<number>(-1)
    const [timestampInput, setTimestampInput] = useState<string>("")
    const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null)
    const [showEnhancedTooltip, setShowEnhancedTooltip] = useState(false)

    const handleJsonSubmit = (data: CandlestickData[]) => {
        setFullData(data)
        setChartData(data)
        setSelectedDay(-1)
        setIsModalOpen(false)
    }

    const handleSignalSubmit = (signals: TradingSignal[]) => {
        setTradingSignals((prev) => [...prev, ...signals])
        setIsSignalModalOpen(false)
    }

    const handleEnhancedTooltipDataSubmit = (data: EnhancedTooltipData) => {
        setEnhancedTooltipData((prev) => ({ ...prev, ...data }))
        setIsEnhancedTooltipModalOpen(false)
    }

    const handleSignalClick = (signal: TradingSignal) => {
        setSelectedSignal(signal)
        setIsSignalPopupOpen(true)
    }

    const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const dayIndex = Number.parseInt(event.target.value)
        setSelectedDay(dayIndex)

        if (dayIndex === -1) {
            setChartData(fullData)
        } else {
            const dataPointsPerDay = Math.min(288, Math.ceil(fullData.length / availableDays))
            const startIndex = fullData.length - dataPointsPerDay * (dayIndex + 1)
            const endIndex = startIndex + dataPointsPerDay
            const dayData = fullData.slice(Math.max(0, startIndex), endIndex)
            setChartData(dayData)
        }
    }

    useEffect(() => {
        if (!!timestampInput) {
            const timestamp = Number.parseInt(timestampInput)
            const matchIndex = fullData.findIndex((d) => d.closeTime === timestamp)

            if (matchIndex !== -1) {
                const startIndex = Math.max(0, matchIndex - 50)
                const endIndex = Math.min(fullData.length, matchIndex + 51)
                const rangeData = fullData.slice(startIndex, endIndex)
                setChartData(rangeData)
                setSelectedTimestamp(timestamp)
            } else {
                alert("Timestamp not found in closed data")
            }
        }
    }, [timestampInput, fullData])

    const availableDays = Math.floor(fullData.length / 288)

    const formatDate = (epoch: number) => {
        const date = new Date(epoch)
        return date.toLocaleDateString("en-GB")
    }

    const currentSignalsCount = tradingSignals.filter((signal) => {
        const signalData = signal.BUY || signal.SELL
        return chartData.some((candle) => candle.closeTime === signalData?.candlestick.closeTime)
    }).length

    const enhancedTooltipCount = chartData.filter((candle) => enhancedTooltipData[candle.closeTime.toString()]).length

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Candlestick Chart with Trading Signals</h1>

            <div className="flex gap-4 mb-4">
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="mr-2 h-4 w-4" /> Add Candlestick Data
                </Button>
                <Button onClick={() => setIsSignalModalOpen(true)} variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" /> Add Trading Signals
                </Button>
                <Button onClick={() => setIsEnhancedTooltipModalOpen(true)} variant="outline">
                    <Info className="mr-2 h-4 w-4" /> Add Enhanced Tooltip Data
                </Button>
            </div>

            {/* Enhanced Tooltip Toggle */}
            {fullData.length > 0 && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Tooltip Mode</p>
                            <p className="text-xs text-gray-600">
                                {showEnhancedTooltip
                                    ? `Enhanced mode: showing state and decision data (${enhancedTooltipCount} points available)`
                                    : "Basic mode: showing price and time data"}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="text-sm">Basic</span>
                            <Switch
                                checked={showEnhancedTooltip}
                                onCheckedChange={setShowEnhancedTooltip}
                                disabled={Object.keys(enhancedTooltipData).length === 0}
                            />
                            <span className="text-sm">Enhanced</span>
                        </div>
                    </div>
                </div>
            )}

            {tradingSignals.length > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                        <strong>Trading Signals:</strong> {tradingSignals.length} total signals loaded
                        {currentSignalsCount > 0 && ` (${currentSignalsCount} visible in current view)`}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Click on candlesticks with arrows to view signal details</p>
                </div>
            )}

            {fullData.length > 0 && (
                <div className="mb-4">
                    <input
                        type="number"
                        value={timestampInput}
                        onChange={(e) => setTimestampInput(e.target.value)}
                        placeholder="Enter timestamp"
                        className="p-2 border rounded mr-2"
                    />
                </div>
            )}

            {fullData.length >= 288 && (
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Select Day:</label>
                    <select value={selectedDay} onChange={handleDayChange} className="p-2 border rounded">
                        <option value={-1}>All Data ({fullData.length} points)</option>
                        {Array.from({ length: availableDays }, (_, i) => {
                            const dataPointsPerDay = Math.min(288, Math.ceil(fullData.length / availableDays))
                            const startIndex = Math.max(0, fullData.length - dataPointsPerDay * (i + 1))
                            const endIndex = Math.min(fullData.length, startIndex + dataPointsPerDay)

                            if (startIndex < fullData.length && endIndex > startIndex) {
                                const startDate = formatDate(fullData[startIndex].openTime)
                                const endDate = formatDate(fullData[Math.min(endIndex - 1, fullData.length - 1)].closeTime)
                                return (
                                    <option key={i} value={i}>
                                        {`${startDate} - ${endDate}`}
                                    </option>
                                )
                            }
                            return null
                        }).filter(Boolean)}
                    </select>
                </div>
            )}

            {chartData.length > 0 && (
                <CandlestickChart
                    data={chartData}
                    selectedTimestamp={selectedTimestamp}
                    selectTimestamp={(e) => setTimestampInput(String(e))}
                    tradingSignals={tradingSignals}
                    onSignalClick={handleSignalClick}
                    enhancedTooltipData={enhancedTooltipData}
                    showEnhancedTooltip={showEnhancedTooltip}
                />
            )}

            <JsonInputModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleJsonSubmit} />

            <TradingSignalModal
                isOpen={isSignalModalOpen}
                onClose={() => setIsSignalModalOpen(false)}
                onSubmit={handleSignalSubmit}
            />

            <EnhancedTooltipDataModal
                isOpen={isEnhancedTooltipModalOpen}
                onClose={() => setIsEnhancedTooltipModalOpen(false)}
                onSubmit={handleEnhancedTooltipDataSubmit}
            />

            <TradingSignalPopup
                isOpen={isSignalPopupOpen}
                onClose={() => setIsSignalPopupOpen(false)}
                signal={selectedSignal}
            />
        </main>
    )
}
