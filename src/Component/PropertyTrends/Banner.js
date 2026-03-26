import { useEffect, useState, useRef, useCallback } from "react";
import { useAuth } from "../../Context/ContextProvider";
import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild";
import PrimaryButton from "../Metiral/Button/PrimaryButton";
import { useNavigate } from "react-router-dom";

const searchIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
            d="M18.436 17.8321L14.9569 14.353C15.905 13.1935 16.3712 11.7139 16.2589 10.2203C16.1467 8.72672 15.4647 7.33341 14.354 6.32856C13.2433 5.32371 11.7889 4.78421 10.2916 4.82165C8.79424 4.85909 7.36858 5.4706 6.30948 6.5297C5.25038 7.5888 4.63887 9.01445 4.60144 10.5118C4.564 12.0091 5.1035 13.4635 6.10834 14.5742C7.11319 15.6849 8.50651 16.3669 10.0001 16.4792C11.4937 16.5914 12.9732 16.1252 14.1328 15.1772L17.6118 18.6562C17.7218 18.7624 17.869 18.8211 18.0218 18.8198C18.1746 18.8185 18.3208 18.7572 18.4289 18.6491C18.537 18.541 18.5983 18.3949 18.5996 18.242C18.6009 18.0892 18.5422 17.942 18.436 17.8321ZM10.4468 15.3299C9.52459 15.3299 8.62308 15.0564 7.85628 14.544C7.08948 14.0317 6.49183 13.3034 6.13891 12.4514C5.78599 11.5994 5.69365 10.6619 5.87357 9.75735C6.05349 8.85285 6.49758 8.02201 7.14969 7.3699C7.8018 6.71779 8.63263 6.2737 9.53714 6.09378C10.4416 5.91387 11.3792 6.00621 12.2312 6.35913C13.0832 6.71205 13.8115 7.30969 14.3238 8.07649C14.8362 8.84329 15.1096 9.7448 15.1096 10.667C15.1083 11.9033 14.6165 13.0885 13.7424 13.9626C12.8682 14.8368 11.683 15.3285 10.4468 15.3299Z"
            fill="white"
        />
    </svg>
);

function Banner() {
    const { citiesList, currentCity, locationList, buildSearchPayloadCPropertyTrend, objectToQueryString } = useAuth();

    const [activeTab, setActiveTab] = useState("buy");
    const [filterData, setFilterData] = useState({
        purpose: activeTab === "buy" ? "1" : "2",
        city: currentCity,
        location: "",
    });

    const navigate = useNavigate();
    const searchAreaRef = useRef(null);
    
    useEffect(() => {
        setFilterData((prev) => ({
            ...prev,
            city: currentCity,
            location: "",
        }));
    }, [currentCity]);

    useEffect(() => {
        setFilterData((prev) => ({
            ...prev,
            purpose: activeTab === "buy" ? "1" : "2",
        }));
    }, [activeTab]);

    const handleNaviagte = async () => {
        const data = await buildSearchPayloadCPropertyTrend(filterData);
        const queryString = objectToQueryString(data);
        navigate(`/property-trend-detail?${queryString}`);
    };

    // 🟢 Handle search function
    const handleSearch = useCallback(async () => {
        // Check if there's data to search (city or location)
        const hasData = filterData?.city || filterData?.location;
        
        if (hasData) {
            const data = await buildSearchPayloadCPropertyTrend(filterData);
            const queryString = objectToQueryString(data);
            navigate(`/property-trend-detail?${queryString}`);
        }
    }, [filterData, buildSearchPayloadCPropertyTrend, objectToQueryString, navigate]);

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
                
                // If input is part of dropdown component AND dropdown is visible, don't trigger search
                // (dropdown will handle Enter to select option)
                const isDropdownHandlingEnter = (isSingleMenuInput || isCustomSelectInput || isMultiMenuInput) && visibleDropdown;
                
                // Only trigger search if ALL of these are true:
                // 1. Not clicking directly in dropdown menu
                // 2. Active element is not in dropdown
                // 3. Dropdown is not handling the Enter key
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
        <div className="property-index-banner property-trend-banner">
            <div className="main-container">
                <div className="text-box">
                    <div className="heading">Check Real-Time Property Trends in Pakistan</div>
                    <div className="para">Get the newest insights on Pakistan’s property market across top cities.</div>

                    <div className="input-section" ref={searchAreaRef}>
                        {/* Tabs */}
                        <div className="button-box">
                            <div className={`button ${activeTab === "buy" ? "active" : ""}`} onClick={() => setActiveTab("buy")}>
                                Buy
                            </div>
                            <div className={`button ${activeTab === "rent" ? "active" : ""}`} onClick={() => setActiveTab("rent")}>
                                Rent
                            </div>
                        </div>

                        {/* Input Fields */}
                        <div className="input-box">
                            <div className="input">
                                <SingleMenuFeild
                                    getVaiable={"city"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"city"}
                                    label={"City"}
                                    menuData={citiesList}
                                    optionSelect={"single"}
                                    input={true}
                                    storeKey={"app_code"}
                                />
                            </div>

                            <div style={{ width: "300px" }} className="input">
                                <SingleMenuFeild
                                    getVaiable={"name"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"location"}
                                    label={"Location"}
                                    menuData={locationList}
                                    optionSelect={"single"}
                                    input={true}
                                    storeKey={"id"}
                                />
                            </div>

                            <div className="search-button">
                                <PrimaryButton widthSize={"120px"} onFunction={handleSearch} height={"50px"} text={"Search"} icon={searchIcon} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
