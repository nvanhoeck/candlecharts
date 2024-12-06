import {useEffect, useState} from 'react';
import {Button} from "../components/ui/button";
import {PlusIcon} from 'lucide-react';
import JsonInputModal from '../components/JsonInputModal';
import {CandlestickData} from '../app/types';
import {CandlestickChart} from "../components/CandlestickChart";

export default function Home() {
    const [chartData, setChartData] = useState<CandlestickData[]>([]);
    const [fullData, setFullData] = useState<CandlestickData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<number>(0);
    const [timestampInput, setTimestampInput] = useState<string>(''); // New state for the timestamp input
    const [selectedTimestamp, setSelectedTimestamp] = useState<number | null>(null);

    const handleJsonSubmit = (data: CandlestickData[]) => {
        setFullData(data);
        const lastDayData = data.slice(-288); // Default to the most recent day
        setChartData(lastDayData);
        setSelectedDay(0); // Reset selected day to the most recent
        setIsModalOpen(false);
    };

    // Handle day change
    const handleDayChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const dayIndex = parseInt(event.target.value);
        setSelectedDay(dayIndex);

        const startIndex = fullData.length - 288 * (dayIndex + 1);
        const endIndex = startIndex + 288;
        const dayData = fullData.slice(startIndex, endIndex);
        setChartData(dayData);
    };

    useEffect(() => {
        if(!!timestampInput) {
            const timestamp = parseInt(timestampInput);
            console.log(timestamp)
            console.log(fullData)
            const matchIndex = fullData.findIndex(
                (d) => d.closeTime === timestamp
            );

            if (matchIndex !== -1) {
                const startIndex = Math.max(0, matchIndex - 50); // Prevent negative index
                const endIndex = Math.min(fullData.length, matchIndex + 51); // Ensure within bounds
                const rangeData = fullData.slice(startIndex, endIndex);
                setChartData(rangeData);
                setSelectedTimestamp(timestamp); // Set selected timestamp
            } else {
                alert('Timestamp not found in closed data');
            }
        }
    }, [timestampInput]);



    // Calculate the number of available days
    const availableDays = Math.floor(fullData.length / 288);

    // Function to format epoch time to day-month-year
    const formatDate = (epoch: number) => {
        const date = new Date(epoch);
        return date.toLocaleDateString('en-GB');
    };

    return (
        <main className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Candlestick Chart</h1>
            <Button onClick={() => setIsModalOpen(true)} className="mb-4">
                <PlusIcon className="mr-2 h-4 w-4" /> Add Data
            </Button>

            {/* Input for timestamp search */}
            {fullData.length > 0 && <div className="mb-4">
                <input
                    type="number"
                    value={timestampInput}
                    onChange={(e) => setTimestampInput(e.target.value)}
                    placeholder="Enter timestamp"
                    className="p-2 border rounded mr-2"
                />
            </div>}

            {/* Dropdown to select the day */}
            {fullData.length >= 288 && (
                <div className="mb-4">
                    <label className="mr-2 font-semibold">Select Day:</label>
                    <select value={selectedDay} onChange={handleDayChange} className="p-2 border rounded">
                        {Array.from({ length: availableDays }, (_, i) => {
                            const startIndex = fullData.length - 288 * (i + 1);
                            const endIndex = startIndex + 287; // Last index in this range
                            const startDate = formatDate(fullData[startIndex].openTime);
                            const endDate = formatDate(fullData[endIndex].closeTime);
                            return (
                                <option key={i} value={i}>
                                    {`${startDate} - ${endDate}`}
                                </option>
                            );
                        })}
                    </select>
                </div>
            )}

            {chartData.length > 0 && <CandlestickChart data={chartData} selectedTimestamp={selectedTimestamp} selectTimestamp={e => setTimestampInput(String(e))}/>}
            <JsonInputModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleJsonSubmit} />
        </main>
    );
}
