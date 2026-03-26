import { useState, useRef, useEffect, useCallback } from "react";
import logo from '../../Asset/Projects/Frame 1984078019.svg'
import { styled } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import { alpha } from '@mui/material';
import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild";
import SingleTypeFeild from "../Metiral/InputField/SingleMenuFeild/SingleTypeFeild";
import MultiMenuField from "../Metiral/InputField/MultiMenuField/MultiMenuField";
import RangeMenuFeild from "../Metiral/InputField/RangeMenuField/RangeMenuFeild";
import CustomSingleSelect from "../Metiral/CustomSingleSelect ";
import { useNavigate, useParams } from "react-router-dom";
import PrimaryButton from '.././Metiral/Button/PrimaryButton'
import { useAuth } from "../../Context/ContextProvider";
import { FallbackImage } from '../Metiral/FallbackImage';

const search = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18.4379 17.8325L14.9589 14.3535C15.907 13.194 16.3731 11.7144 16.2609 10.2208C16.1487 8.72721 15.4667 7.33389 14.356 6.32905C13.2453 5.3242 11.7908 4.7847 10.2935 4.82214C8.79619 4.85958 7.37054 5.47109 6.31144 6.53019C5.25234 7.58929 4.64083 9.01494 4.60339 10.5123C4.56595 12.0096 5.10545 13.464 6.1103 14.5747C7.11514 15.6854 8.50846 16.3674 10.002 16.4796C11.4956 16.5919 12.9752 16.1257 14.1347 15.1776L17.6138 18.6567C17.7237 18.7629 17.8709 18.8216 18.0238 18.8203C18.1766 18.819 18.3228 18.7577 18.4308 18.6496C18.5389 18.5415 18.6002 18.3953 18.6015 18.2425C18.6029 18.0897 18.5441 17.9425 18.4379 17.8325ZM10.4488 15.3303C9.52654 15.3303 8.62503 15.0569 7.85823 14.5445C7.09143 14.0322 6.49378 13.3039 6.14086 12.4519C5.78795 11.5999 5.69561 10.6623 5.87552 9.75784C6.05544 8.85334 6.49953 8.0225 7.15164 7.37039C7.80375 6.71828 8.63459 6.27419 9.53909 6.09427C10.4436 5.91436 11.3811 6.0067 12.2332 6.35961C13.0852 6.71253 13.8134 7.31018 14.3258 8.07698C14.8381 8.84378 15.1116 9.74529 15.1116 10.6675C15.1102 11.9037 14.6185 13.089 13.7444 13.9631C12.8702 14.8373 11.685 15.329 10.4488 15.3303Z" fill="white" />
</svg>

