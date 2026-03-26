import { useEffect, useState, useRef, useCallback } from "react"
import { useAuth } from "../../Context/ContextProvider";
import SingleMenuFeild from "../Metiral/InputField/SingleMenuFeild/SingleMenuFeild";
import RangeMenuFeild from "../Metiral/InputField/RangeMenuField/RangeMenuFeild";
import PrimaryButton from "../Metiral/Button/PrimaryButton";
import { useNavigate } from "react-router-dom";

const searchIcon = <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M18.436 17.8321L14.9569 14.353C15.905 13.1935 16.3712 11.7139 16.2589 10.2203C16.1467 8.72672 15.4647 7.33341 14.354 6.32856C13.2433 5.32371 11.7889 4.78421 10.2916 4.82165C8.79424 4.85909 7.36858 5.4706 6.30948 6.5297C5.25038 7.5888 4.63887 9.01445 4.60144 10.5118C4.564 12.0091 5.1035 13.4635 6.10834 14.5742C7.11319 15.6849 8.50651 16.3669 10.0001 16.4792C11.4937 16.5914 12.9732 16.1252 14.1328 15.1772L17.6118 18.6562C17.7218 18.7624 17.869 18.8211 18.0218 18.8198C18.1746 18.8185 18.3208 18.7572 18.4289 18.6491C18.537 18.541 18.5983 18.3949 18.5996 18.242C18.6009 18.0892 18.5422 17.942 18.436 17.8321ZM10.4468 15.3299C9.52459 15.3299 8.62308 15.0564 7.85628 14.544C7.08948 14.0317 6.49183 13.3034 6.13891 12.4514C5.78599 11.5994 5.69365 10.6619 5.87357 9.75735C6.05349 8.85285 6.49758 8.02201 7.14969 7.3699C7.8018 6.71779 8.63263 6.2737 9.53714 6.09378C10.4416 5.91387 11.3792 6.00621 12.2312 6.35913C13.0832 6.71205 13.8115 7.30969 14.3238 8.07649C14.8362 8.84329 15.1096 9.7448 15.1096 10.667C15.1083 11.9033 14.6165 13.0885 13.7424 13.9626C12.8682 14.8368 11.683 15.3285 10.4468 15.3299Z" fill="white" />
</svg>

function Banner({ filterData, setFilterData , open  , setOpen}) {
    const { citiesList, locationList, propertyType,objectToQueryString } = useAuth()
    const navigate=useNavigate()
    const searchAreaRef = useRef(null)
    
    const convertForSearch=(data)=>{
        let filterFormate={}
        if(data?.city){
            filterFormate.city_code=data?.city?.app_code
        }
        if(data?.location){
            filterFormate.location_id=data?.location?.id
        }
        if(data?.purpose){
            filterFormate.property_type_id=data?.purpose?.id
        }
        if(data?.category_id){
            filterFormate.category_id=data?.category_id?.id
        }
        return filterFormate
    }
    
    const goTonext=async()=>{
      let data=await  convertForSearch(filterData);
      let queryString = objectToQueryString(data)
      navigate(`/property-index-detail?${queryString}`)
    }
    
    // 🟢 Handle search function
    const handleSearch = useCallback(async () => {
        // Check if there's data to search (city, location, purpose, or category_id)
        const hasData = filterData?.city || filterData?.location || filterData?.purpose || filterData?.category_id;
        
        if (hasData) {
            let data = await convertForSearch(filterData);
            let queryString = objectToQueryString(data)
            navigate(`/property-index-detail?${queryString}`)
        }
    }, [filterData, navigate, objectToQueryString]);
    
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
                
                // Check if active element is a button (for fields without input={true})
                const isButton = activeElement?.tagName === 'BUTTON' || 
                                activeElement?.closest('button') ||
                                activeElement?.getAttribute('role') === 'button';
                
                // If input is part of dropdown component AND its dropdown is visible, don't trigger search
                // (dropdown will handle Enter to select option)
                // Also, if it's a button without a visible dropdown, allow Enter to trigger search
                const isDropdownHandlingEnter = ((isSingleMenuInput || isCustomSelectInput || isMultiMenuInput) && activeElementDropdown);
                
                // Only trigger search if ALL of these are true:
                // 1. Not clicking directly in dropdown menu
                // 2. Active element is not in dropdown
                // 3. The specific dropdown for the active element is not handling the Enter key
                // 4. We're in the search area
                // OR if it's a button (like Property Type without input), allow Enter
                if (searchAreaRef.current?.contains(target) &&
                    !isInDropdownMenu && 
                    !isActiveInDropdown && 
                    (!isDropdownHandlingEnter || (isButton && !activeElementDropdown))) {
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
            <div className={`property-index-deatail property-index-deatail-banner ${open ? 'open' : ''}`}>
            <div className=" d-sm-none d-flex global-header-new justify-content-between align-items-center" style={{ borderBottom: '1px solid #bbb', padding: "8px 16px" }}>
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
                <div className='property-index-inputt'>
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
                        <div className="input">
                            <SingleMenuFeild
                                getVaiable={"name"}
                                filterData={filterData}
                                setFilterData={setFilterData}
                                varName={"purpose"}
                                label={"Purpose"}
                                menuData={propertyType}
                                optionSelect={"single"}
                                storeKey={"id"}
                            /></div>
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
                        <div style={{ width: "200px" }} className="input">
                            <SingleMenuFeild
                                getVaiable={"name"}
                                filterData={filterData}
                                setFilterData={setFilterData}
                                varName={"category_id"}
                                label={"Property Type"}
                                menuData={filterData?.purpose?.categories || []}
                                optionSelect={"single"}
                                storeKey={"id"}
                                arrow={true}

                            />

                        </div>
                        <div className="search-button">
                            <PrimaryButton height={"50px"} onFunction={handleSearch} text={"Search"} icon={searchIcon} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Banner
