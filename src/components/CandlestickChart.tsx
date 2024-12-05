import { Bar, BarChart, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { CandlestickData } from "@/src/app/types";
import {isThreeBlackCrows} from "../../../../bot/services/candlechart-analysis/bearish/three-black-crows";

export const CandlestickChart = (props: { data: CandlestickData[] }) => {
    const data = props.data.map((stock) => {
        return {
            time: stock.closeTime,
            open: stock.open,
            close: stock.close,
            openClose: [stock.open, stock.close],
            high: stock.high,
            low: stock.low,
            highLow: [stock.high, stock.low]
        };
    });

    return (
        <BarChart
            width={900}
            height={600}
            data={data}
            barGap={-4.5}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
            <XAxis dataKey="time" />
            <YAxis type={"number"} domain={['dataMin', 'dataMax']} />
            <Tooltip />
            <Bar dataKey="openClose" >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={entry.open < entry.close ? "green" : "red"}
                    />
                ))}
            </Bar>
            <Bar dataKey={"highLow"} >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        width={1}
                        fill={entry.open < entry.close ? "green" : "red"}
                    />
                ))}
            </Bar>
        </BarChart>
    );
};
