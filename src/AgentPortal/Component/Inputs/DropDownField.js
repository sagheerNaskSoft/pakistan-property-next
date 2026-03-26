import { useEffect, useRef, useState } from 'react';
import './Inputs.css'

function DropDownField({getName, data, setData, menuData, varName, label, width, errors, active }) {
    const [focus, setFocus] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const inputRef = useRef(null);
    const menuRef = useRef(null);
    const highlightedIndexRef = useRef(-1);

    // Update ref when highlightedIndex changes
    useEffect(() => {
        highlightedIndexRef.current = highlightedIndex;
    }, [highlightedIndex]);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setFocus(false);
                setHighlightedIndex(-1);
                highlightedIndexRef.current = -1;
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Reset highlighted index when menu opens
    useEffect(() => {
        if (focus) {
            setHighlightedIndex(-1);
            highlightedIndexRef.current = -1;
        }
    }, [focus]);

    // Keyboard navigation handler
    useEffect(() => {
        if (!focus || !active) return;

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

        const handleKeyDown = (event) => {
            const optionsLength = menuData?.length || 0;
            if (optionsLength === 0) return;

            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault();
                    event.stopPropagation();
                    setHighlightedIndex((prev) => {
                        const nextIndex = prev < optionsLength - 1 ? prev + 1 : 0;
                        highlightedIndexRef.current = nextIndex;
                        setTimeout(() => scrollToOption(nextIndex), 0);
                        return nextIndex;
                    });
                    break;

                case "ArrowUp":
                    event.preventDefault();
                    event.stopPropagation();
                    setHighlightedIndex((prev) => {
                        const nextIndex = prev > 0 ? prev - 1 : optionsLength - 1;
                        highlightedIndexRef.current = nextIndex;
                        setTimeout(() => scrollToOption(nextIndex), 0);
                        return nextIndex;
                    });
                    break;

                case "Enter":
                    event.preventDefault();
                    event.stopPropagation();
                    const currentIndex = highlightedIndexRef.current;
                    if (currentIndex >= 0 && currentIndex < optionsLength) {
                        handleSelect(menuData[currentIndex]);
                    }
                    break;

                case "Escape":
                    event.preventDefault();
                    event.stopPropagation();
                    setFocus(false);
                    setHighlightedIndex(-1);
                    highlightedIndexRef.current = -1;
                    break;

                default:
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [focus, active, menuData]);
    const handleSelect = (value) => {
        setData((prev) => ({
            ...prev,
            [varName]: value,
        }));
        setFocus(false);
    };

    return (
        <div ref={inputRef} className='global-dropdown' style={{ cursor: active ? 'pointer' : 'not-allowed' }} onClick={() => active ? setFocus(!focus) : ''}>
            <div
                className={
                    `${(width ? (data?.[varName] || focus) : focus)
                        ? "display active"
                        : "display"
                    } ${errors ? "error" : ""}`
                }

                style={{ width: width || "", cursor: active ? 'pointer' : 'not-allowed' }}
                tabIndex={active ? 0 : -1}
                onFocus={() => {
                    if (active) setFocus(true);
                }}
            >

                {data?.[varName]?.name ? data?.[varName]?.name : label}
                <svg style={{transform: focus ? "rotate(180deg)" : "rotate(0deg)"}}
                    xmlns="http://www.w3.org/2000/svg"
                    width="10"
                    height="6"
                    viewBox="0 0 10 6"
                    fill="none"
                >
                    <path
                        d="M0.714355 0.85714L5.00007 5.14285L9.28578 0.85714"
                        stroke={focus ? "#698B75" : "#737678"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            {
                focus &&
                <div ref={menuRef} style={{minWidth:"max-content" , width:'100%',maxHeight:"200px",height:"fit-content",overflowY:"auto"}} className="menu-box">
                    {menuData.map((item, idx) => {
                        const isSelected = data?.[varName]?.id === item?.id;
                        const isHighlighted = highlightedIndex === idx;
                        return (
                            <div 
                                key={idx}
                                className={`menu ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""}`} 
                                onClick={() => handleSelect(item)}
                                onMouseEnter={() => setHighlightedIndex(idx)}
                            >
                                {item?.[getName]}
                            </div>
                        );
                    })}
                </div>
            }
            {errors ? <div className="error-message">{errors}</div> : ""}
        </div>
    )
}

export default DropDownField
