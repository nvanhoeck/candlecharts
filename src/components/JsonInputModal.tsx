import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Button } from "../components/ui/button"
import { Textarea } from "../components/ui/textarea"
import { CandlestickData } from '../app/types'

interface JsonInputModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CandlestickData[]) => void
}

export default function JsonInputModal({ isOpen, onClose, onSubmit }: JsonInputModalProps) {
  const [jsonInput, setJsonInput] = useState('')

  const handleSubmit = () => {
    try {
      const parsedData = JSON.parse(jsonInput) as CandlestickData[]
      if (!Array.isArray(parsedData)) {
        throw new Error('Input must be an array of candlestick data')
      }
      onSubmit(parsedData)
    } catch (error) {
      console.error('Invalid JSON:', error)
      alert('Invalid JSON. Please check your input and try again. Make sure it\'s an array of candlestick data.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter JSON Data</DialogTitle>
        </DialogHeader>
        <Textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Paste your JSON data here..."
          className="h-64"
        />
        <Button onClick={handleSubmit}>Show Chart</Button>
      </DialogContent>
    </Dialog>
  )
}

