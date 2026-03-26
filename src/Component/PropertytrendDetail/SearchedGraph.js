import React, { useEffect, useState, useRef } from "react";
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Label, Customized, BarChart,
    Bar
} from "recharts";
import BreadCrumb from "../Metiral/BreadCrumb";

const defaultData = [
    { label: "Sep\n24", value: 0.09 },
    { label: "Nov\n24", value: 0.15 },
    { label: "Jan\n25", value: 0.21 },
    { label: "Mar\n25", value: 0.27 },
    { label: "May\n25", value: 0.355 },
    { label: "Jul\n25", value: 0.33 },
    { label: "Sep\n25", value: 0.30 },
    { label: "Nov\n25", value: 0.21 },
    { label: "Jan\n26", value: 0.115 },
    { label: "Mar\n26", value: 0.14 },
    { label: "May\n26", value: 0.205 },
    { label: "Jul\n26", value: 0.245 },
    { label: "Sep\n26", value: 0.305 }
];

const MonthTick = ({ x, y, payload }) => {
    const [m, yr] = String(payload.value).split("\n");
    return (
        <g transform={`translate(${x},${y})`}>
            <text textAnchor="middle" className="tick-text">
                <tspan className="tick-text light" x="0" dy="0">{m}</tspan>
                <tspan x="0" dy="14" className="tick-text light">{yr}</tspan>
            </text>
        </g>
    );
};

const YAxisTick = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text textAnchor="end" className="tick-text" x={0} dy={4}>
                {payload.value}
            </text>
        </g>
    );
};

// ✅ Custom tick components for bar chart axes
const BarChartXAxisTick = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text textAnchor="middle" className="bar-chart-axis-tick" x={0} dy={16}>
                {payload.value}
            </text>
        </g>
    );
};

const BarChartYAxisTick = ({ x, y, payload }) => {
    return (
        <g transform={`translate(${x},${y})`}>
            <text textAnchor="end" className="bar-chart-axis-tick" x={0} dy={4}>
                {payload.value}
            </text>
        </g>
    );
};

const PlotFrame = ({ x, y, width, height }) => (
    <rect x={x} y={y} width={width} height={height} rx="8" ry="8" fill="none" className="plot-frame" />
);

const ArrowUp = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="arrow-up">
        <path d="M7 17L17 7M17 7H9M17 7V15" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const defaultData1 = [
    { month: "Apr", value: 15 },
    { month: "May", value: 22 },
    { month: "Jun", value: 28 },
    { month: "Jul", value: 32 },
    { month: "Aug", value: 39 },
    { month: "Sep", value: 35 },
];


