import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import InputSide from "../PropertyListing/InputSide";
import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild";
import { useAuth } from "../../Context/ContextProvider";
import SingleTypeFeild from "../Metiral/InputField/SingleMenuFeild/SingleTypeFeild";
import Banner from "./Banner";

function InputSection({ filterData, setFilterData, data, openSlider, setOpenSlider }) {
    const { areaUnit, propertyType, citiesList, locationList, getLOcation, setLocationList, objectToQueryString, buildSearchPayloadCostCalculate, loginData, saveSearch } = useAuth();
    const [open, setOpen] = useState(false)
    const [filter, setFilter] = useState(false);
    const [subMenu, setSubMenu] = useState([]);
    const SearchRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation()

    useEffect(() => {
        const updateFilterData = async () => {
            let filterPayload = {};

            // ✅ Set city
            if (data?.city_code) {
                filterPayload.city = citiesList?.find(
                    (item) => item?.app_code === data?.city_code
                );
            }

            // ✅ Set location
            if (data?.location_id) {

                if (locationList?.length) {
                    filterPayload.locations = locationList.filter((item) =>
                        data?.location_id.includes(item?.id?.toString())
                    );
                } else {
                    try {
                        const locationResult = await getLOcation({
                            city_code: data?.city_code,
                        });
                        setLocationList(locationResult?.data || []);

                        const foundLocation = locationResult?.data?.filter((item) =>
                            data?.location_id.includes(item?.id?.toString())
                        );
                        if (foundLocation) {
                            filterPayload.locations = foundLocation;
                        }
                    } catch (error) {
                        console.error("Error fetching locations:", error);
                    }
                }
            }

            // ✅ Set property type
            if (data?.rooms?.length) {
                filterPayload.bedroom = data?.rooms

            }
            if (data?.bathrooms?.length) {
                filterPayload.bathroom = data?.bathrooms

            }
            if (data?.property_type_id) {
                filterPayload.purpose = propertyType?.find(
                    (item) => item?.id?.toString() === data?.property_type_id
                );

            }
            if (data?.sub_category_id || data?.category_id) {
                filterPayload.propertyType = {}
                filterPayload.propertyType.subType = data?.sub_category_id
                filterPayload.propertyType.type = data?.category_id

            }
            if (data?.more?.length) {
                filterPayload.more = data?.more

            }
            if (data?.price?.min || data?.price?.max) {
                filterPayload.priceRange = {};
                if (data?.price.min) filterPayload.priceRange.min = Number(data?.price.min);
                if (data?.price.max) filterPayload.priceRange.max = Number(data?.price.max);
                if (data?.currency) filterPayload.priceRange.priceValue = data?.currency
            }
            if (data?.area_size?.min || data?.area_size?.max) {
                filterPayload.areaRange = {};
                if (data?.area_size.min) filterPayload.areaRange.min = Number(data?.area_size.min);
                if (data?.area_size.max) filterPayload.areaRange.max = Number(data?.area_size.max);
                if (data?.currency) filterPayload.areaRange.priceValue = areaUnit?.find((item) => item?.id?.toString() === data?.currency)
            }
            // ✅ Update filterData safely (merge, not nest)
            setFilterData((prev) => ({
                ...prev,
                ...filterPayload,
            }));
        };
        updateFilterData();
        // eslint-disable-next-line
    }, [data, citiesList, locationList, propertyType]);


    // 🔹 Set subMenu when purpose changes
    useEffect(() => {
        if (filterData?.purpose?.id) {
            const selectedId = filterData?.purpose?.id;
            let subPropertyType = propertyType?.find(
                (item) => item?.id === selectedId
            )?.categories;
            setSubMenu(subPropertyType || []);
        }
    }, [filterData?.purpose, propertyType]);

    // 🔹 Handle outside clicks
    useEffect(() => {
        const handleClickOutside = (event) => {
            const refs = [SearchRef.current];
            const clickedInside = refs.some(
                (ref) => ref && ref.contains(event.target)
            );
            if (!clickedInside) {
                setFilter(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    useEffect(() => {
        if (filter) {
            document.body.style.overflow = "hidden";
            document.body.style.height = "100vh";
        } else {
            document.body.style.overflow = "auto";
            document.body.style.height = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
            document.body.style.height = "auto";
        };
    }, [filter]);
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
        if (!filterData?.area_size || filterData?.area_size < 3) {
            errors.area_size = "Area size is required and must be greater or equal to 3";
        }
        if (!filterData?.coverd_area || filterData?.coverd_area < 100) {
            errors.coverd_area = "Please enter minimum 100 square feet";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    }
    const handleCalculate = async () => {
        if (validateForm()) {
            let dataNew = { ...filterData }

            let dataToSearch = {}

            if (!filterData?.coverd_area) {
                let convertedArea = handleConvert(filterData?.area_size, filterData?.area_unit?.name, "Square Feet ( Sq. Ft.)")
                dataToSearch = await buildSearchPayloadCostCalculate({ ...dataNew, coverd_area: convertedArea })
            }
            if (filterData?.coverd_area) {
                dataToSearch = await buildSearchPayloadCostCalculate(dataNew)
            }
            const queryString = objectToQueryString(dataToSearch);
            navigate(`/construction-cost-calculator/${dataNew?.area_size}-${dataNew?.area_unit?.code}-house-construction-cost-${dataNew?.city?.city}?${queryString}`)
        }
    };

    return (
        <>
            <div className={`construction-detail-page input-section ${openSlider ? "open" : ""}`}>
                <div className="d-flex align-items-center justify-content-between global-input-section-header">
                    <h4 className='global-input-section-title mb-sm-2 mb-0 d-md-none d-block'>Filters</h4>
                    <div onClick={() => setOpenSlider(false)} className="input-section-close-btn d-md-none d-flex justify-content-center align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D"></path><path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D"></path></svg></div>
                </div>
                <div className="input-area">
                    <div className="main-container">
                        <div className="row m-0 d-flex" style={{ gap: "15px 0" }}>
                            {/* Purpose Dropdown */}
                            <div className="col-lg-3 col-md-4 col-12">
                                <SingleTypeFeild
                                    getVaiable={"name"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"area_size"}
                                    label={"Area Size"}
                                    input={true}
                                    optionSelect={"single"}
                                    storeKey={"id"}
                                    type={'number'}
                                    error={errors?.area_size || null}
                                />
                            </div>
                            <div className="col-lg-3 col-md-4 col-12">
                                <SingleTypeFeild
                                    getVaiable={"name"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"coverd_area"}
                                    label={"Coverd Area"}
                                    input={true}
                                    optionSelect={"single"}
                                    storeKey={"id"}
                                    menuValue={"Sq.ft"}
                                    type={'number'}
                                    error={errors?.coverd_area || null}
                                />
                            </div>
                            {/* City Dropdown */}
                            <div className="col-lg-2 col-md-4 col-12">
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

                            <div className="col-lg-2 col-md-4 col-12">
                                <SingleMenuFeild
                                    getVaiable={"name"}
                                    storeKey={"value"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"construction_type"}
                                    label={"Construction Type"}
                                    menuData={[
                                        { name: "Complete", value: "complete" },
                                        { name: "Grey Structure", value: "grey_structure" },
                                    ]}
                                    optionSelect={"single"}
                                    arrow={true}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-12">
                                <SingleMenuFeild
                                    getVaiable={"name"}
                                    storeKey={"value"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"construction_mode"}
                                    label={"Construction Mode"}
                                    menuData={[
                                        { value: "with_mterial", name: "With Material" },
                                        { value: "without_mterial", name: "Without Material" },
                                    ]}
                                    optionSelect={"single"}
                                    arrow={true}
                                />
                            </div>
                            {/* Bathrooms Dropdown */}
                            <div className="col-lg-2 col-md-4 col-12">
                                <SingleMenuFeild
                                    getVaiable={"value"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"bathrooms"}
                                    label={"Select Bathroom"}
                                    menuData={[
                                        { value: "1" },
                                        { value: "2" },
                                        { value: "3" },
                                        { value: "4" },
                                        { value: "5" },
                                        { value: "6" },
                                        { value: "7" },
                                    ]}
                                    optionSelect={"single"}
                                    arrow={true}
                                />
                            </div>
                            {/* Bedrooms Dropdown */}
                            <div className="col-lg-2 col-md-4 col-12">
                                <SingleMenuFeild
                                    getVaiable={"value"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"bedrooms"}
                                    label={"Select Bedroom"}
                                    menuData={[
                                        { value: "1" },
                                        { value: "2" },
                                        { value: "3" },
                                        { value: "4" },
                                        { value: "5" },
                                        { value: "6" },
                                        { value: "7" },
                                    ]}
                                    optionSelect={"single"}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-12">
                                <SingleMenuFeild
                                    getVaiable={"value"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"kitchens"}
                                    label={"Select Kitchen"}
                                    menuData={[
                                        { value: "1" },
                                        { value: "2" },
                                        { value: "3" },
                                        { value: "4" },
                                        { value: "5" },
                                        { value: "6" },
                                        { value: "7" },
                                    ]}
                                    optionSelect={"single"}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-12">
                                <SingleMenuFeild
                                    getVaiable={"value"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"living_rooms"}
                                    label={"Living Room"}
                                    menuData={[
                                        { value: "1" },
                                        { value: "2" },
                                        { value: "3" },
                                        { value: "4" },
                                        { value: "5" },
                                        { value: "6" },
                                        { value: "7" },
                                    ]}
                                    optionSelect={"single"}
                                />
                            </div>
                            <div className="col-lg-2 col-md-4 col-12">
                                <SingleMenuFeild
                                    getVaiable={"value"}
                                    filterData={filterData}
                                    setFilterData={setFilterData}
                                    varName={"drowing_rooms"}
                                    label={"Drawing Room"}
                                    menuData={[
                                        { value: "1" },
                                        { value: "2" },
                                        { value: "3" },
                                        { value: "4" },
                                        { value: "5" },
                                        { value: "6" },
                                        { value: "7" },
                                    ]}
                                    optionSelect={"single"}
                                />
                            </div>

                            {/* Button Box */}
                            <div className="col-lg-2 col-md-4 col-12 d-flex justify-content-end d-md-inline d-none ms-auto">
                                <div className="button-box w-100">
                                    <div
                                        className="button btn-primary-button w-100"
                                        onClick={handleCalculate}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z" fill="white" />
                                        </svg>
                                        Calculate Cost
                                    </div>

                                </div>
                            </div>
                        </div>
                        {/* <InputSide /> */}
                        {/* <Banner/> */}
                    </div>
                </div>
                <div className="button-box d-md-none d-block w-100">
                    <div
                        className="button btn-primary-button w-100"
                        onClick={() => {handleCalculate() ; setOpenSlider(false)}}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z" fill="white" />
                        </svg>
                        Calculate Cost
                    </div>

                </div>
            </div>
        </>
    );
}

export default InputSection;
