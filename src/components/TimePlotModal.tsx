"use client"

import {useState} from "react"
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "./ui/dialog"
import {Button} from "./ui/button"
import {Textarea} from "./ui/textarea"

interface TimePlotModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: number[]) => void
}

export default function TimePlotModal({isOpen, onClose, onSubmit}: TimePlotModalProps) {
    const [jsonInput, setJsonInput] = useState("")

    const handleSubmit = () => {
        try {
            const parsedData = JSON.parse(jsonInput) as number[]
            if (!Array.isArray(parsedData)) {
                throw new Error("Input must be an array of closed times")
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
                    <DialogTitle>Enter Zone Time Plots</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                        <p>Expected format:</p>
                        <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {`[ 1054854040, 08403156498, 509884987980,...]`}
            </pre>
                    </div>
                    <Textarea
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        placeholder="Paste your time plots JSON data here..."
                        className="h-64 font-mono text-sm"
                    />
                    <Button onClick={handleSubmit} className="w-full">
                        Add Time plots
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