export default function SearchedTrendsLive({
    locationName,
    graphData,
    // ↓ Slightly lower bottom so baseline upar aaye (more space for labels)
    yDomain = [0.085, 0.36],
    yTicks = [0.09, 0.18, 0.27, 0.36],
    title = `Interest in ${locationName}`,
    percent = 24.86,
    delta = 0.09,
    deltaLabel = "Increase compared to Aug 2025",
}) {
    const [data, setData] = useState([])
    const [newdata, setnewData] = useState([])
    const [openDropdown, setOpenDropdown] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const dropdownRef = useRef(null)
    
    // Get current date and month
    const getCurrentDate = () => {
        const now = new Date();
        const day = now.getDate();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames[now.getMonth()];
        return `${day} ${month}`;
    };
    
    const currentDate = getCurrentDate();
    
    // Detect mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        
        return () => {
            window.removeEventListener('resize', checkMobile);
        };
    }, []);
    
    useEffect(() => {
        if (graphData?.monthly?.length) {
            // ✅ Process data for main area chart
            let allData = graphData?.monthly?.map((items) => {
                return {
                    label: `${items?.month}\n${items?.year}`,
                    value: items?.percentage || 0
                }
            })
            
            // ✅ On mobile, show only last 6 months; on desktop, show all
            let updateData = isMobile 
                ? allData?.slice(-6) || []  // Last 6 months on mobile
                : allData || []              // All months on desktop
            
            // ✅ Process data for bar chart (only last 6 months, filter out undefined)
            let updateDataNew = graphData?.monthly
                ?.slice(-6) // ✅ Get only last 6 months
                ?.map((items) => {
                    return {
                        label: items?.month,
                        value: items?.percentage || 0
                    }
                }) || []
            setData(updateData)
            setnewData(updateDataNew)
        } else {
            // ✅ Reset data if no graphData
            setData([])
            setnewData([])
        }
    }, [graphData, isMobile])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (openDropdown && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };

        if (openDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    return (
        <div className="main-container">
            <div className="row">
                <div className="d-flex justify-content-between align-items-sm-center align-items-baseline" style={{ width: "100%", gap:'12px' }}>
                    <div className="searched-location-heading mt-0" style={{ margin: 0 }}>Searched trends {locationName}</div>
                    <div 
                        ref={dropdownRef}
                        style={{ 
                            position: "relative",
                            display: "inline-block"
                        }}
                    >
                        <div 
                            className="dropdown-trigger"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // setOpenDropdown(prev => !prev);
                            }}
                            style={{
                                cursor: "pointer",
                                padding: "8px 12px",
                                backgroundColor: "white",
                                border: "1px solid #BBB",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent:"space-between",
                                gap: "8px",
                                height:"36px",
                                width:"128px",
                                cursor:"not-allowed"
                            }}
                        >
                            <span style={{ fontSize: "14px", color: "#2D2D2D", fontFamily: "DM Sans" }}>{currentDate}</span>
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="10" 
                                height="6" 
                                viewBox="0 0 10 6" 
                                fill="none"
                                style={{ transform: openDropdown ? "rotate(180deg)" : "rotate(0deg)", transition: "0.3s ease" }}
                            >
                                <path
                                    d="M0.714355 0.85714L5.00007 5.14285L9.28578 0.85714"
                                    stroke="#737678"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        {openDropdown && (
                            <div 
                                className="dropdown-menu"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    position: "absolute",
                                    bottom: "100%",
                                    right: 0,
                                    marginBottom: "8px",
                                    backgroundColor: "white",
                                    borderRadius: "4px",
                                    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                                    minWidth: "150px",
                                    zIndex: 1000,
                                    padding: "8px 0"
                                }}
                            >
                                <div 
                                    style={{
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        color: "#2D2D2D",
                                        fontFamily: "DM Sans"
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                    onClick={() => {
                                        setOpenDropdown(false);
                                        // Add export functionality here
                                    }}
                                >
                                    Export Data
                                </div>
                                <div 
                                    style={{
                                        padding: "8px 16px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        color: "#2D2D2D",
                                        fontFamily: "DM Sans"
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                    onClick={() => {
                                        setOpenDropdown(false);
                                        // Add share functionality here
                                    }}
                                >
                                    Share
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="searched-trends-card" style={{ outline: "none" }}>
                        <ResponsiveContainer width="100%" height={366} style={{ outline: "none" }}>
                            {/* ↑ bottom margin bada diya */}
                            <AreaChart
                                data={data}
                                margin={{ top: 20, right: 20, left: 20, bottom: 10 }}
                                style={{ outline: "none" }}
                            >
                                <defs>
                                    <linearGradient id="fillLine" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#27AE60" stopOpacity={0.08} />
                                        <stop offset="100%" stopColor="#27AE60" stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 6" stroke="#E5E7EB" vertical horizontal />

                                <XAxis
                                    dataKey="label"
                                    tick={<MonthTick />}
                                    interval={0}
                                    // ↓ space between axis line and tick text
                                    tickMargin={12}
                                    // ↓ extra room for two-line labels
                                    height={46}
                                    tickLine={{ stroke: "#E5E7EB" }}
                                    axisLine={{ stroke: "#E5E7EB" }}
                                >
                                    <Label value="Months" position="insideBottom" offset={-6} className="axis-title" />
                                </XAxis>

                                <YAxis
                                    dataKey={"value"}
                                    tick={<YAxisTick />}
                                    tickLine={{ stroke: "#E5E7EB" }}
                                    axisLine={{ stroke: "#E5E7EB" }}
                                    width={46}
                                    margin={{ right: 5.82 }}
                                    tickMargin={5.82}  // ✅ 5.82px gap between Y-axis numbers and Y-axis line
                                    // ↓ push line a bit up from bottom to avoid overlap
                                    padding={{ top: 6, bottom: 10 }}
                                    domain={[0, (dataMax) => Math.min(100, Math.max(0, dataMax))]}  // ✅ Cap Y-axis at 100% maximum
                                >
                                    <Label
                                        value="Search Percentages (%)"
                                        angle={-90}
                                        position="insideLeft"   // keeps it inside chart, slightly spaced
                                        offset={-5}     // ✅ 11px gap between label and Y-axis numbers (5.82 + 11 = 16.82)
                                        className="trend-detail-graph-para"        // moves text away from axis line (increase if needed)
                                        style={{
                                            textAnchor: "middle", // centers vertically
                                        }}
                                    />
                                </YAxis>

                                <Tooltip
                                    formatter={(val) => [`${Number(val).toFixed(3)}`, "Search %"]}
                                    labelFormatter={(l) => l.replace("\n", " ")}
                                    contentStyle={{
                                        borderRadius: 10,
                                        border: "1px solid #E6E9EC",
                                        boxShadow: "0 4px 16px rgba(17,24,39,.08)",
                                    }}
                                />

                                <Customized component={(props) => {
                                    const { x = 0, y = 0, width = 0, height = 0 } = props;
                                    return <PlotFrame x={x} y={y} width={width} height={height} />;
                                }} />

                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#27AE60"
                                    strokeWidth={3}
                                    fill="url(#fillLine)"
                                    dot={false}
                                    activeDot={{ r: 4, fill: "#27AE60", stroke: "none" }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="interest-card">
                        <h4 className="interest-title">{title}</h4>

                        <h2 className="interest-percent">{data?.length > 0 ? data[data?.length - 1]?.value?.toFixed(2) : 0}%</h2>

                        <div className="interest-delta">
                            <ArrowUp />
                            <span className="delta-value">{delta.toFixed(2)}%</span>
                            <span className="delta-text">{deltaLabel}</span>
                        </div>

                        <div className="interest-chart" style={{ outline: "none" }}>
                            <ResponsiveContainer width="100%" height="100%" style={{ outline: "none" }}>
                                <BarChart
                                    data={newdata}
                                    margin={{ top: 6, right: 2, left: -20, bottom: 0 }}
                                    style={{ outline: "none" }}
                                >
                                    {/* ✅ Show both vertical and horizontal dashed lines */}
                                    <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 6" vertical horizontal />
                                    <XAxis
                                        dataKey="label"
                                        tick={<BarChartXAxisTick />}
                                        axisLine={{ stroke: "#E5E7EB" }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        dataKey={"value"}
                                        domain={[0, (dataMax) => Math.min(100, Math.max(0, dataMax))]}  // ✅ Cap Y-axis at 100% maximum
                                        tick={<BarChartYAxisTick />}
                                        axisLine={{ stroke: "#E5E7EB" }}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: "rgba(16,185,129,0.06)" }}
                                        contentStyle={{
                                            borderRadius: 10,
                                            border: "1px solid #E5E7EB",
                                            boxShadow: "0 4px 16px rgba(17,24,39,.08)",
                                        }}
                                        formatter={(v) => [`${v}`, "Interest"]}
                                        labelStyle={{ color: "#374151" }}
                                    />
                                    <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} barSize={44.093} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
