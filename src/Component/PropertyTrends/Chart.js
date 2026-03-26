import * as React from "react";
import Box from "@mui/material/Box";
import {
    LineChart,
    LinePlot,
    MarkPlot,
    lineElementClasses,
} from "@mui/x-charts/LineChart";

// Highlight configuration
const highlightScope = {
    highlight: "item",
    fade: "global",
};

// Custom glowing moving mark
function CustomMark(props) {
    const { x, y, isHighlighted, color, ...other } = props;
    if (!isHighlighted) return null;

    const markColor = color || "#27AE60";

    return (
        <g>
            <circle
                cx={x}
                cy={y}
                r={5}
                fill={markColor}
                filter={`drop-shadow(0 0 8px ${markColor})`}
                {...other}
            />
        </g>
    );
}

export default function Chart({ width = 128, height = 100, trend, graph_data = [], marginLeft = "-8px", left }) {

    // ✅ handle empty data gracefully
    if (!graph_data || graph_data.length === 0) return null;

    // Convert your API data into chart arrays
    const xAxisData = graph_data.map((item) => item.date || "");
    const yAxisData = graph_data.map((item) => item.clicks || 0);

    // ✅ Determine trend color (from trend prop if given)
    const trendColor =
        trend === "increased" || trend === "up"
            ? "#27AE60" // green
            : trend === "decreased"
                ? "#C94444" // red
                : "#999999ff"; // default gray if neutral

    return (
        <Box
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "flex-start", // ✅ align chart to top (like your screenshot)
                justifyContent: "flex-end", // ✅ Changed from "center" to "flex-end" to align all content to the right side
            }}
        >
            <LineChart
                width={width}
                height={height}
                style={{ marginLeft: left ? left : marginLeft }}  // ✅ Move graph 8px to the left (default -8px, can be overridden by prop)
                series={[
                    {
                        data: yAxisData,
                        color: trendColor,
                        highlightScope,
                    },
                ]}
                xAxis={[{ scaleType: "point", data: xAxisData, position: "none" }]}
                yAxis={[{ position: "none" }]}
                slots={{
                    mark: CustomMark,
                    tooltip: () => null,
                }}
                sx={{
                    [`& .${lineElementClasses.root}`]: {
                        stroke: trendColor,
                        strokeWidth: 2,
                        filter: `drop-shadow(0px 2px 4px rgba(${trend == "increment" || trend == "up" ? "39,174,96" : trend == "decrement" ? '201,68,68' : "153,153,153"},0.2))`, // ✅ subtle shadow under line
                    },
                }}
                disableAxisListener
            >
                <LinePlot />
                {/* <MarkPlot /> */}
            </LineChart>
        </Box>
    );
}
