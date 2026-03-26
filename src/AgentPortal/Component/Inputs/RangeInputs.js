import React, { useState, useRef, useEffect } from "react";
import "./Inputs.css";

function RangeInput({
    label,
    varName,
    min,
    max,
    maxValue = 100000,
    filterData,
    setFilterData,
    sliderValue,
    setSliderValue,
    design = "simple"
}) {
    const [focus, setFocus] = useState(false);
    const [error, setError] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputRef.current && !inputRef.current.contains(e.target)) {
                setFocus(false);
                validateRange();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sliderValue]);

    const handleInputChange = (index, val) => {
        const numeric = val === "" ? "" : Math.min(Number(val), maxValue);
        const newRange = [...sliderValue];
        newRange[index] = numeric;
        setSliderValue(newRange);

        setFilterData((prev) => ({
            ...prev,
            [varName]: {
                ...prev?.[varName],
                [index === 0 ? min : max]: numeric,
            },
        }));
    };

    const validateRange = () => {
        const [minVal, maxVal] = sliderValue;
        if (
            minVal === "" ||
            maxVal === "" ||
            isNaN(minVal) ||
            isNaN(maxVal) ||
            Number(maxVal) < Number(minVal)
        ) {
            setError("Invalid range values!");
        } else {
            setError("");
        }
    };

    return (
        <div
            ref={inputRef}
            className={`simple-range-input ${focus ? "focus" : ""} ${design === "dark" ? "dark" : ""
                }`}
        >
            {label && <label onClick={() => setFocus(true)}>{label}</label>}

            <div className="input-wrapper" onClick={() => setFocus(true)}>
                <input
                    type="number"
                    placeholder="Min"
                    value={sliderValue[0] ?? ""}
                    onChange={(e) => handleInputChange(0, e.target.value)}
                />
                <span>-</span>
                <input
                    type="number"
                    placeholder="Max"
                    value={sliderValue[1] ?? ""}
                    onChange={(e) => handleInputChange(1, e.target.value)}
                />
            </div>

            {error && <p className="error">{error}</p>}
        </div>
    );
}

export default RangeInput;
