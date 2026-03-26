import { useEffect, useState, useRef, useCallback } from "react";
import PrimaryButton from "../Metiral/Button/PrimaryButton";
import CustomSingleSelect from "../Metiral/CustomSingleSelect ";
import MultiMenuField from "../Metiral/InputField/MultiMenuField/MultiMenuField";
import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/ContextProvider";
import SingleTypeFeild from "../Metiral/InputField/SingleMenuFeild/SingleTypeFeild";

const icon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18.4379 17.8325L14.9589 14.3535C15.907 13.194 16.3731 11.7144 16.2609 10.2208C16.1487 8.72721 15.4667 7.33389 14.356 6.32905C13.2453 5.3242 11.7908 4.7847 10.2935 4.82214C8.79619 4.85958 7.37054 5.47109 6.31144 6.53019C5.25234 7.58929 4.64083 9.01494 4.60339 10.5123C4.56595 12.0096 5.10545 13.464 6.1103 14.5747C7.11514 15.6854 8.50846 16.3674 10.002 16.4796C11.4956 16.5919 12.9752 16.1257 14.1347 15.1776L17.6138 18.6567C17.7237 18.7629 17.8709 18.8216 18.0238 18.8203C18.1766 18.819 18.3228 18.7577 18.4308 18.6496C18.5389 18.5415 18.6002 18.3953 18.6015 18.2425C18.6029 18.0897 18.5441 17.9425 18.4379 17.8325ZM10.4488 15.3303C9.52654 15.3303 8.62503 15.0569 7.85823 14.5445C7.09143 14.0322 6.49378 13.3039 6.14086 12.4519C5.78795 11.5999 5.69561 10.6623 5.87552 9.75784C6.05544 8.85334 6.49953 8.0225 7.15164 7.37039C7.80375 6.71828 8.63459 6.27419 9.53909 6.09427C10.4436 5.91436 11.3811 6.0067 12.2332 6.35961C13.0852 6.71253 13.8134 7.31018 14.3258 8.07698C14.8381 8.84378 15.1116 9.74529 15.1116 10.6675C15.1102 11.9037 14.6185 13.089 13.7444 13.9631C12.8702 14.8373 11.685 15.329 10.4488 15.3303Z" fill="white" />
</svg>
function Banner() {
    const navigate = useNavigate()
    const { propertyType, citiesList, locationList, currentCity, setLocationList, getLOcation, buildSearchPayloadAgencies, objectToQueryString, agencyList } = useAuth()
    const [subMenu, setSubMenu] = useState()
    const searchAreaRef = useRef(null)

    const [filterData, setFilterData] = useState({
        city: currentCity,
        search: [],
        agency_name: "",
        propertyType: {
            type: "",
            subType: []
        }
    })

    useEffect(() => {
        const updateFilterData = async () => {
            try {
                // Clear locations when city changes
                setFilterData(prev => ({
                    ...prev,
                    locations: []
                }));

                if (!filterData?.city?.app_code) return;

                const locationResult = await getLOcation({
                    city_code: filterData?.city?.app_code,
                });
                setLocationList(locationResult?.data || []);
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        updateFilterData();
    }, [filterData?.city]);

    const purposeId = 1;
    useEffect(() => {
        if (purposeId === 1) {
            const selectedId = purposeId;
            let subPropertyType = propertyType?.find(
                (item) => item?.id === selectedId
            )?.categories;
            setSubMenu(subPropertyType || []);
        }
    }, [filterData?.purpose, propertyType]);

    // 🟢 Handle search function
    const handleSearch = useCallback(async () => {
        // Check if there's data to search (city, locations, agency_name, propertyType, etc.)
        const hasData = filterData?.city || 
                       (filterData?.search && filterData?.search?.length > 0) ||
                       filterData?.agency_name ||
                       filterData?.propertyType?.type ||
                       (filterData?.propertyType?.subType && filterData?.propertyType?.subType?.length > 0);
        
        if (hasData) {
            const data = await buildSearchPayloadAgencies(filterData);
            const queryString = objectToQueryString(data);
            navigate(`/agency-listing?${queryString}`);
        }
    }, [filterData, buildSearchPayloadAgencies, objectToQueryString, navigate]);

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
        <div className="agency-banner">
           <div className="main-container">
           <div className="text-box">
                <div className="heading">Access Top Real Estate Agencies in Pakistan</div>
                <div className="para">Connect with reliable real estate agencies in Pakistan that make buying, selling, or renting simple and secure. Pakistan Property portal helps you reach verified agents and top agencies.</div>
            </div>
            <div className="input-box" ref={searchAreaRef}>
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
                {/* Search */}
                <div className="input">
                    <CustomSingleSelect zindex={true} left={'12px'}
                        getVaiable={'name'} optionSelect={"multiple"} filterData={filterData} setFilterData={setFilterData} varName={"locations"} label={"Search the Area"} menuData={locationList} type={'menu selected'} clearOnChange={true}
                    />
                </div>
                {/* Property Type */}
               
                {/* City */}

                {/* Button */}
                <div className="button"
                    onClick={handleSearch}>
                    <PrimaryButton height={'50px'} icon={icon} text={"Search"} padding={true} />
                </div>
                <div className="input">
                    <MultiMenuField filterData={filterData} setFilterData={setFilterData} varName={'propertyType'} type={'type'} subType={"subType"} label={"Property Type"} menuData={subMenu} />
                </div>
                {/* Agency Name */}
                <div className="input">
                    <SingleTypeFeild
                        filterData={filterData}
                        setFilterData={setFilterData}
                        varName={"agency_name"}
                        label={"Agency Name"}
                        input={true}
                    />
                </div>
            </div>
           </div>
        </div>
    )
}

export default Banner
