import React, { useEffect, useState } from "react";
import img from '../../Asset/PropertyindexDetail/Container.png'
import img1 from '../../Asset/PropertyindexDetail/Icon.png'
import img2 from '../../Asset/Icon-1.svg'
import img3 from '../../Asset/Icon.svg'

import Image from 'next/image';
 import  {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
// import "./IndexAnalization.css";


const formatNumber = (num) => {
    if (num >= 1_00_00_00_000) {
        return `${(num / 1_00_00_00_000).toFixed(2)} Billion`;
    } else if (num >= 1_00_00_000) {
        return `${(num / 1_00_00_000).toFixed(2)} Cr`;
    } else if (num >= 1_00_000) {
        return `${(num / 1_00_000).toFixed(2)} Lac`;
    } else if (num >= 1_000) {
        return `${(num / 1_000).toFixed(2)} K`;
    } else if (num >= 1_00) {
        return `${(num / 1_00).toFixed(2)} Hundred`;
    }
    return num?.toString();
};
function formatDateYYYYMM(yyyymm) {
    // Example: '2025-10'
    if(yyyymm){
        const [year, month] = yyyymm?.split('-');
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        // JavaScript months are 0-based index
        return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
    }
  
}
function IndexAnalization({ graphData, otherData, activePeriod, setActivePeriod, selectedMonth }) {
    const [data, setData] = useState([])

    // Function to get current date
    const getCurrentDate = () => {
        const now = new Date();
        return {
            year: now.getFullYear(),
            month: now.getMonth() + 1 // 1-12
        };
    }

    // Function to filter data based on selected month and period
    const filterData = (rawData, period, monthFilter = null, isPricePerSqFt = false) => {
        const { year: currentYear, month: currentMonth } = getCurrentDate();
        
        let yearsBack = 1;
        if (period === 'year3_trend') yearsBack = 3;
        else if (period === 'year5_trend' || period === 'max_year_trend') yearsBack = 5;

        // If a specific month is selected, show that month across all years in the period
        if (monthFilter !== null && monthFilter !== undefined) {
            // Calculate the range: from (currentYear - yearsBack) to currentYear (inclusive)
            // For 3Y: show current month of current year, 1 year ago, 2 years ago, and 3 years ago
            const startYear = currentYear - yearsBack;
            const filtered = rawData.filter((item) => {
                if (!item?.month) return false;
                const [year, month] = item.month.split('-').map(Number);
                // Show the selected month for all years from startYear to currentYear (inclusive)
                return month === monthFilter && year >= startYear && year <= currentYear;
            });

            return filtered.map((item) => ({
                year: item?.month,
                price: isPricePerSqFt ? item?.avg_price_per_sqft : item?.avg_price,
            }));
        } else {
            // No month filter
            const startYear = currentYear - yearsBack;
            
            // For 1Y: show all months from 1 year ago's current month to current month
            if (period === 'year1_trend') {
                let filtered = rawData.filter((item) => {
                    if (!item?.month) return false;
                    const [year, month] = item.month.split('-').map(Number);
                    
                    // Exclude years outside the range
                    if (year < startYear || year > currentYear) return false;
                    
                    // For startYear: include months from currentMonth to December (12)
                    if (year === startYear) {
                        return month >= currentMonth;
                    }
                    
                    // For currentYear: include months from January (1) to currentMonth
                    if (year === currentYear) {
                        return month <= currentMonth;
                    }
                    
                    // For years in between (shouldn't happen for 1Y, but just in case)
                    return true;
                });

                // Sort by year and month to ensure correct chronological order
                filtered.sort((a, b) => {
                    const [yearA, monthA] = a.month.split('-').map(Number);
                    const [yearB, monthB] = b.month.split('-').map(Number);
                    if (yearA !== yearB) return yearA - yearB;
                    return monthA - monthB;
                });

                return filtered.map((item) => ({
                    year: item?.month,
                    price: isPricePerSqFt ? item?.avg_price_per_sqft : item?.avg_price,
                }));
            } else {
                // For 3Y/5Y/Max: show current month across all years in the period
                // For 3Y: show current month of current year, 1 year ago, 2 years ago, and 3 years ago
                let filtered = rawData.filter((item) => {
                    if (!item?.month) return false;
                    const [year, month] = item.month.split('-').map(Number);
                    // Show only current month for all years in the period
                    return month === currentMonth && year >= startYear && year <= currentYear;
                });

                // Sort by year to ensure correct chronological order
                filtered.sort((a, b) => {
                    const [yearA] = a.month.split('-').map(Number);
                    const [yearB] = b.month.split('-').map(Number);
                    return yearA - yearB;
                });

                return filtered.map((item) => ({
                    year: item?.month,
                    price: isPricePerSqFt ? item?.avg_price_per_sqft : item?.avg_price,
                }));
            }
        }
    }

    // Update data when graphData, activePeriod, or selectedMonth changes
    useEffect(() => {
        // Max uses the same data as 5Y
        const dataKey = activePeriod === 'max_year_trend' ? 'year5_trend' : activePeriod;
        
        if (!graphData?.value?.[dataKey]?.months) return;
        
        const rawData = graphData.value[dataKey].months;
        const isPricePerSqFt = graphData?.name === "Price per Sq. Ft.";
        const filteredData = filterData(rawData, activePeriod, selectedMonth, isPricePerSqFt);
        setData(filteredData);
    }, [graphData, activePeriod, selectedMonth])
    return (
        <>
            <style>{`
                .chart-con:focus,
                .chart-con:active,
                .chart-con *:focus,
                .chart-con *:active,
                .chart-no-outline:focus,
                .chart-no-outline:active,
                .chart-no-outline *:focus,
                .chart-no-outline *:active {
                    outline: none !important;
                    border: none !important;
                }
            `}</style>
            <div className="main-container">
                <div className="index-analization mt-3 pt-1" style={{marginBottom:"38px"}}>
                    <div className="row m-0">
                        <div className="col-lg-8 ps-0 pe-2 p-0">
                            <div className="index-chart">
                                <div className="chart-card">
                                    <div className="chart-header">
                                        <div>
                                            <h3 className="chart-title">Price Change Over Time</h3>
                                            <p className="chart-sub">Historical trends from 2010 to 2025</p>
                                        </div>
                                        <div className="range-pills">
                                            <button className={activePeriod === 'year1_trend' ? 'pill active' : 'pill'} onClick={() => {
                                                setActivePeriod('year1_trend')
                                            }}>1Y</button>
                                            <button className={activePeriod === 'year3_trend' ? 'pill active' : 'pill'} onClick={() => {
                                                setActivePeriod('year3_trend')
                                            }}>3Y</button>
                                            <button className={activePeriod === 'year5_trend' ? 'pill active' : 'pill'} onClick={() => {
                                                setActivePeriod('year5_trend')
                                            }}>5Y</button>
                                            <button className={activePeriod === 'max_year_trend' ? 'pill active' : 'pill'} onClick={() => {
                                                setActivePeriod('max_year_trend')
                                            }}>Max</button>
                                        </div>
                                    </div>

                                    {data.length === 0 ? (
                                        <div style={{ 
                                            height: '400px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            flexDirection: 'column',
                                            color: '#737678',
                                            fontFamily: '"DM Sans"'
                                        }}>
                                            <p style={{ fontSize: '16px', margin: 0 }}>No data available for the selected period</p>
                                            <p style={{ fontSize: '14px', margin: '8px 0 0 0', opacity: 0.7 }}>Please try selecting a different time period or month</p>
                                        </div>
                                    ) : data.length === 1 ? (
                                        <div style={{ position: 'relative', height: '400px' }}>
                                            <ResponsiveContainer className="chart-con" height="100%">
                                                <AreaChart
                                                    data={[...data, { ...data[0], year: data[0].year + '_duplicate' }]} // Duplicate point for visualization
                                                    margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                                                    outline="none"
                                                    tabIndex={-1}
                                                    onClick={(e) => e.preventDefault()}
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    style={{
                                                        outline: "none",
                                                        border: "none",
                                                        boxShadow: "none",
                                                        borderRadius: "0",
                                                        padding: "0",
                                                        margin: "0",
                                                    }}
                                                    className="chart-no-outline"
                                                >
                                                    <defs>
                                                        <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="#1C6040" stopOpacity={0.35} />
                                                            <stop offset="100%" stopColor="#1C6040" stopOpacity={0.06} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="2 8" stroke="#E6E9EC" vertical horizontal />
                                                    <XAxis 
                                                        dataKey="year"
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tick={({ x, y, payload }) => {
                                                            const value = payload.value;
                                                            if (value && !value.includes('_duplicate')) {
                                                                const [year, month] = value.split('-');
                                                                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                                                const monthName = monthNames[parseInt(month, 10) - 1] || value;
                                                                return (
                                                                    <g transform={`translate(${x},${y})`}>
                                                                        <text x={0} y={0} dy={16} textAnchor="middle" fill="#737678" style={{ fontFamily: '"DM Sans"', fontSize: '12px', fontStyle: 'normal', fontWeight: 400, lineHeight: '18px' }}>
                                                                            {monthName}
                                                                        </text>
                                                                        <text x={0} y={0} dy={32} textAnchor="middle" fill="#737678" style={{ fontFamily: '"DM Sans"', fontSize: '12px', fontStyle: 'normal', fontWeight: 400, lineHeight: '18px' }}>
                                                                            {year}
                                                                        </text>
                                                                    </g>
                                                                );
                                                            }
                                                            return null;
                                                        }}
                                                        height={60}
                                                    />
                                                    <YAxis
                                                        tickFormatter={(v) => formatNumber(v)}
                                                        domain={['dataMin', 'dataMax']}
                                                        tick={{ fill: "#737678", fontSize: 12, style: { fontFamily: '"DM Sans"', fontStyle: 'normal', fontWeight: 400, lineHeight: '18px', textAnchor: 'end' } }}
                                                        axisLine={{ stroke: "#E6E9EC" }}
                                                        tickLine={{ stroke: "#E6E9EC" }}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{ borderRadius: 10, border: "1px solid #E6E9EC", boxShadow: "0 4px 16px rgba(17,24,39,.08)" }}
                                                        formatter={(val) => [`${formatNumber(val)}`, "Price"]}
                                                        labelFormatter={(l) => l && !l.includes('_duplicate') ? `Year: ${l}` : ''}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="price"
                                                        stroke="#1C6040"
                                                        strokeWidth={3}
                                                        fill="url(#fillGreen)"
                                                        activeDot={{ r: 5, fill: "#1C6040", stroke: "#fff", strokeWidth: 2 }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                            {/* <div style={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                padding: '12px 24px',
                                                borderRadius: '8px',
                                                border: '1px solid #E6E9EC',
                                                fontSize: '14px',
                                                color: '#737678',
                                                fontFamily: '"DM Sans"',
                                                pointerEvents: 'none',
                                                textAlign: 'center'
                                            }}>
                                                Single data point: {data[0]?.year ? formatDateYYYYMM(data[0].year) : 'N/A'}
                                                <br />
                                                <span style={{ fontSize: '12px', opacity: 0.7 }}>Price: {formatNumber(data[0]?.price || 0)}</span>
                                            </div> */}
                                        </div>
                                    ) : (
                                        <ResponsiveContainer className="chart-con">
                                            <AreaChart
                                                data={data}
                                            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
                                            outline="none"  // top space for header
                                            tabIndex={-1}
                                            onClick={(e) => e.preventDefault()}
                                            onMouseDown={(e) => e.preventDefault()}
                                            style={{
                                                outline: "none",
                                                border: "none",
                                                boxShadow: "none",
                                                borderRadius: "0",
                                                padding: "0",
                                                margin: "0",
                                            }}
                                            className="chart-no-outline"
                                        >
                                            <defs>
                                                <linearGradient id="fillGreen" x1="0" y1="0" x2="0" y2="1">
                                                    <stop
                                                        offset="0%"
                                                        stopColor="#1C6040"
                                                        stopOpacity={0.35}
                                                    />
                                                    <stop
                                                        offset="100%"
                                                        stopColor="#1C6040"
                                                        stopOpacity={0.06}
                                                    />
                                                </linearGradient>
                                            </defs>

                                            <CartesianGrid
                                                strokeDasharray="2 8"
                                                stroke="#E6E9EC"
                                                vertical
                                                horizontal
                                            />
                                            <XAxis
                                                dataKey="year"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={({ x, y, payload, index }) => {
                                                    const value = payload.value;
                                                    if (value) {
                                                        const [year, month] = value.split('-');
                                                        const monthNames = [
                                                            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                                                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
                                                        ];
                                                        const monthName = monthNames[parseInt(month, 10) - 1] || value;
                                                        
                                                        // Calculate interval based on data length
                                                        const dataLength = data?.length || 0;
                                                        let interval = 0;
                                                        if (dataLength > 24) {
                                                            interval = Math.floor(dataLength / 12); // Show ~12 labels
                                                        } else if (dataLength > 12) {
                                                            interval = Math.floor(dataLength / 8); // Show ~8 labels
                                                        } else {
                                                            interval = 0; // Show all labels
                                                        }
                                                        
                                                        // Only show label if it matches the interval
                                                        if (interval === 0 || index % interval === 0 || index === dataLength - 1) {
                                                            return (
                                                                <g transform={`translate(${x},${y})`}>
                                                                    <text
                                                                        x={0}
                                                                        y={0}
                                                                        dy={16}
                                                                        textAnchor="middle"
                                                                        fill="#737678"
                                                                        style={{
                                                                            fontFamily: '"DM Sans"',
                                                                            fontSize: '12px',
                                                                            fontStyle: 'normal',
                                                                            fontWeight: 400,
                                                                            lineHeight: '18px'
                                                                        }}
                                                                    >
                                                                        {monthName}
                                                                    </text>
                                                                    <text
                                                                        x={0}
                                                                        y={0}
                                                                        dy={32}
                                                                        textAnchor="middle"
                                                                        fill="#737678"
                                                                        style={{
                                                                            fontFamily: '"DM Sans"',
                                                                            fontSize: '12px',
                                                                            fontStyle: 'normal',
                                                                            fontWeight: 400,
                                                                            lineHeight: '18px'
                                                                        }}
                                                                    >
                                                                        {year}
                                                                    </text>
                                                                </g>
                                                            );
                                                        }
                                                        return null;
                                                    }
                                                    return null;
                                                }}
                                                height={60}
                                            />
                                            <YAxis
                                                tickFormatter={(v) => formatNumber(v)}
                                                domain={data.length > 0 ? ['dataMin', 'dataMax'] : [0, 8]}
                                                alphabetic={true}
                                                tick={{ 
                                                    fill: "#737678", 
                                                    fontSize: 12,
                                                    style: {
                                                        fontFamily: '"DM Sans"',
                                                        fontStyle: 'normal',
                                                        fontWeight: 400,
                                                        lineHeight: '18px',
                                                        textAnchor: 'end'
                                                    }
                                                }}
                                                axisLine={{ stroke: "#E6E9EC" }}
                                                tickLine={{ stroke: "#E6E9EC" }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    borderRadius: 10,
                                                    border: "1px solid #E6E9EC",
                                                    boxShadow: "0 4px 16px rgba(17,24,39,.08)",
                                                }}
                                                formatter={(val) => [`${formatNumber(val)}`, "Price"]}
                                                labelFormatter={(l) => `Year: ${l}`}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="price"
                                                stroke="#1C6040"
                                                strokeWidth={3}
                                                fill="url(#fillGreen)"
                                                activeDot={{
                                                    r: 5,
                                                    fill: "#1C6040",
                                                    stroke: "#fff",
                                                    strokeWidth: 2,
                                                }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="index-total-value ">
                                        <div className="index-toal-inner-card first">
                                            <div className="index-total">
                                                <div className="side-indes">
                                                    <div>
                                                        <Image src={img1} alt="chart1" />
                                                    </div>
                                                    <div>
                                                    <svg style={{ marginTop: '17px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M5.83337 5.83331H14.1667V14.1666" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M5.83337 14.1666L14.1667 5.83331" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="indexhash">
                                                    <h4>Highest Price</h4>
                                                    <h2 className="index-pkr">PKR {formatNumber(otherData?.highest_price?.highest_price) ||0}</h2>
                                                </div>
                                                <h5>in {otherData?.highest_price?.highest_year}</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="index-total-value">
                                        <div className="index-toal-inner-card second">
                                            <div className="index-total">
                                                <div className="side-indes">
                                                    <div>
                                                        <Image src={img3} alt="chart2" />
                                                    </div>
                                                    <div>
                                                    <svg style={{ marginTop: '17px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M5.83337 5.83331H14.1667V14.1666" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M5.83337 14.1666L14.1667 5.83331" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="indexhash">
                                                    <h4>Total Growth</h4>
                                                    <h2 className="index-pkr">+{otherData?.total_growth_since_start?.total_growth_percent}%</h2>
                                                </div>
                                                <h5>Since 2010</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="index-total-value">
                                        <div className="index-toal-inner-card third">
                                            <div className="index-total">
                                                <div className="side-indes">
                                                    <div>
                                                        <Image src={img2} alt="chart3" />
                                                    </div>
                                                    <div>
                                                        <svg style={{ marginTop: '17px' }} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                            <path d="M5.83337 5.83331H14.1667V14.1666" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M5.83337 14.1666L14.1667 5.83331" stroke="#2D2D2D" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="indexhash">
                                                    <h4>Avg. Annual Growth</h4>
                                                    <h2 className="index-pkr">+{otherData?.avg_annual_growth?.average_annual_growth_percent}%</h2>
                                                </div>
                                                <h5>Per Year</h5>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-4 ps-3 pe-0">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="index-side-card-inner">
                                        <h4 className="decorative">Current Average Price</h4>
                                        <div className="card-decor">
                                            <Image src={img} alt="analysis-step" />
                                        </div>

                                        <div className="avg-price">
                                            <span className="cur">PKR</span>
                                            <span className="val">{formatNumber(otherData?.current_average_price_comparison?.current_month_avg_price)}</span>
                                        </div>

                                        <div className="avg-badge up">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                <path d="M8 3.5H11V6.5" stroke="#27AE60" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M11 3.5L6.75 7.75L4.25 5.25L1 8.5" stroke="#27AE60" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            +{otherData?.current_average_price_comparison?.percent_change}% vs last month
                                        </div>

                                        <p className="avg-asof">As of {formatDateYYYYMM(otherData?.current_average_price_comparison?.last_month)}</p>
                                        <p className="avg-note">All property sizes included</p>
                                    </div>
                                </div>
                                <div className="col-lg-12 mt-3 pt-1">
                                    <div className="index-price-summary">
                                        <div className="pcs-card">
                                            <h3 className="pcs-title">Price Change Summary</h3>

                                         <div className="pcs-box">
                                         <div className="pcs-row pcs-row--2010">
                                                <span className="pcs-label">Since {otherData?.price_change_summary?.ps1?.year}</span>
                                                <span className="pcs-val pcs-val--purple">+PKR {formatNumber(otherData?.price_change_summary?.ps1?.price)}</span>
                                            </div>

                                            <div className="pcs-row pcs-row--2015">
                                                <span className="pcs-label">Since {otherData?.price_change_summary?.ps2?.year}</span>
                                                <span className="pcs-val pcs-val--blue">+PKR {formatNumber(otherData?.price_change_summary?.ps2?.price)}</span>
                                            </div>

                                            <div className="pcs-row pcs-row--2020">
                                                <span className="pcs-label">Since {otherData?.price_change_summary?.ps3?.year}</span>
                                                <span className="pcs-val pcs-val--peach">+PKR {formatNumber(otherData?.price_change_summary?.ps3?.price)}</span>
                                            </div>
                                         </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-12">
                                    <div className="index-comparison">
                                        <div className="hc-card">
                                            <h3 className="hc-title">Historical Comparison</h3>

                                            <div className="hc-row">
                                                <div>
                                                    <p className="hc-time">6 Months Ago</p>
                                                    <p className="hc-price">PKR {formatNumber(otherData?.historical_price_comparison?.['6_months_ago']?.avg_price)}</p>
                                                </div>
                                                <div className="hc-change">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <g clipPath="url(#clip0_7151_120557)">
                                                            <path d="M10.6667 4.66669H14.6667V8.66669" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M14.6666 4.66669L8.99998 10.3334L5.66665 7.00002L1.33331 11.3334" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_7151_120557">
                                                                <rect width="16" height="16" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    <span>{otherData?.historical_price_comparison?.['6_months_ago']?.trend==="increase"?"+":"-"}{Math.round(otherData?.historical_price_comparison?.['6_months_ago']?.percent_change_vs_current)}%</span>
                                                </div>
                                            </div>

                                            <div className="hc-row">
                                                <div>
                                                    <p className="hc-time">1 Year Ago</p>
                                                    <p className="hc-price">PKR {formatNumber(otherData?.historical_price_comparison?.['1_year_ago']?.avg_price)}</p>
                                                </div>
                                                <div className="hc-change">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <g clipPath="url(#clip0_7151_120557)">
                                                            <path d="M10.6667 4.66669H14.6667V8.66669" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M14.6666 4.66669L8.99998 10.3334L5.66665 7.00002L1.33331 11.3334" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_7151_120557">
                                                                <rect width="16" height="16" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    <span>{otherData?.historical_price_comparison?.['1_year_ago']?.trend==="increase"?"+":"-"}{Math.round(otherData?.historical_price_comparison?.['1_year_ago']?.percent_change_vs_current)}%</span>
                                                </div>
                                            </div>

                                            <div className="hc-row">
                                                <div>
                                                    <p className="hc-time">2 Years Ago</p>
                                                    <p className="hc-price">PKR {formatNumber(otherData?.historical_price_comparison?.['2_years_ago']?.avg_price)}</p>
                                                </div>
                                                <div className="hc-change">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <g clipPath="url(#clip0_7151_120557)">
                                                            <path d="M10.6667 4.66669H14.6667V8.66669" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M14.6666 4.66669L8.99998 10.3334L5.66665 7.00002L1.33331 11.3334" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_7151_120557">
                                                                <rect width="16" height="16" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    <span>{otherData?.historical_price_comparison?.['2_years_ago']?.trend==="increase"?"+":"-"}{Math.round(otherData?.historical_price_comparison?.['2_years_ago']?.percent_change_vs_current)}%</span>
                                                </div>
                                            </div>

                                            <div className="hc-row">
                                                <div>
                                                    <p className="hc-time">5 Years Ago</p>
                                                    <p className="hc-price">PKR {formatNumber(otherData?.historical_price_comparison?.['5_years_ago']?.avg_price)}</p>
                                                </div>
                                                <div className="hc-change">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <g clipPath="url(#clip0_7151_120557)">
                                                            <path d="M10.6667 4.66669H14.6667V8.66669" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M14.6666 4.66669L8.99998 10.3334L5.66665 7.00002L1.33331 11.3334" stroke="#27AE60" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_7151_120557">
                                                                <rect width="16" height="16" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                    <span>{otherData?.historical_price_comparison?.['5_years_ago']?.trend==="increase"?"+":"-"}{Math.round(otherData?.historical_price_comparison?.['5_years_ago']?.percent_change_vs_current)}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default IndexAnalization;
