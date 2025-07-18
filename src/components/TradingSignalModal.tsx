"use client"

import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog"
import {Button} from "./ui/button"
import {Textarea} from "./ui/textarea"
import type {TradingSignal} from "../app/types"

interface TradingSignalModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: TradingSignal[]) => void
}

export default function TradingSignalModal({ isOpen, onClose, onSubmit }: TradingSignalModalProps) {
    const [jsonInput, setJsonInput] = useState("")

    const handleSubmit = () => {
        try {
            const parsedData = JSON.parse(jsonInput)

            // Convert the object format to array format
            const signalsArray: TradingSignal[] = Object.values(parsedData).map((signal: any) => ({
                state: signal.state,
                action: signal.action,
                candlestick: signal.candlestick,
            }))

            onSubmit(signalsArray)
        } catch (error) {
            console.error("Invalid JSON:", error)
            alert("Invalid JSON. Please check your input and try again. Make sure it contains valid trading signals.")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Enter Trading Signals JSON Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                        <p>Expected format:</p>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {`{
  "1736157599999": {
    "state": {
      "1h": { "bollingerBreakout": false, ... },
      "4h": { "bollingerBreakout": true, ... }
    },
    "action": "BUY",
    "candlestick": {
      "openTime": 1736154000000,
      "closeTime": 1736157599999,
      ...
    }
  }
}`}
            </pre>
                    </div>
                    <Textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your trading signals JSON data here..."
                        className="h-64 font-mono text-sm"
                    />
                    <Button onClick={handleSubmit} className="w-full">
                        Add Trading Signals
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
