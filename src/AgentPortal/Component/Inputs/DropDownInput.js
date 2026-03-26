import React, { useEffect, useRef, useState, useCallback } from "react";

function DropDownInput({
    label,
    data,
    setData,
    varName,
    getVariable,
    menuData = [],
    width,
    placeHolder,
    errors,
}) {
    const [menu, setMenu] = useState(false);
    const inputRef = useRef(null);
    const menuRef = useRef(null);
    const [searchValue, setSearchValue] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const highlightedIndexRef = useRef(-1);

    // ✅ Set selected value from data
    useEffect(() => {
        const value = menuData?.find((item) => item?.id === data[varName])?.[getVariable];
        setSearchValue(value || "");
    }, [data?.[varName], menuData, getVariable]);

    // ✅ Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setMenu(false);
                setHighlightedIndex(-1);
                highlightedIndexRef.current = -1;
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ✅ Sync highlightedIndexRef with highlightedIndex
    useEffect(() => {
        highlightedIndexRef.current = highlightedIndex;
    }, [highlightedIndex]);

    // ✅ Reset highlighted index when menu closes or searchValue changes
    useEffect(() => {
        if (!menu) {
            setHighlightedIndex(-1);
            highlightedIndexRef.current = -1;
        }
    }, [menu]);

    useEffect(() => {
        setHighlightedIndex(-1);
        highlightedIndexRef.current = -1;
    }, [searchValue]);

    // ✅ Handle selection
    const handleSelect = useCallback((value) => {
        setSearchValue(value?.[getVariable]);
        setData((prev) => ({
            ...prev,
            [varName]: value?.id,
        }));
        setMenu(false);
        setHighlightedIndex(-1);
        highlightedIndexRef.current = -1;
    }, [getVariable, varName, setData]);

    return (
        <div className="global-input-box">
            {label && <label>{label}</label>}

            <div className="input" style={{ width: width || "100%" }} ref={inputRef}>
                <div
                    className={`display ${menu || searchValue ? "active" : ""} ${errors ? "error" : ""}`}
                    style={{ minWidth: width ? `${width}px` : "286px" }}
                    onClick={() => setMenu((prev) => !prev)}
                >
                    <input
                        style={{
                            width: "95%",
                            backgroundColor: "transparent",
                            border: "none",
                            outline: "none",
                            cursor: "pointer",
                        }}
                        type="text"
                        value={searchValue}
                        placeholder={placeHolder}
                        readOnly
                        onKeyDown={(e) => {
                            if (!menu || !menuData?.length) return;
                            
                            const optionsLength = menuData.length;
                            if (optionsLength === 0) return;

                            const scrollToOption = (index) => {
                                if (menuRef.current) {
                                    const menuItems = menuRef.current.querySelectorAll(".menu");
                                    if (menuItems[index]) {
                                        menuItems[index].scrollIntoView({
                                            behavior: "smooth",
                                            block: "nearest",
                                        });
                                    }
                                }
                            };

                            switch (e.key) {
                                case "ArrowDown":
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setHighlightedIndex((prev) => {
                                        if (prev < 0) {
                                            highlightedIndexRef.current = 0;
                                            setTimeout(() => scrollToOption(0), 0);
                                            return 0;
                                        }
                                        const nextIndex = prev < optionsLength - 1 ? prev + 1 : 0;
                                        highlightedIndexRef.current = nextIndex;
                                        setTimeout(() => scrollToOption(nextIndex), 0);
                                        return nextIndex;
                                    });
                                    break;

                                case "ArrowUp":
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setHighlightedIndex((prev) => {
                                        if (prev < 0) {
                                            const lastIndex = optionsLength - 1;
                                            highlightedIndexRef.current = lastIndex;
                                            setTimeout(() => scrollToOption(lastIndex), 0);
                                            return lastIndex;
                                        }
                                        const nextIndex = prev > 0 ? prev - 1 : optionsLength - 1;
                                        highlightedIndexRef.current = nextIndex;
                                        setTimeout(() => scrollToOption(nextIndex), 0);
                                        return nextIndex;
                                    });
                                    break;

                                case "Enter":
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const currentIndex = highlightedIndexRef.current;
                                    if (currentIndex >= 0 && currentIndex < optionsLength) {
                                        handleSelect(menuData[currentIndex]);
                                    }
                                    break;

                                case "Escape":
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setMenu(false);
                                    setHighlightedIndex(-1);
                                    highlightedIndexRef.current = -1;
                                    break;

                                default:
                                    break;
                            }
                        }}
                        onFocus={() => {
                            if (menuData?.length > 0) {
                                setMenu(true);
                            }
                        }}
                    />

                    <svg
                        style={{
                            transform: menu ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "0.3s ease",
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                    >
                        <path
                            d="M0.714355 0.85714L5.00007 5.14285L9.28578 0.85714"
                            stroke={menu ? "#698B75" : "#737678"}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>

                {menu && (
                    <div className="menu-box" style={{zIndex:"9999999"}} ref={menuRef}>
                        {menuData.length > 0 ? (
                            menuData.map((item, idx) => {
                                const isHighlighted = highlightedIndex === idx;
                                return (
                                    <div
                                        key={idx}
                                        className={`menu ${searchValue === item?.[getVariable] ? "selected" : ""} ${isHighlighted ? "highlighted" : ""}`}
                                        onClick={() => handleSelect(item)}
                                        onMouseEnter={() => setHighlightedIndex(idx)}
                                    >
                                        {item?.[getVariable]}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="menu no-results">No results found</div>
                        )}
                    </div>
                )}

                {errors && <div className="error-message">{errors}</div>}
            </div>
        </div>
    );
}

export default DropDownInput;
