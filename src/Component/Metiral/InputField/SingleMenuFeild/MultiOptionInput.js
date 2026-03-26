import { useEffect, useRef, useState } from 'react';
import './SingleMenuField.css';
import Checkbox from '@mui/material/Checkbox';
import { IoIosCloseCircleOutline } from 'react-icons/io';

function MultiOptionInput({ filterData, setFilterData, varName, label, menuData, optionSelect, type, input }) {
    const [focus, setFocus] = useState(false);
    const [searchText, setSearchText] = useState(''); // 🔍 Step 1: separate search text state
    const [selectedValues, setSelectedValues] = useState([])
    const inputRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setFocus(false);
                setSearchText(''); // 🔁 Step 3: reset search text on close
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOptionClick = (value) => {
        const currentArray = filterData?.[varName] || [];

        const updatedArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value].sort((a, b) => a - b);

        setFilterData(prev => ({
            ...prev,
            [varName]: updatedArray
        }));

        setSearchText(''); // Reset search after option selection if needed
    };

    // 🔍 Step 2: Use searchText for filtering
    const filteredMenuData = input
        ? menuData.filter((item) =>
            item.toLowerCase().includes(searchText.toLowerCase())
        )
        : menuData;

    return (
        <div
            className={focus || filterData?.[varName]?.length > 0 ? "single-input-field focus align-items-center" : "single-input-field align-items-center"}
            onClick={() => setFocus(!focus)}
            ref={inputRef}
        >
            <label>{label}</label>
            {
                selectedValues.length > 0 ?
                    <div className="selected-value-box">
                        {
                            selectedValues.map((data) => (
                                <div className="value-box">{data} <IoIosCloseCircleOutline style={{ marginLeft: "2px" }} /></div>
                            ))
                        }
                    </div>
                    : ''
            }
            {input ? (
                <input
                    type='text'
                    className="input-value input-value-input"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)} 
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <div className="input-value">
                    {focus && !filterData?.[varName]
                        ? "Select Value"
                        : optionSelect === "multiple"
                            ? filterData?.[varName]?.join(", ")
                            : filterData?.[varName]}
                </div>
            )}

            {focus ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <rect width="18.8657" height="20" transform="translate(0.716309 0.714294)" fill="white" />
                    <path d="M14.1917 12.8572L10.149 8.57146L6.10636 12.8572" stroke="#698B75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5.71436 7.85712L10.0001 12.1428L14.2858 7.85712" stroke="#737678" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            )}

            {focus && (
                <div className="menu-box">
                    {filteredMenuData.length > 0 ? (
                        filteredMenuData.map((value, index) => {
                            const isSelected =
                                optionSelect === "multiple"
                                    ? filterData?.[varName]?.includes(value)
                                    : filterData?.[varName] === value;

                            return (
                                <div
                                    key={index}
                                    className={
                                        isSelected ? "menu selected" : `menu ${type ? "check" : ""}`
                                    }
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleOptionClick(value);
                                        setSelectedValues(prev => {
                                            const alreadySelected = prev.includes(value);
                                            if (alreadySelected) {
                                                return prev.filter(item => item !== value);
                                            } else {
                                                return [...prev, value];
                                            }
                                        });
                                    }}
                                >
                                    {value}
                                </div>
                            );
                        })
                    ) : (
                        <div className="menu no-results">No results found</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default MultiOptionInput;
