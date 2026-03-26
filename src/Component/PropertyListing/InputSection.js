import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild";
import MultiMenuField from "../Metiral/InputField/MultiMenuField/MultiMenuField";
import RangeMenuFeild from "../Metiral/InputField/RangeMenuField/RangeMenuFeild";
import CustomSingleSelect from "../Metiral/CustomSingleSelect ";
import { useAuth } from "../../Context/ContextProvider";
import LoginModal from "../NavBarFooter/LoginModal";
import SingleTypeFeild from "../Metiral/InputField/SingleMenuFeild/SingleTypeFeild";

function InputSection({ data, filterData, setFilterData, setOpen, open, saveBlink }) {
  const { areaUnit, propertyType, citiesList, locationList, getLOcation, setLocationList, objectToQueryString, buildSearchPayloadProperty, loginData, saveSearch, setOpenLoanModal, setOpen: setSnackbarOpen, setError: setSnackbarError, globalPrice, globalArea, savedSearches, getSavedSearches } = useAuth();
  const [priceSlider, setPriceSlider] = useState([0, globalPrice]);
  const [areaSlider, setAreaSlider] = useState([0, globalArea]);
  const [filter, setFilter] = useState(false);
  const [subMenu, setSubMenu] = useState([]);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const SearchRef = useRef(null);
  const navigate = useNavigate();

  // Detect screen size for global-scroll-class
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth <= 576);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Normalize filter data for comparison
  const normalizeFilterData = (filters) => {
    const normalized = {};

    // Normalize purpose
    if (filters?.purpose) {
      normalized.purpose = filters.purpose?.id || filters.purpose;
    }

    // Normalize city
    if (filters?.city) {
      normalized.city = filters.city?.id || filters.city?.app_code || filters.city;
    }

    // Normalize locations (array)
    if (filters?.locations) {
      normalized.locations = Array.isArray(filters.locations)
        ? filters.locations.map(loc => loc?.id || loc).sort()
        : [];
    }

    // Normalize bedroom (array)
    if (filters?.bedroom) {
      normalized.bedroom = Array.isArray(filters.bedroom)
        ? [...filters.bedroom].sort((a, b) => parseInt(a) - parseInt(b))
        : [];
    }

    // Normalize bathroom (array)
    if (filters?.bathroom) {
      normalized.bathroom = Array.isArray(filters.bathroom)
        ? [...filters.bathroom].sort((a, b) => parseInt(a) - parseInt(b))
        : [];
    }

    // Normalize priceRange
    if (filters?.priceRange) {
      normalized.priceRange = {
        min: filters.priceRange?.min || null,
        max: filters.priceRange?.max || null,
        priceValue: filters.priceRange?.priceValue?.id || filters.priceRange?.priceValue?.code || filters.priceRange?.priceValue || null
      };
    }

    // Normalize areaRange
    if (filters?.areaRange) {
      normalized.areaRange = {
        min: filters.areaRange?.min || null,
        max: filters.areaRange?.max || null,
        areaValue: filters.areaRange?.areaValue?.id || filters.areaRange?.areaValue?.code || filters.areaRange?.areaValue || null
      };
    }

    // Normalize propertyType
    if (filters?.propertyType) {
      normalized.propertyType = {
        type: filters.propertyType?.type || null,
        subType: Array.isArray(filters.propertyType?.subType)
          ? [...filters.propertyType.subType].sort()
          : []
      };
    }

    // Normalize more (array)
    if (filters?.more) {
      normalized.more = Array.isArray(filters.more)
        ? [...filters.more].sort()
        : [];
    }

    return normalized;
  };

  // Check if current filterData matches any saved search
  useEffect(() => {
    if (!loginData || !savedSearches || savedSearches.length === 0) {
      setIsSaved(false);
      return;
    }

    const currentNormalized = normalizeFilterData(filterData);

    const matches = savedSearches.some(savedSearch => {
      const savedNormalized = normalizeFilterData(savedSearch?.filters);
      return JSON.stringify(currentNormalized) === JSON.stringify(savedNormalized);
    });

    setIsSaved(matches);
  }, [filterData, savedSearches, loginData]);

  // Fetch saved searches on mount if logged in
  useEffect(() => {
    if (loginData) {
      getSavedSearches();
    }
  }, [loginData]);

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
      if (data?.price?.min || data?.price?.max || data?.max_price || data?.min_price) {
        filterPayload.priceRange = {};
        if (data?.min_price) filterPayload.priceRange.min = Number(data?.min_price);
        if (data?.price?.min) filterPayload.priceRange.min = Number(data?.price.min);
        if (data?.price?.max) filterPayload.priceRange.max = Number(data?.price.max);
        if (data?.max_price) filterPayload.priceRange.max = Number(data?.max_price);
        if (data?.currency) filterPayload.priceRange.priceValue = data?.currency
        if (data?.price?.min || data?.price?.max) {
          setPriceSlider([Number(data?.price.min), Number(data?.price.max)]);
        }
        if (data?.max_price || data?.min_price) {
          setPriceSlider([Number(data?.min_price), Number(data?.max_price)]);
        }
      }
      if (data?.area_size?.min || data?.area_size?.max || data?.area_min || data?.area_max) {
        filterPayload.areaRange = {};
        if (data?.area_min) filterPayload.areaRange.min = Number(data?.area_min);
        if (data?.area_max) filterPayload.areaRange.max = Number(data?.area_max);
        if (data?.area_size?.min) filterPayload.areaRange.min = Number(data?.area_size.min);
        if (data?.area_size?.max) filterPayload.areaRange.max = Number(data?.area_size.max);
        if (data?.unit_area) {
          const foundAreaUnit = areaUnit?.find(unit => unit?.id === Number(data?.unit_area));
          filterPayload.areaRange.areaValue = foundAreaUnit;
        }
        if (data?.area_min || data?.area_max) {
          setAreaSlider([Number(data?.area_min), Number(data?.area_max)]);
        }
        if (data?.area_size?.min || data?.area_size?.max) {
          setAreaSlider([Number(data?.area_size.min), Number(data?.area_size.max)]);
        }
      }
      if (data?.sorting) {
        filterPayload.sorting = data?.sorting
      }
      if (data?.per_page) {
        filterPayload.per_page = data?.per_page
      }
      if (data?.current_page) {
        filterPayload.current_page = data?.current_page
      }
      // ✅ Update filterData safely (merge, not nest)
      setFilterData((prev) => ({
        ...prev,
        ...filterPayload,
      }));
    };
    updateFilterData();
    // eslint-disable-next-line
  }, [data, citiesList, propertyType]);


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

  // Handle body scroll when input section is open
  useEffect(() => {
    if (open) {
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
  }, [open]);
  const handlePostSearchPropertyData = async () => {
    // --- Recent Searches Logic Start ---
    const RECENT_SEARCHES_KEY = 'recent-property-searches';
    let current = filterData;
    try {
      let recent = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY)) || [];

      // Remove any previous identical record (deep equality)
      recent = recent.filter(
        (item) => JSON.stringify(item) !== JSON.stringify(current)
      );
      // Add current search to the start
      recent.unshift(current);
      // Cap to max 10 searches
      if (recent.length > 10) {
        recent = recent.slice(0, 10);
      }
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent));
    } catch (e) {
      // handle/localStorage error silently
      console.error('Recent searches storage error:', e);
    }
    // --- Recent Searches Logic End ---

    let data = await buildSearchPayloadProperty(filterData);
    let queryParams = objectToQueryString(data)
    navigate(`/properties?${queryParams}`)
    setOpen(false)
  };



  return (
    <>
      {/* Backdrop overlay */}
      {open && <div className="input-section-backdrop" onClick={() => setOpen(false)}></div>}
      <div className={`global-sidebar-box-container input-section ${open ? "open" : ""}`}>
        {/* Close button - visible on 576px and below */}
        <div className=" d-lg-none d-flex global-header-new justify-content-between align-items-center" style={{ borderBottom: '1px solid #bbb', padding: "8px 16px" }}>
          <div className="global-input-section-title">
            Filters
          </div>
          <div className="input-section-close-btn d-lg-none d-flex justify-content-center align-items-center" onClick={() => setOpen(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15.9999 8.00031C15.8124 7.81284 15.5581 7.70752 15.2929 7.70752C15.0278 7.70752 14.7735 7.81284 14.5859 8.00031L11.9999 10.5863L9.41395 8.00031C9.22534 7.81815 8.97274 7.71735 8.71055 7.71963C8.44835 7.72191 8.19754 7.82708 8.01213 8.01249C7.82672 8.1979 7.72155 8.44871 7.71928 8.7109C7.717 8.9731 7.81779 9.2257 7.99995 9.41431L10.5859 12.0003L7.99995 14.5863C7.81779 14.7749 7.717 15.0275 7.71928 15.2897C7.72155 15.5519 7.82672 15.8027 8.01213 15.9881C8.19754 16.1735 8.44835 16.2787 8.71055 16.281C8.97274 16.2833 9.22534 16.1825 9.41395 16.0003L11.9999 13.4143L14.5859 16.0003C14.7745 16.1825 15.0271 16.2833 15.2893 16.281C15.5515 16.2787 15.8023 16.1735 15.9878 15.9881C16.1732 15.8027 16.2783 15.5519 16.2806 15.2897C16.2829 15.0275 16.1821 14.7749 15.9999 14.5863L13.4139 12.0003L15.9999 9.41431C16.1874 9.22678 16.2927 8.97247 16.2927 8.70731C16.2927 8.44214 16.1874 8.18783 15.9999 8.00031Z" fill="#2D2D2D" />
              <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C23.9966 8.81846 22.7312 5.76821 20.4815 3.51852C18.2318 1.26883 15.1815 0.00344108 12 0V0ZM12 22C10.0222 22 8.08879 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C21.9971 14.6513 20.9426 17.1931 19.0679 19.0679C17.1931 20.9426 14.6513 21.9971 12 22Z" fill="#2D2D2D" />
            </svg>
          </div>
        </div>
        <div className="input-area">
          <div className="main-container h-100">
            <div className='btn_box d-sm-none d-flex align-items-center justify-content-md-start justify-content-center mb-3 mt-md-0 mt-2'>
              {propertyType?.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setFilterData((prev) => ({
                      ...prev,
                      purpose: item
                    }));
                  }}
                  className={`banner_btn ${filterData?.purpose?.id === item?.id ? "active_btn" : ""} ${idx % 2 !== 0 ? "mx-2" : ""}`}
                >
                  {item?.name === "Sell" ? "Buy" : item?.name}
                </button>
              ))}
            </div>
            <div className={`row h-100  ${isLargeScreen ? 'global-scroll-box pb-5  mb-5' : ''}`} style={{ gap: "15px 0" }}>
              {/* Purpose Dropdown */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  d-sm-inline d-none">
                <SingleMenuFeild
                  getVaiable={"name"}
                  filterData={filterData}
                  setFilterData={setFilterData}
                  varName={"purpose"}
                  label={"Purpose"}
                  menuData={propertyType}
                  optionSelect={"single"}
                  storeKey={"id"}
                />
              </div>
              {/* City Dropdown */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  ">
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
              {/* Search Input */}
              <div className="col-lg-4 col-md-4 col-sm-6 col-12 ">
                <CustomSingleSelect zindex={true} left={'12px'} moreOption={2}
                  getVaiable={'name'} optionSelect={"multiple"} filterData={filterData} setFilterData={setFilterData} varName={"locations"} label={"Search the Area"} menuData={locationList} type={'menu selected'}
                />
              </div>
              {/* Price Range */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  ">
                <RangeMenuFeild
                  label={"Price Range"}
                  filterData={filterData}
                  setFilterData={setFilterData}
                  varName={"priceRange"}
                  min={"min"}
                  max={"max"}
                  value={"priceValue"}
                  menuData={[
                    { id: 1, name: "USD", code: "$" },
                    { id: 2, name: "EUR", code: "€" },
                    { id: 3, name: "GBP", code: "£" },
                    { id: 4, name: "SAR", code: "ر.س" },
                    { id: 5, name: "AED", code: "د.إ" },
                    { id: 6, name: "PKR", code: "Rs" },
                  ]}
                  sliderValue={priceSlider}
                  setSliderValue={setPriceSlider}
                  maxValue={globalPrice}
                />
              </div>
              {/* Area Range */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  ">
                <RangeMenuFeild
                  label={"Area Range"}
                  filterData={filterData}
                  setFilterData={setFilterData}
                  varName={"areaRange"}
                  min={"min"}
                  max={"max"}
                  value={"areaValue"}
                  menuData={areaUnit}
                  sliderValue={areaSlider}
                  setSliderValue={setAreaSlider}
                  maxValue={globalArea}
                />
              </div>
              {/* Property Type Dropdown */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  ">
                <MultiMenuField
                  filterData={filterData}
                  setFilterData={setFilterData}
                  varName={"propertyType"}
                  type={"type"}
                  subType={"subType"}
                  label={"Property Type"}
                  menuData={subMenu}
                />
              </div>
              {/* Bedrooms Dropdown */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  ">
                <SingleMenuFeild
                  getVaiable={"value"}
                  filterData={filterData}
                  setFilterData={setFilterData}
                  varName={"bedroom"}
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
                  optionSelect={"multiple"}
                />
              </div>
              {/* Bathrooms Dropdown */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  ">
                <SingleMenuFeild
                  getVaiable={"value"}
                  filterData={filterData}
                  setFilterData={setFilterData}
                  varName={"bathroom"}
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
                  optionSelect={"multiple"}
                  arrow={true}
                />
              </div>
              {/* Agencies Input */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  ">
                <SingleTypeFeild

                  varName={"agency_name"}
                  label={"Agencies"}
                  filterData={filterData}
                  setFilterData={setFilterData}
                  type={"text"}
                  input={true}

                />
              </div>
              {/* More Dropdown */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  ">
                <SingleMenuFeild
                  getVaiable={"value"}
                  filterData={filterData}
                  setFilterData={setFilterData}
                  varName={"more"}
                  label={"More"}
                  menuData={[
                    { value: "Hot" },
                    { value: "Superhot" },
                    { value: "Verified" },
                    { value: "New Listing" },
                  ]}
                  optionSelect={"multiple"}
                  type={"check"}
                />
              </div>
              {/* Button Box - Desktop */}
              <div className="col-lg-2 col-md-4 col-sm-6 col-12  d-md-flex d-none justify-content-end ms-auto">
                <div className="button-box">
                  <div
                    className="button btn-primary-button"
                    onClick={handlePostSearchPropertyData}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z" fill="white" />
                    </svg>
                    Search
                  </div>
                  <div
                    className={`button save btn-secondary-button ${saveBlink ? "blink" : ""}`}
                    onClick={async () => {
                      if (!loginData) {
                        setOpenLoanModal(true)
                        // saveSearch will store the data in pendingSearchData
                        const result = await saveSearch(filterData)
                        if (result?.success === false) {
                          setSnackbarError({
                            message: "Search will be saved after you log in",
                            color: "success"
                          });
                          setSnackbarOpen(true);
                        }
                      }
                      else {
                        const result = await saveSearch(filterData)
                        if (result?.success) {
                          setSnackbarError({
                            message: "Search saved successfully",
                            color: "success"
                          });
                          setSnackbarOpen(true);
                        } else {
                          setSnackbarError({
                            message: result?.error?.message || "Failed to save search. Please try again.",
                            color: "error"
                          });
                          setSnackbarOpen(true);
                        }
                      }

                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" style={{marginRight:window?.innerWidth <= 1400 && '-3px'}}>
                      <path d="M14.7188 5.25098C15.3865 5.24971 16.0482 5.37936 16.665 5.63477L16.6641 5.63574C17.2596 5.88143 17.8032 6.23756 18.2637 6.6875H18.2627C18.6665 7.08118 18.9995 7.54034 19.248 8.04492L19.3496 8.26367V8.26465C19.615 8.87935 19.7516 9.53448 19.75 10.208L19.7441 10.4482C19.7157 11.0105 19.5871 11.5789 19.3711 12.1426C19.1655 12.6823 18.8733 13.2281 18.5127 13.7646H18.5117C17.9392 14.6154 17.1659 15.4832 16.2275 16.3467C14.675 17.7742 13.1454 18.7568 13.0674 18.8066L12.6836 19.0518L12.6816 19.0527C12.266 19.3169 11.734 19.3169 11.3184 19.0527L11.3164 19.0518L10.9326 18.8066V18.8057C10.7618 18.698 9.27554 17.7302 7.77246 16.3467C6.83408 15.4832 6.0608 14.6154 5.48828 13.7646H5.4873C5.12582 13.2268 4.83534 12.6827 4.62891 12.1455C4.38151 11.5007 4.25003 10.8489 4.25 10.208C4.25 9.53532 4.38577 8.87989 4.65137 8.26465C4.90698 7.67273 5.27676 7.13632 5.73926 6.68652C6.20112 6.23588 6.74032 5.88208 7.33691 5.63574V5.63477C7.95575 5.37858 8.61088 5.25 9.2832 5.25C10.2188 5.25001 11.1333 5.50558 11.9287 5.98926C11.953 6.00404 11.976 6.02096 12 6.03613C12.0245 6.02068 12.0485 6.00431 12.0732 5.98926C12.8682 5.50591 13.7818 5.25128 14.7168 5.25098V5.25L14.7178 5.25098H14.7188Z" stroke="#698B75" strokeWidth="1.5" />
                    </svg>
                    {
                      window?.innerWidth > 1400 &&
                      <span>Save</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Button Box - Mobile/Tablet (Fixed at bottom) */}

        </div>
        <div className="input-section-sticky-buttons d-md-none">
          <div className="button-box">
            <div
              className="button btn-primary-button"
              onClick={handlePostSearchPropertyData}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18.436 17.8325L14.9569 14.3535C15.905 13.194 16.3712 11.7144 16.2589 10.2208C16.1467 8.72721 15.4647 7.33389 14.354 6.32905C13.2433 5.3242 11.7889 4.7847 10.2916 4.82214C8.79424 4.85958 7.36858 5.47109 6.30948 6.53019C5.25038 7.58929 4.63887 9.01494 4.60144 10.5123C4.564 12.0096 5.1035 13.464 6.10834 14.5747C7.11319 15.6854 8.50651 16.3674 10.0001 16.4796C11.4937 16.5919 12.9732 16.1257 14.1328 15.1776L17.6118 18.6567C17.7218 18.7629 17.869 18.8216 18.0218 18.8203C18.1746 18.819 18.3208 18.7577 18.4289 18.6496C18.537 18.5415 18.5983 18.3953 18.5996 18.2425C18.6009 18.0897 18.5422 17.9425 18.436 17.8325ZM10.4468 15.3303C9.52459 15.3303 8.62308 15.0569 7.85628 14.5445C7.08948 14.0322 6.49183 13.3039 6.13891 12.4519C5.78599 11.5999 5.69365 10.6623 5.87357 9.75784C6.05349 8.85334 6.49758 8.0225 7.14969 7.37039C7.8018 6.71828 8.63263 6.27419 9.53714 6.09427C10.4416 5.91436 11.3792 6.0067 12.2312 6.35961C13.0832 6.71253 13.8115 7.31018 14.3238 8.07698C14.8362 8.84378 15.1096 9.74529 15.1096 10.6675C15.1083 11.9037 14.6165 13.089 13.7424 13.9631C12.8682 14.8373 11.683 15.329 10.4468 15.3303Z" fill="white" />
              </svg>
              Search
            </div>
            <div
              className={`button save btn-secondary-button ${saveBlink ? "blink" : ""} ${isSaved ? "active" : ""}`}
              onClick={async () => {
                if (!loginData) {
                  setOpenLoanModal(true)
                  // saveSearch will store the data in pendingSearchData
                  const result = await saveSearch(filterData)
                  if (result?.success === false) {
                    setSnackbarError({
                      message: "Search will be saved after you log in",
                      color: "success"
                    });
                    setSnackbarOpen(true);
                  }
                }
                else {
                  const result = await saveSearch(filterData)
                  if (result?.success) {
                    setIsSaved(true);
                    await getSavedSearches();
                    setSnackbarError({
                      message: "Search saved successfully",
                      color: "success"
                    });
                    setSnackbarOpen(true);
                  } else {
                    setSnackbarError({
                      message: result?.error?.message || "Failed to save search. Please try again.",
                      color: "error"
                    });
                    setSnackbarOpen(true);
                  }
                }

              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M14.7188 5.25098C15.3865 5.24971 16.0482 5.37936 16.665 5.63477L16.6641 5.63574C17.2596 5.88143 17.8032 6.23756 18.2637 6.6875H18.2627C18.6665 7.08118 18.9995 7.54034 19.248 8.04492L19.3496 8.26367V8.26465C19.615 8.87935 19.7516 9.53448 19.75 10.208L19.7441 10.4482C19.7157 11.0105 19.5871 11.5789 19.3711 12.1426C19.1655 12.6823 18.8733 13.2281 18.5127 13.7646H18.5117C17.9392 14.6154 17.1659 15.4832 16.2275 16.3467C14.675 17.7742 13.1454 18.7568 13.0674 18.8066L12.6836 19.0518L12.6816 19.0527C12.266 19.3169 11.734 19.3169 11.3184 19.0527L11.3164 19.0518L10.9326 18.8066V18.8057C10.7618 18.698 9.27554 17.7302 7.77246 16.3467C6.83408 15.4832 6.0608 14.6154 5.48828 13.7646H5.4873C5.12582 13.2268 4.83534 12.6827 4.62891 12.1455C4.38151 11.5007 4.25003 10.8489 4.25 10.208C4.25 9.53532 4.38577 8.87989 4.65137 8.26465C4.90698 7.67273 5.27676 7.13632 5.73926 6.68652C6.20112 6.23588 6.74032 5.88208 7.33691 5.63574V5.63477C7.95575 5.37858 8.61088 5.25 9.2832 5.25C10.2188 5.25001 11.1333 5.50558 11.9287 5.98926C11.953 6.00404 11.976 6.02096 12 6.03613C12.0245 6.02068 12.0485 6.00431 12.0732 5.98926C12.8682 5.50591 13.7818 5.25128 14.7168 5.25098V5.25L14.7178 5.25098H14.7188Z" stroke="#698B75" strokeWidth="1.5" />
              </svg>
                <span>Save</span>
            </div>
          </div>
        </div>
      </div>
      <LoginModal openDashboard={true} />
    </>
  );
}

export default InputSection;
