import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../../Context/ContextProvider";
function SingleInput({
  label,
  data,
  setData,
  varName,
  getVariable,
  menuData,
  input,
  dropDown,
  width,
  placeHolder,
  inputType,
  errors,
  priceChanger,
  forName,
  index,
  countryCodeBox,
  positionBottom,
  captalizeText,
  uppercaseText,
  firstLetterCapitalize
}) {
  const [menu, setMenu] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);
  const { getLOcation, setLocationList, formatPakistaniPhoneNumber, formatPakistaniLandline } = useAuth();
  const [selectedValue, setSelectedValue] = useState("");
  const [searchValue, setSearchValue] = useState(selectedValue);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const highlightedIndexRef = useRef(-1);
  useEffect(() => {
    let value;
    if (Array.isArray(data?.[varName])) {
      value = data?.[varName][index] || "";
    } else if (data?.[varName] && typeof data?.[varName] === 'object' && getVariable) {
      // If it's an object (like city or location), show the display value
      value = data?.[varName][getVariable] || "";
    } else if (data?.[varName] && menuData && getVariable) {
      // If it's a simple value (like app_code), find the matching item and show its display value
      const matchedItem = menuData.find(item =>
        item?.app_code === data?.[varName] || item?.id === data?.[varName]
      );
      value = matchedItem ? matchedItem[getVariable] : data?.[varName];
    } else if (forName === "city" && data?.[varName] && menuData?.length) {
      // Special handling for city - show city name from menuData
      const cityItem = menuData.find(item =>
        item?.app_code === data?.[varName]?.app_code || item?.id === data?.[varName]
      );
      value = cityItem ? cityItem.city : data?.[varName];
    } else {
      value = data?.[varName] || "";
    }
    setSelectedValue(value);
    setSearchValue(value);
  }, [data?.[varName], menuData, forName, getVariable, index]);

  const handleInputChange = (value) => {
    setSearchValue(firstLetterCapitalize ? value.charAt(0).toUpperCase() + value.slice(1) : value);
    if (input) setMenu(true);
    else setMenu(value.length > 0);
    setHighlightedIndex(-1);
    highlightedIndexRef.current = -1;
    setData((prev) => {
      const newData = { ...prev };
      if (Array.isArray(newData[varName])) {
        const updatedArr = [...newData[varName]];
        updatedArr[index] = firstLetterCapitalize ? value.charAt(0).toUpperCase() + value.slice(1) : value;
        newData[varName] = updatedArr;
      } else {
        newData[varName] = firstLetterCapitalize ? value.charAt(0).toUpperCase() + value.slice(1) : value;
      }

      // Clear location when city changes or is cleared
      if (forName === "city" || varName === "city") {
        newData.location = "";
        // Also clear if location is stored as an object
        if (newData.location && typeof newData.location === 'object') {
          newData.location = null;
        }
      }

      return newData;
    });
  };
  // :white_check_mark: Handle selecting from dropdown
  const handleSelect = useCallback(async (value) => {
    const displayValue = forName === "city" ? value?.city : value?.[getVariable];
    setSearchValue(displayValue);
    setData((prev) => {
      const newData = { ...prev };
      
      // Always clear location when city is selected (before updating city)
      if (forName === "city" || varName === "city") {
        // Clear location - set to empty string to ensure it's cleared
        newData.location = "";
      }
      
      if (Array.isArray(newData[varName])) {
        const updatedArr = [...newData[varName]];
        updatedArr[index] =
          varName === "city" ? value?.app_code : value?.id;
        newData[varName] = updatedArr;
      } else {
        newData[varName] =
          varName === "city" ? value?.app_code : value?.id;
      }

      return newData;
    });
    if (varName === "city" || forName === "city") {
      const locationResult = await getLOcation({ city_code: value?.app_code });
      setLocationList(locationResult?.data);
    }
    setMenu(false);
    setHighlightedIndex(-1);
    highlightedIndexRef.current = -1;
  }, [forName, getVariable, varName, index, getLOcation, setLocationList, setData]);
  // Filter menu - memoized to prevent unnecessary recalculations
  const filteredMenu = useMemo(() => {
    if (!menuData) return [];
    return menuData.filter((item) => {
      if (!searchValue || searchValue === '') {
        return true; // Show all items when no search term
      }

      const searchField = forName === "city" ? item?.city : item?.[getVariable];
      const searchTerm = typeof searchValue === 'string' ? searchValue.toLowerCase() : '';

      return searchField?.toLowerCase()?.includes(searchTerm);
    });
  }, [menuData, searchValue, forName, getVariable]);

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

  // Update ref when highlightedIndex changes
  useEffect(() => {
    highlightedIndexRef.current = highlightedIndex;
  }, [highlightedIndex]);

  // Reset highlighted index when search value changes
  useEffect(() => {
    setHighlightedIndex(-1);
    highlightedIndexRef.current = -1;
  }, [searchValue]);



  return (
    <div className="global-input-box">
      {label && <label>{label}</label>}
      <div className="input" style={{ width: width || "100%" }} ref={inputRef}>
        <div
          className={`display
            ${menu || selectedValue || searchValue ? "active" : ""}
            ${errors ? "error" : ""}`}
          style={{ minWidth: width ? `${width}px` : "286px", padding: countryCodeBox ? "0" : "" }}
        >
          {
            countryCodeBox ? (
              <div className="country-code-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="18" viewBox="0 0 24 18" fill="none">
                  <g clipPath="url(#clip0_1740_27356)">
                    <rect width="24" height="18" fill="white" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M7 0H24V18H7V0Z" fill="#00401A" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 0H7V18H0V0Z" fill="white" />
                    <path d="M13.0469 12.7355C9.53713 10.1982 11.7141 5.13953 13.1008 4.93659C13.0898 4.97055 11.7762 9.0481 14.4232 10.822C17.0817 12.6032 20.4315 11.7301 20.4315 11.7301C19.9205 12.8333 16.5572 15.2731 13.0469 12.7355ZM17.8234 6.41088L19.4544 5.66373L18.5823 7.29546L20.2202 8.5177L18.1293 8.37683L17.0658 9.93882L16.8131 8.10476L14.9362 7.77055L16.715 6.90047L16.6122 5.2715L17.8234 6.41088Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_1740_27356">
                      <rect width="24" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <div className="number">
                  +92
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4.57153 6.28613L8.0001 9.7147L11.4287 6.28613" stroke="#737678" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            ) : (
              ""
            )
          }
          <input
            style={{
              width: input && dropDown ? "95%" : "100%",
              backgroundColor: "transparent",
              paddingLeft: countryCodeBox ? "12px" : "",
              textTransform: captalizeText ? "capitalize" : uppercaseText ? "uppercase" : ""
            }}
            type={inputType ? inputType : (dropDown || varName === "contact" || varName === "whatsapp" || varName === "mobile" || varName === "landline") ? "text" : "number"}
            value={dropDown ? searchValue : selectedValue}
            placeholder={placeHolder}
            onChange={(e) => {
              if (varName === "contact" || varName === "whatsapp" || varName === "mobile" || varName === "landline") {
                // For phone numbers, remove non-digits
                let phone = e.target.value.replace(/\D/g, "");

                // Prevent starting with "0" or "92"
                if (phone.startsWith("92")) {
                  phone = phone.slice(2);
                }
                if (phone.startsWith("0")) {
                  phone = phone.slice(1);
                }

                // Limit to exactly 10 digits
                if (phone.length > 10) {
                  phone = phone.slice(0, 10);
                }

                handleInputChange(phone);
              }
              else {
                handleInputChange(e.target.value)
              }
            }}
            onKeyDown={(e) => {
              if (!menu || !dropDown) return;
              
              const optionsLength = filteredMenu?.length || 0;
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
                    handleSelect(filteredMenu[currentIndex]);
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
              if (dropDown) setMenu(true);
            }}
            onClick={() => {
              if (input) setMenu(true);
            }}
          />
          {input && dropDown && (
            <svg style={{ transform: menu ? "rotate(180deg)" : "rotate(0deg)" }}
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
          )}
        </div>
        {menu && dropDown && (
          <div className="menu-box" ref={menuRef}>
            {filteredMenu?.length > 0 ? (
              filteredMenu.map((item, idx) => {
                const displayValue = forName === "city" ? item?.city : item?.[getVariable];
                const isSelected = searchValue === displayValue;
                const isHighlighted = highlightedIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`menu ${isSelected ? "selected" : ""} ${isHighlighted ? "highlighted" : ""}`}
                    onClick={() => { handleSelect(item); setMenu(false) }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                  >
                    {displayValue}
                  </div>
                );
              })
            ) : (
              <div className="menu no-results">No results found</div>
            )}
          </div>
        )}
      </div>
      {errors ? <div className="error-message" style={{ bottom: positionBottom ? positionBottom : "" }}>{errors}</div> : ""}
      {priceChanger ? (
        <div className="converted-price">{priceChanger}</div>
      ) : (
        ""
      )}
    </div>
  );
}
export default SingleInput;
