import React, { useState, useEffect, useRef } from 'react';
import "./CustomMultiSelect.css"
import { IoIosCloseCircleOutline } from 'react-icons/io';
const options = [
    { value: 'DHA Phase 8', label: 'DHA Phase 8' },
    { value: 'DHA Phase 5', label: 'DHA Phase 5' },
    { value: 'Askari 10', label: 'Askari 10' },
    { value: 'Johar Town', label: 'Johar Town' },
    { value: 'Bahria Town', label: 'Bahria Town' },
    { value: 'DHA Phase 8 Ex park View', label: 'DHA Phase 8 Ex park View' },
];
const CustomMultiSelect = ({ setValid }) => {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [showOptions, setShowOptions] = useState(false);
    const [searchText, setSearchText] = useState('');
    const containerRef = useRef();
    const toggleOption = (option) => {
        const exists = selectedOptions.find((item) => item.value === option.value);
        if (exists) {
            setSelectedOptions(selectedOptions.filter((item) => item.value !== option.value));
        } else {
            setSelectedOptions([...selectedOptions, option]);
        }
        setSearchText("")
        setShowOptions(false)
        setshowmore(false)
    };
 useEffect(() => {
    if (typeof setValid === "function") {
      setValid(!!selectedOptions.length || !!searchText);
    }
  }, [selectedOptions, searchText, setValid]);

    const removeSelected = (value) => {
        setSelectedOptions(selectedOptions.filter((item) => item.value !== value));
    };
    const [filteredOptions, setFilteredOptions] = useState([])


    // Close dropdown when clicking outside
    const [showmore, setshowmore] = useState(false)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowOptions(false);
                setshowmore(false)
                setSearchText("")

            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const inputRef = useRef(null); // create ref for input
    useEffect(() => {
        if (showOptions && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showOptions]);
    return (
        <div className='position-box' ref={containerRef} style={{ position: 'relative', width: 300 }}>
            {/* Selected Tags */}
            <div
                onClick={() => {
                    setShowOptions(true)
                    inputRef.current?.focus();  // focus the input
                }}
                className='select_box_custom'
                style={{
                    border: `${showOptions || selectedOptions?.length ? '1px solid #447158' : '1px solid #ccc'}`,
                    borderRadius: '6px',
                    height: "42px",
                    cursor: 'pointer',
                    position: "relative",
                    background: '#fff',
                    display: 'flex',
                    flexWrap: 'wrap',
                    // alignItems: "center",
                    padding: "4px 0px",
                    gap: '6px',
                }}
            >
                <div className='d-flex flex-wrap mt-1 w-100' style={{flexDirection:'column' , background: "white", paddingLeft: "12px", position: "relative", zIndex: `${showOptions || selectedOptions?.length ?"9":"1"}` }}>
                   <div className="selected-values-box d-flex flex-wrap">
                     {showmore && selectedOptions.map((opt) => {
                        return (
                            <div
                                key={opt.value}
                                className='seclected_valus'

                                onClick={(e) => e.stopPropagation()}
                            >
                                {opt.label}
                                <span
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeSelected(opt.value);
                                    }}
                                    style={{
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        color: '#555',

                                    }}
                                >
                                    <IoIosCloseCircleOutline className='ms-2' />

                                </span>
                            </div>
                        )
                    }

                    )}
                    {!showmore && selectedOptions?.map((opt, index) => {
                        if (selectedOptions?.length > 2) {
                            if (index === 0) {
                                return (
                                    <div
                                        key={opt.value}
                                        className='seclected_valus'

                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {opt.label}
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSelected(opt.value);
                                            }}
                                            style={{
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                color: '#555',

                                            }}
                                        >
                                            <IoIosCloseCircleOutline className='ms-2' />

                                        </span>
                                    </div>
                                )
                            }
                        }
                        else {
                            if (index === 0 || index === 1) {
                                return (
                                    <div
                                        key={opt.value}
                                        className='seclected_valus'

                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {opt.label}
                                        <span
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSelected(opt.value);
                                            }}
                                            style={{
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                color: '#555',

                                            }}
                                        >
                                            <IoIosCloseCircleOutline className='ms-2' />

                                        </span>
                                    </div>
                                )
                            }
                        }
                    }

                    )}
                    {selectedOptions.length >= 3 && !showmore ?
                        <div
                            // key={opt.value}
                            className='seclected_valus'

                            onClick={(e) => setshowmore(!showmore)}
                        >
                            +{selectedOptions?.length - 1} more

                        </div>
                        : ""}
                   </div>
                   <div className='box-shadow-parent'>
                     {showOptions && <input
                     className={selectedOptions.length >= 1 ? ' input-shadow':  "" }
                        ref={inputRef}
                        type="text"
                        value={searchText}
                        onChange={(e) => {
                            const filtered = options.filter((opt) =>
                                opt.label.toLowerCase().includes(e.target.value.toLowerCase())
                            );
                            setFilteredOptions(filtered)
                            setSearchText(e.target.value)
                        }}
                        style={{
                            width: '100%',
                            padding: '4px',
                            border: 'none',
                            borderBottom: 'none',
                            outline: 'none',

                        }}
                    />}
                    {filteredOptions.length > 0 && searchText && showOptions ? (
                        <div
                        className='area-box'
                            style={{
                                position: 'absolute',
                                top: '90%',
                                left: 0,
                                width: '100%',
                                background: '#fff',
                                // border: '1px solid #ccc',
                                borderRadius: '0 0 6px 6px',
                                marginTop: '4px',
                                overflow: "hidden",
                               boxShadow: "0 10px 10px -10px rgba(0, 0, 0, 0.1)",
                                zIndex: 7,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                                {filteredOptions.length > 0 ? (
                                    filteredOptions.map((option) => {
                                        return (
                                            <div
                                                key={option.value}
                                                onClick={() => toggleOption(option)}
                                                className='option_valuse'
                                                style={{
                                                    padding: '6px 16px',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {option.label}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div style={{ padding: '10px', color: '#888' }}>No options found</div>
                                )}
                            </div>
                        </div>
                    ) : ""}
                   </div>
                </div>
                <span style={{
                    color: showOptions || selectedOptions?.length ? "#447158" : "#aaa",
                    top: showOptions || selectedOptions?.length ? "-15px" : "7px",
                    background: "white",
                    left: "10px",
                    zIndex:8

                }} className='lable_slect'>{showOptions || selectedOptions?.length ? "Area" : "Search the area"} </span>

            </div>

            {/* Options with Search */}

        </div>
    );
};

export default CustomMultiSelect;
