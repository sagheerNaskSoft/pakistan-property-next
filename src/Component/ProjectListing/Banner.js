import React, { useEffect, useRef, useState, useCallback } from 'react'

import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild";
import SingleTypeFeild from "../Metiral/InputField/SingleMenuFeild/SingleTypeFeild";
import MultiMenuField from "../Metiral/InputField/MultiMenuField/MultiMenuField";
import RangeMenuFeild from "../Metiral/InputField/RangeMenuField/RangeMenuFeild";
import CustomSingleSelect from "../Metiral/CustomSingleSelect ";
import { useAuth } from '../../Context/ContextProvider';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
function Banner({ setFilterData, filterData , setOpen ,open }) {
    const [focus, setFocus] = useState("");
    const [priceSlider, setPriceSlider] = useState([0, 10000]);
    const [areaSlider, setAreaSlider] = useState([0, 100]);
    const { citiesList, projectTypeData, areaUnit, buildSearchPayload, objectToQueryString, locationList, getLOcation, setLocationList, parseQueryParams } = useAuth()
    const [propertyType, setPropertyType] = useState([])
    const navigate = useNavigate()
    const location = useLocation()

    const PriceValue = [
        { code: "USD", symbol: "$" },
        { code: "EUR", symbol: "€" },
        { code: "GBP", symbol: "£" },
        { code: "SAR", symbol: "ر.س" },
        { code: "AED", symbol: "د.إ" },
        { code: "PKR", symbol: "Rs" }
    ];
    const options1 = [
        { name: 'DHA Phase 8', id: 1 },
        { name: 'DHA Phase 5', id: 2 },
        { name: 'Askari 10', id: 3 },
        { name: 'Johar Town', id: 4 },
        { name: 'Bahria Town', id: 5 },
        { name: 'DHA Phase 8 Ex park View', id: 6 },
    ];

    const SearchDeveloperRef = useRef(null)
    const SearchProjectRef = useRef(null)
    const searchAreaRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = [
                SearchDeveloperRef.current,
                SearchProjectRef.current
            ];

            const clickedInside = refs.some(ref => ref && ref.contains(event.target));

            if (!clickedInside) {
                setFocus("");
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const params = useParams()
    const prevCityRef = useRef(null);
    
    useEffect(() => {

        const selectedTypes = projectTypeData?.find((item) => item.name?.toLowerCase().replace(/\s+/g, "-") === params?.slug)
        setPropertyType(selectedTypes?.sub_categories);
    }, [params.slug, projectTypeData]);

    // Fetch locations when city changes
    useEffect(() => {
        const currentCityCode = filterData?.city?.app_code;
        const prevCityCode = prevCityRef.current;
        
        // Only fetch if city actually changed
        if (currentCityCode !== prevCityCode) {
            const fetchLocations = async () => {
                if (currentCityCode) {
                    try {
                        const locationResult = await getLOcation({
                            city_code: currentCityCode,
                        });
                        setLocationList(locationResult?.data || []);
                    } catch (error) {
                        console.error("Error fetching locations:", error);
                    }
                } else {
                    setLocationList([]);
                }
                // Clear locations when city changes (unless we're loading from URL)
                if (!location.search) {
                    setFilterData((prev) => ({
                        ...prev,
                        locations: []
                    }));
                }
            };
            fetchLocations();
            prevCityRef.current = currentCityCode;
        }
    }, [filterData?.city?.app_code]);

    // Set locations from URL parameters
    useEffect(() => {
        const setLocationsFromURL = async () => {
            if (!location.search) return;
            
            try {
                const parsed = await parseQueryParams(location.search);
                
                // Check if location_id exists in URL (could be array or single value)
                if (parsed?.location_id) {
                    const locationIds = Array.isArray(parsed.location_id) 
                        ? parsed.location_id 
                        : [parsed.location_id];
                    
                    // If we have a city and locationList is available
                    if (filterData?.city?.app_code) {
                        // If locationList is not loaded yet, fetch it first
                        if (!locationList?.length) {
                            try {
                                const locationResult = await getLOcation({
                                    city_code: filterData.city.app_code,
                                });
                                setLocationList(locationResult?.data || []);
                                
                                // Match locations after fetching
                                const matchedLocations = locationResult?.data?.filter((item) =>
                                    locationIds.includes(item?.id?.toString()) || locationIds.includes(item?.id)
                                ) || [];
                                
                                // Only update if locations are different
                                const currentLocationIds = filterData?.locations?.map(loc => loc?.id?.toString() || loc?.id) || [];
                                const newLocationIds = matchedLocations.map(loc => loc?.id?.toString() || loc?.id);
                                
                                const areLocationsDifferent = 
                                    currentLocationIds.length !== newLocationIds.length ||
                                    !currentLocationIds.every(id => newLocationIds.includes(id));
                                
                                if (matchedLocations.length > 0 && areLocationsDifferent) {
                                    setFilterData((prev) => ({
                                        ...prev,
                                        locations: matchedLocations
                                    }));
                                }
                            } catch (error) {
                                console.error("Error fetching locations:", error);
                            }
                        } else {
                            // Match locations from existing locationList
                            const matchedLocations = locationList.filter((item) =>
                                locationIds.includes(item?.id?.toString()) || locationIds.includes(item?.id)
                            ) || [];
                            
                            // Only update if locations are different
                            const currentLocationIds = filterData?.locations?.map(loc => loc?.id?.toString() || loc?.id) || [];
                            const newLocationIds = matchedLocations.map(loc => loc?.id?.toString() || loc?.id);
                            
                            const areLocationsDifferent = 
                                currentLocationIds.length !== newLocationIds.length ||
                                !currentLocationIds.every(id => newLocationIds.includes(id));
                            
                            if (matchedLocations.length > 0 && areLocationsDifferent) {
                                setFilterData((prev) => ({
                                    ...prev,
                                    locations: matchedLocations
                                }));
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Error parsing query params:", error);
            }
        };
        
        setLocationsFromURL();
    }, [location.search, filterData?.city?.app_code, locationList]);

    // const goToNext = async () => {
    //     const data = await buildSearchPayload({ ...filterData })
    //     const queryString = objectToQueryString(data);
    //     navigate(`/project-listing/${params.slug}?${queryString}`);
    // }

    // 🟢 Handle search function
    const handleSearch = useCallback(async () => {
        // Check if there's data to search (city, locations, developer_title, project_title, propertyType, etc.)
        const hasData = filterData?.city || 
                       (filterData?.locations && filterData?.locations?.length > 0) ||
                       filterData?.developer_title ||
                       filterData?.project_title ||
                       filterData?.propertyType?.type ||
                       (filterData?.propertyType?.subType && filterData?.propertyType?.subType?.length > 0) ||
                       filterData?.priceRange?.min ||
                       filterData?.priceRange?.max ||
                       filterData?.areaRange?.min ||
                       filterData?.areaRange?.max;
        
        if (hasData) {
            const data = await buildSearchPayload({ ...filterData });
            const queryString = objectToQueryString(data);
            navigate(`/project-listing/${params.slug}?${queryString}`);
        }
    }, [filterData, buildSearchPayload, objectToQueryString, navigate, params]);

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
        <div className={`banner_listing_project ${open ? "open" : ""}`}>
           <div className="position-relative h-100">
           <div className="d-sm-none d-flex">
                <div className=" d-sm-none w-100 d-flex justify-content-between align-items-center" style={{ borderBottom: '1px solid #bbb', padding: "8px 16px" }}>
                    <div className="global-input-section-title">
                        Filters
                    </div>
                    <div className="input-section-close-btn d-sm-none d-flex justify-content-center align-items-center" onClick={() => setOpen(false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D" />
                            <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
                        </svg>
                    </div>
                </div>
            </div>
            <div style={{ top: "44px" }} className="project-input-area" ref={searchAreaRef}>
                <div className="input">
                    <SingleMenuFeild filterData={filterData} setFilterData={setFilterData} varName={'city'} label={"City"} getVaiable={"city"} menuData={citiesList} optionSelect={"single"} input={true} />
                </div>
                <div className="input">
                    <CustomSingleSelect zindex={true} left={'12px'} moreOption={1}
                        getVaiable={'name'} optionSelect={"multiple"} filterData={filterData} setFilterData={setFilterData} varName={"locations"} label={"Search the Area"} menuData={locationList} type={'menu selected'}
                    />
                </div>
                <div className="input">
                    <MultiMenuField filterData={filterData} setFilterData={setFilterData} varName={'propertyType'} type={'type'} subType={"subType"} label={"Property Type"} menuData={propertyType} />
                </div>
                <div className="input">
                    <RangeMenuFeild type={'double'} label={"Price Range"} filterData={filterData} setFilterData={setFilterData} varName={'priceRange'} min={'min'} max={"max"} value={'priceValue'} menuData={PriceValue} sliderValue={priceSlider} setSliderValue={setPriceSlider} maxValue={10000} />
                </div>
                <div className="button-box d-sm-block d-none">
                    <div
                        onClick={() => handleSearch()}
                        className="button btn-primary-button" style={{ height: "50px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18.4379 17.8325L14.9589 14.3535C15.907 13.194 16.3731 11.7144 16.2609 10.2208C16.1487 8.72721 15.4667 7.33389 14.356 6.32905C13.2453 5.3242 11.7908 4.7847 10.2935 4.82214C8.79619 4.85958 7.37054 5.47109 6.31144 6.53019C5.25234 7.58929 4.64083 9.01494 4.60339 10.5123C4.56595 12.0096 5.10545 13.464 6.1103 14.5747C7.11514 15.6854 8.50846 16.3674 10.002 16.4796C11.4956 16.5919 12.9752 16.1257 14.1347 15.1776L17.6138 18.6567C17.7237 18.7629 17.8709 18.8216 18.0238 18.8203C18.1766 18.819 18.3228 18.7577 18.4308 18.6496C18.5389 18.5415 18.6002 18.3953 18.6015 18.2425C18.6029 18.0897 18.5441 17.9425 18.4379 17.8325ZM10.4488 15.3303C9.52654 15.3303 8.62503 15.0569 7.85823 14.5445C7.09143 14.0322 6.49378 13.3039 6.14086 12.4519C5.78795 11.5999 5.69561 10.6623 5.87552 9.75784C6.05544 8.85334 6.49953 8.0225 7.15164 7.37039C7.80375 6.71828 8.63459 6.27419 9.53909 6.09427C10.4436 5.91436 11.3811 6.0067 12.2332 6.35961C13.0852 6.71253 13.8134 7.31018 14.3258 8.07698C14.8381 8.84378 15.1116 9.74529 15.1116 10.6675C15.1102 11.9037 14.6185 13.089 13.7444 13.9631C12.8702 14.8373 11.685 15.329 10.4488 15.3303Z" fill="white" />
                        </svg>
                        Search</div>
                </div>
                <div className="input">
                    <RangeMenuFeild label={"Area Range"} filterData={filterData} setFilterData={setFilterData} varName={'areaRange'} min={'min'} max={"max"} value={'areaValue'} menuData={areaUnit} sliderValue={areaSlider} setSliderValue={setAreaSlider} maxValue={100} />
                </div>
                <div className="input">
                    <SingleTypeFeild filterData={filterData} setFilterData={setFilterData} varName={"developer_title"} label={"Search Developer Title"} input={true} type={'text'} />
                </div>
                <div className="input">
                    <SingleTypeFeild filterData={filterData} setFilterData={setFilterData} varName={"project_title"} label={"Search Project Title"} input={true} type={'text'} />
                </div>

            </div>
            <div className="button-box d-sm-none d-block">
                    <div
                        onClick={() => {handleSearch() ; setOpen(false)}}
                        className="button btn-primary-button" style={{ height: "50px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18.4379 17.8325L14.9589 14.3535C15.907 13.194 16.3731 11.7144 16.2609 10.2208C16.1487 8.72721 15.4667 7.33389 14.356 6.32905C13.2453 5.3242 11.7908 4.7847 10.2935 4.82214C8.79619 4.85958 7.37054 5.47109 6.31144 6.53019C5.25234 7.58929 4.64083 9.01494 4.60339 10.5123C4.56595 12.0096 5.10545 13.464 6.1103 14.5747C7.11514 15.6854 8.50846 16.3674 10.002 16.4796C11.4956 16.5919 12.9752 16.1257 14.1347 15.1776L17.6138 18.6567C17.7237 18.7629 17.8709 18.8216 18.0238 18.8203C18.1766 18.819 18.3228 18.7577 18.4308 18.6496C18.5389 18.5415 18.6002 18.3953 18.6015 18.2425C18.6029 18.0897 18.5441 17.9425 18.4379 17.8325ZM10.4488 15.3303C9.52654 15.3303 8.62503 15.0569 7.85823 14.5445C7.09143 14.0322 6.49378 13.3039 6.14086 12.4519C5.78795 11.5999 5.69561 10.6623 5.87552 9.75784C6.05544 8.85334 6.49953 8.0225 7.15164 7.37039C7.80375 6.71828 8.63459 6.27419 9.53909 6.09427C10.4436 5.91436 11.3811 6.0067 12.2332 6.35961C13.0852 6.71253 13.8134 7.31018 14.3258 8.07698C14.8381 8.84378 15.1116 9.74529 15.1116 10.6675C15.1102 11.9037 14.6185 13.089 13.7444 13.9631C12.8702 14.8373 11.685 15.329 10.4488 15.3303Z" fill="white" />
                        </svg>
                        Search</div>
                </div>
           </div>
        </div>
    )
}

export default Banner