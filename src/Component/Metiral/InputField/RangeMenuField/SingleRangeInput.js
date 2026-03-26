import React, { useEffect, useRef, useState } from 'react';
import './RangeMenuField.css';
import Slider from '@mui/material/Slider';

function SingleRangeInput({
    label,
    filterData,
    setFilterData,
    varName,
    min,
    max,
    value,
    sliderValue,
    setSliderValue,
    maxValue,
    input,
    padding,
    disable,
    width,
    modified,
    inputType,
    propertyPriceValue
}) {
    const [focus, setFocus] = useState(false);
    const inputRef = useRef(null);
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);

    const hugeValue = 10000000; // PKR conversion base

    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = [inputRef.current, inputRef1.current, inputRef2.current];
            const clickedInside = refs.some(ref => ref && ref.contains(event.target));
            if (!clickedInside) {
                setFocus(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [sliderValue]);

    const percentageValue = min
        ? (filterData?.[varName]?.[min] !== null && filterData?.[varName]?.[min] !== '')
            ? filterData[varName][min]
            : 1
        : (filterData?.[varName] !== null && filterData?.[varName] !== '')
            ? filterData[varName]
            : 1;


    const pkrValue = Math.round((percentageValue / 100) * hugeValue);

    const handleSliderChange = (e, newValue) => {
        setSliderValue(newValue);
        if (min) {
            setFilterData((prev) => ({
                ...prev,
                [varName]: {
                    ...prev?.[varName],
                    [min]: newValue,
                },
            }));
        }
        else {
            setFilterData((prev) => ({
                ...prev,
                [varName]: newValue,
            }));
        }

    };

    const kiborRate = 20;
    const kiborPlusThree = kiborRate + 3;

    useEffect(() => {
        if (disable) {
            setFilterData((prev) => ({
                ...prev,
                [varName]: {
                    ...prev?.[varName],
                    [min]: kiborPlusThree,
                },
            }));
            setSliderValue(kiborPlusThree);
        }
    }, [disable]);

    const formatNumber = (num) => {
        if (num >= 1_00_00_00_000) {
            return `${(num / 1_00_00_00_000).toFixed(2)} Billion`;
        } else if (num >= 1_00_00_000) {
            return `${(num / 1_00_00_000).toFixed(2)} Crore`;
        } else if (num >= 1_00_000) {
            return `${(num / 1_00_000).toFixed(2)} Lakh`;
        } else if (num >= 1_000) {
            return `${(num / 1_000).toFixed(2)} Thousand`;
        } else if (num >= 1_00) {
            return `${(num / 1_00).toFixed(2)} Hundred`;
        }
        return num?.toLocaleString();
    };



    // 🔹 Down Payment or Percentage Calculation
    let calculatedValue = 0;
    if (inputType === "%" && propertyPriceValue) {
        calculatedValue = (propertyPriceValue * sliderValue) / 100;
    }

    // 🔹 Year → Month Conversion
    let yearCalculatedValue = 0;
    if (inputType === "date") {
        yearCalculatedValue = sliderValue * 12;
    }

    return (
        <div
            className={
                min
                    ? (
                        focus ||
                        (filterData?.[varName]?.length > 0) ||
                        filterData?.[varName]?.[min] ||
                        filterData?.[varName]?.[max]
                    )
                        ? 'range-input-field focus'
                        : 'range-input-field'
                    : (
                        focus ||
                        (filterData?.[varName] > 0)
                    )
                        ? 'range-input-field focus'
                        : 'range-input-field'
            }

            ref={inputRef}
        >
            <label onClick={() => setFocus(!focus)}>
                {label} {inputType === "%" && sliderValue > 0 ? `(${sliderValue}%)` : ""}
            </label>

            <div className="parent-box" onClick={() => setFocus(!focus)}>
                {modified && filterData?.[varName] ? <div className="modified-value">{value}</div> : ''}
                <div className="input-value">
                    {
                        disable
                            ? "Kibor + 3%"
                            : input === "percentage"
                                ? `${pkrValue.toLocaleString()} PKR`
                                : filterData?.[varName]?.[min] !== ''
                                    ? modified
                                        ? inputType === "%" && propertyPriceValue >= 1
                                            ? `${formatNumber(calculatedValue || 0)}`
                                            : inputType === "date" && sliderValue > 0
                                                ? `${filterData?.[varName]} (${yearCalculatedValue} Months)`
                                                : formatNumber(filterData?.[varName] || 0)
                                        : `${filterData?.[varName]?.[min]} ${filterData?.[varName]?.[value] || ''}`
                                    : '0'
                    }
                </div>

                {focus ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                        <rect width="18.8657" height="20" transform="translate(0.716309 0.714294)" fill="white" />
                        <path d="M14.1917 12.8572L10.149 8.57146L6.10636 12.8572" stroke="#698B75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5.71436 7.85712L10.0001 12.1428L14.2858 7.85712" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </div>

            {focus && (
                <div className={`area-range ${modified ? "modified" : ''}`} style={{ width: width ? "286px" : '100%' }}>
                    <div className="value-box">
                        {
                            modified ?
                                <input
                                    className='modified-number-input'
                                    type="number"
                                    value={filterData?.[varName] || ""}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (val > maxValue) return;
                                        setFilterData((prev) => ({
                                            ...prev,
                                            [varName]: val
                                        }));
                                        setSliderValue(val)
                                    }}
                                /> :

                                <div
                                    ref={inputRef1}
                                    style={{ padding: padding ? "0" : "0 9px" }}
                                    className={
                                        percentageValue
                                            ? "single-value-label-box focus align-items-start"
                                            : "single-value-label-box align-items-start"
                                    }
                                >
                                    {input === "percentage" ? (
                                        <div className="percentage-box" style={{ padding: padding ? "0 9px" : "unset" }}>
                                            {percentageValue + "%"}
                                        </div>
                                    ) : null}

                                    {input !== "percentage" ? (
                                        <input
                                            type="number"
                                            className="value min"
                                            placeholder={disable ? "Kibor + 3%" : 0}
                                            value={filterData?.[varName]?.[min] ?? ''}
                                            onChange={() => { }}
                                            readOnly
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="value min"
                                            placeholder={`${hugeValue.toLocaleString()} PKR`}
                                            value={`${pkrValue.toLocaleString()} PKR`}
                                            readOnly
                                            disabled={disable}
                                        />
                                    )}
                                </div>
                        }
                    </div>

                    <div className="bottom">
                        <div className={`value ${modified ? 'modified' : ''}`}>
                            <span>
                                {input === "percentage"
                                    ? '1'
                                    : inputType === "%"
                                        ? '20'
                                        : inputType === "date"
                                            ? '1'
                                            : '0'}
                            </span>
                            <span>{varName === "propertyPrice" ? formatNumber(maxValue) : maxValue}{inputType === "%" ? inputType : ""}</span>
                        </div>

                        <Slider
                            className="slider"
                            value={disable ? 23 : percentageValue}
                            onChange={handleSliderChange}
                            min={
                                input === "percentage"
                                    ? 1
                                    : inputType === "%"
                                        ? 20
                                        : inputType === "date"
                                            ? 1
                                            : 0
                            }
                            max={maxValue}
                            step={maxValue <= 100 ? 1 : 100000}
                            valueLabelDisplay="auto"
                            disabled={disable}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default SingleRangeInput;
