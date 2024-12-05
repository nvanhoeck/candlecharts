import { useState } from 'react'
import { Button } from "../components/ui/button"
import {PlusIcon} from 'lucide-react'
import JsonInputModal from '../components/JsonInputModal'
import { CandlestickData } from '../app/types'
import {CandlestickChart} from "../components/CandlestickChart";

export default function Home() {
  const [chartData, setChartData] = useState<CandlestickData[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleJsonSubmit = (data: CandlestickData[]) => {
    setChartData(data)
    setIsModalOpen(false)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Candlestick Chart</h1>
      <Button onClick={() => setIsModalOpen(true)} className="mb-4">
        <PlusIcon className="mr-2 h-4 w-4" /> Add Data
      </Button>
        {chartData.length}
      {chartData.length > 0 && <CandlestickChart data={chartData}/>}
      <JsonInputModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleJsonSubmit} />
    </main>
  )
}

