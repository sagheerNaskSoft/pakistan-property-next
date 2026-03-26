import { useEffect, useRef, useState } from "react";
import "./SingleMenuField.css";
function SingleTypeFeild({
    filterData,
    setFilterData,
    varName,
    label,
    menuData,
    menuValue,
    optionSelect,
    type,
    input,
    design,
    staticValue,
    error,
    disabled
}) {
    const [focus, setFocus] = useState(false);
    const inputRef = useRef(null);
    const conversionRates = {
        "Square Feet ( Sq. Ft.)": 1,
        "Square Yards ( Sq. Yd.)": 9,       // 1 sq yd = 9 sq ft
        "Square Meters ( Sq. M.)": 10.7639, // 1 sq m = 10.7639 sq ft
        Marla: 225,              // 1 Marla = 225 sq ft
        Kanal: 4500,             // 1 Kanal = 4500 sq ft
        Acre: 43560,             // 1 Acre = 43560 sq ft
    }
    const handleConvert = (inpValue, fromUnitvalue, toUnitvalue) => {
        
        if (!inpValue || isNaN(inpValue)) {
            return;
        }

        // Step 1: Convert input value → square feet
        const valueInSqft = inpValue * conversionRates[fromUnitvalue];

        // Step 2: Convert sqft → target unit
        const convertedValue = valueInSqft / conversionRates[toUnitvalue];
        
        let totalArea = convertedValue*2
        if(totalArea>=1350 && totalArea<=2250){
            let notCoverdArea=totalArea/100*10
            let coveredArea=totalArea-notCoverdArea
            return Math.round(coveredArea)
        }
        if(totalArea>=2251 && totalArea<=3600){
            let notCoverdArea=totalArea/100*15
            let coveredArea=totalArea-notCoverdArea
            return Math.round(coveredArea)
        }
        if(totalArea>=3601 && totalArea<=4050){
            let notCoverdArea=totalArea/100*20
            let coveredArea=totalArea-notCoverdArea
            return Math.round(coveredArea)
        }
        if(totalArea>=4051 && totalArea<=6300){
            let notCoverdArea=totalArea/100*25
            let coveredArea=totalArea-notCoverdArea
            return Math.round(coveredArea)
        }
        if(totalArea>=6301 && totalArea<=8415){
            let notCoverdArea=totalArea/100*29.7
            let coveredArea=totalArea-notCoverdArea
            return Math.round(coveredArea)
        }
        if(totalArea>=8416 ){
            let notCoverdArea=totalArea/100*30
            let coveredArea=totalArea-notCoverdArea
            return Math.round(coveredArea)
        }
        else{
        return totalArea
        }
    };
    const onChange = async (e) => {
        const value = e.target.value;
        if (varName === "area_size") {
            let converted_value = await handleConvert(value,filterData?.area_unit?.name,"Square Feet ( Sq. Ft.)")
            setFilterData((prev) => ({
                ...prev,
                [varName]: value,
                coverd_area: converted_value
            }));
        }
        else {
            setFilterData((prev) => ({
                ...prev,
                [varName]: value,
            }));
        }

    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setFocus(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return (
        <div
            className={
                design === "simple"
                    ? focus ||
                        (optionSelect === "multiple"
                            ? filterData?.[varName]?.length > 0
                            : !!filterData?.[varName])
                        ? "single-input-field focus align-items-center simple-design"
                        : "single-input-field align-items-center simple-design"
                    : focus ||
                        (optionSelect === "multiple"
                            ? filterData?.[varName]?.length > 0
                            : !!filterData?.[varName])
                        ? "single-input-field focus align-items-center"
                        : "single-input-field align-items-center"
            }
            onClick={() => {
                setFocus(!focus);

            }}
            ref={inputRef}
            style={{ borderColor: error ? "var(--state-error)" : "" }}
        >
            <label>{label}</label>

            {input ? (
                <input
                style={{background:"none"}}
                    type={type ? type : "text"}
                    className="input-value input-value-input"
                    value={filterData?.[varName] ?? ""}
                    onChange={onChange}
                    disabled={disabled?true:false}
                />
            ) : (
                <div className="input-value">

                </div>
            )}
            <span className="staticValue">{staticValue}</span>
            {menuData ? (focus ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                >
                    <rect
                        width="18.8657"
                        height="20"
                        transform="translate(0.716309 0.714294)"
                        fill="white"
                    />
                    <path
                        d="M14.1917 12.8572L10.149 8.57146L6.10636 12.8572"
                        stroke="#698B75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M5.71436 7.85712L10.0001 12.1428L14.2858 7.85712"
                        stroke="#737678"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            )) : ""}
            <span className="menuValue">
                {menuValue ? menuValue : ""}
            </span>
            {error && <div className="error-para">{error}</div>}

        </div>
    );
}

export default SingleTypeFeild;
