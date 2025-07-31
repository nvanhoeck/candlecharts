"use client"

import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog"
import {Button} from "./ui/button"
import {Textarea} from "./ui/textarea"
import type {EnhancedTooltipData} from "../app/types"

interface EnhancedTooltipDataModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: EnhancedTooltipData) => void
}

export default function EnhancedTooltipDataModal({ isOpen, onClose, onSubmit }: EnhancedTooltipDataModalProps) {
    const [jsonInput, setJsonInput] = useState("")

    const handleSubmit = () => {
        try {
            const parsedData = JSON.parse(jsonInput) as EnhancedTooltipData
            if (typeof parsedData !== "object" || Array.isArray(parsedData)) {
                throw new Error("Input must be an object with timestamp keys")
            }
            onSubmit(parsedData)
        } catch (error) {
            console.error("Invalid JSON:", error)
            alert(
                'Invalid JSON. Please check your input and try again. Expected format: {"timestamp": {"state": "..."}}',
            )
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Enter Enhanced Tooltip Data</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                        <p>Expected format:</p>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {`{
  "1739656799999": {
    "state": "{\\"1h\\":{\\"bollingerBreakout\\":true,...}}",
  }
}`}
            </pre>
                    </div>
                    <Textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your enhanced tooltip data here..."
                        className="h-64 font-mono text-sm"
                    />
                    <Button onClick={handleSubmit} className="w-full">
                        Add Enhanced Tooltip Data
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
