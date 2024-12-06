import {Bar, BarChart, Cell, Tooltip, XAxis, YAxis} from "recharts";
import {CandlestickData} from "@/src/app/types";
import {useCallback, useEffect, useRef, useState} from "react";
import {CategoricalChartFunc} from "recharts/types/chart/generateCategoricalChart";

type StockData = {
    time: string; // Formatted date string
    timestamp: number; // Assuming closeTime is a Unix timestamp
    open: string; // Assuming stock.open is a string
    close: string; // Assuming stock.close is a string
    openClose: [string, string]; // Tuple for open and close values
    high: string; // Assuming stock.high is a string
    low: string; // Assuming stock.low is a string
    highLow: [string, string]; // Tuple for high and low values
};
export const CandlestickChart = (props: { data: CandlestickData[], selectedTimestamp: number | null, selectTimestamp: (timestamp: number) => void }) => {
    const data: StockData[] = props.data.map((stock) => {
        return {
            time: new Date(stock.closeTime).toLocaleString(),
            timestamp: stock.closeTime,
            open: stock.open,
            close: stock.close,
            openClose: [stock.open, stock.close],
            high: stock.high,
            low: stock.low,
            highLow: [stock.high, stock.low]
        };
    });

    const chartContainerRef = useRef<HTMLDivElement>(null); // Reference to the container
    const [chartWidth, setChartWidth] = useState<number>(0);


    useEffect(() => {
        // Update the chart width based on the container
        const handleResize = () => {
            if (chartContainerRef.current) {
                setChartWidth(chartContainerRef.current.offsetWidth);
            }
        };

        handleResize(); // Initial resize
        window.addEventListener("resize", handleResize); // Adjust on window resize

        return () => window.removeEventListener("resize", handleResize); // Cleanup
    }, []);

    const selectBar: CategoricalChartFunc = useCallback((e) => {
        console.log(e.activePayload![0].payload.timestamp)
        props.selectTimestamp(e.activePayload![0].payload.timestamp)
    }, [])
    return (
        <div ref={chartContainerRef} style={{ width: "100%", overflowX: "auto" }}>
            <BarChart
                onClick={selectBar}
                width={chartWidth} // Use dynamic width based on container
                height={600}
                data={data}
                barGap={(data.length > 125 ? -1.5 : -5)}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
                <XAxis dataKey="time" />
                <YAxis type="number" domain={["dataMin", "dataMax"]} />
                <Tooltip />
                <Bar dataKey="openClose">
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.open < entry.close ? "green" : "red"} // Default bar color
                            stroke={
                                props.selectedTimestamp &&
                                 entry.timestamp === props.selectedTimestamp
                                    ? '#ff00ff' // Highlight color
                                    : '' // Default bar color
                            }
                        />
                    ))}
                </Bar>
                <Bar dataKey="highLow">
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            width={1}
                            fill={entry.open < entry.close ? "green" : "red"} // Default bar color
                        />
                    ))}
                </Bar>
            </BarChart>
        </div>
    );
};
