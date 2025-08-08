"use client"

import type React from "react"
import {useEffect, useState} from "react"
import {Button} from "../components/ui/button"
import {Switch} from "../components/ui/switch"
import {Activity, BarChart3, Info, PlusIcon, Timer, Trash2, TrendingUp} from "lucide-react"
import JsonInputModal from "../components/JsonInputModal"
import TradingSignalModal from "../components/TradingSignalModal"
import SupportResistanceModal from "../components/SupportResistanceModal"
import ZoneTrendModal from "../components/ZoneTrendModal" // New import
import TradingSignalPopup from "../components/TradingSignalPopup"
import ZoneTrendPopup from "../components/ZoneTrendPopup" // New import
import type {
    CandlestickData,
    EnhancedTooltipData,
    SupportResistanceLevel,
    TradingSignal,
    ZoneTrend,
} from "../app/types"
import {CandlestickChart} from "../components/CandlestickChart"
import EnhancedTooltipDataModal from "../components/EnhancedTooltipDataModel";
import TimePlotModal from "../components/TimePlotModal";

export default function Home() {
    const [chartData, setChartData] = useState<CandlestickData[]>([])
    const [fullData, setFullData] = useState<CandlestickData[]>([])
    const [tradingSignals, setTradingSignals] = useState<TradingSignal[]>([])
    const [enhancedTooltipData, setEnhancedTooltipData] = useState<EnhancedTooltipData>({})
    const [supportResistanceLevels, setSupportResistanceLevels] = useState<SupportResistanceLevel[]>([])
    const [zoneTrends, setZoneTrends] = useState<ZoneTrend[]>([]) // New state
    const [timePlots, setTimePlots] = useState<number[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSignalModalOpen, setIsSignalModalOpen] = useState(false)
    const [isEnhancedTooltipModalOpen, setIsEnhancedTooltipModalOpen] = useState(false)
    const [isSupportResistanceModalOpen, setIsSupportResistanceModalOpen] = useState(false)
    const [isZoneTrendModalOpen, setIsZoneTrendModalOpen] = useState(false) // New modal state
    const [isSignalPopupOpen, setIsSignalPopupOpen] = useState(false)
    const [isZoneTrendPopupOpen, setIsZoneTrendPopupOpen] = useState(false) // New popup state
    const [isTimePlotModalOpen, setIsTimePlotModalOpen] = useState(false)
    const [selectedSignal, setSelectedSignal] = useState<TradingSignal | null>(null)
    const [selectedZoneTrend, setSelectedZoneTrend] = useState<ZoneTrend | null>(null) // New selected trend state
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
        setEnhancedTooltipData((prev) => ({...prev, ...data}))
        setIsEnhancedTooltipModalOpen(false)
    }

    const handleSupportResistanceSubmit = (levels: SupportResistanceLevel[]) => {
        setSupportResistanceLevels((prev) => [...prev, ...levels])
        setIsSupportResistanceModalOpen(false)
    }

    const handleZoneTrendSubmit = (trends: ZoneTrend[]) => {
        // New submit handler
        setZoneTrends((prev) => [...prev, ...trends])
        setIsZoneTrendModalOpen(false)
    }

    const handleSignalClick = (signal: TradingSignal) => {
        setSelectedSignal(signal)
        setIsSignalPopupOpen(true)
    }

    const handleZoneTrendClick = (trend: ZoneTrend) => {
        // New click handler
        setSelectedZoneTrend(trend)
        setIsZoneTrendPopupOpen(true)
    }

    const handleTimePlotClick = (timePlots: number[]) => {
        setTimePlots(timePlots)
    }

    const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const dayIndex = Number.parseInt(event.target.value)
        setSelectedDay(dayIndex)

        if (dayIndex === -1) {
            setChartData(fullData)
        } else {
            const dataPointsPerDay = Math.min(250, Math.ceil(fullData.length / availableDays))
            const startIndex = fullData.length - dataPointsPerDay * (dayIndex + 1)
            const endIndex = startIndex + dataPointsPerDay
            const dayData = fullData.slice(Math.max(0, startIndex), endIndex)
            setChartData(dayData)
        }
    }

    // Clear functions
    const clearCandlestickData = () => {
        setChartData([])
        setFullData([])
        setSelectedDay(-1)
        setTimestampInput("")
        setSelectedTimestamp(null)
    }

    const clearTradingSignals = () => {
        setTradingSignals([])
    }

    const clearEnhancedTooltipData = () => {
        setEnhancedTooltipData({})
        setShowEnhancedTooltip(false)
    }

    const clearSupportResistanceLevels = () => {
        setSupportResistanceLevels([])
    }

    const clearZoneTrends = () => {
        setZoneTrends([])
    }

    const clearTimePlots = () => {
        setTimePlots([])
    }

    const clearAllData = () => {
        setChartData([])
        setFullData([])
        setTradingSignals([])
        setEnhancedTooltipData({})
        setSupportResistanceLevels([])
        setSelectedDay(-1)
        setTimestampInput("")
        setSelectedTimestamp(null)
        setShowEnhancedTooltip(false)
        setTimePlots([])
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

    const availableDays = Math.floor(fullData.length / 250)

    const formatDate = (epoch: number) => {
        const date = new Date(epoch)
        return date.toLocaleDateString("en-GB")
    }

    const currentSignalsCount = tradingSignals.filter((signal) => {
        return chartData.some((candle) => candle.closeTime === signal.candlestick.closeTime)
    }).length

    const currentTrendsCount = zoneTrends.filter((trend) => {
        return chartData.some((candle) => candle.closeTime === trend.timestampOfSwing)
    }).length

    const enhancedTooltipCount = chartData.filter((candle) => enhancedTooltipData[candle.closeTime.toString()]).length

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Candlestick Chart with Trading Signals</h1>

            <div className="flex gap-4 mb-4">
                <Button onClick={() => setIsModalOpen(true)}>
                    <PlusIcon className="mr-2 h-4 w-4"/> Add Candlestick Data
                </Button>
                <Button onClick={() => setIsSignalModalOpen(true)} variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4"/> Add Trading Signals
                </Button>
                <Button onClick={() => setIsEnhancedTooltipModalOpen(true)} variant="outline">
                    <Info className="mr-2 h-4 w-4"/> Add Enhanced Tooltip Data
                </Button>
                <Button onClick={() => setIsSupportResistanceModalOpen(true)} variant="outline">
                    <BarChart3 className="mr-2 h-4 w-4"/> Add Support & Resistance
                </Button>
                <Button onClick={() => setIsZoneTrendModalOpen(true)} variant="outline">
                    {" "}
                    {/* New button */}
                    <Activity className="mr-2 h-4 w-4"/> Add Trends
                </Button>
                <Button onClick={() => setIsTimePlotModalOpen(true)} variant="outline">
                    {" "}
                    {/* New button */}
                    <Timer className="mr-2 h-4 w-4"/> Add Time plots
                </Button>
            </div>

            {/* Clear Data Buttons */}
            <div className="flex gap-2 mb-4 flex-wrap">
                {fullData.length > 0 && (
                    <Button onClick={clearCandlestickData} variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3"/> Clear Candlestick Data
                    </Button>
                )}
                {tradingSignals.length > 0 && (
                    <Button onClick={clearTradingSignals} variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3"/> Clear Trading Signals
                    </Button>
                )}
                {Object.keys(enhancedTooltipData).length > 0 && (
                    <Button onClick={clearEnhancedTooltipData} variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3"/> Clear Enhanced Data
                    </Button>
                )}
                {supportResistanceLevels.length > 0 && (
                    <Button onClick={clearSupportResistanceLevels} variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3"/> Clear Support & Resistance
                    </Button>
                )}
                {zoneTrends.length > 0 && (
                    <Button onClick={clearZoneTrends} variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3"/> Clear Zone Trends
                    </Button>
                )}
                {timePlots.length > 0 && (
                    <Button onClick={clearTimePlots} variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-3 w-3"/> Clear Time Plots
                    </Button>
                )}
                {(fullData.length > 0 ||
                    tradingSignals.length > 0 ||
                    Object.keys(enhancedTooltipData).length > 0 ||
                    supportResistanceLevels.length > 0) && (
                    <Button onClick={clearAllData} variant="destructive" size="sm" className="ml-2">
                        <Trash2 className="mr-1 h-3 w-3"/> Clear All Data
                    </Button>
                )}
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
                    <p className="text-xs text-blue-600 mt-1">Click on candlesticks with arrows to view signal
                        details</p>
                </div>
            )}

            {zoneTrends.length > 0 && (
                <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700">
                        <strong>Trends:</strong> {zoneTrends.length} total trends loaded
                        {currentTrendsCount > 0 && ` (${currentTrendsCount} visible in current view)`}
                    </p>
                    <p className="text-xs text-purple-600 mt-1">Click on candlesticks with arrows to view trend
                        details</p>
                </div>
            )}

            {supportResistanceLevels.length > 0 && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                        <strong>Support & Resistance:</strong> {supportResistanceLevels.length} levels loaded (
                        {supportResistanceLevels.filter((l) => l.type === "support").length} support,{" "}
                        {supportResistanceLevels.filter((l) => l.type === "resistance").length} resistance)
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                        Line thickness represents number of touches. Support lines are solid, resistance lines are
                        dashed.
                    </p>
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

            {fullData.length >= 250 && (
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Select Day:</label>
                    <select value={selectedDay} onChange={handleDayChange} className="p-2 border rounded">
                        <option value={-1}>All Data ({fullData.length} points)</option>
                        {Array.from({length: availableDays}, (_, i) => {
                            const dataPointsPerDay = Math.min(250, Math.ceil(fullData.length / availableDays))
                            const startIndex = fullData.length - dataPointsPerDay * (i + 1)
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
                    supportResistanceLevels={supportResistanceLevels}
                    zoneTrends={zoneTrends} // Pass new trend data
                    onZoneTrendClick={handleZoneTrendClick} // Pass new click handler
                    timePlots={timePlots}
                />
            )}

            <JsonInputModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleJsonSubmit}/>

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

            <SupportResistanceModal
                isOpen={isSupportResistanceModalOpen}
                onClose={() => setIsSupportResistanceModalOpen(false)}
                onSubmit={handleSupportResistanceSubmit}
            />

            <ZoneTrendModal // New modal component
                isOpen={isZoneTrendModalOpen}
                onClose={() => setIsZoneTrendModalOpen(false)}
                onSubmit={handleZoneTrendSubmit}
            />

            <TimePlotModal isOpen={isTimePlotModalOpen} onClose={() => setIsTimePlotModalOpen(false)}
                           onSubmit={setTimePlots}/>

            <TradingSignalPopup
                isOpen={isSignalPopupOpen}
                onClose={() => setIsSignalPopupOpen(false)}
                signal={selectedSignal}
            />

            <ZoneTrendPopup // New popup component
                isOpen={isZoneTrendPopupOpen}
                onClose={() => setIsZoneTrendPopupOpen(false)}
                trend={selectedZoneTrend}
            />
        </main>
    )
}
