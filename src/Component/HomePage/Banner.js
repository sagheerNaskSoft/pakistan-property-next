import React, { useEffect, useRef, useState, useCallback } from 'react';
import Button from '../Metiral/Button';
import CustomSingleSelect from '../Metiral/CustomSingleSelect ';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/ContextProvider';
import Image from 'next/image';
import img1 from '../../Asset/BG.webp'; // >= 2440px
import img2 from '../../Asset/BG.webp';  // 1880px - 1440px
import img3 from '../../Asset/HomePage/homepagebg.webp'; // 1440px - 568px (current)
import img4 from '../../Asset/HomePage/xs-banner.png'; // < 568px
import SingleMenuFeild from '../Metiral/InputField/SingleMenuFeild/SingleMenuFeild';
function Banner() {
    const {
        citiesList,
        locationList,
        propertyType,
        buildSearchPayloadProperty,
        getLOcation,
        setLocationList,
        currentCity,
        objectToQueryString
    } = useAuth();

    const [filterData, setFilterData] = useState({
        city: currentCity,
        area: [],
        property_type_id: ""
    });

    const prevCityRef = useRef(null);
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(img3);
    const searchBoxRef = useRef(null);
    // Handle responsive image based on screen width
    useEffect(() => {
        const updateImage = () => {
            const width = window.innerWidth;
            if (width > 1880) {
                setCurrentImage(img1);
            } else if (width >= 1440) {
                setCurrentImage(img2);
            } else if (width >= 568) {
                setCurrentImage(img3);
            } else {
                setCurrentImage(img4);
            }
        };

        updateImage();
        window.addEventListener('resize', updateImage);
        return () => window.removeEventListener('resize', updateImage);
    }, []);


    useEffect(() => {
        const updateFiltersAndFetch = async () => {
            let updatedFilterData = { ...filterData };

            if (propertyType?.length) {
                 updatedFilterData.property_type_id = propertyType[0]?.id;
            }
            if (currentCity?.app_code) {
                updatedFilterData.city = currentCity;
            }
            // update state
            setFilterData((prev) => ({ ...prev, ...updatedFilterData }));

            // fetch locations only if city changed
            if (updatedFilterData?.city?.app_code) {
                try {
                    const locationResult = await getLOcation({
                        city_code: updatedFilterData.city.app_code,
                    });
                    setLocationList(locationResult?.data || []);
                 
                    
                } catch (error) {
                    console.error("Error fetching locations:", error);
                }
            }
        };

        updateFiltersAndFetch();
    }, [propertyType, currentCity]); // 👈 only depend on propertyType & city
    
    // 🟢 Handle search function
    const handleSearch = useCallback(async () => {
        // Check if there's data to search (city or area selected)
        const hasData = filterData?.city || (filterData?.area && filterData?.area?.length > 0);
        
        if (hasData) {
            const data = await buildSearchPayloadProperty(filterData);
            const queryString = objectToQueryString(data);
            navigate(`/properties?${queryString}`, { state: filterData });
        }
    }, [filterData, navigate, buildSearchPayloadProperty, objectToQueryString]);

    // 🟢 Enter key handler for search
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Only trigger if Enter is pressed
            if (event.key === 'Enter') {
                const target = event.target;
                const activeElement = document.activeElement;
                
                // Check if we're directly in a dropdown menu element
                const isInDropdownMenu = target.closest('.menu-box') || target.closest('.custom-options');
                
                // Check if active element is in a dropdown
                const isActiveInDropdown = activeElement?.closest('.menu-box') || activeElement?.closest('.custom-options');
                
                // Check if any dropdown is currently visible/open in the DOM
                const visibleDropdown = document.querySelector('.menu-box') || document.querySelector('.custom-options');
                
                // Check if the focused input belongs to a dropdown component
                // For SingleMenuFeild: input is in .single-input-field.focus
                const singleInputContainer = activeElement?.closest('.single-input-field');
                const isSingleMenuInput = singleInputContainer && 
                    singleInputContainer.classList.contains('focus');
                
                // For CustomSingleSelect: input is in .main_iner inside .single-input-field.focus  
                const mainInerContainer = activeElement?.closest('.main_iner');
                const isCustomSelectInput = mainInerContainer && 
                    mainInerContainer.closest('.single-input-field')?.classList.contains('focus');
                
                // If input is part of dropdown component AND dropdown is visible, don't trigger search
                // (dropdown will handle Enter to select option)
                const isDropdownHandlingEnter = (isSingleMenuInput || isCustomSelectInput) && visibleDropdown;
                
                // Only trigger search if ALL of these are true:
                // 1. Not clicking directly in dropdown menu
                // 2. Active element is not in dropdown
                // 3. No visible dropdown OR input is not part of dropdown component
                // 4. Dropdown is not handling the Enter key
                // 5. We're in the search box area
                if (!isInDropdownMenu && 
                    !isActiveInDropdown && 
                    !isDropdownHandlingEnter &&
                    searchBoxRef.current?.contains(target)) {
                    event.preventDefault();
                    handleSearch();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleSearch]);

    return (
        <div className='banner-home'>
            <Image
                className='back-ground-img'
                src={currentImage}
                alt='Pakistan Property banner'
                fill
                priority
                sizes="100vw"
            />
            <div style={{ position: "relative" }} className='w-100'>
                <div className='main-container'>
                    <div className="banner-tag d-sm-flex d-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <g clipPath="url(#clip0_69_12756)">
                                <path d="M7.34472 1.876C7.37328 1.72307 7.45443 1.58495 7.57412 1.48555C7.6938 1.38615 7.84447 1.33174 8.00005 1.33174C8.15563 1.33174 8.3063 1.38615 8.42599 1.48555C8.54567 1.58495 8.62682 1.72307 8.65538 1.876L9.35605 5.58134C9.40581 5.84477 9.53383 6.08708 9.7234 6.27665C9.91297 6.46622 10.1553 6.59424 10.4187 6.644L14.1241 7.34467C14.277 7.37324 14.4151 7.45439 14.5145 7.57407C14.6139 7.69375 14.6683 7.84443 14.6683 8C14.6683 8.15558 14.6139 8.30626 14.5145 8.42594C14.4151 8.54562 14.277 8.62677 14.1241 8.65534L10.4187 9.356C10.1553 9.40577 9.91297 9.53379 9.7234 9.72336C9.53383 9.91293 9.40581 10.1552 9.35605 10.4187L8.65538 14.124C8.62682 14.2769 8.54567 14.4151 8.42599 14.5145C8.3063 14.6139 8.15563 14.6683 8.00005 14.6683C7.84447 14.6683 7.6938 14.6139 7.57412 14.5145C7.45443 14.4151 7.37328 14.2769 7.34472 14.124L6.64405 10.4187C6.59429 10.1552 6.46627 9.91293 6.2767 9.72336C6.08713 9.53379 5.84482 9.40577 5.58138 9.356L1.87605 8.65534C1.72312 8.62677 1.58499 8.54562 1.4856 8.42594C1.3862 8.30626 1.33179 8.15558 1.33179 8C1.33179 7.84443 1.3862 7.69375 1.4856 7.57407C1.58499 7.45439 1.72312 7.37324 1.87605 7.34467L5.58138 6.644C5.84482 6.59424 6.08713 6.46622 6.2767 6.27665C6.46627 6.08708 6.59429 5.84477 6.64405 5.58134L7.34472 1.876Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M13.3334 1.33333V3.99999" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14.6667 2.66667H12" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M2.66671 14.6667C3.40309 14.6667 4.00004 14.0697 4.00004 13.3333C4.00004 12.597 3.40309 12 2.66671 12C1.93033 12 1.33337 12.597 1.33337 13.3333C1.33337 14.0697 1.93033 14.6667 2.66671 14.6667Z" stroke="#2D2D2D" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_69_12756">
                                    <rect width="16" height="16" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Premium Real Estate Platform</span>
                    </div>
                    <h1 >Find & List the Best Properties in Pakistan</h1>
                    <p className='mb-md-4 mb-0'>
                        <b> Pakistan Property</b> connects buyers, sellers, and agents on one trusted platform. List your home, flat, or commercial plot for <b>sale, rent, or lease</b>, and reach thousands of genuine Pakistani buyers instantly.
                    </p>
                    {/* Property Type Buttons */}
                    <div className='btn_box d-flex align-items-center justify-content-md-start justify-content-center mb-2 mt-md-0 mt-2'>
                        {propertyType?.map((item, idx) => (
                            <button
                                key={idx}
                                onClick={() => setFilterData({ ...filterData, property_type_id: item?.id })}
                                className={`banner_btn ${filterData?.property_type_id === item?.id ? "active_btn" : ""} ${idx % 2 !== 0 ? "mx-2" : ""}`}
                            >
                                {item?.name === "Sell" ? "Buy" : item?.name}
                            </button>
                        ))}
                    </div>

                    {/* Search Box */}
                    <div className='search_box' ref={searchBoxRef}>
                        <div className='city_select'>
                            <SingleMenuFeild
                                getVaiable="city"
                                filterData={filterData}
                                setFilterData={setFilterData}
                                varName="city"
                                label="City"
                                menuData={citiesList}
                                optionSelect="single"
                                input={true}
                                storeKey="app_code"
                            />
                        </div>

                        <div className='area_select'>
                            <CustomSingleSelect
                                getVaiable="name"
                                optionSelect="multiple"
                                filterData={filterData}
                                setFilterData={setFilterData}
                                varName="area"
                                label="Search the Area"
                                menuData={locationList}
                                type="menu selected"
                            />
                        </div>

                        {/* Search Button */}
                        <Button
                            onClick={handleSearch}
                            variant="primary extra-large home"
                            state="hover"
                            sx={{ width: '120px' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path
                                    d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z"
                                    fill="white"
                                />
                            </svg>
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
