import { useEffect, useRef, useState } from 'react';
import './CustomMultiSelect.css';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useAuth } from '../../Context/ContextProvider';


function CustomSingleSelect({ filterData, getVaiable, setFilterData, varName, label, menuData, optionSelect, icon, arrow, design, zindex, Newzindex, clearOnChange, moreOption }) {
    const [focus, setFocus] = useState(false);
    const inputRef = useRef(null);
    const inputRefi = useRef(null);
    const menuRef = useRef(null);
    const [searchText, setSearchText] = useState(filterData?.[varName]?.[getVaiable] || '');
    const [showmore, setshowmore] = useState(false);
    const [filteredOptions, setfilteredOptions] = useState(menuData);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const { getLOcation, setLocationList } = useAuth()

    // Calculate the threshold for showing "+X more" based on moreOption prop
    // If moreOption is provided, show "+X more" after that many items
    // Default: 1 for arrow case (show after 1 item = show when 2+), 2 for non-arrow case (show after 2 items = show when 3+)
    const showMoreThreshold = moreOption !== undefined
        ? (moreOption + 1)
        : (arrow ? 2 : 3);
    const maxVisibleItems = moreOption !== undefined ? moreOption : (arrow ? 1 : 2);

    useEffect(() => {
        if (varName === "city") {
            setSearchText(
                filterData?.[varName]?.[getVaiable]
            )
        } else if (clearOnChange && (!filterData?.[varName] || filterData?.[varName]?.length === 0)) {
            // Clear search text when clearOnChange is true and filterData is empty
            setSearchText("");
        }
    }, [filterData?.[varName]?.[getVaiable], filterData?.[varName], clearOnChange])

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setFocus(false);
                setshowmore(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ✅ Remove a selected value (multiple)
    const removeSelected = (value) => {

        setFilterData({
            ...filterData,
            [varName]: filterData[varName].filter((item) => item[getVaiable] !== value[getVaiable]),
        });
    };

    // ✅ Handle option click (single + multiple)
    const handleOptionClick = async (value) => {
        if (optionSelect === 'single') {
            setFilterData((prev) => ({
                ...prev,
                [varName]: value,
            }));
            setSearchText(value?.[getVaiable] || '');
            setFocus(false); // close dropdown
            setshowmore(false);
            if (varName === "city") {
                const locationResult = await getLOcation({
                    city_code: value.app_code,
                });
                setLocationList(locationResult?.data || []);
            }
        }

        if (optionSelect === 'multiple') {
            const currentArray = filterData?.[varName] || [];

            // ✅ toggle (if exists → remove, else add)
            const exists = currentArray.some((item) => item[getVaiable] === value[getVaiable]);

            const updatedArray = exists
                ? currentArray.filter((item) => item[getVaiable] !== value[getVaiable])
                : [...currentArray, value].sort((a, b) => a[getVaiable].localeCompare(b[getVaiable]));

            setFilterData((prev) => ({
                ...prev,
                [varName]: updatedArray,
            }));

            setSearchText(''); // clear input in multiple mode
            setHighlightedIndex(-1); // Reset highlighted index after selection
            // ❌ don't close dropdown here
        }
    };

    // 🟢 Reset highlighted index when filtered options change
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [filteredOptions]);

    // 🟢 Keyboard navigation handler
    useEffect(() => {
        if (!focus) return;

        const scrollToOption = (index) => {
            if (menuRef.current) {
                const menuItems = menuRef.current.querySelectorAll(".option_valuse");
                if (menuItems[index]) {
                    menuItems[index].scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                    });
                }
            }
        };

        const handleKeyDown = (event) => {
            const optionsLength = filteredOptions?.length || 0;
            if (optionsLength === 0) return;

            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    setHighlightedIndex((prev) => {
                        const nextIndex = prev < optionsLength - 1 ? prev + 1 : 0;
                        setTimeout(() => scrollToOption(nextIndex), 0);
                        return nextIndex;
                    });
                    break;

                case "ArrowUp":
                    event.preventDefault();
                    setHighlightedIndex((prev) => {
                        const nextIndex = prev > 0 ? prev - 1 : optionsLength - 1;
                        setTimeout(() => scrollToOption(nextIndex), 0);
                        return nextIndex;
                    });
                    break;

                case "Enter":
                    event.preventDefault();
                    event.stopPropagation(); // Prevent event from bubbling to parent handlers
                    if (highlightedIndex >= 0 && highlightedIndex < optionsLength) {
                        const selectedOption = filteredOptions[highlightedIndex];
                        handleOptionClick(selectedOption);
                        // Reset highlighted index after selection to prevent re-selecting same item
                        setHighlightedIndex(-1);
                    }
                    break;

                case "Escape":
                    event.preventDefault();
                    setFocus(false);
                    setHighlightedIndex(-1);
                    break;

                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [focus, highlightedIndex, filteredOptions, handleOptionClick]);

    const handleMainClick = () => {
        setFocus(true);
        setHighlightedIndex(-1);
    };

    // Focus input when dropdown opens
    useEffect(() => {
        if (focus) {
            requestAnimationFrame(() => {
                inputRefi.current?.focus();
            });
        }
    }, [focus]);

    const onChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        setHighlightedIndex(-1);
        const searchValue = value.toLowerCase();
        const filtered = menuData.filter((item) => item?.[getVaiable].toLowerCase().includes(searchValue));
        setfilteredOptions(filtered);
    };

    return (
        <div
            className={
                design === 'simple'
                    ? (
                        focus || (
                            optionSelect === 'multiple'
                                ? filterData?.[varName]?.length > 0
                                : !!filterData?.[varName]
                        )
                            ? "single-input-field focus simple-design"
                            : "single-input-field simple-design"
                    )
                    : (
                        focus || (
                            optionSelect === 'multiple'
                                ? filterData?.[varName]?.length > 0
                                : !!filterData?.[varName]
                        )
                            ? "single-input-field focus"
                            : "single-input-field"
                    )
            }

            style={{ padding: "0" }}
            onClick={() => handleMainClick()}
            ref={inputRef}
        >
            {icon && <div className='h-100 d-flex align-items-center justify-content-center'>
                {icon}
            </div>}
            <div
                className='main_iner d-flex flex-wrap px-2'
                style={{
                    background: "white",
                    position: "relative",
                    zIndex: focus ? (zindex ? '2' : Newzindex ? '1' : '') : undefined,
                    boxShadow: (focus && (varName === "locations" || varName === "area")) ? "0 2px 8px rgba(68, 113, 88, 0.2)" : "none",
                    borderRadius: (focus && (varName === "locations" || varName === "area")) ? "4px" : undefined,
                    transition: "box-shadow 0.2s ease, border-radius 0.2s ease"
                }}
            >
                {optionSelect === "single" ? (<label style={{ top: `${focus || filterData?.[varName] !== "" ? "4px" : arrow ? "19px" : "17px"}`, left: `${"9px"}` }}>{label}</label>) : <label className={design === "simple" ? "new-label" : ''} style={{ top: `${focus || filterData?.[varName]?.length > 0 ? "4px" : arrow ? "19px" : design === "simple" ? "11px" : "17px"}`, left: `9px` }}>{label}</label>}
                {optionSelect === "multiple" && <div
                    className='selected_values d-flex'
                    style={{
                        flexWrap: ((filterData?.[varName]?.length >= showMoreThreshold && !showmore) || (moreOption === undefined && filterData?.[varName]?.length === 2)) ? 'nowrap' : 'wrap',
                        gap: '4px',
                        minWidth: 0 // Allow items to shrink if needed
                    }}
                >
                    {arrow ?
                        <>
                            {showmore && filterData?.[varName].map((opt) => {
                                return (
                                    <div
                                        key={opt.value}
                                        className='seclected_valus'
                                        style={{ cursor: 'pointer' }}

                                    >
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSelected(opt);
                                            }}
                                            style={{
                                                cursor: 'pointer',
                                                color: '#555',
                                            }}
                                        >
                                            <div> {opt?.[getVaiable]}</div>
                                            <IoIosCloseCircleOutline style={{ marginLeft: "2px" , fontSize: "14px" , width:'14px' , height:'14px' , minWidth:'14px' }} onClick={(e) => e.stopPropagation()} />

                                        </span>
                                    </div>
                                )
                            }
                            )}
                            {!showmore && filterData?.[varName]?.map((opt, index) => {

                                if (index < maxVisibleItems) {
                                    const showMoreTab = filterData?.[varName]?.length >= showMoreThreshold && !showmore;
                                    const totalItems = filterData?.[varName]?.length || 0;

                                    // Calculate width based on moreOption and item count
                                    let itemWidth = {};
                                    if (moreOption === undefined) {
                                        // When moreOption is not available
                                        if (totalItems === 1) {
                                            itemWidth = { width: 'fit-content' };
                                        } else if (totalItems === 2) {
                                            // 2 items: both 44% to divide space and prevent overflow
                                            itemWidth = { width: '40%' };
                                        } else if (showMoreTab) {
                                            // 3+ items with "+X more": first item 44% to prevent wrapping
                                            if (index === 0) {
                                                itemWidth = { width: '44%' };
                                            }
                                        }
                                    } else {
                                        // When moreOption is available: use existing logic
                                        if (showMoreTab && index === 0) {
                                            itemWidth = { width: '44%' };
                                        }
                                    }

                                    return (
                                        <div
                                            key={opt.value}
                                            className='seclected_valus'
                                            onClick={(e) => e.stopPropagation()}
                                            style={itemWidth}
                                        >
                                            <span

                                                style={{
                                                    // fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    color: '#555',

                                                }}
                                            >
                                                <div>
                                                    {opt.label.length > 10 && filterData?.[varName]?.length > maxVisibleItems ? opt?.[getVaiable].slice(0, 10) + '...' : opt?.[getVaiable]}</div>

                                                <IoIosCloseCircleOutline style={{ marginLeft: "2px", fontSize: "14px" , width:'14px' , height:'14px' , minWidth:'14px' }} onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSelected(opt);
                                                }} />

                                            </span>
                                        </div>
                                    )
                                }


                            }
                            )}
                            {filterData?.[varName]?.length >= showMoreThreshold && !showmore ?
                                <div
                                    // key={opt.value}
                                    className='seclected_valus'
                                    style={{ width: 'fit-content', flexShrink: 0 }}
                                    onClick={(e) => setshowmore(!showmore)}
                                >
                                    +{filterData?.[varName]?.length - maxVisibleItems} more

                                </div>
                                : ""}
                        </>
                        :
                        <>
                            {showmore && filterData?.[varName].map((opt) => {
                                return (
                                    <div
                                        key={opt.value}
                                        className='seclected_valus'
                                        style={{ cursor: 'pointer' }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span

                                            style={{
                                                cursor: 'pointer',
                                                color: '#555',
                                            }}
                                        >
                                            <div>{opt?.[getVaiable]}</div>
                                            <IoIosCloseCircleOutline style={{ marginLeft: "2px" , fontSize: "14px" , width:'14px' , height:'14px' , minWidth:'14px' }} onClick={(e) => {
                                                e.stopPropagation();
                                                removeSelected(opt);
                                            }} />

                                        </span>
                                    </div>
                                )
                            }
                            )}
                            {!showmore && filterData?.[varName]?.map((opt, index) => {
                                if (index < maxVisibleItems) {
                                    const showMoreTab = filterData?.[varName]?.length >= showMoreThreshold && !showmore;
                                    const totalItems = filterData?.[varName]?.length || 0;

                                    // Calculate width based on moreOption and item count
                                    let itemWidth = {};
                                    if (moreOption === undefined) {
                                        // When moreOption is not available
                                        if (totalItems === 1) {
                                            itemWidth = { width: 'fit-content' };
                                        } else if (totalItems === 2) {
                                            // 2 items: both 44% to divide space and prevent overflow
                                            itemWidth = { width: '40%' };
                                        } else if (showMoreTab) {
                                            // 3+ items with "+X more": divide space (44% each)
                                            itemWidth = { width: '44%' };
                                        }
                                    } else {
                                        // When moreOption is available: use existing logic
                                        if (showMoreTab && index === 0) {
                                            itemWidth = { width: '44%' };
                                        }
                                    }

                                    return (
                                        <div
                                            key={opt.value}
                                            className='seclected_valus'
                                            onClick={(e) => e.stopPropagation()}
                                            style={itemWidth}
                                        >
                                            <span

                                                style={{
                                                    // fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    color: '#555',
                                                }}
                                            >
                                                <div>
                                                    {opt?.[getVaiable]}
                                                </div>
                                                <IoIosCloseCircleOutline style={{ marginLeft: "2px", fontSize: "14px" , width:'14px' , height:'14px' , minWidth:'14px' }} onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeSelected(opt);
                                                }} />
                                            </span>
                                        </div>
                                    )
                                }
                            }
                            )}
                            {filterData?.[varName]?.length >= showMoreThreshold && !showmore ?
                                <div
                                    // key={opt.value}
                                    className='seclected_valus'
                                    style={{ width: 'fit-content', flexShrink: 0 }}
                                    onClick={(e) => setshowmore(!showmore)}
                                >
                                    +{filterData?.[varName]?.length - maxVisibleItems} more

                                </div>
                                : ""}
                        </>}

                </div>}
                {optionSelect === "single" ? (
                    <input
                        ref={inputRefi}
                        value={searchText}
                        style={{ marginTop: "18px" }}
                        onChange={onChange}
                        autoFocus={focus && (varName === "locations" || varName === "area")}
                    />
                ) : (
                    <>
                        {focus && (
                            <input
                                ref={inputRefi}
                                value={searchText}
                                className="ps-2 py-1"
                                style={{ marginTop: filterData?.[varName]?.length > 0 ? "0px" : "18px" }}
                                onChange={onChange}
                                autoFocus={varName === "locations" || varName === "area"}
                            />
                        )}
                    </>
                )}
                {(
                    (varName === "locations" || varName === "area" ? (focus && searchText) : focus)
                ) && (
                        <div
                            className="custom-options"
                            style={{
                                position: 'absolute',
                                top: optionSelect === "single" ? "140%" : '100%',
                                left: 0,
                                width: '100%',
                                background: '#fff',
                                // border: '1px solid #ccc',
                                borderRadius: optionSelect === "single" ? "6px" : '0 0 6px 6px',
                                // marginTop: '20px',
                                // border:"1px solid",
                                overflow: "hidden",
                                zIndex: 10,
                                boxShadow: optionSelect === "single" ? "0 10px 10px 10px rgba(0, 0, 0, 0.1)" : "0 10px 10px 0 rgba(0, 0, 0, 0.1)",

                            }}
                            ref={menuRef}
                        >
                            <div style={{ maxHeight: 300, overflowY: 'auto' }} className='list'>
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option, index) => {
                                        const isHighlighted = highlightedIndex === index;
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOptionClick(option);
                                                }}
                                                className={`option_valuse ${isHighlighted ? 'highlighted' : ''}`}
                                                style={{
                                                    padding: '6px 16px',
                                                    cursor: 'pointer',
                                                }}
                                                onMouseEnter={() => setHighlightedIndex(index)}
                                            >
                                                <span>{option?.[getVaiable]}</span>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ padding: '10px', color: '#888' }}>No options found</div>
                                )}
                            </div>
                        </div>
                    )}
                {
                    arrow && filterData[varName]?.length === 0 ?
                        focus ?
                            <svg className='arrow' xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                <rect width="18.8657" height="20" transform="translate(0.716309 0.714294)" fill="white" />
                                <path d="M14.1917 12.8572L10.149 8.57146L6.10636 12.8572" stroke="#698B75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            :
                            <svg className='arrow' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5.71436 7.85712L10.0001 12.1428L14.2858 7.85712" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        : ''
                }
                {
                    arrow && optionSelect === "single" ?
                        focus ?
                            <svg className='arrow' xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                <rect width="18.8657" height="20" transform="translate(0.716309 0.714294)" fill="white" />
                                <path d="M14.1917 12.8572L10.149 8.57146L6.10636 12.8572" stroke="#698B75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            :
                            <svg className='arrow' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M5.71436 7.85712L10.0001 12.1428L14.2858 7.85712" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        : ''
                }
            </div>



        </div>
    );
}

export default CustomSingleSelect;
