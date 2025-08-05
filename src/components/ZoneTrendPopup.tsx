import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog"
import type {ZoneTrend} from "../app/types"

interface ZoneTrendPopupProps {
    isOpen: boolean
    onClose: () => void
    trend: ZoneTrend | null
}

export default function ZoneTrendPopup({ isOpen, onClose, trend }: ZoneTrendPopupProps) {
    if (!trend) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className={`text-xl font-bold ${trend.direction === "UP" ? "text-green-600" : "text-red-600"}`}>
                        Trend Details ({trend.direction})
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <span className="font-medium">Timestamp:</span> {new Date(trend.timestampOfSwing).toLocaleString()}
                        </div>
                        <div>
                            <span className="font-medium">Direction:</span>{" "}
                            <span className={`font-bold ${trend.direction === "UP" ? "text-green-600" : "text-red-600"}`}>
                {trend.direction}
              </span>
                        </div>
                        <div>
                            <span className="font-medium">Close Price:</span> {trend.close}
                        </div>
                        <div>
                            <span className="font-medium">High Price:</span> {trend.high}
                        </div>
                        <div>
                            <span className="font-medium">Low Price:</span> {trend.low}
                        </div>
                        <div>
                            <span className="font-medium">Max % Change:</span> {trend.maxPercentageChange.toFixed(2)}%
                        </div>
                        <div>
                            <span className="font-medium">Current Retracement:</span> {trend.currentRetracement.toFixed(2)}%
                        </div>
                        <div>
                            <span className="font-medium">Zone Swing Index:</span> {trend.zoneSwingIndex}
                        </div>
                        <div>
                            <span className="font-medium">S/R Touches:</span> {trend.supportResistanceTouches}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
