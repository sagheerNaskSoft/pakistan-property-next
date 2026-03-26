import React, { useState, useEffect, useMemo } from 'react'
import { PiArrowsLeftRight } from 'react-icons/pi';
import { TiArrowRight } from 'react-icons/ti';
import { GoArrowUpRight } from "react-icons/go";
import SingleMenuFeild from '../Metiral/InputField/SingleMenuFeild/SingleMenuFeild';

function Bannner() {
    const [value, setValue] = useState("1");
    const [result, setResult] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 576);
    const [conversionRates, setConversionRates] = useState({
        "Square Feet": 1,
        "Square Yards": 9,       // 1 sq yd = 9 sq ft
        "Square Meters": 10.7639, // 1 sq m = 10.7639 sq ft
        Marla: 225,              // 1 Marla = 225 sq ft
        Kanal: 4500,             // 1 Kanal = 4500 sq ft
        Acre: 43560,             // 1 Acre = 43560 sq ft
    })

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Convert conversionRates to menuData array (recalculates when conversionRates changes)
    const unitMenuData = useMemo(() => {
        return Object.keys(conversionRates).map((unit) => ({
            name: unit,
            value: conversionRates[unit]
        }));
    }, [conversionRates]);

    const [filterData, setFilterData] = useState({
        fromUnit: { name: "Marla", value: 225 },
        toUnit: { name: "Square Feet", value: 1 }
    });

    const fromUnit = filterData?.fromUnit?.name || "Marla";
    const toUnit = filterData?.toUnit?.name || "Square Feet";
    const handleConvert = (inpValue, fromUnitvalue, toUnitvalue) => {
        // Convert string to number, handle empty string
        const numValue = parseFloat(inpValue);
        if (inpValue === "" || inpValue === null || inpValue === undefined || isNaN(numValue) || numValue <= 0) {
            setResult(null);
            return;
        }

        // Step 1: Convert input value → square feet
        const valueInSqft = numValue * conversionRates[fromUnitvalue];

        // Step 2: Convert sqft → target unit
        const convertedValue = valueInSqft / conversionRates[toUnitvalue];

        setResult(convertedValue);
    };

    // Auto-convert when units or value change
    useEffect(() => {
        if (value !== "" && value !== null && fromUnit && toUnit && conversionRates[fromUnit] && conversionRates[toUnit]) {
            handleConvert(value, fromUnit, toUnit);
        } else {
            setResult(null);
        }
    }, [value, fromUnit, toUnit, conversionRates.Marla, conversionRates["Square Feet"], conversionRates["Square Yards"], conversionRates["Square Meters"], conversionRates.Kanal, conversionRates.Acre]);
    const areaConversionsMobile = [
        { fromUnit: "Kanal", toUnit: "Marla", value: 1, displayFrom: "Kanal", displayTo: "Marla" },
        { fromUnit: "Marla", toUnit: "Kanal", value: 1, displayFrom: "Marla", displayTo: "Kanal" },
        { fromUnit: "Square Feet", toUnit: "Square Meters", value: 1, displayFrom: "Sq.ft.", displayTo: "Sq.m." },
        { fromUnit: "Square Yards", toUnit: "Square Feet", value: 1, displayFrom: "Sq.yd.", displayTo: "Sq.ft." },
        { fromUnit: "Square Yards", toUnit: "Square Meters", value: 1, displayFrom: "Sq.yd.", displayTo: "Sq.m." },
        { fromUnit: "Acre", toUnit: "Kanal", value: 1, displayFrom: "Acre", displayTo: "Kanal" },
        { fromUnit: "Kanal", toUnit: "Acre", value: 1, displayFrom: "Kanal", displayTo: "Acre" },
        { fromUnit: "Square Meters", toUnit: "Square Feet", value: 1, displayFrom: "Sq.m.", displayTo: "Sq.ft." },
    ];

    const areaConversionsDesktop = [
        { fromUnit: "Square Feet", toUnit: "Square Meters", value: 1, displayFrom: "Square Feet", displayTo: "Square Meters" },
        { fromUnit: "Square Feet", toUnit: "Square Yards", value: 1, displayFrom: "Square Feet", displayTo: "Square Yards" },
        { fromUnit: "Square Meters", toUnit: "Square Feet", value: 1, displayFrom: "Square Meters", displayTo: "Square Feet" },
        { fromUnit: "Square Meters", toUnit: "Square Yards", value: 1, displayFrom: "Square Meters", displayTo: "Square Yards" },
        { fromUnit: "Square Yards", toUnit: "Square Feet", value: 1, displayFrom: "Square Yards", displayTo: "Square Feet" },
        { fromUnit: "Square Yards", toUnit: "Square Meters", value: 1, displayFrom: "Square Yards", displayTo: "Square Meters" },
    ];

    const areaConversions = isMobile ? areaConversionsMobile : areaConversionsDesktop;
    const generateAreaTableData = () => {
        const rows = [];

        for (let i = 1; i <= 20; i++) {
            const marla = i;
            const marlaToSqft = marla * conversionRates.Marla;
            const marlaToSqm = marlaToSqft / conversionRates["Square Meters"];
            const marlaToSqyd = marlaToSqft / conversionRates["Square Yards"];
            const marlaToKanal = marlaToSqft / conversionRates.Kanal;

            rows.push({
                marla: `${marla} Marla`,
                kanal: `${marlaToKanal.toFixed(2)} Kanal`,
                sqft: `${Math.round(marlaToSqft)} Sq. ft.`,
                sqm: `${Math.round(marlaToSqm)} Sq. m.`,
                sqyd: `${Math.round(marlaToSqyd)} Sq. yd.`,
            });
        }
        return rows;
    }
    return (
        <div>
            <div className='banner_area_coverter'>
                <div className='banner_content w-100'>
                    <div className='main-container'>
                        <h1>Area Unit Converter</h1>
                        <p className='pera'>A quick and easy way to convert and compare different property <br /> area measurements accurately.</p>
                        <div className='coverter_box'>
                            <p className='siz_text'><PiArrowsLeftRight className='me-2' />Marla Size</p>
                            <div className='d-flex gap-2 mb-3'>
                                <div className={`marla_value ${conversionRates?.Marla === 225 ? "active" : ""}`} onClick={() => setConversionRates({ ...conversionRates, Marla: 225 })}>225/Sq.ft.</div>
                                <div className={`marla_value ${conversionRates?.Marla === 250 ? "active" : ""}`} onClick={() => setConversionRates({ ...conversionRates, Marla: 250 })}>250/Sq.ft.</div>
                                <div className={`marla_value ${conversionRates?.Marla === 272 ? "active" : ""}`} onClick={() => setConversionRates({ ...conversionRates, Marla: 272 })}>272/Sq.ft.</div>
                            </div>
                            <style>{`
                                .inp_box_forarea .single-input-field.simple-design {
                                    border: none !important;
                                    border-radius: 0 !important;
                                    height: auto !important;
                                    padding: 0 !important;
                                    background: transparent !important;
                                    width: 100% !important;
                                }
                                .inp_box_forarea .single-input-field.simple-design .input-value {
                                    padding: 0 !important;
                                    font-size: 12px !important;
                                    font-weight: 400 !important;
                                }
                                .inp_box_forarea .single-input-field.simple-design label {
                                    display: none !important;
                                }
                                .inp_box_forarea .single-input-field.simple-design svg {
                                    width: 16px !important;
                                    height: 16px !important;
                                }
                            `}</style>
                            <div className='inp_box_main_marla d-flex gap-3 align-items-center flex-wrap'>
                                <div className='input_box_area' style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
                                    <div className='inp_box_forarea' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            value={value}
                                            placeholder='0'
                                            onChange={(e) => {
                                                setValue(e.target.value)
                                            }}
                                            type='number'
                                            style={{ flex: 1, border: 'none', background: 'none', outline: 'none', padding: 0 }}
                                        />
                                        <div >
                                            <SingleMenuFeild
                                                getVaiable={"name"}
                                                filterData={filterData}
                                                setFilterData={setFilterData}
                                                varName={"fromUnit"}
                                                label={""}
                                                menuData={unitMenuData}
                                                optionSelect={"single"}
                                                storeKey={"name"}
                                                design={"simple"}
                                            />
                                        </div>
                                    </div>
                                    {/* {filterData?.fromUnit && (
                                        <div style={{ fontSize: '12px', color: '#737678', marginTop: '4px', paddingLeft: '4px' }}>
                                            = {conversionRates[filterData.fromUnit.name]} Sq. ft.
                                        </div>
                                    )} */}
                                </div>
                                <h6 className='m-0'>To</h6>
                                <div className='input_box_area' style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '200px' }}>
                                    <div className='inp_box_forarea' style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type='number'
                                            readOnly
                                            value={result?.toLocaleString(undefined, {
                                                maximumFractionDigits: 4,
                                            }) || ''}
                                            style={{ flex: 1, border: 'none', background: 'none', outline: 'none', padding: 0 }}
                                        />
                                        <div >
                                            <SingleMenuFeild
                                                getVaiable={"name"}
                                                filterData={filterData}
                                                setFilterData={setFilterData}
                                                varName={"toUnit"}
                                                label={""}
                                                menuData={unitMenuData}
                                                optionSelect={"single"}
                                                storeKey={"name"}
                                                design={"simple"}
                                            />
                                        </div>
                                    </div>
                                    {/* {filterData?.toUnit && (
                                        <div style={, color: '#737678', marginTop: '4px', paddingLeft: '4px' }}>
                                            = {conversionRates[filterData.toUnit.name]} Sq. ft.
                                        </div>
                                    )} */}
                                </div>
                            </div>
                            <p className='siz_text mt-3'><PiArrowsLeftRight className='me-2' />Usefull Converter</p>
                            <div className='d-flex flex-sm-nowrap flex-wrap marla_container gap-2 mb-sm-3'>
                                <div className={`marla_value`} onClick={() => {
                                    setFilterData({
                                        ...filterData,
                                        fromUnit: { name: "Marla", value: conversionRates.Marla },
                                        toUnit: { name: "Square Yards", value: conversionRates["Square Yards"] }
                                    })
                                }}><PiArrowsLeftRight className='me-2' style={{ color: "#447158", fontSize: "15px" }} />Marla<TiArrowRight />Sq. yd.</div>
                                <div className={`marla_value`} onClick={() => {
                                    setFilterData({
                                        ...filterData,
                                        fromUnit: { name: "Square Meters", value: conversionRates["Square Meters"] },
                                        toUnit: { name: "Square Yards", value: conversionRates["Square Yards"] }
                                    })
                                }}><PiArrowsLeftRight className='me-2' style={{ color: "#447158", fontSize: "15px" }} />Sq.m.<TiArrowRight />Sq. yd.</div>
                                <div className={`marla_value`} onClick={() => {
                                    setFilterData({
                                        ...filterData,
                                        fromUnit: { name: "Kanal", value: conversionRates.Kanal },
                                        toUnit: { name: "Marla", value: conversionRates.Marla }
                                    })
                                }}><PiArrowsLeftRight className='me-2' style={{ color: "#447158", fontSize: "15px" }} />Kanal<TiArrowRight />Marla</div>
                                <div className={`marla_value`} onClick={() => {
                                    setFilterData({
                                        ...filterData,
                                        fromUnit: { name: "Square Feet", value: conversionRates["Square Feet"] },
                                        toUnit: { name: "Square Meters", value: conversionRates["Square Meters"] }
                                    })
                                }}><PiArrowsLeftRight className='me-2' style={{ color: "#447158", fontSize: "15px" }} />Sq.ft.<TiArrowRight />Sq.m.</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='main-container'>
                <div className='mt-5 popular_conversions'>

                    <h2>Popular Conversions</h2>
                    <div className='row m-0'>
                        {areaConversions.map((item, index) => {
                            return (
                                <div key={index} onClick={() => {
                                    setFilterData({
                                        ...filterData,
                                        fromUnit: { name: item?.fromUnit, value: conversionRates[item?.fromUnit] },
                                        toUnit: { name: item?.toUnit, value: conversionRates[item?.toUnit] }
                                    })
                                    setValue(String(item?.value || "1"))
                                    window.scrollTo(0, 0);
                                }} className='p-0 col-lg-4 col-md-6 col-6'><GoArrowUpRight className='icon' /> {item?.displayFrom || item?.fromUnit} to {item?.displayTo || item?.toUnit}</div>
                            )
                        })}
                    </div>
                    <h2 className='mt-5 mb-4'>Standard Property Area Conversion Chart for Pakistan</h2>
                    <div className='converter_table'>
                        <table>
                            <thead>
                                <tr>
                                    <th>Marla</th>
                                    <th>Kanal</th>
                                    <th>Square Feet (Sq. ft.)	</th>
                                    <th>Square Meter (Sq. m.)	</th>
                                    <th>Square Yard (Sq. yd. / Gazz)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generateAreaTableData()?.map((item, i) => {
                                    return (
                                        <tr key={i}>
                                            <td className={`${i % 2 !== 0 ? "active" : ""}`}>{item?.marla}</td>
                                            <td className={`${i % 2 !== 0 ? "active" : ""}`}>{item?.kanal}</td>
                                            <td className={`${i % 2 !== 0 ? "active" : ""}`}>{item?.sqft}</td>
                                            <td className={`${i % 2 !== 0 ? "active" : ""}`}>{item?.sqm}</td>
                                            <td className={`${i % 2 !== 0 ? "active" : ""}`}>{item?.sqyd}</td>

                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default Bannner