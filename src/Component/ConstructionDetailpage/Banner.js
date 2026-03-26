import React, { useEffect, useState, useRef, useCallback } from 'react'
import { HiOutlineDownload } from "react-icons/hi";
import BreadCrumb from '../Metiral/BreadCrumb';
import ShareModal from '../Metiral/ShareModal';
import './Banner.css';
import CustomTooltip from '../Metiral/CustomTooltip';
import { LuFilter } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/ContextProvider';
function Banner({ filterData, categories, onPdfDownload, pdfLoading, setOpenSlider }) {
    const navigate = useNavigate()
    const { objectToQueryString, buildSearchPayloadCostCalculate } = useAuth()
    const searchAreaRef = useRef(null)

    const formatNumber = (num) => {
        if (num >= 1_00_00_00_000) {
            return `${(num / 1_00_00_00_000).toFixed(2)} Billion`;
        } else if (num >= 1_00_00_000) {
            return `${(num / 1_00_00_000).toFixed(2)} Crore`;
        } else if (num >= 1_00_000) {
            return `${(num / 1_00_000).toFixed(2)} Lakh`;
        } else if (num >= 1_000) {
            return `${(num / 1_000).toFixed(2)} K`;
        } else if (num >= 1_00) {
            return `${(num / 1_00).toFixed(2)} Hundred`;
        }
        return num.toString();
    };
    const area = parseFloat(filterData?.coverd_area) || 0;


    const breadcrumbItems = [
        "Home",
        "Construction Cost Calculator",
        `${filterData?.area_size || ''} ${filterData?.areaValue?.name || ''} House Construction Cost ${filterData?.city?.city ? "in" : ""} ${filterData?.city?.city}`
    ];
    const [total, setTotal] = useState(0)
    const [gryTotal, setGreyTotal] = useState(0)
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!categories) return;

        let totalCost = 0;
        let greyTotalCost = 0;

        categories.forEach(category => {
            category.subcategories.forEach(sub => {
                sub.items.forEach(item => {
                    const cost = item.total_cost || 0;

                    // 1. Total of all items
                    totalCost += cost;

                    // 2. Only grey_structure items ka total
                    if (item?.construction_type?.includes("grey_structure")) {
                        greyTotalCost += cost;
                    }
                });
            });
        });

        // Save totals
        setTotal(totalCost);
        setGreyTotal(greyTotalCost); // <-- a new state for grey total
    }, [categories]);
    const costPerSqft = area > 0 ? total / area : 0;

    const handlePdfDownloadClick = async () => {
        // document.body.classList.add('pdf-export-active');
        await new Promise(resolve => setTimeout(resolve, 800));
        await onPdfDownload();
        // document.body.classList.remove('pdf-export-active');
    };
    
    // 🟢 Handle search function
    const handleSearch = useCallback(async () => {
        // Check if there's data to search (city and area_size)
        const hasData = filterData?.city && filterData?.area_size;
        
        if (hasData) {
            let dataNew = { ...filterData }
            let dataToSearch = await buildSearchPayloadCostCalculate(dataNew)
            const queryString = objectToQueryString(dataToSearch);
            navigate(`/construction-cost-calculator/${dataNew?.area_size}-${dataNew?.area_unit?.code}-house-construction-cost-${dataNew?.city?.city}?${queryString}`)
        }
    }, [filterData, buildSearchPayloadCostCalculate, objectToQueryString, navigate]);
    
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
                
                // Check if we're in the input section (filter panel) or search area
                const isInInputSection = target.closest('.input-section') || 
                                        target.closest('.cost-calulator-form-fields') ||
                                        searchAreaRef.current?.contains(target);
                
                // Only trigger search if ALL of these are true:
                // 1. Not clicking directly in dropdown menu
                // 2. Active element is not in dropdown
                // 3. The specific dropdown for the active element is not handling the Enter key
                // 4. We're in the input section or search area
                if (!isInDropdownMenu && 
                    !isActiveInDropdown && 
                    !isDropdownHandlingEnter &&
                    isInInputSection) {
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
            <div className='const-main-b' ref={searchAreaRef}>
                <div style={{ display: 'flex' }} className='row'>
                    <div className='col-12 p-0'>
                        <div className="d-md-flex align-items-center justify-content-between">
                            <div className='pakistani-property'>
                                <div className="d-flex flex-wrap align-items-center justify-content-between w-100" style={{ margin: "16px 0 18px", gap: "10px" }}>
                                    <BreadCrumb items={breadcrumbItems} paths={["/", "/construction-cost-calculator"]} />
                                    <div className="filter d-md-none d-flex align-items-center gap-2" style={{ marginLeft: 'auto' }} onClick={() => { setOpenSlider && setOpenSlider(true) }}>Filter <LuFilter /></div>
                                </div>
                                <div className="d-flex justify-content-between w-100 align-items-center" style={{ gap: "10px" }}>
                                    <h1>{filterData?.area_size} {filterData?.areaValue?.name} House Construction Cost in {filterData?.city?.city ? ` in ${filterData?.city?.city}` : ""}</h1>
                                    <div className='d-md-none d-flex align-items-center gap-2'>
                                        <div className="global-share-btn share-btn" onClick={() => setOpen(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M18.1008 14.2205C17.4714 14.221 16.8517 14.3747 16.2949 14.6682C15.7382 14.9617 15.2613 15.3863 14.9053 15.9052L9.48734 13.4589C9.87216 12.5296 9.87365 11.4859 9.4915 10.5555L14.902 8.0967C15.4296 8.85979 16.2132 9.4085 17.1108 9.6433C18.0083 9.8781 18.9602 9.78343 19.7939 9.37648C20.6277 8.96953 21.2879 8.27724 21.6549 7.42519C22.0219 6.57314 22.0714 5.61777 21.7943 4.73237C21.5173 3.84697 20.9321 3.09019 20.1449 2.5993C19.3577 2.10842 18.4206 1.91594 17.5036 2.05678C16.5866 2.19762 15.7505 2.66245 15.1469 3.36696C14.5433 4.07147 14.2121 4.96899 14.2136 5.89672C14.2171 6.11631 14.2394 6.33518 14.2802 6.55097L8.52844 9.16464C7.97602 8.64708 7.28446 8.30216 6.5387 8.17225C5.79295 8.04233 5.02548 8.13309 4.3306 8.43336C3.63571 8.73363 3.04367 9.23035 2.62721 9.86247C2.21075 10.4946 1.988 11.2346 1.98634 11.9916C1.98467 12.7486 2.20417 13.4896 2.61785 14.1235C3.03153 14.7575 3.62138 15.2568 4.31494 15.5601C5.0085 15.8634 5.77556 15.9576 6.52187 15.8309C7.26819 15.7043 7.96127 15.3624 8.51595 14.8473L14.2827 17.451C14.2426 17.6666 14.2206 17.8851 14.2169 18.1044C14.2167 18.8728 14.4445 19.624 14.8713 20.2629C15.298 20.9019 15.9047 21.3999 16.6146 21.6941C17.3245 21.9882 18.1056 22.0652 18.8593 21.9153C19.6129 21.7655 20.3052 21.3955 20.8485 20.8521C21.3919 20.3088 21.7619 19.6165 21.9117 18.8629C22.0616 18.1092 21.9846 17.3281 21.6905 16.6182C21.3963 15.9083 20.8983 15.3016 20.2593 14.8748C19.6204 14.4481 18.8692 14.2203 18.1008 14.2205ZM18.1008 3.67677C18.5399 3.67661 18.9692 3.80667 19.3344 4.0505C19.6995 4.29433 19.9842 4.64098 20.1523 5.04661C20.3205 5.45224 20.3646 5.89862 20.279 6.32931C20.1935 6.75999 19.9821 7.15562 19.6717 7.46617C19.3612 7.77672 18.9657 7.98823 18.535 8.07396C18.1044 8.15968 17.658 8.11577 17.2523 7.94777C16.8466 7.77977 16.4998 7.49524 16.2559 7.13015C16.0119 6.76506 15.8817 6.33582 15.8817 5.89672C15.8821 5.30824 16.116 4.74396 16.5321 4.32776C16.9481 3.91156 17.5123 3.67743 18.1008 3.67677ZM5.89313 14.2205C5.45403 14.2207 5.02474 14.0906 4.65956 13.8468C4.29439 13.6029 4.00972 13.2563 3.84157 12.8507C3.67342 12.445 3.62934 11.9987 3.7149 11.568C3.80046 11.1373 4.01183 10.7417 4.32226 10.4311C4.63269 10.1206 5.02825 9.90904 5.4589 9.82332C5.88955 9.73759 6.33595 9.78151 6.74164 9.9495C7.14734 10.1175 7.49409 10.402 7.73806 10.7671C7.98203 11.1322 8.11225 11.5615 8.11225 12.0006C8.11159 12.589 7.8776 13.1531 7.46161 13.5693C7.04561 13.9854 6.48155 14.2196 5.89313 14.2205ZM18.1008 20.3243C17.6617 20.3243 17.2325 20.1941 16.8674 19.9502C16.5024 19.7063 16.2178 19.3596 16.0498 18.9539C15.8818 18.5483 15.8378 18.1019 15.9235 17.6713C16.0091 17.2407 16.2206 16.8451 16.531 16.5346C16.8415 16.2242 17.2371 16.0127 17.6677 15.9271C18.0983 15.8414 18.5447 15.8854 18.9503 16.0534C19.356 16.2214 19.7027 16.506 19.9466 16.871C20.1905 17.2361 20.3207 17.6653 20.3207 18.1044C20.3203 18.693 20.0863 19.2574 19.67 19.6736C19.2538 20.0899 18.6894 20.3239 18.1008 20.3243Z" fill="#2D2D2D" />
                                            </svg>
                                            <div className="share-tooltip">
                                                Share
                                            </div>
                                        </div>
                                        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "25px", padding: "0" }} className='share_btn' onClick={handlePdfDownloadClick} disabled={pdfLoading}>
                                            <CustomTooltip title="Download PDF" placement="bottom">
                                                <HiOutlineDownload style={{ color: "#2D2D2D" }} />
                                            </CustomTooltip>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className='d-md-flex d-none align-items-center gap-2'>
                                <div className="global-share-btn share-btn" onClick={() => setOpen(true)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M18.1008 14.2205C17.4714 14.221 16.8517 14.3747 16.2949 14.6682C15.7382 14.9617 15.2613 15.3863 14.9053 15.9052L9.48734 13.4589C9.87216 12.5296 9.87365 11.4859 9.4915 10.5555L14.902 8.0967C15.4296 8.85979 16.2132 9.4085 17.1108 9.6433C18.0083 9.8781 18.9602 9.78343 19.7939 9.37648C20.6277 8.96953 21.2879 8.27724 21.6549 7.42519C22.0219 6.57314 22.0714 5.61777 21.7943 4.73237C21.5173 3.84697 20.9321 3.09019 20.1449 2.5993C19.3577 2.10842 18.4206 1.91594 17.5036 2.05678C16.5866 2.19762 15.7505 2.66245 15.1469 3.36696C14.5433 4.07147 14.2121 4.96899 14.2136 5.89672C14.2171 6.11631 14.2394 6.33518 14.2802 6.55097L8.52844 9.16464C7.97602 8.64708 7.28446 8.30216 6.5387 8.17225C5.79295 8.04233 5.02548 8.13309 4.3306 8.43336C3.63571 8.73363 3.04367 9.23035 2.62721 9.86247C2.21075 10.4946 1.988 11.2346 1.98634 11.9916C1.98467 12.7486 2.20417 13.4896 2.61785 14.1235C3.03153 14.7575 3.62138 15.2568 4.31494 15.5601C5.0085 15.8634 5.77556 15.9576 6.52187 15.8309C7.26819 15.7043 7.96127 15.3624 8.51595 14.8473L14.2827 17.451C14.2426 17.6666 14.2206 17.8851 14.2169 18.1044C14.2167 18.8728 14.4445 19.624 14.8713 20.2629C15.298 20.9019 15.9047 21.3999 16.6146 21.6941C17.3245 21.9882 18.1056 22.0652 18.8593 21.9153C19.6129 21.7655 20.3052 21.3955 20.8485 20.8521C21.3919 20.3088 21.7619 19.6165 21.9117 18.8629C22.0616 18.1092 21.9846 17.3281 21.6905 16.6182C21.3963 15.9083 20.8983 15.3016 20.2593 14.8748C19.6204 14.4481 18.8692 14.2203 18.1008 14.2205ZM18.1008 3.67677C18.5399 3.67661 18.9692 3.80667 19.3344 4.0505C19.6995 4.29433 19.9842 4.64098 20.1523 5.04661C20.3205 5.45224 20.3646 5.89862 20.279 6.32931C20.1935 6.75999 19.9821 7.15562 19.6717 7.46617C19.3612 7.77672 18.9657 7.98823 18.535 8.07396C18.1044 8.15968 17.658 8.11577 17.2523 7.94777C16.8466 7.77977 16.4998 7.49524 16.2559 7.13015C16.0119 6.76506 15.8817 6.33582 15.8817 5.89672C15.8821 5.30824 16.116 4.74396 16.5321 4.32776C16.9481 3.91156 17.5123 3.67743 18.1008 3.67677ZM5.89313 14.2205C5.45403 14.2207 5.02474 14.0906 4.65956 13.8468C4.29439 13.6029 4.00972 13.2563 3.84157 12.8507C3.67342 12.445 3.62934 11.9987 3.7149 11.568C3.80046 11.1373 4.01183 10.7417 4.32226 10.4311C4.63269 10.1206 5.02825 9.90904 5.4589 9.82332C5.88955 9.73759 6.33595 9.78151 6.74164 9.9495C7.14734 10.1175 7.49409 10.402 7.73806 10.7671C7.98203 11.1322 8.11225 11.5615 8.11225 12.0006C8.11159 12.589 7.8776 13.1531 7.46161 13.5693C7.04561 13.9854 6.48155 14.2196 5.89313 14.2205ZM18.1008 20.3243C17.6617 20.3243 17.2325 20.1941 16.8674 19.9502C16.5024 19.7063 16.2178 19.3596 16.0498 18.9539C15.8818 18.5483 15.8378 18.1019 15.9235 17.6713C16.0091 17.2407 16.2206 16.8451 16.531 16.5346C16.8415 16.2242 17.2371 16.0127 17.6677 15.9271C18.0983 15.8414 18.5447 15.8854 18.9503 16.0534C19.356 16.2214 19.7027 16.506 19.9466 16.871C20.1905 17.2361 20.3207 17.6653 20.3207 18.1044C20.3203 18.693 20.0863 19.2574 19.67 19.6736C19.2538 20.0899 18.6894 20.3239 18.1008 20.3243Z" fill="#2D2D2D" />
                                    </svg>
                                    <div className="share-tooltip">
                                        Share
                                    </div>
                                </div>
                                <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: "25px", padding: "0" }} className='share_btn' onClick={handlePdfDownloadClick} disabled={pdfLoading}>
                                    <CustomTooltip title="Download PDF" placement="bottom">
                                        <HiOutlineDownload style={{ color: "#2D2D2D" }} />
                                    </CustomTooltip>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 p-0'>
                        <div className='construction-lower-box'>
                            <div className="cost-summary d-flex">
                                <div className="cost-item">
                                    <p className="label">Grey Structure Material Cost</p>
                                    <p className="value">{formatNumber(gryTotal)}</p>
                                </div>
                                <div className="line"></div>
                                <div className="cost-item">
                                    <p className="label">Labour Cost</p>
                                    <p className="value">8.67 Lakh</p>
                                </div>
                                <div className="line"></div>
                                <div className="cost-item border-left">
                                    <p className="label">Price Per Sq Ft</p>
                                    <p className="value">{formatNumber(costPerSqft)}</p>
                                </div>
                                <div className="line"></div>
                                <div className="cost-item total">
                                    <p className="label">Total Cost</p>
                                    <p style={{ fontSize: '22px' }} className="value green">{formatNumber(total)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <ShareModal open={open} setOpen={setOpen} />
        </>
    )
}

export default Banner
