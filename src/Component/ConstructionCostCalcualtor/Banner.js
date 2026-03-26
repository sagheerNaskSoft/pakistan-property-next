import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild";
import { useAuth } from "../../Context/ContextProvider";
import SingleTypeFeild from "../Metiral/InputField/SingleMenuFeild/SingleTypeFeild";
import PrimaryButton from "../Metiral/Button/PrimaryButton";

function ConstructionCalculator() {
    const { citiesList, areaUnit, buildSearchPayloadCostCalculate, objectToQueryString } = useAuth()
    const [showMoreFilters, setShowMoreFilters] = useState(false);
    const [data, setData] = useState({
        city: { app_code: "PP016", city: "Lahore" },
        area_size: "",
        area_unit: {
            id: 4,
            name: "Marla",
            code: "marla"
        },
        coverd_area: "",
        construction_type: "complete",
        construction_mode: "without_mterial",
        drowing_rooms: "1",
        living_rooms: "2",
        kitchens: "2",
        bathrooms: "4",
        bedrooms: "3",
    });
    const navigate = useNavigate()
    const searchAreaRef = useRef(null)
    
    const handleChange = (field, value) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };
    const toggleFilters = () => {
        setShowMoreFilters(!showMoreFilters);
    };
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
        let totalArea;
        if (toUnitvalue === "Square Feet ( Sq. Ft.)") {
            totalArea = convertedValue * 2
        }
        else {
            totalArea = convertedValue
        }
        if (totalArea >= 1350 && totalArea <= 2250) {
            let notCoverdArea = totalArea / 100 * 10
            let coveredArea = totalArea - notCoverdArea
            return Math.round(coveredArea)
        }
        if (totalArea >= 2251 && totalArea <= 3600) {
            let notCoverdArea = totalArea / 100 * 15
            let coveredArea = totalArea - notCoverdArea
            return Math.round(coveredArea)
        }
        if (totalArea >= 3601 && totalArea <= 4050) {
            let notCoverdArea = totalArea / 100 * 20
            let coveredArea = totalArea - notCoverdArea
            return Math.round(coveredArea)
        }
        if (totalArea >= 4051 && totalArea <= 6300) {
            let notCoverdArea = totalArea / 100 * 25
            let coveredArea = totalArea - notCoverdArea
            return Math.round(coveredArea)
        }
        if (totalArea >= 6301 && totalArea <= 8415) {
            let notCoverdArea = totalArea / 100 * 29.7
            let coveredArea = totalArea - notCoverdArea
            return Math.round(coveredArea)
        }
        if (totalArea >= 8416) {
            let notCoverdArea = totalArea / 100 * 30
            let coveredArea = totalArea - notCoverdArea
            return Math.round(coveredArea)
        }
        else {
            return totalArea
        }
    };
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        let errors = {};
        if (!data?.area_size || data?.area_size < 3) {
            errors.area_size = "Area size is required and must be greater or equal to 3";
        }
        if (!data?.coverd_area || data?.coverd_area<100) {
            errors.coverd_area = "Please enter minimum 100 square feet";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }
    const handleCalculate = async () => {
       if(validateForm()){
        let dataNew = { ...data }

        let dataToSearch = {}
        let convertedMarla = handleConvert(data?.area_size, data?.area_unit?.name, "Marla")
        if (convertedMarla > 1 && convertedMarla <= 7) {
            dataNew = { ...dataNew, bedrooms: 3, bathrooms: 4 }
        }
        if (convertedMarla > 7 && convertedMarla <= 18) {
            dataNew = { ...dataNew, bedrooms: 4, bathrooms: 5 }
        }
        if (convertedMarla > 18) {
            dataNew = { ...dataNew, bedrooms: 5, bathrooms: 6 }
        }
        if (!data?.coverd_area) {
            let convertedArea = handleConvert(data?.area_size, data?.area_unit?.name, "Square Feet ( Sq. Ft.)")
            dataToSearch = await buildSearchPayloadCostCalculate({ ...dataNew, coverd_area: convertedArea })
        }
        if (data?.coverd_area) {
            dataToSearch = await buildSearchPayloadCostCalculate(dataNew)
        }

        const queryString = objectToQueryString(dataToSearch);
        navigate(`/construction-cost-calculator/${dataNew?.area_size}-${dataNew?.area_unit?.code}-house-construction-cost-${dataNew?.city?.city}?${queryString}`)
       }
    };
    
    // 🟢 Handle search function
    const handleSearch = useCallback(() => {
        // Check if there's data to calculate (city and area_size)
        const hasData = data?.city && data?.area_size;
        
        if (hasData) {
            // Call handleCalculate directly - it will validate and navigate
            handleCalculate();
        }
    }, [data]);
    
    // 🟢 Enter key handler for search
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Only trigger if Enter is pressed
            if (event.key === 'Enter') {
                const target = event.target;
                const activeElement = document.activeElement;
                
                // Check if we're directly in a dropdown menu element
                const isInDropdownMenu = target.closest('.menu-box') || 
                                         target.closest('.custom-options') ||
                                         target.closest('.sub-menu-box');
                
                // Check if active element is in a dropdown
                const isActiveInDropdown = activeElement?.closest('.menu-box') || 
                                           activeElement?.closest('.custom-options') ||
                                           activeElement?.closest('.sub-menu-box');
                
                // Check if any dropdown is currently visible/open in the DOM
                const visibleDropdown = document.querySelector('.menu-box') || 
                                        document.querySelector('.custom-options') ||
                                        document.querySelector('.sub-menu-box');
                
                // Check if the focused input belongs to a dropdown component
                // For SingleMenuFeild: input is in .single-input-field.focus
                const singleInputContainer = activeElement?.closest('.single-input-field');
                const isSingleMenuInput = singleInputContainer && 
                    singleInputContainer.classList.contains('focus');
                
                // For CustomSingleSelect: input is in .main_iner inside .single-input-field.focus  
                const mainInerContainer = activeElement?.closest('.main_iner');
                const isCustomSelectInput = mainInerContainer && 
                    mainInerContainer.closest('.single-input-field')?.classList.contains('focus');
                
                // For MultiMenuField: check if in multi-input-field with focus
                const multiInputContainer = activeElement?.closest('.multi-input-field');
                const isMultiMenuInput = multiInputContainer && 
                    multiInputContainer.classList.contains('focus');
                
                // Check if the active element's dropdown is actually visible
                // This ensures we only block Enter when the specific dropdown is open
                const activeElementDropdown = singleInputContainer?.querySelector('.menu-box') ||
                                             mainInerContainer?.closest('.single-input-field')?.querySelector('.custom-options') ||
                                             multiInputContainer?.querySelector('.sub-menu-box');
                
                // If input is part of dropdown component AND its dropdown is visible, don't trigger search
                // (dropdown will handle Enter to select option)
                const isDropdownHandlingEnter = ((isSingleMenuInput || isCustomSelectInput || isMultiMenuInput) && activeElementDropdown);
                
                // Only trigger search if ALL of these are true:
                // 1. Not clicking directly in dropdown menu
                // 2. Active element is not in dropdown
                // 3. The specific dropdown for the active element is not handling the Enter key
                // 4. We're in the search area
                if (!isInDropdownMenu && 
                    !isActiveInDropdown && 
                    !isDropdownHandlingEnter &&
                    searchAreaRef.current?.contains(target)) {
                    event.preventDefault();
                    handleSearch();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleSearch]);

    return (
        <div className="main-cost-calulators" style={{ marginBottom: showMoreFilters ? "200px" : "" }}>
            <div className="main-container">

                <div className="cost-calculator">
                    <h1>Construction Cost Calculator</h1>
                    <p className="subtitle">
                        Get an instant, reliable estimate of your property construction cost in Pakistan, including materials, labour, and structure, based on the selected area and size.
                    </p>

                    <div className="calculator-box d-flex" style={{ flexDirection: "column" }} ref={searchAreaRef}>
                        {/* Form Fields Grid */}
                        <div className="cost-calulator-form-fields" style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr auto",
                            columnGap: "24px",
                            rowGap: "12px",
                            width: "100%"
                        }}>
                            {/* Row 1 */}
                            <div>
                                <SingleMenuFeild
                                    getVaiable={"city"}
                                    filterData={data}
                                    setFilterData={setData}
                                    varName={"city"}
                                    label={"City"}
                                    menuData={citiesList}
                                    optionSelect={"single"}
                                    input={true}
                                    storeKey={"app_code"}
                                />
                            </div>
                            <div>
                                <SingleTypeFeild
                                    getVaiable={"name"}
                                    filterData={data}
                                    setFilterData={setData}
                                    varName={"area_size"}
                                    label={"Area Size"}
                                    input={true}
                                    optionSelect={"single"}
                                    storeKey={"id"}
                                    type={'number'}
                                    staticValue={"Marla"}
                                    error={errors?.area_size}
                                />
                            </div>
                            <div>
                                <div className="btn-box" style={{marginTop: window.innerWidth <= 576 && errors?.area_size ? "6px" : ''}}>
                                    <PrimaryButton widthSize={"184px"} height={"50px"} text={"Calculate Cost"} onFunction={handleCalculate} />
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="d-sm-inline-block d-none">
                                {showMoreFilters ? (
                                    <SingleTypeFeild
                                        getVaiable={"name"}
                                        filterData={data}
                                        setFilterData={setData}
                                        varName={"coverd_area"}
                                        label={"Coverd Area"}
                                        input={true}
                                        optionSelect={"single"}
                                        storeKey={"id"}
                                        menuValue={"Sq.ft"}
                                        type={'number'}
                                        error={errors?.coverd_area}
                                    />
                                ) : null}
                            </div>
                            <div className="d-sm-inline-block d-none">
                                {showMoreFilters ? (
                                    <div className="form-group">
                                        <label>Construction Type</label>
                                        <div className="toggle-btns">
                                            <button
                                                className={data.construction_type === "grey_structure" ? "active" : ""}
                                                onClick={() => handleChange("construction_type", "grey_structure")}
                                            >
                                                Grey Structure
                                            </button>
                                            <button
                                                className={data.construction_type === "complete" ? "active" : ""}
                                                onClick={() => handleChange("construction_type", "complete")}
                                            >
                                                Complete
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                            <div className="d-sm-inline-block d-none">
                                <div className="cost-calculator-filter-button d-sm-block d-none" onClick={toggleFilters} style={{ cursor: 'pointer' }}>
                                    {showMoreFilters ? "Less Filters" : "More Filters"}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transform: showMoreFilters ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                                        <path d="M5.71387 7.85715L9.99958 12.1429L14.2853 7.85715" stroke="#2D2D2D" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            {showMoreFilters && (
                                <div className="d-sm-inline-block d-none">
                                    <div className="form-group">
                                        <label>Construction Mode</label>
                                        <div className="toggle-btns">
                                            <button
                                                className={data.construction_mode === "with_material" ? "active" : ""}
                                                onClick={() => handleChange("construction_mode", "with_material")}
                                            >
                                                With Material
                                            </button>
                                            <button
                                                className={data.construction_mode === "without_mterial" ? "active" : ""}
                                                onClick={() => handleChange("construction_mode", "without_mterial")}
                                            >
                                                Without Material
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>






                    </div>
                </div>
            </div>
        </div>
    );
}

export default ConstructionCalculator;
