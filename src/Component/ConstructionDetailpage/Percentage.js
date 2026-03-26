import React, { useEffect, useMemo, useState } from "react";
import {
    Box, Paper, Stack, Chip, Typography, alpha
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CircleIcon from "@mui/icons-material/Circle";
import { PieChart } from "@mui/x-charts/PieChart";
import { useAuth } from "../../Context/ContextProvider";

const COLORS = {
    "Plumbing Works": "#F59E0B",
    "Electrical Works\r\n": "#A78BFA",
    "Wood, Metal and Tile Works": "#0EA5E9",
    "Fittings & Fixtures": "#EF4444",
    "Foundation & Structure": "#3DCAD4",
};



    const formatNumber = (num) => {
        if (num >= 1_00_00_00_000) {
            return `${(num / 1_00_00_00_000).toFixed(2)} Billion`;
        } else if (num >= 1_00_00_000) {
            return `${(num / 1_00_00_000).toFixed(2)} Crore`;
        } else if (num >= 1_00_000) {
            return `${(num / 1_00_000).toFixed(2)} Lakh`;
        } else if (num >= 1_000) {
            return `${(num / 1_000).toFixed(2)} K`;
        } else if (num >= 1_00) {
            return `${(num / 1_00).toFixed(2)} Hundred`;
        }
        return num.toString();
    };

// Format Lakh value with commas for display (excludes donut chart)


export default function Percentage({ categories,construction_type }) {
    const { formatPriceWithCommas } = useAuth()
    const [data, setData] = useState([])

    const [tab, setTab] = useState("complete");
    // const data = useMemo(() => DATASETS[tab], [tab]);
    const [total, setTotal] = useState(0)
    useEffect(() => {
        if (!categories) return;

        // -----------------------------------------
        // CASE 1: Grey Structure Tab
        // -----------------------------------------
        if (tab === "grey") {

            // Step 1: Filter categories that have at least ONE grey_structure item
            const filteredGreyCategories = categories
                ?.map(category => {
                    // Filter subcategories → filter items inside
                    const updatedSubcats = category.subcategories.map(sub => {
                        const greyItems = sub.items.filter(
                            item => item?.construction_type?.includes("grey_structure")
                        );
                        return { ...sub, items: greyItems };
                    });

                    // Check if ANY subcategory still has items
                    const hasGreyItems = updatedSubcats.some(sub => sub.items.length > 0);

                    if (!hasGreyItems) return null; // remove empty category

                    return { ...category, subcategories: updatedSubcats };
                })
                .filter(Boolean); // remove nulls

            // Step 2: Map category totals
            let newData = filteredGreyCategories.map((category) => {
                const grandTotal = category.subcategories.reduce((catTotal, sub) => {
                    const subTotal = sub.items.reduce(
                        (sum, item) => sum + (item.total_cost || 0),
                        0
                    );
                    return catTotal + subTotal;
                }, 0);

                return {
                    id: category.id,
                    label: category.name,
                    value: grandTotal,
                    color: COLORS[category.name],
                };
            });

            setData(newData);

            const totalValue = newData.reduce((sum, item) => sum + item.value, 0);
            setTotal(totalValue);

            return; // stop here
        }

        // -----------------------------------------
        // CASE 2: Normal Tab (non-grey)
        // -----------------------------------------
        const filteredCategories = categories?.filter(category =>
            category.subcategories.some(sub => sub.items.length > 0)
        );

        let newData = filteredCategories?.map((category) => {
            const grandTotal = category.subcategories.reduce((catSum, sub) => {
                return catSum + sub.items.reduce((sum, item) => sum + (item.total_cost || 0), 0);
            }, 0);

            return {
                id: category.id,
                label: category.name,
                value: grandTotal,
                color: COLORS[category.name],
            };
        });

        setData(newData);

        const totalValue = newData.reduce((sum, item) => sum + item.value, 0);
        setTotal(totalValue);

    }, [categories, tab]);

    return (
        <div className="percentage-graph-section" style={{ marginBottom: '32px' }}>
            <Box className="main-container">
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, md: 3 },
                        borderRadius: 2,
                        boxShadow: "0 2px 14px rgba(17,24,39,0.08)",
                        border: "1px solid",
                        borderColor: alpha("#000", 0.06),
                    }}
                >
                 {construction_type === "complete" ?<Stack direction="row" spacing={1.5} sx={{ mb: 3, flexWrap: "wrap" }}>
                        <Chip
                            // icon={<CheckCircleRoundedIcon fontSize="small" />}
                            label="Complete"
                            className={`tab-chip ${tab === "complete" ? "active" : ""}`}
                            onClick={() => setTab("complete")}
                        />

                        <Chip
                            label="Grey Structure"
                            className={`tab-chip grey-structure ${tab === "grey" ? "active" : ""}`}
                            onClick={() => setTab("grey")}
                        />


                    </Stack>:null}


                    {/* Filter chips */}



                    <div className="row" style={{ gap: "20px 0" }}>
                        <div className="col-lg-6">
                            <div className="left-box" style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" ,justifyContent: "center"}}>
                                <Typography style={{alignSelf:"flex-start"}} className="circular-chart-heading">
                                    Breakdown of Overall Construction Cost By Percentage (PKR)
                                </Typography>
                                <div>
                                <Box sx={{ width: { xs: "100%" }, height: "260px", position: "relative" }}>
                                    <PieChart
                                        width={260}
                                        height={260}
                                        series={[
                                            {
                                                data: data ?? [],     // <-- NEVER undefined
                                                innerRadius: 65,
                                                outerRadius: 110,
                                                paddingAngle: 1,
                                                cornerRadius: 3,
                                                highlightScope: { faded: "global", highlighted: "item" },
                                                faded: { additionalRadius: -10, color: "rgba(0,0,0,0.08)" },
                                                highlighted: { additionalRadius: 10 },
                                            },
                                        ]}
                                        slotProps={{
                                            legend: { hidden: true },
                                            tooltip: {
                                                trigger: "item",
                                                formatter: (item) => `${item.label}: ${formatNumber(item.value)}`,
                                            },
                                        }}
                                    />

                                </Box>
                                <div className="total-box">
                                    <div className="heading">Total Construction Cost</div>
                                    <div className="value">PKR {formatNumber(total)}</div>
                                </div>
                                </div>
                                
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="col-lg-6">
                            <Box sx={{ width: { xs: "100%" } }}>
                                <Stack spacing={2}>
                                    {data?.map((item) => {
                                        const percentage = ((item.value / total) * 100).toFixed(2);
                                        return (
                                            <div key={item.id} className="right-box">
                                                <div className="top">
                                                    <div className="d-flex align-items-center" style={{ gap: "8px" }}>
                                                        <CircleIcon sx={{ fontSize: 8, color: item.color }} />
                                                        <div className="box-title">{item.label}</div>
                                                    </div>
                                                    <div className="box-percentage" style={{ backgroundColor: alpha(item.color, 0.15) }}>
                                                        {percentage}%
                                                    </div>
                                                </div>
                                                <div className="box-price">PKR {formatPriceWithCommas(Math.round(item.value))}</div>
                                                <div style={{
                                                    width: '100%',
                                                    height: '8px',
                                                    backgroundColor: '#F3F4F6',
                                                    overflow: 'hidden',
                                                    borderRadius: "16px"
                                                }}>
                                                    <div style={{
                                                        width: `${percentage}%`,
                                                        height: '100%',
                                                        backgroundColor: item.color,
                                                        transition: 'width 0.3s ease',
                                                        borderRadius: "16px"
                                                    }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </Stack>
                            </Box>
                        </div>
                    </div>
                </Paper>
            </Box>
        </div>
    );
}