function Banner({ data }) {
    const [focus, setFocus] = useState("");
    const [marketed, setMarketed] = useState(true)
    const [priceSlider, setPriceSlider] = useState([0, 10000]);
    const [areaSlider, setAreaSlider] = useState([0, 100]);
    const { citiesList, projectTypeData, areaUnit, buildSearchPayload ,currentCity, locationList, getLOcation, setLocationList} = useAuth()
    const [propertyType, setPropertyType] = useState([])
    const [filterData, setFilterData] = useState({
        purpose: "",
        city: currentCity,
        locations: [],
        developer_title: "",
        project_title: "",
        marketedByPP: "",
        priceRange: {
            min: "",
            max: "",
            priceValue: "PKR"
        },
        areaRange: {
            min: "",
            max: "",
            areaValue: {
                id: 4,
                name: "Marla",
                code: "marla"
            },
        },
        propertyType: {
            type: "",
            subType: []
        }
    })
    const params = useParams()
    const prevCityRef = useRef(null);
    
    useEffect(() => {

        const selectedTypes = projectTypeData?.find((item) => item.name?.toLowerCase().replace(/\s+/g, "-") === (params?.slug || "housing-societies"))
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
                // Clear locations when city changes
                setFilterData((prev) => ({
                    ...prev,
                    locations: []
                }));
            };
            fetchLocations();
            prevCityRef.current = currentCityCode;
        }
    }, [filterData?.city?.app_code]);
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

    const CustomSwitch = styled(Switch)(({ theme }) => ({
        '& .MuiSwitch-switchBase.Mui-checked': {
            color: "#2E5640",
            '&:hover': {
                backgroundColor: alpha("#2E5640", theme.palette.action.hoverOpacity),
            },
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: "#2E5640",
        },
    }));
    const navigate = useNavigate()
    const objectToQueryString = (obj, prefix) => {
        const str = [];
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const k = prefix ? `${prefix}[${key}]` : key;
                const v = obj[key];
                if (typeof v === "object" && !Array.isArray(v)) {
                    str.push(objectToQueryString(v, k));
                } else if (Array.isArray(v)) {
                    v.forEach((val) => {
                        str.push(`${encodeURIComponent(k)}[]=${encodeURIComponent(val)}`);
                    });
                } else {
                    str.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
                }
            }
        }
        return str.join("&");
    };
    const goToNext = async () => {
        const data = await buildSearchPayload(filterData)
        if(params?.slug){
            const foundProjectType = projectTypeData?.find((item) => item.name?.toLowerCase().replace(/\s+/g, "-") === params?.slug);
            const projectTypeId = foundProjectType?.id || 1;
            const queryString = objectToQueryString({...data, project_type_id: projectTypeId});
            navigate(`/project-listing/${params.slug}?${queryString}`);
        }else{
            const queryString = objectToQueryString({...data, project_type_id: 1});
            navigate(`/project-listing/${"housing-societies"}?${queryString}`);
        }
    };

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
            const data = await buildSearchPayload(filterData);
            if(params?.slug){
                const foundProjectType = projectTypeData?.find((item) => item.name?.toLowerCase().replace(/\s+/g, "-") === params?.slug);
                const projectTypeId = foundProjectType?.id || 1;
                const queryString = objectToQueryString({...data, project_type_id: projectTypeId});
                navigate(`/project-listing/${params.slug}?${queryString}`);
            }else{
                const queryString = objectToQueryString({...data, project_type_id: 1});
                navigate(`/project-listing/${"housing-societies"}?${queryString}`);
            }
        }
    }, [filterData, buildSearchPayload, objectToQueryString, navigate, params, projectTypeData]);

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
        <>
            <div className="project-banner">
                <div className="overlay"></div>
                <div className="main-container">
                    <div className="banner-content-parent">
                        <div className="text-box">
                            <div className="heading">{data?.heading1 ? data?.heading1 : "Find New Projects in Pakistan"}</div>
                            <div className="para">{data?.para ? data?.para : "Discover the latest real estate projects launching across Pakistan’s top cities. From modern apartments to commercial hubs, explore new developments with verified details and flexible payment plans."}</div>
                        </div>
                        <div className="project-input-area" ref={searchAreaRef}>
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
                            <div className="input d-sm-block d-none">
                                <RangeMenuFeild type={'double'} label={"Price Range"} filterData={filterData} setFilterData={setFilterData} varName={'priceRange'} min={'min'} max={"max"} value={'priceValue'} menuData={PriceValue} sliderValue={priceSlider} setSliderValue={setPriceSlider} maxValue={10000} />
                            </div>
                            <div className="button-box d-flex align-items-center" onClick={handleSearch} >
                                <PrimaryButton icon={search} text={"Search"} height={'50px'} />
                            </div>
                            <div className="input d-sm-block d-none">
                                <RangeMenuFeild label={"Area Range"} filterData={filterData} setFilterData={setFilterData} varName={'areaRange'} min={'min'} max={"max"} value={'areaValue'} menuData={areaUnit} sliderValue={areaSlider} setSliderValue={setAreaSlider} maxValue={100} />
                            </div>
                            <div className="input d-sm-flex d-none">
                                {/* <SingleTypeFiled/> */}
                                <SingleTypeFeild filterData={filterData} setFilterData={setFilterData} varName={"developer_title"} label={"Search Developer Title"} input={true} type={'text'} />
                            </div>
                            <div className="input d-sm-flex d-none">
                                <SingleTypeFeild filterData={filterData} setFilterData={setFilterData} varName={"project_title"} label={"Search Project Title"} input={true} type={'text'} />
                            </div>
                            <div className="radio-box justify-content-lg-start justify-content-end d-sm-flex d-none">
                                <CustomSwitch
                                    checked={!marketed}
                                    onChange={(e) => {
                                        setMarketed(!marketed);
                                        setFilterData((prev) => ({ ...prev, marketedByPP: marketed }));
                                    }}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'transparent',
                                            color: '#60A560',
                                        },
                                        '&.Mui-checked:hover': {
                                            color: '#2f7635'
                                        }
                                    }} />
                                <div className="text">
                                    <span>Marketed By</span>
                                    <FallbackImage src={logo} alt="" componentName="Banner" />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default Banner
