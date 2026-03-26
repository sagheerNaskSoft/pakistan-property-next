import { useState, useRef, useEffect } from "react";
import Slider from '@mui/material/Slider';
import { useNavigate } from "react-router-dom";
import { LuFilter } from "react-icons/lu";
import Checkbox from '@mui/material/Checkbox';
import CustomMultiSelect from "../Metiral/CustomMultiSelect ";
import { IoClose } from "react-icons/io5";

function InputSide() {
    const [save, setSave] = useState(false)
    const [priceSlider, setPriceSlider] = useState([0, 10000]);
    const [errorPrice, setErrorPrice] = useState(false);
    const [priceErrorMessage, setPriceErrorMessage] = useState('')
    const [areaSlider, setAreaSlider] = useState([0, 100]);
    const [focus, setFocus] = useState("");
    const [subMenu, setSubMenu] = useState(false);
    const [subName, setSubName] = useState("");
    const [tempSubTypes, setTempSubTypes] = useState([]);
    const [selectedSubTypes, setSelectedSubTypes] = useState([]);
    const [valid, setValid] = useState(false)
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [dropDown, setDropDown] = useState(false);
    const [filter, setFilter] = useState(false)
    const purposeRef = useRef(null);
    const cityRef = useRef(null);
    const typeRef = useRef(null);
    const areaRef = useRef(null);
    const priceRef = useRef(null);
    const BedroomRef = useRef(null);
    const BathroomRef = useRef(null);
    const SearchRef = useRef(null)
    const moreRef = useRef(null)
    const slideRef = useRef(null)
    const CityMenu = ["Lahore", "Karachi", "Islamabad", "Peshawar", "Faislabad"];
    const PurposeMenu = ["Buy", "Rent", "Lease"];
    const TypeMenu = ["Home", "Plots", "Commerical"];
    const moreMenu = ["Hot", "Superhot", "Verified", "New Listing"]
    const BedroomMenu = ["1", "2", "3", "4"]
    const BathroomMenu = ["1", "2", "3", "4"]
    const AreaSize = ["Kanal", "Marla", "Square meters", "Square yards", "Square feet"]
    const SubMenu = [
        { parent: "Home", options: ["House", "Flat", "Room", "Lower Portion", "Upper Portion", " Pent House", "Hostel", "Apartments", "Basement"] },
        { parent: "Plots", options: ["Residential PLot", "Commercial Plot", "Agriculture Land", "Industrial Land", "Plot File", "Plot Form"] },
        { parent: "Commerical", options: ["Office", "Shop", "Warehouse", "Factory", "Building", "Other"] },
    ];
    const PriceValue = [
        { code: "USD", symbol: "$" },
        { code: "EUR", symbol: "€" },
        { code: "GBP", symbol: "£" },
        { code: "SAR", symbol: "ر.س" },
        { code: "AED", symbol: "د.إ" },
        { code: "PKR", symbol: "Rs" }
    ];
    const [filterData, setFilterData] = useState({
        purpose: "",
        city: "",
        bedroom: [],
        bathroom: [],
        locations: "",
        search: "",
        more: [],
        priceRange: {
            min: "",
            max: "",
            priceValue: "PKR"
        },
        areaRange: {
            min: "",
            max: "",
            areaValue: "Marla"
        },
        propertyType: {
            type: "",
            subType: []
        }
    })

    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = [
                purposeRef.current,
                cityRef.current,
                typeRef.current,
                areaRef.current,
                priceRef.current,
                BathroomRef.current,
                BedroomRef.current,
                SearchRef.current,
                moreRef.current,
                slideRef.current
            ];

            const clickedInside = refs.some(ref => ref && ref.contains(event.target));

            if (!clickedInside) {
                setFocus("");
                setFilter(false);
                setSubMenu(false);
                setDropDown(false)
            }
            if (areaRef.current && !areaRef.current.contains(event.target)) {
                validateAreaRange();
            }
            if (priceRef.current && !priceRef.current.contains(event.target)) {
                validatePriceRange();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [areaSlider]);

    const handleReset = () => {
        const currentType = filterData?.propertyType?.type;
        const storedType = subName;

        if (currentType !== storedType) {
            setSelectedSubTypes([]);
            setTempSubTypes([]);

            setFilterData(prev => ({
                ...prev,
                propertyType: {
                    ...prev.propertyType,
                    type: storedType,
                    subType: [],
                }
            }));
        } else {
            setSelectedSubTypes([]);
            setTempSubTypes([]);
        }
    };

    const handleSubTypeChange = (opt) => {
        if (!filterData.propertyType.type) return;

        setTempSubTypes(prev =>
            prev.includes(opt)
                ? prev.filter(item => item !== opt)
                : [...prev, opt]
        );
        setSelectedSubTypes(prev =>
            prev.includes(opt)
                ? prev.filter(item => item !== opt)
                : [...prev, opt]
        );
    };

    const handleApply = () => {
        const currentSubTypes = filterData.propertyType.subType || [];
        const isSame =
            currentSubTypes.length === tempSubTypes.length &&
            currentSubTypes.every(val => tempSubTypes.includes(val));

        if (!isSame) {
            setSelectedSubTypes(tempSubTypes);
        }

        setFilterData(prev => ({
            ...prev,
            propertyType: {
                ...prev.propertyType,
                subType: tempSubTypes
            }
        }));

        setTempSubTypes([]);
    };

    useEffect(() => {
        if (filter) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        } else {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
        };
    }, [filter]);

    const handleAreaInput = (index, value) => {
        const numericValue = value === "" ? "" : Math.min(Number(value), 100);

        setAreaSlider((prevSlider) => {
            const newSlider = [...prevSlider];
            newSlider[index] = numericValue;
            return newSlider;
        });
        setFilterData((prev) => ({
            ...prev,
            areaRange: {
                ...prev.areaRange,
                [index === 0 ? "min" : "max"]: numericValue,
            },
        }));
    };

    const validateAreaRange = () => {
        let [min, max] = areaSlider;
        const minVal = min === "" ? null : Number(min);
        const maxVal = max === "" ? null : Number(max);
        if (minVal === null || maxVal === null || maxVal < minVal) {
            setError(true)
            setErrorMessage("Inputs are Empty or Invalid!")
            return;
        }
        setError(false);
        setErrorMessage("");
    };

    const applyAreaFilter = () => {
        const [minVal, maxVal] = areaSlider.map(val => Math.min(val, 100));
        setFilterData(prev => ({
            ...prev,
            areaRange: {
                ...prev.areaRange,
                min: minVal,
                max: maxVal
            }
        }));
    };

    const handlePriceInput = (index, value) => {
        const numericValue = value === "" ? "" : Number(value);
        setFilterData((prev) => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [index === 0 ? "min" : "max"]: numericValue,
            },
        }));
        setPriceSlider((prevSlider) => {
            const newSlider = [...prevSlider];
            newSlider[index] = numericValue;
            return newSlider;
        });
    };

    const validatePriceRange = () => {
        const minVal = filterData?.priceRange?.min;
        const maxVal = filterData?.priceRange?.max;
        if (
            minVal === null ||
            maxVal === null ||
            Number(maxVal) < Number(minVal)
        ) {
            setErrorPrice(true);
            setPriceErrorMessage("Inputs are Empty or Invalid!");
            return;
        }
        setErrorPrice(false);
        setPriceErrorMessage("");
    };

    const applyPriceFilter = () => {
        const [minVal, maxVal] = priceSlider.map(val => Math.min(val, 10000));
        setFilterData(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                min: minVal,
                max: maxVal
            }
        }));
    };
    const navigate = useNavigate()

    return (
        <>
            <div className="filter-side d-md-none d-block" ref={slideRef} style={{ height: filter ? "unset" : "30px", overflow: filter ? "unset" : "hidden" }}>
                <div className="filter" onClick={() => setFilter(!filter)}>Filter <LuFilter /></div>
                <div className={filter ? "slide-filter active" : "slide-filter"}>
                    <div className="row m-0 d-md-none d-flex" style={{ gap: "15px 0" }} >
                        <div className="close-btn" onClick={() => setFilter(!filter)}>
                            <IoClose />
                        </div>
                        {/* Search Input */}
                        <div className="col-lg-12">
                            <div className={focus === "search" || filterData?.search || valid ? "floating-input new-floating-input selected" : "floating-input new-floating-input"} ref={SearchRef} onClick={() => setFocus(focus === "search" ? "" : "search")}>
                                <div className="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M15.3643 14.8601L12.4651 11.9609C13.2552 10.9946 13.6436 9.76165 13.5501 8.517C13.4566 7.27235 12.8883 6.11125 11.9627 5.27388C11.0371 4.43651 9.82505 3.98692 8.57728 4.01812C7.32951 4.04932 6.14146 4.55891 5.25888 5.4415C4.3763 6.32408 3.8667 7.51213 3.83551 8.75989C3.80431 10.0077 4.25389 11.2197 5.09126 12.1453C5.92864 13.0709 7.08973 13.6392 8.33438 13.7327C9.57903 13.8262 10.812 13.4378 11.7783 12.6477L14.6775 15.5469C14.7691 15.6354 14.8918 15.6844 15.0192 15.6833C15.1465 15.6821 15.2683 15.6311 15.3584 15.541C15.4484 15.451 15.4995 15.3291 15.5006 15.2018C15.5017 15.0744 15.4528 14.9517 15.3643 14.8601ZM8.70665 12.775C7.93813 12.775 7.18687 12.5471 6.54787 12.1201C5.90887 11.6931 5.41084 11.0863 5.11674 10.3763C4.82264 9.66624 4.74569 8.88496 4.89562 8.13121C5.04555 7.37746 5.41562 6.68509 5.95905 6.14167C6.50247 5.59824 7.19484 5.22817 7.94859 5.07823C8.70234 4.9283 9.48362 5.00525 10.1936 5.29935C10.9037 5.59345 11.5105 6.09149 11.9375 6.73049C12.3645 7.36949 12.5923 8.12075 12.5923 8.88927C12.5912 9.91946 12.1814 10.9071 11.453 11.6356C10.7245 12.3641 9.73685 12.7738 8.70665 12.775Z" fill="#737678" />
                                    </svg>
                                </div>
                                {/* <input type="text" value={filterData?.search} onChange={(e) => setFilterData((prev) => ({ ...prev, search: e.target.value }))} /> */}
                                <label className={focus === "search" || filterData?.search || valid ? "focus" : ""}>Search the Area</label>
                                <CustomMultiSelect setValid={setValid} />
                            </div>
                        </div>
                        {/* Purpose Dropdown */}
                        <div className="col-lg-12">
                            <div className="floating-input" ref={purposeRef}>
                                <div
                                    className={focus === "purpose" || filterData?.purpose ? "select selected" : "select"}
                                    onClick={() => {
                                        setFocus(focus === "purpose" ? "" : "purpose");
                                        setSubMenu(false);
                                    }}
                                >
                                    <div className="select-value">
                                        {filterData?.purpose || " "}
                                    </div>
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="none"
                                        >
                                            {focus === "purpose" ? (
                                                // ↑ Green up arrow when focused
                                                <path
                                                    d="M9.47461 5.14258L5.43197 0.856863L1.38932 5.14258"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : filterData?.purpose ? (
                                                // ↓ Green down arrow when value is selected
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : (
                                                // ↓ Gray down arrow (default)
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#737678"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            )}
                                        </svg>
                                    </>
                                </div>
                                <label className={focus === "purpose" || filterData?.purpose ? "focus" : ""}>
                                    Purpose
                                </label>

                                {focus === "purpose" && (
                                    <div className="menu-box">
                                        {PurposeMenu.map((purpose) => (
                                            <div
                                                key={purpose}
                                                className={`menu ${filterData?.purpose === purpose ? "selected" : ""}`}
                                                onClick={() => {
                                                    setFilterData(prev => ({
                                                        ...prev,
                                                        purpose: purpose
                                                    }));
                                                    setFocus(""); // Immediately close after select
                                                }}
                                            >
                                                {purpose}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* City Dropdown */}
                        <div className="col-lg-12">
                            <div className="floating-input" ref={cityRef}>
                                <div
                                    className={focus === "city" || filterData?.city ? "select selected" : "select"}
                                    onClick={() => {
                                        setFocus(focus === "city" ? "" : "city");
                                        setSubMenu(false);
                                    }}
                                >
                                    <div className="select-value">
                                        {filterData?.city || " "}
                                    </div>
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="none"
                                        >
                                            {focus === "city" ? (
                                                // ↑ Green up arrow when focused
                                                <path
                                                    d="M9.47461 5.14258L5.43197 0.856863L1.38932 5.14258"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : filterData?.city ? (
                                                // ↓ Green down arrow when value is selected
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : (
                                                // ↓ Gray down arrow (default)
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#737678"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            )}
                                        </svg>
                                    </>
                                </div>
                                <label className={focus === "city" || filterData?.city ? "focus" : ""}>
                                    City
                                </label>

                                {focus === "city" && (
                                    <div className="menu-box">
                                        {CityMenu.map((city) => (
                                            <div
                                                key={city}
                                                className={`menu ${filterData?.city === city ? "selected" : ""}`}
                                                onClick={() => {
                                                    setFilterData(prev => ({
                                                        ...prev,
                                                        city: city
                                                    }));
                                                    setFocus(""); // Immediately close after select
                                                }}
                                            >
                                                {city}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Property Type Dropdown */}
                        <div className="col-lg-12">
                            <div className="floating-input" ref={typeRef}>
                                <div
                                    className={focus === "type" || filterData?.propertyType?.subType?.length ? "select selected" : "select"}
                                    onClick={() => setFocus(focus === "type" ? "" : "type")}
                                >
                                    <div className="select-value">
                                        {filterData.propertyType.subType.length > 0
                                            ? filterData.propertyType.subType.join(", ")
                                            : ""}
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="10"
                                        height="6"
                                        viewBox="0 0 10 6"
                                        fill="none"
                                    >
                                        {focus === "type" ? (
                                            <path
                                                d="M9.47461 5.14258L5.43197 0.856863L1.38932 5.14258"
                                                stroke="#698B75"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        ) : filterData?.propertyType?.subType?.length ? (
                                            <path
                                                d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                stroke="#698B75"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        ) : (
                                            <path
                                                d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                stroke="#737678"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        )}
                                    </svg>
                                </div>
                                <label className={focus === "type" || filterData?.propertyType?.subType?.length ? "focus" : ""}>
                                    Property Type
                                </label>

                                {focus === "type" && (
                                    <div className="menu-box">
                                        {TypeMenu.map((name) => (
                                            <div
                                                className={`menu ${subName === name ? "selected" : ""}`}
                                                onClick={() => {
                                                    setSubMenu(true);
                                                    setSubName(name);
                                                    setFilterData(prev => ({
                                                        ...prev,
                                                        propertyType: {
                                                            ...prev.propertyType,
                                                            type: name,
                                                        }
                                                    }));

                                                }}
                                                key={name}
                                            >
                                                {name}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="6"
                                                    height="10"
                                                    viewBox="0 0 6 10"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M0.857422 9.47559L5.14314 5.43294L0.857423 1.3903"
                                                        stroke="#2D2D2D"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {focus === "type" && subMenu && (
                                    <div className="sub-menu-box">
                                        <div className="menu-tabs">
                                            {SubMenu.find((item) => item.parent === subName)?.options.map((opt) => (
                                                <div
                                                    className={`sub-menu ${selectedSubTypes?.includes(opt) ? "selected" : ""}`}
                                                    key={opt}
                                                    onClick={() => handleSubTypeChange(opt)}

                                                >
                                                    {opt}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="btn-box">
                                            <div className="button btn-secondary-text-button" onClick={handleReset}>Reset</div>
                                            <div className="button btn-primary-button" onClick={() => {
                                                setFilterData(prev => ({
                                                    ...prev,
                                                    propertyType: {
                                                        ...prev.propertyType,
                                                        subType: []
                                                    }
                                                }));
                                                handleApply();
                                                setSubMenu(false);
                                                setFocus("")
                                            }
                                            }>Apply</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Area Range */}
                        <div className="col-lg-12">
                            <div className="floating-input" ref={areaRef}>
                                <div
                                    className={
                                        error
                                            ? "select  error-input"
                                            : focus === "area" || (filterData.areaRange.min && filterData.areaRange.max)
                                                ? "select selected"
                                                : "select"
                                    }

                                    onClick={() => {
                                        setFocus(focus === "area" ? "" : "area");
                                        setSubMenu(false);
                                    }}
                                >
                                    <div className="select-value">
                                        {filterData.areaRange.min && filterData.areaRange.max
                                            ? `${filterData.areaRange.min} - ${filterData.areaRange.max} ${filterData.areaRange.areaValue}`
                                            : " "}
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="10"
                                        height="6"
                                        viewBox="0 0 10 6"
                                        fill="none"
                                    >
                                        {focus === "area" ? (
                                            <path
                                                d="M9.47461 5.14258L5.43197 0.856863L1.38932 5.14258"
                                                stroke="#698B75"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        ) : filterData.areaRange.min && filterData.areaRange.max ? (
                                            <path
                                                d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                stroke="#698B75"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        ) : (
                                            <path
                                                d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                stroke="#737678"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        )}
                                    </svg>
                                </div>

                                <label
                                    className={
                                        focus === "area" || error ||
                                            (filterData.areaRange.min && filterData.areaRange.max)
                                            ? "focus"
                                            : ""
                                    }
                                >
                                    Area Range
                                </label>

                                {focus === "area" && (
                                    <div className="area-range">
                                        <div className="top">
                                            <div className="heading">Area Range</div>

                                            <div className="area" onClick={() => setDropDown(!dropDown)}>
                                                {filterData.areaRange.areaValue}
                                                {dropDown ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M8.60938 5.14258L4.56673 0.856863L0.524088 5.14258"
                                                            stroke="#444545"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M8.60938 0.857422L4.56673 5.14314L0.524088 0.857423"
                                                            stroke="#444545"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </div>

                                            {dropDown && (
                                                <div className="size-dropdown">
                                                    {AreaSize.map((size) => (
                                                        <div
                                                            className="size"
                                                            key={size}
                                                            onClick={() => {
                                                                setDropDown(false);
                                                                setFilterData((prev) => ({
                                                                    ...prev,
                                                                    areaRange: {
                                                                        ...prev.areaRange,
                                                                        areaValue: size,
                                                                    },
                                                                }));
                                                            }}

                                                        >
                                                            {size}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="value-box">
                                            <input
                                                type="number"
                                                className="value min"
                                                placeholder="Min"
                                                value={filterData?.areaRange?.min}
                                                onChange={(e) => handleAreaInput(0, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") applyAreaFilter();
                                                }}
                                            // onBlur={validateAreaRange}
                                            />

                                            <input
                                                type="number"
                                                className="value max"
                                                placeholder="Max"
                                                value={filterData?.areaRange?.max}
                                                onChange={(e) => handleAreaInput(1, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") applyAreaFilter();
                                                }}
                                            // onBlur={validateAreaRange}
                                            />
                                        </div>

                                        <div className="bottom">
                                            <div className="value">
                                                <span>0</span>
                                                <span>100</span>
                                            </div>
                                            <Slider
                                                className="slider"
                                                value={areaSlider.map(val => val === "" ? 0 : val)}
                                                onChange={(e, newValue) => {
                                                    setAreaSlider(newValue);
                                                    if (newValue[0] !== "" && newValue[1] !== "") {
                                                        applyAreaFilter();
                                                    }
                                                }}
                                                min={0}
                                                max={100}
                                                step={1}
                                                valueLabelDisplay="auto"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className={error ? "d-block error" : 'd-none'}>
                                    {errorMessage}
                                </div>
                            </div>
                        </div>
                        {/* Price Range */}
                        <div className="col-lg-12">
                            <div className="floating-input" ref={priceRef}>
                                <div
                                    className={
                                        errorPrice
                                            ? "select  error-input"
                                            : focus === "price" || (filterData.priceRange.min && filterData.priceRange.max)
                                                ? "select selected"
                                                : "select"
                                    }

                                    onClick={() => {
                                        setFocus(focus === "price" ? "" : "price");
                                        setSubMenu(false);
                                    }}
                                >
                                    <div className="select-value">
                                        {filterData.priceRange.min && filterData.priceRange.max
                                            ? `${filterData.priceRange.min} - ${filterData.priceRange.max} ${filterData.priceRange.priceValue}`
                                            : " "}
                                    </div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="10"
                                        height="6"
                                        viewBox="0 0 10 6"
                                        fill="none"
                                    >
                                        {focus === "price" ? (
                                            <path
                                                d="M9.47461 5.14258L5.43197 0.856863L1.38932 5.14258"
                                                stroke="#698B75"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        ) : filterData.priceRange.min && filterData.priceRange.max ? (
                                            <path
                                                d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                stroke="#698B75"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        ) : (
                                            <path
                                                d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                stroke="#737678"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        )}
                                    </svg>
                                </div>

                                <label
                                    className={
                                        focus === "price" || errorPrice ||
                                            (filterData.priceRange.min && filterData.priceRange.max)
                                            ? "focus"
                                            : ""
                                    }
                                >
                                    Price Range
                                </label>

                                {focus === "price" && (
                                    <div className="area-range">
                                        <div className="top">
                                            <div className="heading">Price Range</div>

                                            <div className="area" onClick={() => setDropDown(!dropDown)}>
                                                {filterData.priceRange.priceValue}
                                                {dropDown ? (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M8.60938 5.14258L4.56673 0.856863L0.524088 5.14258"
                                                            stroke="#444545"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="10"
                                                        height="6"
                                                        viewBox="0 0 10 6"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M8.60938 0.857422L4.56673 5.14314L0.524088 0.857423"
                                                            stroke="#444545"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                )}
                                            </div>

                                            {dropDown && (
                                                <div className="size-dropdown">
                                                    {PriceValue.map((size) => (
                                                        <div
                                                            className="size"
                                                            key={size}
                                                            onClick={() => {
                                                                setDropDown(false);
                                                                setFilterData((prev) => ({
                                                                    ...prev,
                                                                    priceRange: {
                                                                        ...prev.priceRange,
                                                                        priceValue: size.code,
                                                                    },
                                                                }));
                                                            }}
                                                        >
                                                            {size.code + " " + size.symbol}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="value-box">
                                            <input
                                                type="number"
                                                className="value min"
                                                placeholder="Min"
                                                value={filterData?.priceRange?.min}
                                                onChange={(e) => handlePriceInput(0, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") applyPriceFilter();
                                                }}
                                            // onBlur={validateAreaRange}
                                            />

                                            <input
                                                type="number"
                                                className="value max"
                                                placeholder="Max"
                                                value={filterData?.priceRange?.max}
                                                onChange={(e) => handlePriceInput(1, e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") applyPriceFilter();
                                                }}
                                            // onBlur={validateAreaRange}
                                            />
                                        </div>

                                        <div className="bottom">
                                            <div className="value">
                                                <span>0</span>
                                                <span>10000</span>
                                            </div>
                                            <Slider
                                                className="slider"
                                                value={priceSlider.map(val => val === "" ? 0 : val)}
                                                onChange={(e, newValue) => {
                                                    setPriceSlider(newValue);
                                                    if (newValue[0] !== "" && newValue[1] !== "") {
                                                        applyPriceFilter();
                                                    }
                                                }}
                                                min={0}
                                                max={10000}
                                                step={10}
                                                valueLabelDisplay="auto"
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className={errorPrice ? "d-block error" : 'd-none'}>
                                    {priceErrorMessage}
                                </div>
                            </div>
                        </div>
                        {/* Bathrooms Dropdown */}
                        <div className="col-lg-12">
                            <div className="floating-input" ref={BathroomRef}>
                                <div
                                    className={focus === "bathroom" || filterData?.bathroom?.length ? "select selected" : "select"}
                                    onClick={() => {
                                        setFocus(focus === "bathroom" ? "" : "bathroom");
                                        setSubMenu(false);
                                    }}
                                >
                                    <div className="select-value">
                                        {filterData?.bathroom?.length > 0
                                            ? `${filterData?.bathroom.join(", ")}${filterData?.bathroom?.length === 1 && filterData?.bathroom[0] === '1' ? " Bathroom" : " Bathrooms"}`
                                            : ""}
                                    </div>
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="none"
                                        >
                                            {focus === "bathroom" ? (
                                                // ↑ Green up arrow when focused
                                                <path
                                                    d="M9.47461 5.14258L5.43197 0.856863L1.38932 5.14258"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : filterData?.bathroom?.length ? (
                                                // ↓ Green down arrow when value is selected
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : (
                                                // ↓ Gray down arrow (default)
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#737678"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            )}
                                        </svg>
                                    </>
                                </div>
                                <label className={focus === "bathroom" || filterData?.bathroom?.length ? "focus" : ""}>
                                    Select Bathroom
                                </label>
                                {focus === "bathroom" && (
                                    <div className="menu-box">
                                        {BathroomMenu.map((num) => (
                                            <div
                                                key={num}
                                                className={`menu ${filterData?.bathroom?.includes(num) ? "selected" : ""}`}
                                                onClick={() => {
                                                    let updatedBathroom = [];

                                                    if (filterData?.bathroom?.includes(num)) {
                                                        // Remove the clicked item
                                                        updatedBathroom = filterData.bathroom.filter(item => item !== num);
                                                    } else {
                                                        // Add the item and sort the result
                                                        updatedBathroom = [...filterData.bathroom, num].sort((a, b) => a - b);
                                                    }

                                                    setFilterData({ ...filterData, bathroom: updatedBathroom });
                                                }}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Bedrooms Dropdown */}
                        <div className="col-lg-12">
                            <div className="floating-input" ref={BedroomRef}>
                                <div
                                    className={focus === "bedroom" || filterData?.bedroom?.length ? "select selected" : "select"}
                                    onClick={() => {
                                        setFocus(focus === "bedroom" ? "" : "bedroom");
                                        setSubMenu(false);
                                    }}
                                >
                                    <div className="select-value">
                                        {filterData?.bedroom?.length > 0
                                            ? `${filterData?.bedroom.join(", ")}${filterData?.bedroom?.length === 1 && filterData?.bedroom[0] === '1' ? " Bedroom" : " Bedrooms"}`
                                            : ""}
                                    </div>
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="none"
                                        >
                                            {focus === "bedroom" ? (
                                                // ↑ Green up arrow when focused
                                                <path
                                                    d="M9.47461 5.14258L5.43197 0.856863L1.38932 5.14258"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : filterData?.bedroom ? (
                                                // ↓ Green down arrow when value is selected
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : (
                                                // ↓ Gray down arrow (default)
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#737678"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            )}
                                        </svg>
                                    </>
                                </div>
                                <label className={focus === "bedroom" || filterData?.bedroom.length ? "focus" : ""}>
                                    Select Bedrooms
                                </label>

                                {focus === "bedroom" && (
                                    <div className="menu-box">
                                        {BedroomMenu.map((num) => (
                                            <div
                                                key={num}
                                                className={`menu ${filterData?.bedroom?.includes(num) ? "selected" : ""}`}
                                                onClick={() => {
                                                    let updatedBedrooms = [];

                                                    if (filterData?.bedroom?.includes(num)) {
                                                        // Remove the clicked item
                                                        updatedBedrooms = filterData.bedroom.filter(item => item !== num);
                                                    } else {
                                                        // Add the item and sort the result
                                                        updatedBedrooms = [...filterData.bedroom, num].sort((a, b) => a - b);
                                                    }

                                                    setFilterData({ ...filterData, bedroom: updatedBedrooms });
                                                }}
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* More Dropdown */}
                        <div className="col-lg-12">
                            <div className="floating-input" ref={moreRef}>
                                <div
                                    className={focus === "more" || filterData?.more?.length ? "select selected" : "select"}
                                    onClick={() => {
                                        setFocus(focus === "more" ? "" : "more");
                                        setSubMenu(false);
                                    }}
                                >
                                    <div className="select-value">
                                        {filterData?.more?.length > 0
                                            ? `${filterData?.more?.length > 0 ? filterData.more.join(", ") : ""}
                   `
                                            : ""}
                                    </div>
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            height="6"
                                            viewBox="0 0 10 6"
                                            fill="none"
                                        >
                                            {focus === "more" ? (
                                                // ↑ Green up arrow when focused
                                                <path
                                                    d="M9.47461 5.14258L5.43197 0.856863L1.38932 5.14258"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : filterData?.more ? (
                                                // ↓ Green down arrow when value is selected
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#698B75"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            ) : (
                                                // ↓ Gray down arrow (default)
                                                <path
                                                    d="M0.714844 0.857422L5.00056 5.14314L9.28627 0.857422"
                                                    stroke="#737678"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            )}
                                        </svg>
                                    </>
                                </div>
                                <label className={focus === "more" || filterData?.more.length ? "focus" : ""}>
                                    More
                                </label>

                                {focus === "more" && (
                                    <div className="more menu-box">
                                        {moreMenu.map((num) => (
                                            <div
                                                key={num}
                                                className="menu"
                                                onClick={() => {
                                                    let updatedMore = [];

                                                    if (filterData?.more?.includes(num)) {
                                                        updatedMore = filterData.more.filter(item => item !== num);
                                                    } else {
                                                        updatedMore = [...filterData.more, num];
                                                    }

                                                    setFilterData({ ...filterData, more: updatedMore });
                                                }}
                                            >
                                                <Checkbox
                                                    checked={filterData.more.includes(num)}
                                                    sx={{
                                                        color: "#737678",
                                                        padding: '1px',
                                                        '&.Mui-checked': {
                                                            color: "#447158",
                                                        },
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: 18,
                                                            borderRadius: '4px',
                                                            border: '1px solid #737678',
                                                        },
                                                        '&:hover .MuiSvgIcon-root': {
                                                            border: '0.8px solid green',
                                                            backgroundColor: 'rgba(0, 128, 0, 0.1)', 
                                                        },
                                                        '&.Mui-checked:hover .MuiSvgIcon-root': {
                                                            border: '0.8px solid green',
                                                        }
                                                    }}
                                                />
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                )}

                            </div>
                        </div>
                        {/* Button Box */}
                        <div className="col-lg-12 d-flex justify-content-end ms-auto">
                            <div className="button-box">
                                <div className="button btn-primary-button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z" fill="white" />
                                    </svg>
                                    Search</div>
                                <div className="button save btn-secondary-button" onClick={() => {
                                    setSave(!save)
                                    navigate("/saved-search")
                                }}>
                                    <svg className="save-svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={save ? "#698B75" : "none"}>
                                        <path d="M14.7188 5.25098C15.3865 5.24971 16.0482 5.37936 16.665 5.63477L16.6641 5.63574C17.2596 5.88143 17.8032 6.23756 18.2637 6.6875H18.2627C18.6665 7.08118 18.9995 7.54034 19.248 8.04492L19.3496 8.26367V8.26465C19.615 8.87935 19.7516 9.53448 19.75 10.208L19.7441 10.4482C19.7157 11.0105 19.5871 11.5789 19.3711 12.1426C19.1655 12.6823 18.8733 13.2281 18.5127 13.7646H18.5117C17.9392 14.6154 17.1659 15.4832 16.2275 16.3467C14.675 17.7742 13.1454 18.7568 13.0674 18.8066L12.6836 19.0518L12.6816 19.0527C12.266 19.3169 11.734 19.3169 11.3184 19.0527L11.3164 19.0518L10.9326 18.8066V18.8057C10.7618 18.698 9.27554 17.7302 7.77246 16.3467C6.83408 15.4832 6.0608 14.6154 5.48828 13.7646H5.4873C5.12582 13.2268 4.83534 12.6827 4.62891 12.1455C4.38151 11.5007 4.25003 10.8489 4.25 10.208C4.25 9.53532 4.38577 8.87989 4.65137 8.26465C4.90698 7.67273 5.27676 7.13632 5.73926 6.68652C6.20112 6.23588 6.74032 5.88208 7.33691 5.63574V5.63477C7.95575 5.37858 8.61088 5.25 9.2832 5.25C10.2188 5.25001 11.1333 5.50558 11.9287 5.98926C11.953 6.00404 11.976 6.02096 12 6.03613C12.0245 6.02068 12.0485 6.00431 12.0732 5.98926C12.8682 5.50591 13.7818 5.25128 14.7168 5.25098V5.25L14.7178 5.25098H14.7188Z" stroke="#698B75" strokeWidth="1.5" />
                                    </svg>
                                    Save
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InputSide
