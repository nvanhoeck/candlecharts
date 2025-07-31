"use client"

import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog"
import {Button} from "./ui/button"
import {Textarea} from "./ui/textarea"
import type {SupportResistanceLevel} from "../app/types"

interface SupportResistanceModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: SupportResistanceLevel[]) => void
}

export default function SupportResistanceModal({ isOpen, onClose, onSubmit }: SupportResistanceModalProps) {
    const [jsonInput, setJsonInput] = useState("")

    const handleSubmit = () => {
        try {
            const parsedData = JSON.parse(jsonInput) as SupportResistanceLevel[]
            if (!Array.isArray(parsedData)) {
                throw new Error("Input must be an array of support/resistance levels")
            }
            onSubmit(parsedData)
            onClose()
        } catch (error) {
            console.error("Invalid JSON:", error)
            alert(
                "Invalid JSON. Please check your input and try again. Make sure it's an array of support/resistance levels.",
            )
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Enter Support & Resistance Levels</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                        <p>Expected format:</p>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {`[
  {
    "type": "resistance",
    "price": 1.1124,
    "touches": 7
  },
  {
    "type": "support",
    "price": 1.0719,
    "touches": 14
  }
]`}
            </pre>
                    </div>
                    <Textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your support & resistance levels JSON data here..."
                        className="h-64 font-mono text-sm"
                    />
                    <Button onClick={handleSubmit} className="w-full">
                        Add Support & Resistance Levels
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
