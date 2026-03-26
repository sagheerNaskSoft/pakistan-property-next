import React, { useEffect, useRef, useState } from 'react';
import './RangeMenuField.css';
import Slider from '@mui/material/Slider';
import CustomToolTip from '../../CustomTooltip.js'
import {useAuth} from '../../../../Context/ContextProvider.js'

function RangeMenuFeild({
    label,
    filterData,
    setFilterData,
    varName,
    min,
    max,
    value,
    menuData,
    sliderValue,
    setSliderValue,
    maxValue,
    type,
    input,
    design,
    placeHolder,
    fixedUnit,
    modified,
    viewText,
    newModified,
    newErrors,
    forcefullyAddedLabel
}) {
    const {globalPrice , globalArea} = useAuth()
    const [focus, setFocus] = useState(false);
    const [inputFocus, setInputFocus] = useState(true);
    const [inputFocus1, setInputFocus1] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dropDown, setDropDown] = useState(false);
    const inputRef = useRef(null);
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    
    // Compute effective maxValue based on varName
    const effectiveMaxValue = (varName === "price" || varName === "Price" || varName === "priceRange" || varName === "PriceRange")
        ? (globalPrice || maxValue)
        : (varName === "area" || varName === "Area" || varName === "areaRange" || varName === "AreaRange")
        ? (globalArea || maxValue)
        : maxValue;

    useEffect(() => {
        if(varName === "price" || varName === "Price" || varName === "priceRange" || varName === "PriceRange"){
            if(globalPrice) {
                setSliderValue([1, globalPrice]);
            }
        }
        if(varName === "area" || varName === "Area" || varName === "areaRange" || varName === "AreaRange"){
            if(globalArea) {
                setSliderValue([1, globalArea]);
            }
        }
    }, [globalPrice, globalArea, varName, setSliderValue]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = [
                inputRef.current,
                inputRef1.current,
                inputRef2.current
            ];
            const clickedInside = refs.some(ref => ref && ref.contains(event.target));
            if (!clickedInside) {
                setFocus(false);
                setDropDown(false);
                validateRange();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [[sliderValue]]);

    const handleInput = (index, val) => {
        const numericValue = val === '' ? '' : Math.min(Number(val), newModified ? maxValue :   effectiveMaxValue);
        const newSlider = [...sliderValue];
        newSlider[index] = numericValue;
        setSliderValue(newSlider);

        setFilterData((prev) => ({
            ...prev,
            [varName]: {
                ...prev?.[varName],
                [index === 0 ? min : max]: numericValue,
            },
        }));
    };


 
    const validateRange = () => {
        const [minVal, maxVal] = sliderValue;

        if (
            minVal === '' ||
            maxVal === '' ||
            isNaN(minVal) ||
            isNaN(maxVal) ||
            Number(maxVal) < Number(minVal)
        ) {
            setError(true);
            setErrorMessage('Inputs are Empty or Invalid!');
        } else {
            setError(false);
            setErrorMessage('');
        }
    };

    const applyFilter = () => {
        const [minVal, maxVal] = sliderValue.map(val => Math.min(Number(val), newModified ? maxValue : effectiveMaxValue));
        setFilterData((prev) => ({
            ...prev,
            [varName]: {
                ...prev?.[varName],
                [min]: minVal,
                [max]: maxVal,
            },
        }));
    };

    const formatNumber = (num) => {

        // Only format price & priceRange
        if (varName !== "price" && varName !== "priceRange") {
            return num;
        }
    
        // Max allowed value = 5 Billion (5 Arab)
        if (num > 5_000_000_000) {
            return "Value exceeds limit";
        }
    
        // PKR Format
        if (num >= 1_00_00_00_000) {
            return `${(num / 1_00_00_00_000).toFixed(2)} Arab`;
        } 
        if (num >= 1_00_00_000) {
            return `${(num / 1_00_00_000).toFixed(2)} Crore`;
        }
        if (num >= 1_00_000) {
            return `${(num / 1_00_000).toFixed(2)} Lakh`;
        }
    
        return num?.toString(); // Keep smaller values as-is
    };

    // Helper function to safely extract display value from object or string
    const getDisplayValue = (val) => {
        if (!val) return '';
        if (typeof val === 'string' || typeof val === 'number') return val;
        if (typeof val === 'object') {
            // Try to get name first, then code, then symbol
            return val?.name || val?.code || val?.symbol || '';
        }
        return '';
    };
    


    return (
        <CustomToolTip placement={"bottom"} zindex={99}
        title={
            (filterData?.[varName]?.[min] === '' && filterData?.[varName]?.[max] === '')
                ? placeHolder
                : `${formatNumber(filterData?.[varName]?.[min], varName)} - ${formatNumber(filterData?.[varName]?.[max], varName)}${
                    (filterData?.[varName]?.[min] || filterData?.[varName]?.[max])
                        ? ` ${getDisplayValue(filterData?.[varName]?.[value])}`
                        : ''
                }`
        }
        enabled={Boolean(filterData?.[varName]?.[min] || filterData?.[varName]?.[max])}
    >
        <div style={{ display: 'grid', gap: design ? "5px" : '8px' , position: modified ? "relative" : "unset" }}>
            {design === "simple" && <label style={{fontSize: viewText ? "14px" : "0" }} className={`${design == "simple" && newModified ? "d-none" : design == "simple" ? "simple-design-label" : ""} ${modified ? "modified" : ""}`} onClick={() => setFocus(!focus)}>{label}</label>}
            <div
            style={{borderColor:newErrors ? "#C94444":""}}
                className={
                 
                          design === 'simple' && newModified    ?
                          (
                            focus ||
                                filterData?.[varName]?.length > 0 ||
                                filterData?.[varName]?.[min] ||
                                filterData?.[varName]?.[max]
                                ? 'range-input-field focus simple-design simple-design-new'
                                : 'range-input-field simple-design simple-design-new'
                        ) :
                        design === 'simple'
                        ? (
                            focus ||
                                filterData?.[varName]?.length > 0 ||
                                filterData?.[varName]?.[min] ||
                                filterData?.[varName]?.[max]
                                ? 'range-input-field focus simple-design'
                                : 'range-input-field simple-design'
                        )
                        :
                        (
                            focus ||
                                filterData?.[varName]?.length > 0 ||
                                filterData?.[varName]?.[min] ||
                                filterData?.[varName]?.[max]
                                ? 'range-input-field focus'
                                : 'range-input-field'
                        )
                }
                ref={inputRef}
            >

                <label style={{ whiteSpace: forcefullyAddedLabel ? "nowrap" : "" , display: design === "simple" && newModified && !filterData?.[varName]?.[min] ?"" : design == "simple"? "none" : '' }} onClick={() => setFocus(!focus)}>{ forcefullyAddedLabel ? label : design == "simple" ? "Select" : label}</label>
                <div className="parent-box" onClick={() => setFocus(!focus)} style={{padding: viewText ? "10px 12px" : "" , display: viewText ? "flex" : "" , alignItems: viewText ? "center" : ""}}>
              
    <div
        className="input-value"
        style={{
            opacity: viewText ? 1 : "",
            fontSize: viewText ? "14px" : "",
            fontWeight: viewText ? "400" : "",
            color: viewText ? "#737678" : ""
        }}
    >
        {(filterData?.[varName]?.[min] === '' && filterData?.[varName]?.[max] === '') 
            ? placeHolder
            : `${formatNumber(filterData?.[varName]?.[min], varName)} - ${formatNumber(filterData?.[varName]?.[max], varName)}${
                (filterData?.[varName]?.[min] || filterData?.[varName]?.[max])
                    ? ` ${getDisplayValue(filterData?.[varName]?.[value])}`
                    : ''
            }`
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
                    <div className="area-range" style={{ top: design == "simple" && "35px" }}>
                        {
                            !fixedUnit &&
                            <div className="top">
                                <div className="heading">{label}</div>

                                <div className="area" onClick={() => setDropDown(!dropDown)}>
                                    {getDisplayValue(filterData?.[varName]?.[value]) || 'Select Size'}
                                    {dropDown ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                                            <path d="M8.60938 5.14258L4.56673 0.856863L0.524088 5.14258" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" viewBox="0 0 10 6" fill="none">
                                            <path d="M8.60938 0.857422L4.56673 5.14314L0.524088 0.857423" stroke="#444545" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    )}
                                </div>

                                {dropDown && (
                                    <div className="size-dropdown">
                                        {menuData?.map((size) => (
                                            <div
                                                className="size"
                                                key={size?.id}
                                                onClick={() => {
                                                    setDropDown(false);
                                                    if (type === 'double') {
                                                        setFilterData((prev) => ({
                                                            ...prev,
                                                            [varName]: {
                                                                ...prev?.[varName],
                                                                [value]: size.code,
                                                            },
                                                        }));
                                                    } else {
                                                        setFilterData((prev) => ({
                                                            ...prev,
                                                            [varName]: {
                                                                ...prev?.[varName],
                                                                [value]: size,
                                                            },
                                                        }));
                                                    }
                                                }}

                                            >
                                                {
                                                    type === 'double'
                                                        ? `${size.code} ${size.symbol || ''}`
                                                        : size?.name
                                                }
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        }

                        {
                            input === "single" ?
                                <div className="value-box">
                                    <div ref={inputRef1} className={inputFocus || filterData?.[varName]?.[min] ? "single-value-label-box focus" : "single-value-label-box"}>
                                        <input
                                            type="number"
                                            className="value min"
                                            placeholder={1}
                                            value={filterData?.[varName]?.[min] ?? ''}
                                            onChange={(e) => handleInput(0, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                        />
                                        <div className='percentage-box'>{filterData?.[varName]?.[min] + " - " + filterData?.[varName]?.[max] + "%"}</div>
                                        {/* <label>Min</label>  */}
                                    </div>

                                    {/* <div ref={inputRef2} className={inputFocus1 || filterData?.[varName]?.[max] ? "value-label-box focus" : "value-label-box"}>
                                    <input
                                        type="number"
                                        className="value max"
                                        placeholder={maxValue}
                                        value={filterData?.[varName]?.[max] ?? ''}
                                        onChange={(e) => handleInput(1, e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                    />
                                    <label>Max</label>
                                </div> */}
                                </div>
                                : <div className="value-box">
                                    <div ref={inputRef1} className={inputFocus || filterData?.[varName]?.[min] ? "value-label-box focus" : "value-label-box"}>
                                        <input
                                            type="number"
                                            className="value min"
                                            placeholder={1}
                                            value={filterData?.[varName]?.[min] ?? ''}
                                            onChange={(e) => handleInput(0, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                        />
                                        <label>Min</label>
                                    </div>

                                    <div ref={inputRef2} className={inputFocus1 || filterData?.[varName]?.[max] ? "value-label-box focus" : "value-label-box"}>
                                        <input
                                            type="number"
                                            className="value max"
                                            placeholder={newModified ? maxValue : effectiveMaxValue}
                                            value={filterData?.[varName]?.[max] ?? ''}
                                            onChange={(e) => handleInput(1, e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && applyFilter()}
                                        />
                                        <label>Max</label>
                                    </div>
                                </div>
                        }

                        <div className="bottom">
                            <div className="value">
                                <span>1</span>
                                <span>{newModified ? maxValue : effectiveMaxValue}</span>
                            </div>
                            <Slider
                                className="slider"
                                value={sliderValue.map(val => val === '' ? 0 : Number(val))}
                                onChange={(e, newValue) => {
                                    setSliderValue(newValue);
                                    setFilterData((prev) => ({
                                        ...prev,
                                        [varName]: {
                                            ...prev?.[varName],
                                            [min]: newValue[0],
                                            [max]: newValue[1],
                                        },
                                    }));
                                }}
                                min={1}
                                max={newModified ? maxValue : effectiveMaxValue}
                                step={effectiveMaxValue === 100 ? 1 : 10}
                                valueLabelDisplay="auto"
                            />
                        </div>
                    </div>
                )}

                <div className={error ? 'd-block error' : 'd-none'}>
                    {errorMessage}
                </div>
            </div>
        </div>
        </CustomToolTip>
    );
}

export default RangeMenuFeild;
