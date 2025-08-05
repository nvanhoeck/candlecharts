"use client"

import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog"
import {Button} from "./ui/button"
import {Textarea} from "./ui/textarea"
import type {ZoneTrend} from "../app/types"

interface ZoneTrendModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: ZoneTrend[]) => void
}

export default function ZoneTrendModal({ isOpen, onClose, onSubmit }: ZoneTrendModalProps) {
    const [jsonInput, setJsonInput] = useState("")

    const handleSubmit = () => {
        try {
            const parsedData = JSON.parse(jsonInput) as ZoneTrend[]
            if (!Array.isArray(parsedData)) {
                throw new Error("Input must be an array of zone trends")
            }
            onSubmit(parsedData)
            onClose()
        } catch (error) {
            console.error("Invalid JSON:", error)
            alert("Invalid JSON. Please check your input and try again. Make sure it's an array of zone trends.")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Enter Zone Trend Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                        <p>Expected format:</p>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {`[
  {
    "close": 1.1000,
    "low": 1.0800,
    "high": 1.1200,
    "maxPercentageChange": 2.00,
    "direction": "DOWN",
    "currentRetracement": 1.50,
    "startZoneSwingIndex": 54,
    "endZoneSwingIndex": 57,
    "supportResistanceTouches": 2,
    "timestampOfSwing": 1736254799999
  },...
]`}
            </pre>
                    </div>
                    <Textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your zone trend JSON data here..."
                        className="h-64 font-mono text-sm"
                    />
                    <Button onClick={handleSubmit} className="w-full">
                        Add Trends
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
